import ExcelBuilder from 'excel-builder';
import Zip from 'jszip';

import capitalize from 'lodash.capitalize';

import moment from 'moment';

import each from 'lodash.foreach';
import defaults from 'lodash.defaults';

const colors = {
  BLACK: '000000',
  WHITE: 'FFFFFF',
  headerBg: '00ccff',
};

export function docsToExcel({ docs }) {
  const workbook = ExcelBuilder.Builder.createWorkbook();

  const worksheet = workbook.createWorksheet({
    name: 'Feuil1',
  });

  const stylesheet = workbook.getStyleSheet();

  const headerRowCellStyle = stylesheet.createFormat({
    font: {
      bold: true,
      color: colors.BLACK,
      size: 8,
    },

    border: {
      bottom: { color: colors.BLACK, style: 'thin' },
      top: { color: colors.BLACK, style: 'thin' },
      left: { color: colors.BLACK, style: 'thin' },
      right: { color: colors.BLACK, style: 'thin' },
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: colors.headerBg,
    },

    alignment: {
      horizontal: 'left',
      vertical: 'bottom',
      wrapText: true,
    },
  });

  const dataCellStyle = stylesheet.createFormat({
    font: {
      bold: false,
      color: colors.BLACK,
      size: 7,
    },

    border: {
      bottom: { color: colors.BLACK, style: 'thin' },
      top: { color: colors.BLACK, style: 'thin' },
      left: { color: colors.BLACK, style: 'thin' },
      right: { color: colors.BLACK, style: 'thin' },
    },

    fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: colors.WHITE,
    },

    alignment: {
      horizontal: 'left',
      vertical: 'bottom',
      wrapText: true,
    },
  });

  const originalData = [
    [
      { value: 'CODE', metadata: { style: headerRowCellStyle.id } },
      { value: 'Réf', metadata: { style: headerRowCellStyle.id } },
      { value: 'Assureur conseil', metadata: { style: headerRowCellStyle.id } },
      { value: 'Assuré OU Tiers', metadata: { style: headerRowCellStyle.id } },
      { value: 'DT Sinistre', metadata: { style: headerRowCellStyle.id } },
      { value: 'Véhicule', metadata: { style: headerRowCellStyle.id } },
      { value: 'Genre', metadata: { style: headerRowCellStyle.id } },
      { value: 'N° Immat', metadata: { style: headerRowCellStyle.id } },
      { value: 'N° Série', metadata: { style: headerRowCellStyle.id } },
      { value: 'DT Mission', metadata: { style: headerRowCellStyle.id } },
      { value: 'Nature', metadata: { style: headerRowCellStyle.id } },
      {
        value: 'N° Sinistre ou N° Police',
        metadata: { style: headerRowCellStyle.id },
      },
      { value: 'DT VALIDATION', metadata: { style: headerRowCellStyle.id } },
      { value: 'PAIEMENT', metadata: { style: headerRowCellStyle.id } },
    ],
  ];

  docs.forEach(
    (
      {
        refNo,
        company,
        date,
        dateMission,
        vehicle,
        client,
        agent,
        police,
        nature,
        validation_date,
        payment_date,
      },
      index,
    ) => {
      originalData.push([
        { value: index + 1, metadata: { style: dataCellStyle.id } },

        {
          value: `${company ? capitalize(company.toLowerCase()) : ''}${refNo}`,
          metadata: { style: dataCellStyle.id },
        },

        { value: agent.name, metadata: { style: dataCellStyle.id } },
        { value: client.name, metadata: { style: dataCellStyle.id } },

        {
          value: moment.utc(date).format('DD/MM/YY'),
          metadata: { style: dataCellStyle.id },
        },

        {
          value: vehicle.manufacturer || null,
          metadata: { style: dataCellStyle.id },
        },
        {
          value: vehicle.model || null,
          metadata: { style: dataCellStyle.id },
        },
        {
          value: vehicle.plateNumber || null,
          metadata: { style: dataCellStyle.id },
        },
        {
          value: vehicle.series || null,
          metadata: { style: dataCellStyle.id },
        },

        {
          value: moment.utc(dateMission).format('DD/MM/YY'),
          metadata: { style: dataCellStyle.id },
        },

        { value: nature || null, metadata: { style: dataCellStyle.id } },
        { value: police || null, metadata: { style: dataCellStyle.id } },

        {
          value: validation_date
            ? moment.utc(validation_date).format('DD/MM/YY')
            : null,
          metadata: { style: dataCellStyle.id },
        },

        {
          value: payment_date
            ? moment.utc(payment_date).format('DD/MM/YY')
            : null,
          metadata: { style: dataCellStyle.id },
        },
      ]);
    },
  );

  // Header height
  worksheet.setRowInstructions(0, {
    height: 40,
  });

  worksheet.setColumns([
    { width: 10 }, // A
    { width: 16 }, // B
    { width: 30 }, // C
    { width: 30 }, // D
    { width: 16 }, // E
    { width: 16 }, // F
    { width: 16 }, // G
    { width: 16 }, // H
    { width: 16 }, // I
    { width: 16 }, // J
    { width: 16 }, // K
    { width: 25 }, // L
    { width: 16 }, // M
    { width: 16 }, // N
  ]);

  worksheet.setData(originalData);
  workbook.addWorksheet(worksheet);

  return createFile(workbook);

  function createFile(workbook, options) {
    const zip = new Zip();
    return workbook.generateFiles().then(function(files) {
      each(files, function(content, path) {
        path = path.substr(1);
        if (path.indexOf('.xml') !== -1 || path.indexOf('.rel') !== -1) {
          zip.file(path, content, { base64: false });
        } else {
          zip.file(path, content, { base64: true, binary: true });
        }
      });
      return zip.generateAsync(
        defaults(options || {}, {
          type: 'base64',
        }),
      );
    });
  }
}
