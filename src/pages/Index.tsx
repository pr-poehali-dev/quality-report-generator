import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { FormData, WeldConnection } from '@/components/welding/types';
import HeaderForm from '@/components/welding/HeaderForm';
import ObjectForm from '@/components/welding/ObjectForm';
import ConnectionsForm from '@/components/welding/ConnectionsForm';
import SignatureForm from '@/components/welding/SignatureForm';
import PreviewDialog from '@/components/welding/PreviewDialog';
import { generatePDF, generateExcelFile } from '@/components/welding/documentGenerators';

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
      generatePDF(formData, connections);
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
      generateExcelFile(formData, connections);
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
            <HeaderForm formData={formData} updateFormData={updateFormData} />
          </TabsContent>

          <TabsContent value="object" className="animate-fade-in">
            <ObjectForm formData={formData} updateFormData={updateFormData} />
          </TabsContent>

          <TabsContent value="connections" className="animate-fade-in">
            <ConnectionsForm 
              connections={connections}
              addConnection={addConnection}
              removeConnection={removeConnection}
              updateConnection={updateConnection}
            />
          </TabsContent>

          <TabsContent value="signature" className="animate-fade-in">
            <SignatureForm formData={formData} updateFormData={updateFormData} />
          </TabsContent>
        </Tabs>

        <PreviewDialog 
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          formData={formData}
          connections={connections}
          generateDocument={generateDocument}
          generateExcel={generateExcel}
        />
      </div>
    </div>
  );
}