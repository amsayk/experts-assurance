import Parse from 'parse/node';

import fs from 'fs';

import * as codes from 'result-codes';

import { formatError, getOrCreateBusiness, serializeParseObject } from 'backend/utils';
import { BusinessType, ActivityType, DocType, FileType } from 'data/types';

export default async function uploadFile(request, done) {
  if (!request.user) {
    done(new Error('A user is required.'));
    return;
  }

  const { payload: {
    docId,
    category,
    metadata,
  } } = request.params;

  const date = new Date(request.now);

  const ACL = new Parse.ACL();
  ACL.setPublicReadAccess(false);
  ACL.setPublicWriteAccess(false);

  async function add(business,  doc) {
    const { name, type, path, size } = metadata;

    const fileData = await new Promise((resolve, reject) => {
      fs.readFile(path, (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve(buf.toString('base64'));
        }
      });
    });

    const fileObj = await new Parse.File(name, { base64 : fileData }, type)
      .save(null, { useMasterKey: true });

    const props = {
      fileObj,
      document : doc,
      user: request.user,
      business,
      name,
      category,
      type,
      size,
      date,
    };

    const file = await new FileType()
      .setACL(ACL)
      .set(props)
      .save(null, { useMasterKey: true });

    doc.addUnique('files', file.id);

    await doc.save(null, { useMasterKey : true });

    return file;
  }

  const business = request.user.get('business');

  try {
    const doc = await new Parse.Query(DocType).get(docId, { useMasterKey: true });
    if (!doc) {
      throw new Parse.Error(codes.ERROR_ENTITY_NOT_FOUND);
    }

    const activities = [
      { type : 'FILE_UPLOADED', user: request.user, date },
    ];

    let file;
    if (business) {
      file = await add(await business.fetch({ useMasterKey: true }), doc);
    } else {
      file = await add(await getOrCreateBusiness(), doc);
    }

    const objects = activities.map(({ type, date, user, ...metadata }) => {
      return new ActivityType()
        .setACL(ACL)
        .set({
          ns        : 'DOCUMENTS',
          type      : type,
          metadata  : { ...metadata },
          timestamp : date,
          document  : doc,
          file      : file,
          user,
          business,
        });
    });

    await Promise.all(objects.map((o) => o.save(null, { useMasterKey : true })));

    const [ newDoc, newFile, newActivities ] = await Promise.all([
      // new doc
      new Parse.Query(DocType)
      .include([
        'manager',
        'client',
        'agent',
        'user',
        'payment_user',
        'validation_user',
        'closure_user',
      ])
      .get(doc.id, { useMasterKey : true }),

      // new file
      new Parse.Query(FileType)
      .include([
        'user',
        'document',
        'fileObj',
      ])
      .get(file.id, { useMasterKey : true }),

      // activities
      new Parse.Query(ActivityType)
      .equalTo('file', file)
      .include([
        'document',
        'file',
        'user',
      ])
      .find({ useMasterKey : true })
    ]);

    done(null, {
      doc        : serializeParseObject(newDoc),
      file       : serializeParseObject(newFile),
      activities : newActivities.map(serializeParseObject),
    });

  } catch (e) {
    done(formatError(e));
  }
}

