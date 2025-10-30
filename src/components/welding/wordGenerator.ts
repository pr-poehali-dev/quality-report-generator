import { FormData, WeldConnection } from './types';

function base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function generateWordDocument(formData: FormData, connections: WeldConnection[]): Promise<void> {
  const response = await fetch('https://functions.poehali.dev/aad88013-11b5-4bbe-9acd-697f931f1b73', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      formData: formData,
      connections: connections,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to generate document: ${error}`);
  }

  const result = await response.json();
  const blob = base64ToBlob(result.file, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  downloadBlob(blob, result.filename);
}