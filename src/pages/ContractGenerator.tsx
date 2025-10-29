import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const TEMPLATE_BASE64 = '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';

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

  const generateContract = async () => {
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
          template: TEMPLATE_BASE64,
          data: formData,
        }),
      });

      const result = await response.json();

      if (result.file) {
        const blob = new Blob(
          [Uint8Array.from(atob(result.file), (c) => c.charCodeAt(0))],
          { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Договор_${formData.contract_number || 'новый'}.docx`;
        link.click();
        URL.revokeObjectURL(url);

        toast({
          title: 'Успешно!',
          description: 'Договор создан и скачан',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Генератор договоров
            </CardTitle>
            <CardDescription>
              Заполните данные для автоматической генерации договора
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <Input
                  id="work_description"
                  value={formData.work_description}
                  onChange={(e) => handleInputChange('work_description', e.target.value)}
                  placeholder="Разработка веб-сайта"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={generateContract}
                disabled={loading}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Генерирую...
                  </>
                ) : (
                  <>
                    <Icon name="FileText" size={16} />
                    Сгенерировать договор
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
