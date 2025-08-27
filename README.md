# 🎭 Pinterest Memes BR API

API para extrair memes brasileiros do Pinterest e servir para aplicações web.

## 🚀 Deploy no Railway

Esta API está configurada para deploy automático no Railway.

## 📋 Endpoints

- `GET /` - Status da API
- `GET /api/memes/br` - Lista de memes brasileiros
- `GET /api/memes/br/random` - Meme aleatório
- `GET /api/memes/br/batch` - Lote de memes formatados

## 🌐 Fonte

Memes extraídos de: https://br.pinterest.com/iamjujurobert/memes-br

## 🔧 Uso

```javascript
fetch('/api/memes/br/batch?count=8')
  .then(response => response.json())
  .then(data => console.log(data.memes));
``` 