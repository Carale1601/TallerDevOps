# Dockerfile
FROM node:lts-alpine

WORKDIR /app

# Instala las dependencias
COPY package*.json ./
RUN npm install

# Copia la aplicación
COPY . .

# Instala SQLite y configura el entorno
RUN apk update && apk add --no-cache sqlite sqlite-dev

# Exponer el puerto
EXPOSE 3000

# Comando por defecto para ejecutar la aplicación
CMD ["npm", "run", "start:dev"]
