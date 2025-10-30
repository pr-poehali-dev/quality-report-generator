import json
import base64
from typing import Dict, Any
from docx import Document
from io import BytesIO


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generates Word document from template by replacing text placeholders
    Args: event - dict with httpMethod, body containing template (base64) and replacements dict
          context - object with request_id attribute
    Returns: HTTP response with base64-encoded .docx file
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    template_base64 = body_data.get('template')
    replacements = body_data.get('replacements', {})
    
    if not template_base64:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Template file required in base64 format'})
        }
    
    template_bytes = base64.b64decode(template_base64)
    template_stream = BytesIO(template_bytes)
    
    doc = Document(template_stream)
    
    for paragraph in doc.paragraphs:
        for old_text, new_text in replacements.items():
            if old_text in paragraph.text:
                for run in paragraph.runs:
                    if old_text in run.text:
                        run.text = run.text.replace(old_text, str(new_text))
    
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    for old_text, new_text in replacements.items():
                        if old_text in paragraph.text:
                            for run in paragraph.runs:
                                if old_text in run.text:
                                    run.text = run.text.replace(old_text, str(new_text))
    
    output_stream = BytesIO()
    doc.save(output_stream)
    output_stream.seek(0)
    
    result_base64 = base64.b64encode(output_stream.read()).decode('utf-8')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'file': result_base64,
            'filename': 'output.docx'
        })
    }
