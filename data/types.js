const Parse = require(process.env.PARSE_MODULE_PATH); // will be required on both server and client.

export const BusinessType = Parse.Object.extend('Business');

export const DocType = Parse.Object.extend('Doc');

export const ActivityType = Parse.Object.extend('Activity');

