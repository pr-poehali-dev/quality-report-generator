import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface WeldConnection {
  id: string;
  number: string;
  diameter: string;
  section: string;
  sensitivity: string;
  coordinates: string;
  defects: string;
  conclusion: 'годен' | 'ремонт' | 'вырезать';
  notes: string;
}

interface FormData {
  labName: string;
  certificate: string;
  normDoc: string;
  otkNumber: string;
  radiationSource: string;
  detector: string;
  protectiveScreen: string;
  amplifier: string;
  vikNumber: string;
  vikDate: string;
  conclusionNumber: string;
  conclusionDate: string;
  objectName: string;
  qualityLevel: string;
  controlVolume: string;
  routeName: string;
  pipelineSection: string;
  contractor: string;
  customer: string;
  welderMark: string;
  controllerName: string;
  controllerLevel: string;
  controllerCertificate: string;
  controlDate: string;
}

export default function Index() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('header');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    labName: 'ЛККСС',
    certificate: '',
    normDoc: 'СТО Газпром 15-1.3-004-2023',
    otkNumber: '',
    radiationSource: 'рентгенаппарат ERESCO 65 MF, U=105-200кВ, I=4,5мА',
    detector: 'радиографическая плёнка PT-1',
    protectiveScreen: 'Pb',
    amplifier: 'СМП',
    vikNumber: '',
    vikDate: '',
    conclusionNumber: '',
    conclusionDate: new Date().toISOString().split('T')[0],
    objectName: 'Замена дефектных участков',
    qualityLevel: 'В',
    controlVolume: '100',
    routeName: 'МГ Митрофановская-Березанская',
    pipelineSection: '',
    contractor: 'ЯУАВР',
    customer: 'Березанская ЛПУМГ',
    welderMark: '',
    controllerName: '',
    controllerLevel: 'II',
    controllerCertificate: '',
    controlDate: new Date().toISOString().split('T')[0],
  });

  const [connections, setConnections] = useState<WeldConnection[]>([
    {
      id: '1',
      number: '',
      diameter: '720x8',
      section: '0-320',
      sensitivity: '0.3',
      coordinates: '',
      defects: '',
      conclusion: 'годен',
      notes: '',
    },
  ]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addConnection = () => {
    const newConnection: WeldConnection = {
      id: Date.now().toString(),
      number: '',
      diameter: '720x8',
      section: '0-320',
      sensitivity: '0.3',
      coordinates: '',
      defects: '',
      conclusion: 'годен',
      notes: '',
    };
    setConnections([...connections, newConnection]);
  };

  const removeConnection = (id: string) => {
    setConnections(connections.filter(c => c.id !== id));
  };

  const updateConnection = (id: string, field: keyof WeldConnection, value: string) => {
    setConnections(connections.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const saveTemplate = () => {
    const template = {
      formData,
      connections,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('welding-template', JSON.stringify(template));
    toast({
      title: 'Шаблон сохранён',
      description: 'Данные успешно сохранены в браузере',
    });
  };

  const loadTemplate = () => {
    const saved = localStorage.getItem('welding-template');
    if (saved) {
      const template = JSON.parse(saved);
      setFormData(template.formData);
      setConnections(template.connections);
      toast({
        title: 'Шаблон загружен',
        description: 'Данные восстановлены',
      });
    } else {
      toast({
        title: 'Шаблон не найден',
        description: 'Сохранённых данных нет',
        variant: 'destructive',
      });
    }
  };

  const generateDocument = () => {
    try {
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

      toast({
        title: 'Документ сгенерирован',
        description: 'PDF успешно создан и загружен',
      });
      setShowPreview(false);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать документ',
        variant: 'destructive',
      });
    }
  };

  const generateExcel = () => {
    try {
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

      toast({
        title: 'Excel создан',
        description: 'Файл успешно экспортирован',
      });
      setShowPreview(false);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать Excel файл',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Генератор форм РК НК
          </h1>
          <p className="text-gray-600">Система формирования заключений по радиационному контролю</p>
        </div>

        <div className="flex gap-4 mb-6 justify-center">
          <Button onClick={saveTemplate} variant="outline" className="gap-2">
            <Icon name="Save" size={16} />
            Сохранить шаблон
          </Button>
          <Button onClick={loadTemplate} variant="outline" className="gap-2">
            <Icon name="FolderOpen" size={16} />
            Загрузить шаблон
          </Button>
          <Button onClick={() => setShowPreview(true)} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Icon name="FileText" size={16} />
            Предпросмотр и экспорт
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="header" className="gap-2">
              <Icon name="FileCheck" size={16} />
              Шапка документа
            </TabsTrigger>
            <TabsTrigger value="object" className="gap-2">
              <Icon name="MapPin" size={16} />
              Объект
            </TabsTrigger>
            <TabsTrigger value="connections" className="gap-2">
              <Icon name="Table" size={16} />
              Результаты
            </TabsTrigger>
            <TabsTrigger value="signature" className="gap-2">
              <Icon name="PenTool" size={16} />
              Подпись
            </TabsTrigger>
          </TabsList>

          <TabsContent value="header" className="animate-fade-in">
            <Card className="gradient-border backdrop-blur-sm bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="FileCheck" size={20} />
                  Данные лаборатории и оборудования
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="labName">Наименование лаборатории НК</Label>
                    <Input 
                      id="labName" 
                      value={formData.labName}
                      onChange={(e) => updateFormData('labName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificate">Свидетельство об аттестации №</Label>
                    <Input 
                      id="certificate" 
                      value={formData.certificate}
                      onChange={(e) => updateFormData('certificate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="normDoc">Нормативный документ</Label>
                  <Input 
                    id="normDoc" 
                    value={formData.normDoc}
                    onChange={(e) => updateFormData('normDoc', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="otkNumber">Номер ОТК НК (ТК-РК-)</Label>
                    <Input 
                      id="otkNumber" 
                      placeholder="введите номер"
                      value={formData.otkNumber}
                      onChange={(e) => updateFormData('otkNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vikNumber">Заключение по ВИК №</Label>
                    <Input 
                      id="vikNumber" 
                      value={formData.vikNumber}
                      onChange={(e) => updateFormData('vikNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radiationSource">Источник ионизирующего излучения</Label>
                  <Input 
                    id="radiationSource" 
                    value={formData.radiationSource}
                    onChange={(e) => updateFormData('radiationSource', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="detector">Тип детектора</Label>
                    <Input 
                      id="detector" 
                      value={formData.detector}
                      onChange={(e) => updateFormData('detector', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="protectiveScreen">Тип защитного экрана</Label>
                    <Input 
                      id="protectiveScreen" 
                      value={formData.protectiveScreen}
                      onChange={(e) => updateFormData('protectiveScreen', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amplifier">Тип усиливающего</Label>
                    <Input 
                      id="amplifier" 
                      value={formData.amplifier}
                      onChange={(e) => updateFormData('amplifier', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="object" className="animate-fade-in">
            <Card className="gradient-border backdrop-blur-sm bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MapPin" size={20} />
                  Информация об объекте контроля
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conclusionNumber">Номер заключения</Label>
                    <Input 
                      id="conclusionNumber" 
                      placeholder="номер-ПА"
                      value={formData.conclusionNumber}
                      onChange={(e) => updateFormData('conclusionNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conclusionDate">Дата заключения</Label>
                    <Input 
                      id="conclusionDate" 
                      type="date"
                      value={formData.conclusionDate}
                      onChange={(e) => updateFormData('conclusionDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objectName">Наименование объекта</Label>
                  <Input 
                    id="objectName" 
                    value={formData.objectName}
                    onChange={(e) => updateFormData('objectName', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qualityLevel">Уровень качества</Label>
                    <Input 
                      id="qualityLevel" 
                      value={formData.qualityLevel}
                      onChange={(e) => updateFormData('qualityLevel', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="controlVolume">Объем контроля (%)</Label>
                    <Input 
                      id="controlVolume" 
                      value={formData.controlVolume}
                      onChange={(e) => updateFormData('controlVolume', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routeName">Название трассы</Label>
                  <Input 
                    id="routeName" 
                    value={formData.routeName}
                    onChange={(e) => updateFormData('routeName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pipelineSection">Участок трубопровода, километраж</Label>
                  <Input 
                    id="pipelineSection" 
                    placeholder="например: 44,188 км"
                    value={formData.pipelineSection}
                    onChange={(e) => updateFormData('pipelineSection', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractor">Наименование орг. подрядчика</Label>
                    <Input 
                      id="contractor" 
                      value={formData.contractor}
                      onChange={(e) => updateFormData('contractor', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer">Наименование орг. заказчика</Label>
                    <Input 
                      id="customer" 
                      value={formData.customer}
                      onChange={(e) => updateFormData('customer', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welderMark">Шифр бригады или клеймо сварщика</Label>
                  <Input 
                    id="welderMark" 
                    placeholder="например: 0ННF; 8N3Z"
                    value={formData.welderMark}
                    onChange={(e) => updateFormData('welderMark', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="animate-fade-in">
            <Card className="gradient-border backdrop-blur-sm bg-white/90">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Table" size={20} />
                  Результаты контроля сварных соединений
                </CardTitle>
                <Button onClick={addConnection} size="sm" className="gap-2">
                  <Icon name="Plus" size={16} />
                  Добавить соединение
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {connections.map((conn, index) => (
                    <div key={conn.id} className="p-4 border-2 border-purple-200 rounded-lg space-y-4 hover:border-purple-400 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-purple-700">Соединение #{index + 1}</h3>
                        {connections.length > 1 && (
                          <Button 
                            onClick={() => removeConnection(conn.id)} 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Номер по журналу</Label>
                          <Input 
                            value={conn.number}
                            onChange={(e) => updateConnection(conn.id, 'number', e.target.value)}
                            placeholder="3"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Диаметр x толщина</Label>
                          <Input 
                            value={conn.diameter}
                            onChange={(e) => updateConnection(conn.id, 'diameter', e.target.value)}
                            placeholder="720x8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Номер участка</Label>
                          <Input 
                            value={conn.section}
                            onChange={(e) => updateConnection(conn.id, 'section', e.target.value)}
                            placeholder="0-320"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Чувствительность</Label>
                          <Input 
                            value={conn.sensitivity}
                            onChange={(e) => updateConnection(conn.id, 'sensitivity', e.target.value)}
                            placeholder="0.3"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Координаты дефектов</Label>
                          <Input 
                            value={conn.coordinates}
                            onChange={(e) => updateConnection(conn.id, 'coordinates', e.target.value)}
                            placeholder="198;245"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Описание дефектов</Label>
                          <Input 
                            value={conn.defects}
                            onChange={(e) => updateConnection(conn.id, 'defects', e.target.value)}
                            placeholder="Ac 2.5x2.0<; 3Aa 0.4"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Заключение</Label>
                          <Select 
                            value={conn.conclusion}
                            onValueChange={(value) => updateConnection(conn.id, 'conclusion', value as 'годен' | 'ремонт' | 'вырезать')}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="годен">годен</SelectItem>
                              <SelectItem value="ремонт">ремонт</SelectItem>
                              <SelectItem value="вырезать">вырезать</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Примечания</Label>
                          <Input 
                            value={conn.notes}
                            onChange={(e) => updateConnection(conn.id, 'notes', e.target.value)}
                            placeholder="дополнительная информация"
                          />
                        </div>
                      </div>

                      <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded border-l-4 border-blue-500">
                        <span className="text-sm font-medium">Заключение о качестве: </span>
                        <span className={`font-bold ${conn.conclusion === 'годен' ? 'text-green-600' : conn.conclusion === 'ремонт' ? 'text-orange-600' : 'text-red-600'}`}>
                          {conn.conclusion}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signature" className="animate-fade-in">
            <Card className="gradient-border backdrop-blur-sm bg-white/90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="PenTool" size={20} />
                  Подпись специалиста
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="controllerName">ФИО специалиста</Label>
                  <Input 
                    id="controllerName" 
                    placeholder="Иванов Иван Иванович"
                    value={formData.controllerName}
                    onChange={(e) => updateFormData('controllerName', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="controllerLevel">Уровень специалиста</Label>
                    <Select 
                      value={formData.controllerLevel}
                      onValueChange={(value) => updateFormData('controllerLevel', value)}
                    >
                      <SelectTrigger id="controllerLevel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="I">I уровень</SelectItem>
                        <SelectItem value="II">II уровень</SelectItem>
                        <SelectItem value="III">III уровень</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="controllerCertificate">Номер удостоверения</Label>
                    <Input 
                      id="controllerCertificate" 
                      placeholder="удост. №"
                      value={formData.controllerCertificate}
                      onChange={(e) => updateFormData('controllerCertificate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="controlDate">Дата проведения контроля</Label>
                  <Input 
                    id="controlDate" 
                    type="date"
                    value={formData.controlDate}
                    onChange={(e) => updateFormData('controlDate', e.target.value)}
                  />
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                  <p className="text-sm text-gray-600 mb-2">Подпись в документе:</p>
                  <p className="font-medium">Контроль провёл: {formData.controllerName || '[ФИО не указано]'}</p>
                  <p className="text-sm">{formData.controllerLevel} ур., удост. № {formData.controllerCertificate || '[номер не указан]'}</p>
                  <p className="text-sm mt-1">Дата: {new Date(formData.controlDate).toLocaleDateString('ru-RU')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Предпросмотр документа
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 p-6 bg-white rounded-lg border-2 border-gray-200">
              <div className="text-xs space-y-1 border-b pb-4">
                <p><strong>Наименование лаборатории НК:</strong> {formData.labName}</p>
                <p><strong>Свидетельство об аттестации:</strong> № {formData.certificate}</p>
                <p><strong>Нормативный документ:</strong> {formData.normDoc}</p>
                <p><strong>Номер ОТК НК:</strong> ТК-РК-{formData.otkNumber}</p>
                <p><strong>Источник ионизирующего излучения:</strong> {formData.radiationSource}</p>
                <p><strong>Тип детектора:</strong> {formData.detector}</p>
                <p><strong>Тип защитного экрана:</strong> {formData.protectiveScreen}</p>
                <p><strong>Тип усиливающего:</strong> {formData.amplifier}</p>
                <p><strong>Заключение по ВИК№:</strong> {formData.vikNumber} от {formData.vikDate}</p>
              </div>

              <div className="text-center py-4 border-b">
                <h2 className="text-lg font-bold">ЗАКЛЮЧЕНИЕ № {formData.conclusionNumber}-ПА</h2>
                <p className="text-sm">от {new Date(formData.conclusionDate).toLocaleDateString('ru-RU')} года</p>
                <p className="text-sm mt-2">по результатам контроля качества сварных соединений</p>
                <p className="text-sm">радиационным неразрушающим методом (РК)</p>
              </div>

              <div className="text-xs space-y-1 border-b pb-4">
                <p><strong>Наименование объекта:</strong> {formData.objectName}</p>
                <p><strong>Уровень качества:</strong> «{formData.qualityLevel}»</p>
                <p><strong>Объем контроля:</strong> {formData.controlVolume}%</p>
                <p><strong>Название трассы:</strong> {formData.routeName}</p>
                <p><strong>Участок трубопровода, километраж:</strong> {formData.pipelineSection}</p>
                <p><strong>Наименование орг. подрядчика:</strong> {formData.contractor}</p>
                <p><strong>Наименование орг. заказчика:</strong> {formData.customer}</p>
                <p><strong>Шифр бригады или клеймо сварщика:</strong> {formData.welderMark}</p>
              </div>

              <div>
                <h3 className="font-bold text-center mb-3">РЕЗУЛЬТАТЫ КОНТРОЛЯ</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse border border-gray-300">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="border border-gray-300 p-2">№ соед.</th>
                        <th className="border border-gray-300 p-2">Диаметр x толщина</th>
                        <th className="border border-gray-300 p-2">№ участка</th>
                        <th className="border border-gray-300 p-2">Чувств.</th>
                        <th className="border border-gray-300 p-2">Координаты</th>
                        <th className="border border-gray-300 p-2">Описание дефектов</th>
                        <th className="border border-gray-300 p-2">Заключение</th>
                        <th className="border border-gray-300 p-2">Примечания</th>
                      </tr>
                    </thead>
                    <tbody>
                      {connections.map((conn) => (
                        <tr key={conn.id}>
                          <td className="border border-gray-300 p-2 text-center">{conn.number}</td>
                          <td className="border border-gray-300 p-2 text-center">{conn.diameter}</td>
                          <td className="border border-gray-300 p-2 text-center">{conn.section}</td>
                          <td className="border border-gray-300 p-2 text-center">{conn.sensitivity}</td>
                          <td className="border border-gray-300 p-2">{conn.coordinates}</td>
                          <td className="border border-gray-300 p-2">{conn.defects}</td>
                          <td className={`border border-gray-300 p-2 text-center font-semibold ${
                            conn.conclusion === 'годен' ? 'text-green-600' : 
                            conn.conclusion === 'ремонт' ? 'text-orange-600' : 'text-red-600'
                          }`}>{conn.conclusion}</td>
                          <td className="border border-gray-300 p-2">{conn.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-xs border-t pt-4">
                <p><strong>Контроль провёл:</strong> {formData.controllerName}</p>
                <p>{formData.controllerLevel} ур., удост. № {formData.controllerCertificate}</p>
                <p><strong>Дата:</strong> {new Date(formData.controlDate).toLocaleDateString('ru-RU')}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={generateDocument} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
                <Icon name="FileDown" size={16} />
                Скачать PDF
              </Button>
              <Button onClick={generateExcel} className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600">
                <Icon name="Sheet" size={16} />
                Скачать Excel
              </Button>
              <Button onClick={() => setShowPreview(false)} variant="outline">
                Закрыть
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}