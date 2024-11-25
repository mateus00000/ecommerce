# Etapa 1: Construir o aplicativo React
FROM node:18-alpine AS build

# Definir o diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Construir o aplicativo para produção
RUN npm run build

# Etapa 2: Servir o aplicativo com Nginx
FROM nginx:alpine

# Copiar os arquivos de build para o diretório padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expor a porta padrão do Nginx
EXPOSE 80

# Comando para manter o Nginx em execução
CMD ["nginx", "-g", "daemon off;"]
