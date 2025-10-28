import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { FormData, WeldConnection } from './types';

interface PreviewDialogProps {
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  formData: FormData;
  connections: WeldConnection[];
  generateDocument: () => void;
  generateExcel: () => void;
}

export default function PreviewDialog({ 
  showPreview, 
  setShowPreview, 
  formData, 
  connections, 
  generateDocument, 
  generateExcel 
}: PreviewDialogProps) {
  return (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Предпросмотр документа
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-6 bg-white rounded-lg border-2 border-gray-200">
          <div className="text-xs space-y-1 border-b pb-4">
            <p><strong>Наименование лаборатории НК:</strong> {formData.labName}</p>
            <p><strong>Свидетельство об аттестации:</strong> № {formData.certificate}</p>
            <p><strong>Нормативный документ:</strong> {formData.normDoc}</p>
            <p><strong>Номер ОТК НК:</strong> ТК-РК-{formData.otkNumber}</p>
            <p><strong>Источник ионизирующего излучения:</strong> {formData.radiationSource}</p>
            <p><strong>Тип детектора:</strong> {formData.detector}</p>
            <p><strong>Тип защитного экрана:</strong> {formData.protectiveScreen}</p>
            <p><strong>Тип усиливающего:</strong> {formData.amplifier}</p>
            <p><strong>Заключение по ВИК№:</strong> {formData.vikNumber} от {formData.vikDate}</p>
          </div>

          <div className="text-center py-4 border-b">
            <h2 className="text-lg font-bold">ЗАКЛЮЧЕНИЕ № {formData.conclusionNumber}-ПА</h2>
            <p className="text-sm">от {new Date(formData.conclusionDate).toLocaleDateString('ru-RU')} года</p>
            <p className="text-sm mt-2">по результатам контроля качества сварных соединений</p>
            <p className="text-sm">радиационным неразрушающим методом (РК)</p>
          </div>

          <div className="text-xs space-y-1 border-b pb-4">
            <p><strong>Наименование объекта:</strong> {formData.objectName}</p>
            <p><strong>Уровень качества:</strong> «{formData.qualityLevel}»</p>
            <p><strong>Объем контроля:</strong> {formData.controlVolume}%</p>
            <p><strong>Название трассы:</strong> {formData.routeName}</p>
            <p><strong>Участок трубопровода, километраж:</strong> {formData.pipelineSection}</p>
            <p><strong>Наименование орг. подрядчика:</strong> {formData.contractor}</p>
            <p><strong>Наименование орг. заказчика:</strong> {formData.customer}</p>
            <p><strong>Шифр бригады или клеймо сварщика:</strong> {formData.welderMark}</p>
          </div>

          <div>
            <h3 className="font-bold text-center mb-3">РЕЗУЛЬТАТЫ КОНТРОЛЯ</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-gray-300">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="border border-gray-300 p-2">№ соед.</th>
                    <th className="border border-gray-300 p-2">Диаметр x толщина</th>
                    <th className="border border-gray-300 p-2">№ участка</th>
                    <th className="border border-gray-300 p-2">Чувств.</th>
                    <th className="border border-gray-300 p-2">Координаты</th>
                    <th className="border border-gray-300 p-2">Описание дефектов</th>
                    <th className="border border-gray-300 p-2">Заключение</th>
                    <th className="border border-gray-300 p-2">Примечания</th>
                  </tr>
                </thead>
                <tbody>
                  {connections.map((conn) => (
                    <tr key={conn.id}>
                      <td className="border border-gray-300 p-2 text-center">{conn.number}</td>
                      <td className="border border-gray-300 p-2 text-center">{conn.diameter}</td>
                      <td className="border border-gray-300 p-2 text-center">{conn.section}</td>
                      <td className="border border-gray-300 p-2 text-center">{conn.sensitivity}</td>
                      <td className="border border-gray-300 p-2">{conn.coordinates}</td>
                      <td className="border border-gray-300 p-2">{conn.defects}</td>
                      <td className={`border border-gray-300 p-2 text-center font-semibold ${
                        conn.conclusion === 'годен' ? 'text-green-600' : 
                        conn.conclusion === 'ремонт' ? 'text-orange-600' : 'text-red-600'
                      }`}>{conn.conclusion}</td>
                      <td className="border border-gray-300 p-2">{conn.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-xs border-t pt-4">
            <p><strong>Контроль провёл:</strong> {formData.controllerName}</p>
            <p>{formData.controllerLevel} ур., удост. № {formData.controllerCertificate}</p>
            <p><strong>Дата:</strong> {new Date(formData.controlDate).toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={generateDocument} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
            <Icon name="FileDown" size={16} />
            Скачать PDF
          </Button>
          <Button onClick={generateExcel} className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600">
            <Icon name="Sheet" size={16} />
            Скачать Excel
          </Button>
          <Button onClick={() => setShowPreview(false)} variant="outline">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
