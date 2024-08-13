FROM python:3.12 AS base

WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r ./address_parser_nlp/requirements.txt
RUN apt-get update && apt-get install -y \
    curl \
    gnupg
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
apt-get install -y nodejs
RUN npm install
RUN npm run build
CMD ["node", "dist/main.js"]