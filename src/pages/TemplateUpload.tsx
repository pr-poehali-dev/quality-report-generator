import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function TemplateUpload() {
  const [base64Code, setBase64Code] = useState('');
  const { toast } = useToast();

  const saveTemplate = () => {
    if (!base64Code.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Вставьте base64 код',
        variant: 'destructive',
      });
      return;
    }

    try {
      localStorage.setItem('wordTemplate', base64Code);
      toast({
        title: 'Сохранено',
        description: 'Шаблон успешно сохранён в браузере',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить шаблон',
        variant: 'destructive',
      });
    }
  };

  const loadTemplate = () => {
    const saved = localStorage.getItem('wordTemplate');
    if (saved) {
      setBase64Code(saved);
      toast({
        title: 'Загружено',
        description: 'Шаблон загружен из браузера',
      });
    } else {
      toast({
        title: 'Не найдено',
        description: 'Сохранённый шаблон не найден',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Загрузка шаблона Word
          </h1>
          <p className="text-gray-600 mb-6">
            Вставьте base64 код вашего .docx шаблона в поле ниже
          </p>

          <Textarea
            value={base64Code}
            onChange={(e) => setBase64Code(e.target.value)}
            placeholder="Вставьте сюда base64 код..."
            className="min-h-[400px] font-mono text-sm mb-4"
          />

          <div className="flex gap-3 flex-wrap">
            <Button onClick={saveTemplate} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
              <Icon name="Save" size={16} />
              Сохранить шаблон
            </Button>
            <Button onClick={loadTemplate} variant="outline" className="gap-2">
              <Icon name="Upload" size={16} />
              Загрузить сохранённый
            </Button>
            <Button onClick={() => setBase64Code('')} variant="outline" className="gap-2">
              <Icon name="Trash2" size={16} />
              Очистить
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Инструкция:</strong>
            </p>
            <ol className="text-sm text-gray-600 mt-2 space-y-1 list-decimal list-inside">
              <li>Скопируйте base64 код вашего шаблона</li>
              <li>Вставьте его в поле выше</li>
              <li>Нажмите "Сохранить шаблон"</li>
              <li>Шаблон будет использоваться для генерации документов</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
