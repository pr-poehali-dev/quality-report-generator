import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface ContractData {
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  contractNumber: string;
  contractDate: string;
  workDescription: string;
  amount: string;
  startDate: string;
  endDate: string;
}

export default function ContractGenerator() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contractData, setContractData] = useState<ContractData>({
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    contractNumber: '',
    contractDate: new Date().toISOString().split('T')[0],
    workDescription: '',
    amount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const updateField = (field: keyof ContractData, value: string) => {
    setContractData(prev => ({ ...prev, [field]: value }));
  };

  const generateContract = async () => {
    const template = localStorage.getItem('wordTemplate');
    
    if (!template) {
      toast({
        title: 'Ошибка',
        description: 'Сначала загрузите шаблон на странице /template-upload',
        variant: 'destructive',
      });
      return;
    }

    if (!contractData.clientName || !contractData.amount) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://your-backend-url.com/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: template,
          data: contractData,
        }),
      });

      const result = await response.json();

      if (result.file) {
        const blob = new Blob(
          [Uint8Array.from(atob(result.file), c => c.charCodeAt(0))],
          { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
        );
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Договор_${contractData.contractNumber || 'новый'}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast({
          title: 'Готово!',
          description: 'Договор успешно сгенерирован',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать договор',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="FileText" size={32} className="text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Генератор договоров
              </h1>
              <p className="text-gray-600">Заполните данные для создания договора</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="clientName">ФИО клиента *</Label>
              <Input
                id="clientName"
                value={contractData.clientName}
                onChange={e => updateField('clientName', e.target.value)}
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div>
              <Label htmlFor="clientPhone">Телефон</Label>
              <Input
                id="clientPhone"
                value={contractData.clientPhone}
                onChange={e => updateField('clientPhone', e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="clientAddress">Адрес</Label>
              <Input
                id="clientAddress"
                value={contractData.clientAddress}
                onChange={e => updateField('clientAddress', e.target.value)}
                placeholder="г. Москва, ул. Примерная, д. 1"
              />
            </div>

            <div>
              <Label htmlFor="contractNumber">Номер договора</Label>
              <Input
                id="contractNumber"
                value={contractData.contractNumber}
                onChange={e => updateField('contractNumber', e.target.value)}
                placeholder="001/2025"
              />
            </div>

            <div>
              <Label htmlFor="contractDate">Дата договора</Label>
              <Input
                id="contractDate"
                type="date"
                value={contractData.contractDate}
                onChange={e => updateField('contractDate', e.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="workDescription">Описание работ</Label>
              <Input
                id="workDescription"
                value={contractData.workDescription}
                onChange={e => updateField('workDescription', e.target.value)}
                placeholder="Монтаж системы отопления"
              />
            </div>

            <div>
              <Label htmlFor="amount">Сумма договора (₽) *</Label>
              <Input
                id="amount"
                value={contractData.amount}
                onChange={e => updateField('amount', e.target.value)}
                placeholder="150000"
              />
            </div>

            <div>
              <Label htmlFor="startDate">Дата начала работ</Label>
              <Input
                id="startDate"
                type="date"
                value={contractData.startDate}
                onChange={e => updateField('startDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Дата окончания работ</Label>
              <Input
                id="endDate"
                type="date"
                value={contractData.endDate}
                onChange={e => updateField('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={generateContract}
              disabled={loading}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Генерируем...
                </>
              ) : (
                <>
                  <Icon name="Download" size={16} />
                  Сгенерировать договор
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => window.location.href = '/template-upload'}
              className="gap-2"
            >
              <Icon name="Upload" size={16} />
              Загрузить шаблон
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Инструкция:</strong>
            </p>
            <ol className="text-sm text-gray-600 mt-2 space-y-1 list-decimal list-inside">
              <li>Загрузите шаблон договора на странице /template-upload</li>
              <li>Заполните все необходимые поля формы</li>
              <li>Нажмите "Сгенерировать договор"</li>
              <li>Готовый .docx файл автоматически скачается</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
