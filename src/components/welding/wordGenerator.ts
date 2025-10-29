import { Document, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, BorderStyle, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { FormData, WeldConnection } from './types';

export async function generateWordDocument(formData: FormData, connections: WeldConnection[]) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: formData.labName,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: `Свидетельство об аттестации № ${formData.certificate}`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: `Нормативный документ: ${formData.normDoc}`,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: `Номер ОТК НК: ТК-РК-${formData.otkNumber}`,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: `Источник ионизирующего излучения: ${formData.radiationSource}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Тип детектора: ${formData.detector}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Тип защитного экрана: ${formData.protectiveScreen}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Тип усиливающего: ${formData.amplifier}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Заключение по ВИК№: ${formData.vikNumber} от ${formData.vikDate}`,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: `ЗАКЛЮЧЕНИЕ № ${formData.conclusionNumber}-ПА`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          bold: true
        }),
        new Paragraph({
          text: `от ${new Date(formData.conclusionDate).toLocaleDateString('ru-RU')} года`,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: 'по результатам контроля качества сварных соединений',
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: 'радиационным неразрушающим методом (РК)',
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: `Наименование объекта: ${formData.objectName}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Уровень качества: «${formData.qualityLevel}»`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Объем контроля: ${formData.controlVolume}%`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Название трассы: ${formData.routeName}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Участок трубопровода, километраж: ${formData.pipelineSection}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Наименование орг. подрядчика: ${formData.contractor}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Наименование орг. заказчика: ${formData.customer}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Шифр бригады или клеймо сварщика: ${formData.welderMark}`,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: 'РЕЗУЛЬТАТЫ КОНТРОЛЯ',
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          bold: true
        }),
        createConnectionsTable(connections),
        new Paragraph({
          text: '',
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: `Контроль провёл: ${formData.controllerName}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `${formData.controllerLevel} ур., удост. № ${formData.controllerCertificate}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Дата: ${new Date(formData.controlDate).toLocaleDateString('ru-RU')}`
        })
      ]
    }]
  });

  const { Packer } = await import('docx');
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Заключение_${formData.conclusionNumber}.docx`);
}

function createConnectionsTable(connections: WeldConnection[]): Table {
  const headerRow = new TableRow({
    children: [
      createTableCell('№ соед.', true),
      createTableCell('Диаметр x толщина', true),
      createTableCell('№ участка', true),
      createTableCell('Чувств.', true),
      createTableCell('Координаты', true),
      createTableCell('Описание дефектов', true),
      createTableCell('Заключение', true),
      createTableCell('Примечания', true)
    ]
  });

  const dataRows = connections.map(conn => new TableRow({
    children: [
      createTableCell(conn.number),
      createTableCell(conn.diameter),
      createTableCell(conn.section),
      createTableCell(conn.sensitivity),
      createTableCell(conn.coordinates),
      createTableCell(conn.defects),
      createTableCell(conn.conclusion),
      createTableCell(conn.notes)
    ]
  }));

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows]
  });
}

function createTableCell(text: string, isHeader: boolean = false): TableCell {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold: isHeader })],
      alignment: AlignmentType.CENTER
    })],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 }
    }
  });
}
