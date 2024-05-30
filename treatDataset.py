import json
import os

def unificar_campos(record):
    return {
        "processo": record.get("Processo") or record.get("Número de Processo"),
        "data_acordao": record.get("Data do Acordão") or record.get("Data"),
        "tribunal": record.get("Tribunal") or record.get("tribunal"),
        "relator": record.get("Relator"),
        "descritores": record.get("Descritores") or record.get("Palavras-Chave"),
        "numero_convencional": record.get("Nº Convencional") or record.get("Número Convencional"),
        "numero_documento": record.get("Nº do Documento") or record.get("Número do Documento"),
        "votacao": record.get("Votação") or record.get("Resultado da Votação"),
        "texto_integral": record.get("Texto Integral") or record.get("Conteúdo"),
        "url": record.get("url") or record.get("URL"),
        "outros_campos": {
            "requerente": record.get("Requerente"),
            "requerido": record.get("Requerido"),
            "privacidade": record.get("Privacidade"),
            "normas_apreciadas": record.get("Normas Apreciadas") or record.get("Leis Apreciadas"),
            "normas_julgadas_inconst": record.get("Normas Julgadas Inconst.") or record.get("Leis Julgadas Inconstitucionais"),
            "area_tematica_1": record.get("Área Temática 1"),
            "area_tematica_2": record.get("Área Temática 2"),
            "decisao": record.get("Decisão"),
            "sumario": record.get("Sumário")
        }
    }

input_dir = 'dataset'
output_dir = 'datasetTratado'
os.makedirs(output_dir, exist_ok=True)

for filename in os.listdir(input_dir):
    if filename.endswith('.json'):
        input_path = os.path.join(input_dir, filename)
        with open(input_path, 'r', encoding='utf-8') as file:
            try:
                data = json.load(file)
                for idx, record in enumerate(data):
                    document = unificar_campos(record)
                    output_filename = f"{os.path.splitext(filename)[0]}_{idx+1}.json"
                    output_path = os.path.join(output_dir, output_filename)
                    with open(output_path, 'w', encoding='utf-8') as outfile:
                        json.dump(document, outfile, ensure_ascii=False, indent=4)
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON in {input_path}: {str(e)}")
            except Exception as e:  # Catch other unexpected errors
                print(f"Failed to process {input_path}: {type(e).__name__} - {str(e)}")

print("Dados processados e salvos com sucesso!")
