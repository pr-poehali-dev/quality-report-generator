import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { WeldConnection } from './types';

interface ConnectionsFormProps {
  connections: WeldConnection[];
  addConnection: () => void;
  removeConnection: (id: string) => void;
  updateConnection: (id: string, field: keyof WeldConnection, value: string) => void;
}

export default function ConnectionsForm({ 
  connections, 
  addConnection, 
  removeConnection, 
  updateConnection 
}: ConnectionsFormProps) {
  return (
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
  );
}
