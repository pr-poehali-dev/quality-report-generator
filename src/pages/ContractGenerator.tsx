import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface ContractData {
  party1_name: string;
  party1_address: string;
  party2_name: string;
  party2_address: string;
  contract_number: string;
  contract_date: string;
  amount: string;
  work_description: string;
}

export default function ContractGenerator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [templateBase64, setTemplateBase64] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedFile, setGeneratedFile] = useState<{ base64: string; filename: string } | null>(null);
  const [formData, setFormData] = useState<ContractData>({
    party1_name: '',
    party1_address: '',
    party2_name: '',
    party2_address: '',
    contract_number: '',
    contract_date: new Date().toISOString().split('T')[0],
    amount: '',
    work_description: '',
  });

  const handleInputChange = (field: keyof ContractData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(',')[1];
      setTemplateBase64(base64Data);
      toast({
        title: 'Шаблон загружен',
        description: `Файл ${file.name} готов к использованию`,
      });
    };
    reader.readAsDataURL(file);
  };

  const generateContract = async () => {
    if (!templateBase64) {
      toast({
        title: 'Ошибка',
        description: 'Загрузите шаблон договора',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.party1_name || !formData.party2_name || !formData.amount) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля: стороны договора и сумма',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://functions.yandexcloud.net/d4euokpfpmr9u0r4vpbv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: templateBase64,
          data: formData,
        }),
      });

      const result = await response.json();

      if (result.file) {
        setGeneratedFile({ base64: result.file, filename: `Договор_${formData.contract_number || 'новый'}.docx` });
        
        const blob = new Blob(
          [Uint8Array.from(atob(result.file), (c) => c.charCodeAt(0))],
          { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
        );
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);

        toast({
          title: 'Готово!',
          description: 'Договор создан, доступен предварительный просмотр',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сгенерировать договор',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadContract = () => {
    if (!generatedFile) return;

    const blob = new Blob(
      [Uint8Array.from(atob(generatedFile.base64), (c) => c.charCodeAt(0))],
      { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = generatedFile.filename;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Скачано',
      description: 'Договор сохранён на вашем устройстве',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Генератор договоров
              </CardTitle>
              <CardDescription>
                Загрузите шаблон и заполните данные для автоматической генерации
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="template">Шаблон договора (.docx) *</Label>
                <Input
                  id="template"
                  type="file"
                  accept=".docx"
                  onChange={handleTemplateUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Используйте переменные в шаблоне: {`{{party1_name}}, {{party2_name}}, {{amount}}`} и т.д.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="party1_name">Заказчик (ФИО/Название) *</Label>
                  <Input
                    id="party1_name"
                    value={formData.party1_name}
                    onChange={(e) => handleInputChange('party1_name', e.target.value)}
                    placeholder="ООО Компания"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="party1_address">Адрес заказчика</Label>
                  <Input
                    id="party1_address"
                    value={formData.party1_address}
                    onChange={(e) => handleInputChange('party1_address', e.target.value)}
                    placeholder="г. Москва, ул. Ленина, д. 1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="party2_name">Исполнитель (ФИО/Название) *</Label>
                  <Input
                    id="party2_name"
                    value={formData.party2_name}
                    onChange={(e) => handleInputChange('party2_name', e.target.value)}
                    placeholder="ИП Иванов"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="party2_address">Адрес исполнителя</Label>
                  <Input
                    id="party2_address"
                    value={formData.party2_address}
                    onChange={(e) => handleInputChange('party2_address', e.target.value)}
                    placeholder="г. Санкт-Петербург, пр. Невский, д. 10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contract_number">Номер договора</Label>
                  <Input
                    id="contract_number"
                    value={formData.contract_number}
                    onChange={(e) => handleInputChange('contract_number', e.target.value)}
                    placeholder="001/2024"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contract_date">Дата договора</Label>
                  <Input
                    id="contract_date"
                    type="date"
                    value={formData.contract_date}
                    onChange={(e) => handleInputChange('contract_date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Сумма договора (руб.) *</Label>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="100000"
                    type="number"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="work_description">Описание работ</Label>
                  <Textarea
                    id="work_description"
                    value={formData.work_description}
                    onChange={(e) => handleInputChange('work_description', e.target.value)}
                    placeholder="Разработка веб-сайта"
                    rows={3}
                  />
                </div>
              </div>

              <Button
                onClick={generateContract}
                disabled={loading || !templateBase64}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" className="mr-2 h-5 w-5 animate-spin" />
                    Генерация...
                  </>
                ) : (
                  <>
                    <Icon name="FileText" className="mr-2 h-5 w-5" />
                    Сгенерировать договор
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Предварительный просмотр</CardTitle>
              <CardDescription>
                Просмотрите документ перед скачиванием
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!previewUrl ? (
                <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg bg-muted/20">
                  <Icon name="FileQuestion" className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Сгенерируйте договор,<br />чтобы увидеть предварительный просмотр
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <iframe
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`}
                      className="w-full h-96"
                      title="Предварительный просмотр договора"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={downloadContract} className="flex-1" size="lg">
                      <Icon name="Download" className="mr-2 h-5 w-5" />
                      Скачать договор
                    </Button>
                    <Button
                      onClick={() => {
                        setPreviewUrl(null);
                        setGeneratedFile(null);
                      }}
                      variant="outline"
                      size="lg"
                    >
                      <Icon name="X" className="mr-2 h-5 w-5" />
                      Закрыть
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Просмотр работает через Office Online. Для полного просмотра скачайте файл.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
