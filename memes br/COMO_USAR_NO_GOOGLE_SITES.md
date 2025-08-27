# 🎭 Como Integrar os Memes do Pinterest no Google Sites

## 📋 Passo a Passo Completo

### 1️⃣ **Preparar o Servidor da API**

```bash
# No seu computador ou servidor
cd "C:\Users\xangai\Documents\memes br"
pip install -r requirements_pinterest.txt
python pinterest_memes_api.py
```

A API estará rodando em: `http://localhost:5000`

### 2️⃣ **Código para Google Sites**

#### 🅰️ **HTML (Cole na seção de código do Google Sites):**

```html
<!-- MEMES BR DO PINTEREST -->
<div style="margin: 20px 0;">
  <h3 style="color:#43a047; margin-top:32px; display:flex; align-items:center; gap:10px;">
    🇧🇷 Memes Brasileiros - Pinterest
  </h3>
  
  <div id="pinterest-stats" style="background:#f5f5f5; padding:10px; border-radius:8px; margin:10px 0; font-size:14px; color:#666;">
    Fonte: <a href="https://br.pinterest.com/iamjujurobert/memes-br" target="_blank" style="color:#43a047; text-decoration:none;">Pinterest Memes BR</a>
  </div>
  
  <button onclick="atualizarMemesBR()" style="padding:10px 20px; background:#43a047; color:white; border:none; border-radius:6px; font-size:16px; cursor:pointer; margin:10px 0; transition:background 0.3s ease;">
    🔄 Atualizar Memes BR
  </button>
  
  <div id="memes-br-pinterest" style="display:flex; flex-wrap:wrap; gap:15px; justify-content:center; margin:20px 0; min-height:200px;">
    <!-- Memes aparecerão aqui -->
  </div>
  
  <div id="pinterest-loading" style="color:#43a047; font-size:16px; text-align:center; margin:20px; display:none;">
    🔄 Carregando memes brasileiros do Pinterest...
  </div>
</div>

<!-- CSS ADICIONAL -->
<style>
button:hover {
  background: #388e3c !important;
}

@media (max-width: 768px) {
  #memes-br-pinterest {
    gap: 10px !important;
  }
  
  .meme-item {
    min-width: 200px !important;
    max-width: 250px !important;
  }
}
</style>
```

#### 🅱️ **JavaScript (Cole no final da página):**

```javascript
<script>
// Configuração da API - ALTERE ESTA URL!
const API_BASE_URL = 'http://localhost:5000'; // ⚠️ Mude para sua URL

// Função principal para carregar memes
async function carregarMemesBRPinterest() {
  const container = document.getElementById('memes-br-pinterest');
  const loading = document.getElementById('pinterest-loading');
  const stats = document.getElementById('pinterest-stats');
  
  if (!container) return;
  
  if (loading) loading.style.display = 'block';
  container.innerHTML = '';
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/memes/br/batch?count=8`);
    const data = await response.json();
    
    if (data.success && data.memes) {
      container.innerHTML = '';
      
      data.memes.forEach(meme => {
        const memeDiv = document.createElement('div');
        memeDiv.style = `
          min-width: 230px; max-width: 280px; background: #fffbe7;
          border-radius: 12px; padding: 10px; margin: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;
          transition: transform 0.3s ease; display: inline-block;
        `;
        
        memeDiv.innerHTML = `
          <img src="${meme.image_url}" alt="${meme.description}" 
               style="width:100%; max-width:220px; max-height:220px; object-fit:cover; border-radius:8px; cursor:pointer;"
               onclick="abrirMemeFullscreen('${meme.image_url}', '${meme.description}')"
               onerror="this.parentElement.style.display='none'">
          <p style="font-size:14px; color:#333; margin:8px 0 0 0;">${meme.description}</p>
        `;
        
        memeDiv.onmouseenter = () => memeDiv.style.transform = 'translateY(-5px)';
        memeDiv.onmouseleave = () => memeDiv.style.transform = 'translateY(0)';
        
        container.appendChild(memeDiv);
      });
      
      if (stats) {
        stats.innerHTML = `📊 ${data.count} memes | 🕒 ${new Date().toLocaleTimeString()} | 📌 <a href="https://br.pinterest.com/iamjujurobert/memes-br" target="_blank">Fonte: Pinterest BR</a>`;
      }
    }
  } catch (error) {
    container.innerHTML = `<div style="color:#d32f2f; text-align:center; padding:20px;">❌ Erro: ${error.message}</div>`;
  }
  
  if (loading) loading.style.display = 'none';
}

// Modal para visualizar meme em tela cheia
function abrirMemeFullscreen(imageUrl, description) {
  const modal = document.createElement('div');
  modal.style = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.9); display: flex; justify-content: center;
    align-items: center; z-index: 10000; cursor: pointer;
  `;
  
  modal.innerHTML = `
    <div style="text-align: center; max-width: 90%; max-height: 90%;">
      <img src="${imageUrl}" style="max-width: 100%; max-height: 80vh; object-fit: contain;">
      <p style="color: white; margin-top: 20px; font-size: 18px;">${description}</p>
      <p style="color: #ccc; font-size: 14px;">Clique para fechar</p>
    </div>
  `;
  
  modal.onclick = () => document.body.removeChild(modal);
  document.body.appendChild(modal);
}

// Função para botão de atualizar
function atualizarMemesBR() {
  carregarMemesBRPinterest();
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(carregarMemesBRPinterest, 1000);
});

// Auto-refresh a cada 10 minutos
setInterval(carregarMemesBRPinterest, 10 * 60 * 1000);
</script>
```

### 3️⃣ **Para Usar em Produção (Opcional)**

Se quiser hospedar a API online, você pode usar:

#### **Heroku (Gratuito):**
1. Criar conta no Heroku
2. Instalar Heroku CLI
3. Criar arquivo `Procfile`:
```
web: python pinterest_memes_api.py
```
4. Deploy:
```bash
git init
git add .
git commit -m "Pinterest API"
heroku create seu-app-name
git push heroku main
```

Sua API estará em: `https://seu-app-name.herokuapp.com`

#### **Ngrok (Para teste):**
```bash
# Instalar ngrok
# Executar a API localmente
python pinterest_memes_api.py

# Em outro terminal
ngrok http 5000
```

Use a URL do ngrok no lugar de `localhost:5000`

### 4️⃣ **Configuração Final**

1. **Altere a URL** no JavaScript:
```javascript
const API_BASE_URL = 'https://sua-api.herokuapp.com'; // Sua URL real
```

2. **Cole o código** no Google Sites:
   - HTML na seção de conteúdo
   - JavaScript no final da página

3. **Teste** acessando seu site!

---

## 🎯 **Resultado Final**

Você terá uma seção no seu Google Sites que:
- ✅ Mostra memes brasileiros do Pinterest
- ✅ Atualiza automaticamente a cada 10 minutos  
- ✅ Permite visualização em tela cheia
- ✅ Tem botão para atualizar manualmente
- ✅ É responsivo (funciona no celular)
- ✅ Mostra informações da fonte

## 🔧 **Solução de Problemas**

### ❌ **"Erro ao carregar memes"**
- Verifique se a API está rodando
- Teste a URL: `http://localhost:5000/api/memes/br`
- Verifique o console do navegador (F12)

### ❌ **"CORS Error"**
- A API já tem CORS configurado
- Verifique se está usando HTTP/HTTPS correto

### ❌ **"Container não encontrado"**
- Verifique se o HTML foi colado corretamente
- Confirme que os IDs estão corretos

## 📱 **Exemplo de Uso**

1. Copie o código HTML e cole no Google Sites
2. Copie o código JavaScript e cole no final
3. Altere `API_BASE_URL` para sua URL
4. Salve e publique o site
5. Acesse e veja os memes carregando! 🎭

---

✨ **Pronto! Agora você tem memes brasileiros do Pinterest integrados no seu Google Sites!**

📌 **Fonte:** [Pinterest Memes BR](https://br.pinterest.com/iamjujurobert/memes-br) 