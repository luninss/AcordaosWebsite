import os
import json
from pymongo import MongoClient

# Conectar ao servidor MongoDB (ajuste a URI conforme necessário)
client = MongoClient('mongodb://127.0.0.1:27017/')

# Selecionar o banco de dados e a coleção
db = client.ProjetoEW
collection = db.Acordaos

# Caminho da pasta onde os arquivos JSON estão localizados
input_dir = 'datasetTratado'

# Processar e inserir os dados
for filename in os.listdir(input_dir):
    if filename.endswith('.json'):
        input_path = os.path.join(input_dir, filename)
        with open(input_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            # Inserir o documento na coleção
            collection.insert_one(data)

print("Dados inseridos na base de dados com sucesso!")
