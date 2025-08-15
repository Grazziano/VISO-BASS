# Imagem base
FROM node:18-alpine

# Diretório de trabalho no container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Compila o projeto
RUN npm run build

# Porta que a API vai expor
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
