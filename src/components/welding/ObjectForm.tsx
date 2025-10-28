import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { FormData } from './types';

interface ObjectFormProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
}

export default function ObjectForm({ formData, updateFormData }: ObjectFormProps) {
  return (
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
  );
}
