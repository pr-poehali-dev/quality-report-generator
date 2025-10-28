import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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
    toast({
      title: 'Генерация документа',
      description: 'Функция в разработке. Скоро будет доступен экспорт в PDF/Word',
    });
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
          <Button onClick={generateDocument} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Icon name="FileText" size={16} />
            Сгенерировать документ
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
      </div>
    </div>
  );
}
