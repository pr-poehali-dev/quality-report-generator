import { FormData, WeldConnection } from './types';

const TEMPLATE_BASE64 = 
  'UEsDBBQABgAIAAAAIQDcamkykQEAACwHAAATAAgCW0NvbnRlbnRfVHlwZXNdLnhtbCCiBAIooAAC' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArJVNT8MwDIbvSPyH' +
  'Kle0ZuOAEFq3Ax9HmMSQuIbE3SLypcT7+ve461YhGHRi9FKptf2+T2zVGY7X1mRLiEl7V7BB3mcZ' +
  'OOmVdrOCvUwfetcsSyicEsY7KNgGEhuPzs+G002AlFG1SwWbI4YbzpOcgxUp9wEcRUofrUB6jTMe' +
  'hHwXM+CX/f4Vl94hOOxhpcFGwzsoxcJgdr+mzzVJBJNYdlsnVl4FEyEYLQVSnC+d+uLS2znkVLnN' +
  'SXMd0gUlMH7QoYr8bLCre6LWRK0gm4iIj8JSFl/5qLjycmKpMv9d5gCnL0stoamv1EL0ElKinluT' +
  'NxErtNvzH+KQi4TevlrDNYKdRB/S4GScRrTSg4gamh7+2IuEGwPp/ztR67bbAyIVdAGwU25FWMH' +
  'bc2cUn8RbQUrv0XnsYhqNdCsEONURw165FWEOQkE8/Xf4RlALHzEH8hNvBrqYw066FQJpG0P9PL0T' +
  'W5nfLClzu4Nou8c/HHu/vqvqXjhq+TSOJH3y+aC6GRSoA958e9eNPgAAAP//AwBQSwMEFAAGAAgA' +
  'AAAhAB6RGrfvAAAATgIAAAsACAJfcmVscy8ucmVscyCiBAIooAACAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' +
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArJJNT8Mw' +
  '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' +
  'p9XjJlWNLWjaSrqCRKjvvRhiKZgh5vnv/+e4P6Pnuzv6th/u3fv1ucWwnM49NKEf9y98+ez3vx' +
  'y//+Ph+48f/3ji8P/6xX//fAz8fvnjj88f/fzir0evHv784Hf14fnn5/AkI+iXxx+efXj8/Pdf' +
  'Hz34+Pef/iiFJe66+PDt8Q/v3v/19NdvPz78/K+f3vz46qef/i7FJK6vzrzx9f/2v36w+c//Zx7' +
  'exye8//3x89vv3h1/+Prdy4df3f/10dsvf/j36z/f/vPy0Y/f3f/69Xd/P//n66Mv/rj38f4P/7' +
  'z78f6n127e/Pz+3Y8vP/3118v3X799+O7+xz+/ve//vI+AY5VzeLgEvgFfP/rth0evXv79+68ffn' +
  'j96Ld9aV90+/3x+97D17/c+/D43vvf9uPH//7+7y9fv3r/8vuvvvzr16+//fzqw68PXh37x38+' +
  '//jrzy++/O2//f/fvD585//8+N2bn17e//fxy+fv/vrn3ru///P41d8f3j/6+e2/L5/d+/zp1b' +
  '2P/3z88u2/f7x/b//j/+H/f/30w8vX+3/u//fx49fvP7z67f3xx18f/PP+21d///Xo1Yuf7z3+' +
  '7R8fjz98/Or1/n/98vHty58+fnr87vXzB68+/vvi5f0Pj159/vn+y68+vP7yy9t/PPv+r0+//+' +
  '/Vm3+9vnf8y72PX/789v79z4///v7Rp1+AAAA//8DAFBLAwQUAAYACAAAACEAKa3zo6wWAADWbg' +
  'AAEQAAAG9yZC9zZXR0aW5ncy54bWykXVlzmzl2fU9V/oNLz/EY+6K0ewrrdKe6k9S4p/JMSZTFMi' +
  'mqSMpuTyr/PQciaXk5SLUnLzb1HQK4uLi4Gy4+/vDn3zfrF++Xu/1qe//6Qv5JXLxY3l9vb1b3b1' +
  '9f/O23/jJcvNgfFvc3i/X2fvn64uNyf/HnH//5n374cLlfHg742v4FurjfX26uX1/cHQ4Pl69e7a' +
  '/vlpvF/k/bh+U9wNvtbrM44M/d21ebxe7d48PL6+3mYXFYXa3Wq8PHV0oId3HqZvv64nF3f3nq4u' +
  'Vmdbfdbrf3h9Hkcnt7u7penv47t9j9kXGPTer2+nGzvD88jfhqt1yDhu39/m71sD/3tvlHewN4d+' +
  '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' +
  'uyO nluxgOTQxjVxLC7kq8toWWJKR5NJT+u+V6Sk99rTMDLtv2Pr4qQfyjtwpsyY0yWaAE+Dq3Sjzx+H17fQ4BSk9Z4Ms7aAF79FDbw8nkbMdQsdlsI5kQKohU' +
  'V5xXtp+Ww5u0pV5aSktkaz1Bi/J7BE3glPfn0F7HXxai8ru+Mr+opoG+MVM7wAAAP//AwBQSwMEFAAGAAgAAAAhAEL/3CY6DgAABYUAAA8AAAB3b3JkL3N0eWxlcy54bWzs' +
  'nU9z2zYQwO+d6Xcw8NQeLIkkpTiaSBkpttqoJ7Yq0u09SC2BYQyQAElLyqlJp6ee2ktP7aGfIJOZtKkz6WegvlF3sQBZ6GFB7MXaqWcsQSxW+GOxu8D6xx9/fjPc+Ilyzszhk' +
  '+PhJ4f7z14cPHz14uH+k09e3H/2/MmvHz4/+OX5L19/dXj/2f7zz+6/fPXl0S/f/fDZ/m8vXz75r//zP/zz/efnvzwKngQxDSe/PH/+/X/9z3/+b5/+66v//se3//3w+' +
  'x/++fDXF//+7s9vHv746MXTb//5w7/+88dHv//nn//58z/+/ej597/+/sX/+/j7r7/79sUfX/7+x6Pvfvvzv//50a+v/vX1+T/+5+f//bvv/vPg5fc//fv5f/7f/+Pfjl//99' +
  '9/++eXf/3zy/v/+vXvv/7z3w+f//LPv174n//92xf//O3Pb//5zf/+/d+//v7Hf//+21//+PLXr//+819//vHV/fv3f/v617+++/Ufv3/z9v79b//7n//Y//zLP3757ff/+' +
  'O3f//Xy1f/+9c0f//n6q3/+8dWf3/33w1++/8dfv337+58Pv/nX33/9/t+/fvPnL//3P3/+Pn717X9+//rPP775r6+++f1/f/3Ty9/++vqHP//z23///sc3f/zy7e+/f/ubP3' +
  '7+90+//fb8Pz//+rtvvv3n49/+/vXht98/f/W/v//r37/+858PH//+j6+Pf/j+218e/vHV1w9//Nvzf3z/+P9+/e7R71/++vDD//zp1ufPvz/+9p9f/fro9//99Zc//vrt' +
  'f//94e+/fPevb//14OnDr//8368fPfn29+ff/HX884+PXvzn2y8ffvP7o+Pv//fb3//+8Mfvnv/y55c/fHv0x19f//X7L/vvXj57+N23v3z/x3+8+u+fD3/75s+nD7999q' +
  '+vf/37v//x+//+/fB/f/3rl//9+/f/fvQ//3PZ//D8l//+/Zd/Pbv/7LrXr/56/M1vj7//7+MfXj3//vdXD7/95fn3f77689Hjr//71+9efPP8l+cf/P3l6z/+9t8//Pnw+e/' +
  'fPfyXJy//859+fe/rr/5+9dXLh99998e/Hv7+v99+/fKbPx7+/uKP17/+9u//efnwl9++/epfz/7+7cs//nr0x2///OXhl//z/PuXv//2f4+/u//Ly6++//vPR//z+19f/f' +
  'r7b199+ei7P379/fsvHz35/bs/Hj7/9uXD3x79evTj8z/+fvjDnw+/+uqrl3//+vt/PPzP77//8cf/ffLb8///6vS/fvrXd9/9/vzhr7//52//9vD3//Ovby7+/PKrh9///' +
  '3t86u7f/v/f3799ff/d7z//8+uvXr18+dNPfzz57enTH3766cnv3/3+5SsP//PTT9//9v2T//r+m5+/+/YfD//9rx/+9YU//v79T//z+/e/f/X7X//4Y//dX//31Z9//vns' +
  'xZeP///x89++/f1fl//+y+/f/vzLN//+9vnvf//3xb///PL4t99e/fX779///vtfj/788x+P//r9+df//Ov3F//z36++evnq+ddfvcP/f/rbT3/88e9vXj39/ZtXv//P1w' +
  '//+uvJfz58+cWLP7/+4vlvP/y/V3/98tfDP15998vR//76+y9fffnw2+/+/vX537/89uTX7//+9v+99/+++9dfv33z5z9+/P7lr3/8+tcf//N///r24R+vv3z0/PWfv/zf' +
  '02/vP3r15/NvX/7fX98++e3Flw9/+vqvV49+/vLPh89++e6vv3579ORJEP/6zfNvfnz4w8Nvvvzmp9+/+uO/f/rh5cPfXj8P/njx5Jf/+O3R7z999fDPP//f7598+fzhb/' +
  '8J/vHy6bvf/v7w+a+//eP+v37/95evv9v/5vfv/vfFw+Ppf3z//+/93Z++vPrXN//1/6+/e/D//tX59b+/e/Lq5eN/ff3zzz++ePLl8x+/f/X88cuvv/3pl18f/vT6u8e//' +
  'fr7P57+/t98=';

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
        replacements: dataForTemplate,
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