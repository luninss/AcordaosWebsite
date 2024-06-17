import json
import os
import re
import ijson

def unificar_campos(record, tribunal):
    return {
        "processo": record.get("Processo") or record.get("Número de Processo"),
        "data_acordao": record.get("Data do Acordão") or record.get("Data"),
        "tribunal": tribunal,
        "relator": record.get("Relator") or record.get("Juízo ou Secção"),
        "descritores": record.get("Descritores") or record.get("Palavras-Chave") or record.get("Magistrado"),
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
output_dirAcordaos = 'datasetTratado/acordaos'
output_dirTribunais = 'datasetTratado/tribunais'
os.makedirs(output_dirAcordaos, exist_ok=True)
os.makedirs(output_dirTribunais, exist_ok=True)

tribunal_counts = {}

for filename in os.listdir(input_dir):
    if filename.endswith('.json'):
        input_path = os.path.join(input_dir, filename)
        tribunal = filename.split('_')[0]
        tribunal_counts.setdefault(tribunal, 0)
        with open(input_path, 'r', encoding='utf-8') as file:
            try:
                # Use ijson to stream the JSON records
                records = ijson.items(file, 'item')
                for idx, record in enumerate(records):
                    document = unificar_campos(record, tribunal)
                    output_filename = f"{os.path.splitext(filename)[0]}_{idx+1}.json"
                    output_path = os.path.join(output_dirAcordaos, output_filename)
                    with open(output_path, 'w', encoding='utf-8') as outfile:
                        json.dump(document, outfile, ensure_ascii=False, indent=4)
                    tribunal_counts[tribunal] += 1
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON in {input_path}: {str(e)}")
            except Exception as e:  # Catch other unexpected errors
                print(f"Failed to process {input_path}: {type(e).__name__} - {str(e)}")
        print(f"Arquivo {filename} processado com sucesso!")

# Create summary JSON files for each tribunal
for tribunal, count in tribunal_counts.items():
    summary_path = os.path.join(output_dirTribunais, f"{tribunal}_summary.json")
    summary_content = {
        "tribunal": tribunal,
        "numero_acordaos": count
    }
    with open(summary_path, 'w', encoding='utf-8') as summary_file:
        json.dump(summary_content, summary_file, ensure_ascii=False, indent=4)

print("Dados processados e salvos com sucesso!")
