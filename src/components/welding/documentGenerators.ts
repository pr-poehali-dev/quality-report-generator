import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FormData, WeldConnection } from './types';

export const generatePDF = (formData: FormData, connections: WeldConnection[]) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  doc.addFileToVFS('Roboto-Regular.ttf', '');
  doc.setFont('helvetica');
  doc.setFontSize(10);

  let yPos = 15;

  doc.setFontSize(8);
  doc.text(`Наименование лаборатории НК: ${formData.labName}`, 15, yPos);
  yPos += 4;
  doc.text(`Свидетельство об аттестации: № ${formData.certificate}`, 15, yPos);
  yPos += 4;
  doc.text(`Нормативный документ: ${formData.normDoc}`, 15, yPos);
  yPos += 4;
  doc.text(`Номер ОТК НК: ТК-РК-${formData.otkNumber}`, 15, yPos);
  yPos += 4;
  doc.text(`Источник ионизирующего излучения: ${formData.radiationSource}`, 15, yPos);
  yPos += 4;
  doc.text(`Тип детектора: ${formData.detector}`, 15, yPos);
  yPos += 4;
  doc.text(`Тип защитного экрана: ${formData.protectiveScreen}`, 15, yPos);
  yPos += 4;
  doc.text(`Тип усиливающего: ${formData.amplifier}`, 15, yPos);
  yPos += 4;
  doc.text(`Заключение по ВИК№: ${formData.vikNumber} от ${formData.vikDate}`, 15, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`ЗАКЛЮЧЕНИЕ № ${formData.conclusionNumber}-ПА`, 105, yPos, { align: 'center' });
  yPos += 5;
  doc.text(`от ${new Date(formData.conclusionDate).toLocaleDateString('ru-RU')} года`, 105, yPos, { align: 'center' });
  yPos += 5;
  doc.setFontSize(9);
  doc.text('по результатам контроля качества сварных соединений', 105, yPos, { align: 'center' });
  yPos += 4;
  doc.text('радиационным неразрушающим методом (РК)', 105, yPos, { align: 'center' });
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Наименование объекта: ${formData.objectName}`, 15, yPos);
  yPos += 4;
  doc.text(`Уровень качества: «${formData.qualityLevel}»`, 15, yPos);
  yPos += 4;
  doc.text(`Объем контроля: ${formData.controlVolume}%`, 15, yPos);
  yPos += 4;
  doc.text(`Название трассы: ${formData.routeName}`, 15, yPos);
  yPos += 4;
  doc.text(`Участок трубопровода, километраж: ${formData.pipelineSection}`, 15, yPos);
  yPos += 4;
  doc.text(`Наименование орг. подрядчика: ${formData.contractor}`, 15, yPos);
  yPos += 4;
  doc.text(`Наименование орг. заказчика: ${formData.customer}`, 15, yPos);
  yPos += 4;
  doc.text(`Шифр бригады или клеймо сварщика: ${formData.welderMark}`, 15, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'bold');
  doc.text('РЕЗУЛЬТАТЫ КОНТРОЛЯ', 105, yPos, { align: 'center' });
  yPos += 5;

  const tableData = connections.map(conn => [
    conn.number,
    conn.diameter,
    conn.section,
    conn.sensitivity,
    conn.coordinates,
    conn.defects,
    conn.conclusion,
    conn.notes,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [[
      '№ соединения',
      'Диаметр x толщина',
      '№ участка',
      'Чувствительность',
      'Координаты дефектов',
      'Описание дефектов',
      'Заключение',
      'Примечания',
    ]],
    body: tableData,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [139, 92, 246], textColor: 255, fontStyle: 'bold' },
    margin: { left: 15, right: 15 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Контроль провёл: ${formData.controllerName}`, 15, finalY);
  doc.text(`${formData.controllerLevel} ур., удост. № ${formData.controllerCertificate}`, 15, finalY + 4);
  doc.text(`Дата: ${new Date(formData.controlDate).toLocaleDateString('ru-RU')}`, 15, finalY + 8);

  doc.save(`Заключение_РК_${formData.conclusionNumber}_${new Date().toLocaleDateString('ru-RU')}.pdf`);
};

export const generateExcelFile = (formData: FormData, connections: WeldConnection[]) => {
  const wb = XLSX.utils.book_new();

  const wsData: any[][] = [];

  wsData.push(['Наименование лаборатории НК:', formData.labName]);
  wsData.push(['Свидетельство об аттестации:', formData.certificate]);
  wsData.push(['Нормативный документ:', formData.normDoc]);
  wsData.push(['Номер ОТК НК:', `ТК-РК-${formData.otkNumber}`]);
  wsData.push(['Источник ионизирующего излучения:', formData.radiationSource]);
  wsData.push(['Тип детектора:', formData.detector]);
  wsData.push(['Тип защитного экрана:', formData.protectiveScreen]);
  wsData.push(['Тип усиливающего:', formData.amplifier]);
  wsData.push(['Заключение по ВИК№:', `${formData.vikNumber} от ${formData.vikDate}`]);
  wsData.push([]);

  wsData.push([`ЗАКЛЮЧЕНИЕ № ${formData.conclusionNumber}-ПА`]);
  wsData.push([`от ${new Date(formData.conclusionDate).toLocaleDateString('ru-RU')} года`]);
  wsData.push(['по результатам контроля качества сварных соединений']);
  wsData.push(['радиационным неразрушающим методом (РК)']);
  wsData.push([]);

  wsData.push(['Наименование объекта:', formData.objectName]);
  wsData.push(['Уровень качества:', formData.qualityLevel]);
  wsData.push(['Объем контроля:', `${formData.controlVolume}%`]);
  wsData.push(['Название трассы:', formData.routeName]);
  wsData.push(['Участок трубопровода, километраж:', formData.pipelineSection]);
  wsData.push(['Наименование орг. подрядчика:', formData.contractor]);
  wsData.push(['Наименование орг. заказчика:', formData.customer]);
  wsData.push(['Шифр бригады или клеймо сварщика:', formData.welderMark]);
  wsData.push([]);

  wsData.push(['РЕЗУЛЬТАТЫ КОНТРОЛЯ']);
  wsData.push([
    '№ соединения',
    'Диаметр x толщина',
    '№ участка',
    'Чувствительность',
    'Координаты дефектов',
    'Описание дефектов',
    'Заключение',
    'Примечания',
  ]);

  connections.forEach(conn => {
    wsData.push([
      conn.number,
      conn.diameter,
      conn.section,
      conn.sensitivity,
      conn.coordinates,
      conn.defects,
      conn.conclusion,
      conn.notes,
    ]);
  });

  wsData.push([]);
  wsData.push(['Контроль провёл:', formData.controllerName]);
  wsData.push([`${formData.controllerLevel} ур., удост. №`, formData.controllerCertificate]);
  wsData.push(['Дата:', new Date(formData.controlDate).toLocaleDateString('ru-RU')]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  const colWidths = [
    { wch: 30 },
    { wch: 25 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 30 },
    { wch: 15 },
    { wch: 20 },
  ];
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Заключение РК');

  XLSX.writeFile(wb, `Заключение_РК_${formData.conclusionNumber}_${new Date().toLocaleDateString('ru-RU')}.xlsx`);
};
