import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { FormData } from './types';

interface HeaderFormProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
}

export default function HeaderForm({ formData, updateFormData }: HeaderFormProps) {
  return (
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
  );
}
