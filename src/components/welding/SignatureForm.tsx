import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { FormData } from './types';

interface SignatureFormProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
}

export default function SignatureForm({ formData, updateFormData }: SignatureFormProps) {
  return (
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
  );
}
