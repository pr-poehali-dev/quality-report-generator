import { FormData, WeldConnection } from './types';

const TEMPLATE_BASE64 = 'UEsDBBQABgAIAAAAIQDcamkykQEAACwHAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC0lU1PwzAMhu9I/IcqV7Rm44AQWrcDH0eYxJC4hsTdIvKlxPv697jrViEYdGL0Uqm1/b5PbNUZjtfWZEuISXtXsEHeZxk46ZV2s4K9TB961yxLKJwSxjso2AYSG4/Oz4bTTYCUUbVLBZsjhhvOk5yDFSn3ARxFSh+tQHqNMx6EfBcz4Jf9/hWX3iE47GGlwUbDOyjFwmB2v6bPNUkEk1h2WydWXgUTIRgtBVKcL5364tLbOeRUuc1Jcx3SBSUwftChivxssKt7otZErSCbiIiPwlIWX/mouPJyYaky/13mAKcvSy2hqa/UQvQSUqKeW5M3ESu02/Mf4pCLhN6+WsM1gp1EH9LgZJxGtNKDiBqaHv7Yi4QbA+n/O1HrttsDIhV0AbBTbkVYwdtzZxSfxFtBSu/ReexiGo10KwQ41RHDXrkVYQ5CQTz9d/hGUAsfMQfyE28GupjDTroVAmkbQ/08vRNbmd8sKXO7g2i7xz8ce7++q+peOGr5NI4kffL5oLoZFKgD3nx7140+AAAA//8DAFBLAwQUAAYACAAAACEAHpEat+8AAABOAgAACwAIAl9yZWxzLy5yZWxzIKIEAiigAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA... [truncated]

export async function generateWordDocument(formData: FormData, connections: WeldConnection[]) {
  try {
    const dataForTemplate = {
      lab_name: formData.labName,
      certificate: formData.certificate,
      norm_doc: formData.normDoc,
      otk_number: formData.otkNumber,
      radiation_source: formData.radiationSource,
      detector: formData.detector,
      protective_screen: formData.protectiveScreen,
      amplifier: formData.amplifier,
      vik_number: formData.vikNumber,
      vik_date: formData.vikDate,
      conclusion_number: formData.conclusionNumber,
      conclusion_date: new Date(formData.conclusionDate).toLocaleDateString('ru-RU'),
      object_name: formData.objectName,
      quality_level: formData.qualityLevel,
      control_volume: formData.controlVolume,
      route_name: formData.routeName,
      pipeline_section: formData.pipelineSection,
      contractor: formData.contractor,
      customer: formData.customer,
      welder_mark: formData.welderMark,
      controller_name: formData.controllerName,
      controller_level: formData.controllerLevel,
      controller_certificate: formData.controllerCertificate,
      control_date: new Date(formData.controlDate).toLocaleDateString('ru-RU'),
      connections: connections.map(conn => ({
        number: conn.number,
        diameter: conn.diameter,
        section: conn.section,
        sensitivity: conn.sensitivity,
        coordinates: conn.coordinates,
        defects: conn.defects,
        conclusion: conn.conclusion,
        notes: conn.notes,
      })),
    };

    const response = await fetch('https://functions.poehali.dev/aad88013-11b5-4bbe-9acd-697f931f1b73', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: TEMPLATE_BASE64,
        data: dataForTemplate,
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
      link.download = `Заключение_${formData.conclusionNumber}.docx`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      throw new Error('Не удалось получить файл от сервера');
    }
  } catch (error) {
    console.error('Ошибка генерации Word документа:', error);
    throw error;
  }
}