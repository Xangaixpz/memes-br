// ===============================================
// 🎭 PINTEREST MEMES BR - CÓDIGO PARA GOOGLE SITES
// ===============================================

// Configuração da API (ALTERE PARA SEU SERVIDOR)
const API_BASE_URL = 'http://localhost:5000'; // ⚠️ Altere para sua URL em produção

// Atualiza a seção de memes BR do Pinterest
async function carregarMemesBRPinterest() {
  const container = document.getElementById('memes-br-pinterest');
  const loading = document.getElementById('pinterest-loading');
  const stats = document.getElementById('pinterest-stats');
  
  if (!container) {
    console.error('❌ Container #memes-br-pinterest não encontrado!');
    return;
  }
  
  // Mostra loading
  if (loading) loading.style.display = 'block';
  container.innerHTML = '';
  
  try {
    console.log('🔄 Buscando memes do Pinterest...');
    const response = await fetch(`${API_BASE_URL}/api/memes/br/batch?count=8`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📊 Resposta da API:', data);
    
    if (data.success && data.memes && data.memes.length > 0) {
      // Limpa container
      container.innerHTML = '';
      
      // Adiciona cada meme
      data.memes.forEach((meme, index) => {
        const memeDiv = document.createElement('div');
        memeDiv.className = 'meme-item';
        memeDiv.style = `
          min-width: 230px;
          max-width: 280px;
          background: #fffbe7;
          border-radius: 12px;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
          transition: transform 0.3s ease;
          margin: 10px;
          display: inline-block;
          vertical-align: top;
        `;
        
        memeDiv.innerHTML = `
          <img src="${meme.image_url}" 
               alt="${meme.description}" 
               style="width:100%; max-width:220px; max-height:220px; object-fit:cover; border-radius:8px; cursor:pointer;"
               onclick="abrirMemeFullscreen('${meme.image_url}', '${meme.description}')"
               onerror="this.parentElement.style.display='none'">
          <p style="font-size:14px; color:#333; margin:8px 0 0 0; font-weight:500;">${meme.description}</p>
        `;
        
        // Adiciona hover effect
        memeDiv.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-5px)';
        });
        memeDiv.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0)';
        });
        
        container.appendChild(memeDiv);
      });
      
      // Atualiza estatísticas
      if (stats) {
        stats.innerHTML = `
          📊 ${data.count} memes carregados | 
          🕒 ${new Date(data.timestamp * 1000).toLocaleTimeString()} | 
          📌 <a href="https://br.pinterest.com/iamjujurobert/memes-br" target="_blank" style="color:#43a047; text-decoration:none;">
            Fonte: ${data.source}
          </a>
        `;
      }
      
      console.log(`✅ ${data.count} memes carregados com sucesso!`);
      
    } else {
      throw new Error('Nenhum meme encontrado na resposta da API');
    }
    
  } catch (error) {
    console.error('❌ Erro ao carregar memes do Pinterest:', error);
    
    // Mostra mensagem de erro
    container.innerHTML = `
      <div style="color:#d32f2f; font-size:16px; text-align:center; margin:20px; padding:20px; background:#ffebee; border-radius:8px;">
        ❌ Erro ao carregar memes do Pinterest<br>
        <small style="color:#666;">${error.message}</small><br>
        <button onclick="carregarMemesBRPinterest()" style="margin-top:10px; padding:8px 16px; background:#43a047; color:white; border:none; border-radius:6px; cursor:pointer;">
          🔄 Tentar Novamente
        </button>
      </div>
    `;
  }
  
  // Esconde loading
  if (loading) loading.style.display = 'none';
}

// Função para abrir meme em tela cheia
function abrirMemeFullscreen(imageUrl, description) {
  // Remove modal existente se houver
  const existingModal = document.getElementById('meme-modal');
  if (existingModal) {
    document.body.removeChild(existingModal);
  }
  
  // Cria novo modal
  const modal = document.createElement('div');
  modal.id = 'meme-modal';
  modal.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    cursor: pointer;
  `;
  
  modal.innerHTML = `
    <div style="text-align: center; max-width: 90%; max-height: 90%;">
      <img src="${imageUrl}" 
           alt="${description}" 
           style="max-width: 100%; max-height: 80vh; object-fit: contain; border-radius: 8px;">
      <p style="color: white; margin-top: 20px; font-size: 18px; font-weight: 500;">${description}</p>
      <p style="color: #ccc; margin-top: 10px; font-size: 14px;">👆 Clique para fechar</p>
    </div>
  `;
  
  // Fecha modal ao clicar
  modal.onclick = () => {
    document.body.removeChild(modal);
  };
  
  // Fecha modal com ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('meme-modal')) {
      document.body.removeChild(document.getElementById('meme-modal'));
    }
  });
  
  document.body.appendChild(modal);
}

// Auto-inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎭 Pinterest Memes BR - Inicializando...');
  
  // Carrega memes automaticamente
  setTimeout(() => {
    carregarMemesBRPinterest();
  }, 1000);
  
  console.log('📌 Fonte dos memes: https://br.pinterest.com/iamjujurobert/memes-br');
});

// Auto-refresh a cada 10 minutos
setInterval(() => {
  console.log('🔄 Auto-refresh dos memes...');
  carregarMemesBRPinterest();
}, 10 * 60 * 1000);

// Função para refresh manual
function atualizarMemesBR() {
  console.log('🔄 Atualizando memes manualmente...');
  carregarMemesBRPinterest();
}

// ===============================================
// 🌟 CÓDIGO HTML PARA COPIAR NO GOOGLE SITES
// ===============================================

/*
Cole este HTML no seu Google Sites:

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

*/ 