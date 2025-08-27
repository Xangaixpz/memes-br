# 🎭 Pinterest Memes BR API

API para extrair e servir memes brasileiros do Pinterest especificamente da pasta [Memes BR](https://br.pinterest.com/iamjujurobert/memes-br) do usuário @iamjujurobert.

## 🚀 Funcionalidades

- ✅ Extração automática de imagens do Pinterest
- ✅ Cache inteligente (5 minutos)
- ✅ Sistema de fallback para alta disponibilidade
- ✅ Suporte a CORS para integração web
- ✅ Formato otimizado para Google Sites
- ✅ API RESTful com múltiplos endpoints

## 📋 Pré-requisitos

```bash
pip install -r requirements_pinterest.txt
```

### Dependências:
- Flask 2.3.3
- Flask-CORS 4.0.0
- Requests 2.31.0
- BeautifulSoup4 4.12.2
- lxml 4.9.3
- python-dotenv 1.0.0

## 🛠️ Como Usar

### 1. Iniciar a API

```bash
python pinterest_memes_api.py
```

A API estará disponível em: `http://localhost:5000`

### 2. Endpoints Disponíveis

#### 📊 Status da API
```
GET /
```
Retorna informações sobre a API e endpoints disponíveis.

#### 🎯 Buscar Memes BR
```
GET /api/memes/br?count=8
```
Retorna uma lista de memes brasileiros do Pinterest.

**Parâmetros:**
- `count` (opcional): Número de memes (1-20, padrão: 8)

**Exemplo de resposta:**
```json
{
  "success": true,
  "count": 8,
  "memes": [
    {
      "url": "https://i.pinimg.com/564x/...",
      "description": "Meme BR engraçado",
      "width": 564,
      "height": 564
    }
  ],
  "source": "Pinterest BR - Memes Brasileiros"
}
```

#### 🎲 Meme Aleatório
```
GET /api/memes/br/random
```
Retorna um único meme brasileiro aleatório.

#### 🔄 Lote de Memes (Formato Google Sites)
```
GET /api/memes/br/batch?count=8
```
Retorna memes formatados para fácil integração com Google Sites.

**Exemplo de resposta:**
```json
{
  "success": true,
  "count": 8,
  "memes": [
    {
      "id": 1,
      "image_url": "https://i.pinimg.com/564x/...",
      "description": "Meme BR",
      "width": 564,
      "height": 564,
      "html": "<div>...</div>"
    }
  ],
  "source": "Pinterest BR - Memes Brasileiros",
  "timestamp": 1704067200
}
```

## 🌐 Integração com Google Sites

### Código JavaScript para Google Sites:

```javascript
// Configuração
const API_BASE_URL = 'http://localhost:5000'; // Altere para seu servidor

// Função para buscar memes
async function carregarMemesBR() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/memes/br/batch?count=8`);
    const data = await response.json();
    
    if (data.success) {
      const container = document.getElementById('memes-container');
      container.innerHTML = '';
      
      data.memes.forEach(meme => {
        const div = document.createElement('div');
        div.innerHTML = meme.html;
        container.appendChild(div);
      });
    }
  } catch (error) {
    console.error('Erro ao carregar memes:', error);
  }
}

// Carregar automaticamente
carregarMemesBR();
```

### HTML para Google Sites:

```html
<div id="memes-container" style="display: flex; flex-wrap: wrap; gap: 20px;">
  <!-- Memes serão carregados aqui -->
</div>

<button onclick="carregarMemesBR()" style="padding: 10px 20px; background: #43a047; color: white; border: none; border-radius: 6px;">
  🔄 Atualizar Memes
</button>
```

## 🔧 Configurações Avançadas

### Cache
O sistema possui cache automático de 5 minutos. Para ajustar:

```python
# No arquivo pinterest_memes_api.py
self.cache_duration = 300  # 5 minutos (em segundos)
```

### Headers Personalizados
Para evitar bloqueios, a API usa headers realistas:

```python
self.headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...',
    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
    # ...
}
```

## 🚨 Sistema de Fallback

Se a extração do Pinterest falhar, a API automaticamente:
1. Tenta usar memes em cache
2. Retorna memes padrão como fallback
3. Registra erros no log para debug

## 📈 Monitoramento

A API registra logs importantes:
- Atualizações de cache
- Erros de extração
- Performance de requisições

```python
import logging
logging.basicConfig(level=logging.INFO)
```

## 🔐 Considerações de Segurança

- Use HTTPS em produção
- Configure rate limiting se necessário
- Monitore o uso para evitar bloqueios
- Considere usar proxies rotativos para alta demanda

## 🌍 Deploy em Produção

### Heroku
```bash
# Procfile
web: gunicorn pinterest_memes_api:app

# requirements.txt já configurado
pip install gunicorn
```

### Docker
```dockerfile
FROM python:3.9-slim
COPY requirements_pinterest.txt .
RUN pip install -r requirements_pinterest.txt
COPY . .
CMD ["python", "pinterest_memes_api.py"]
```

## 📝 Exemplos de Uso

### Curl
```bash
# Buscar 5 memes
curl "http://localhost:5000/api/memes/br?count=5"

# Meme aleatório
curl "http://localhost:5000/api/memes/br/random"
```

### Python
```python
import requests

response = requests.get('http://localhost:5000/api/memes/br?count=10')
data = response.json()

for meme in data['memes']:
    print(f"📸 {meme['description']}: {meme['url']}")
```

### JavaScript (Fetch)
```javascript
fetch('http://localhost:5000/api/memes/br/batch?count=6')
  .then(response => response.json())
  .then(data => {
    console.log(`✅ ${data.count} memes carregados!`);
    data.memes.forEach(meme => {
      console.log(`🎭 ${meme.description}`);
    });
  });
```

## 🔄 Atualizações e Melhorias

### Próximas funcionalidades:
- [ ] Suporte a múltiplas pastas do Pinterest
- [ ] Filtros por categoria/tags
- [ ] API de upload de memes próprios
- [ ] Sistema de favoritos
- [ ] Rate limiting automático
- [ ] Métricas de uso

## 📞 Suporte

Para dúvidas ou problemas:
- Fonte original: [Pinterest Memes BR](https://br.pinterest.com/iamjujurobert/memes-br)
- Verifique os logs da aplicação
- Teste os endpoints individualmente

---

## 🎯 Resumo Rápido

1. **Instalar dependências:** `pip install -r requirements_pinterest.txt`
2. **Iniciar API:** `python pinterest_memes_api.py`
3. **Testar:** Acesse `http://localhost:5000`
4. **Integrar:** Use o código em `google_sites_memes_integration.html`
5. **Personalizar:** Ajuste `API_BASE_URL` para seu servidor

✨ **Pronto!** Seus memes brasileiros do Pinterest agora estão disponíveis via API! 