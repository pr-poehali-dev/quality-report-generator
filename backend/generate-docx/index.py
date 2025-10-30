import json
import base64
from typing import Dict, Any
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from io import BytesIO


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Creates Word document with form data without requiring template
    Args: event - dict with httpMethod, body containing formData and connections
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
    form_data = body_data.get('formData', {})
    connections = body_data.get('connections', [])
    
    doc = Document()
    
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = title.add_run('ЗАКЛЮЧЕНИЕ ПО РЕЗУЛЬТАТАМ РАДИАЦИОННОГО КОНТРОЛЯ')
    run.bold = True
    run.font.size = Pt(14)
    
    doc.add_paragraph()
    
    doc.add_paragraph(f"Лаборатория: {form_data.get('labName', '')}")
    doc.add_paragraph(f"Аттестат аккредитации: {form_data.get('certificate', '')}")
    doc.add_paragraph(f"Номер ОТК: {form_data.get('otkNumber', '')}")
    doc.add_paragraph(f"Нормативный документ: {form_data.get('normDoc', '')}")
    
    doc.add_paragraph()
    
    doc.add_paragraph(f"Объект контроля: {form_data.get('objectName', '')}")
    doc.add_paragraph(f"Трасса: {form_data.get('routeName', '')}")
    doc.add_paragraph(f"Участок трубопровода: {form_data.get('pipelineSection', '')}")
    doc.add_paragraph(f"Подрядчик: {form_data.get('contractor', '')}")
    doc.add_paragraph(f"Заказчик: {form_data.get('customer', '')}")
    
    doc.add_paragraph()
    
    if connections:
        table = doc.add_table(rows=1, cols=7)
        table.style = 'Light Grid Accent 1'
        
        hdr_cells = table.rows[0].cells
        headers = ['№', 'Диаметр', 'Участок', 'Чувствительность', 'Координаты', 'Дефекты', 'Заключение']
        for i, header in enumerate(headers):
            hdr_cells[i].text = header
        
        for conn in connections:
            row_cells = table.add_row().cells
            row_cells[0].text = str(conn.get('number', ''))
            row_cells[1].text = str(conn.get('diameter', ''))
            row_cells[2].text = str(conn.get('section', ''))
            row_cells[3].text = str(conn.get('sensitivity', ''))
            row_cells[4].text = str(conn.get('coordinates', ''))
            row_cells[5].text = str(conn.get('defects', ''))
            row_cells[6].text = str(conn.get('conclusion', ''))
    
    doc.add_paragraph()
    
    doc.add_paragraph(f"Контролер НК: {form_data.get('controllerName', '')}")
    doc.add_paragraph(f"Уровень квалификации: {form_data.get('controllerLevel', '')}")
    doc.add_paragraph(f"Аттестат: {form_data.get('controllerCertificate', '')}")
    doc.add_paragraph(f"Дата контроля: {form_data.get('controlDate', '')}")
    
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
            'filename': 'zaklyuchenie_rk.docx'
        })
    }