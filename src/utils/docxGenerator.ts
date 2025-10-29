/**
 * Utility for generating Word documents from templates
 */

const DOCX_FUNCTION_URL = 'https://functions.poehali.dev/aad88013-11b5-4bbe-9acd-697f931f1b73';

interface GenerateDocxParams {
  templateFile: File;
  data: Record<string, any>;
}

/**
 * Generate Word document from template with data substitution
 * @param templateFile - .docx file with {{field}} placeholders
 * @param data - Object with field values to substitute
 * @returns Blob with generated .docx file
 */
export async function generateDocx({ templateFile, data }: GenerateDocxParams): Promise<Blob> {
  // Convert template file to base64
  const templateBase64 = await fileToBase64(templateFile);
  
  // Call backend function
  const response = await fetch(DOCX_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      template: templateBase64,
      data
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate document');
  }

  const result = await response.json();
  
  // Convert base64 result back to Blob
  const binaryString = atob(result.file);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new Blob([bytes], { 
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
  });
}

/**
 * Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Download generated document
 */
export function downloadDocx(blob: Blob, filename: string = 'document.docx') {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
