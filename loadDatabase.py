import os
import json
from pymongo import MongoClient

# Conectar ao servidor MongoDB (ajuste a URI conforme necessário)
client = MongoClient('mongodb://127.0.0.1:27017/')

# Selecionar o banco de dados e a coleção
db = client.ProjetoEW
collectionAcordaos = db.Acordaos
collectionTribunais = db.Tribunais

# Caminho da pasta onde os arquivos JSON estão localizados
input_dirAcordaos = 'datasetTratado/acordaos'
input_dirTribunais = 'datasetTratado/tribunais'

# Processar e inserir os dados
for filename in os.listdir(input_dirAcordaos):
    if filename.endswith('.json'):
        input_path = os.path.join(input_dirAcordaos, filename)
        with open(input_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            # Inserir o documento na coleção
            collectionAcordaos.insert_one(data)

print("Dados de acordaos inseridos na base de dados com sucesso!")

for filename in os.listdir(input_dirTribunais):
    if filename.endswith('.json'):
        input_path = os.path.join(input_dirTribunais, filename)
        with open(input_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            # Inserir o documento na coleção
            collectionTribunais.insert_one(data)

print("Dados de tribunais inseridos na base de dados com sucesso!")
