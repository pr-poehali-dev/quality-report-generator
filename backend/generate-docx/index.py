import json
import base64
from typing import Dict, Any
from docxtpl import DocxTemplate
from io import BytesIO


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generates Word document from template with data substitution
    Args: event - dict with httpMethod, body containing template_url and data fields
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
    data = body_data.get('data', {})
    
    if not template_base64:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Template file required in base64 format'})
        }
    
    # Decode template from base64
    template_bytes = base64.b64decode(template_base64)
    template_stream = BytesIO(template_bytes)
    
    # Load template and render with data
    doc = DocxTemplate(template_stream)
    doc.render(data)
    
    # Save to BytesIO
    output_stream = BytesIO()
    doc.save(output_stream)
    output_stream.seek(0)
    
    # Encode result to base64
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
