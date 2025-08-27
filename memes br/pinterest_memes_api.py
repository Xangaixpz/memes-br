import requests
import json
import re
from flask import Flask, jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup
import random
import time
from urllib.parse import urljoin, urlparse
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Permite requisições de outros domínios

class PinterestMemesAPI:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        self.memes_cache = []
        self.last_fetch = 0
        self.cache_duration = 300  # 5 minutos
    
    def extract_pinterest_images(self, url):
        """Extrai URLs de imagens do Pinterest"""
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Busca por scripts que contêm dados do Pinterest
            scripts = soup.find_all('script', type='application/ld+json')
            images = []
            
            # Método 1: JSON-LD
            for script in scripts:
                try:
                    data = json.loads(script.string)
                    if isinstance(data, list):
                        for item in data:
                            if item.get('@type') == 'ImageObject':
                                img_url = item.get('contentUrl')
                                if img_url:
                                    images.append({
                                        'url': img_url,
                                        'description': item.get('description', 'Meme BR'),
                                        'width': item.get('width', 400),
                                        'height': item.get('height', 400)
                                    })
                except:
                    continue
            
            # Método 2: Busca por imagens diretas
            img_tags = soup.find_all('img', {'src': True})
            for img in img_tags:
                src = img.get('src', '')
                alt = img.get('alt', 'Meme BR')
                
                # Filtra apenas imagens do Pinterest com qualidade
                if ('pinimg.com' in src or 'pinterest' in src) and 'x' in src:
                    # Prioriza imagens maiores
                    if any(size in src for size in ['736x', '564x', '474x', '236x']):
                        images.append({
                            'url': src,
                            'description': alt,
                            'width': 400,
                            'height': 400
                        })
            
            # Remove duplicatas
            unique_images = []
            seen_urls = set()
            for img in images:
                if img['url'] not in seen_urls:
                    unique_images.append(img)
                    seen_urls.add(img['url'])
            
            return unique_images[:20]  # Retorna até 20 imagens
            
        except Exception as e:
            logger.error(f"Erro ao extrair imagens do Pinterest: {e}")
            return []
    
    def get_memes_br(self, count=8):
        """Obtém memes brasileiros do cache ou busca novos"""
        current_time = time.time()
        
        # Verifica se precisa atualizar o cache
        if current_time - self.last_fetch > self.cache_duration or not self.memes_cache:
            logger.info("Atualizando cache de memes...")
            
            pinterest_url = "https://br.pinterest.com/iamjujurobert/memes-br/"
            new_memes = self.extract_pinterest_images(pinterest_url)
            
            if new_memes:
                self.memes_cache = new_memes
                self.last_fetch = current_time
                logger.info(f"Cache atualizado com {len(new_memes)} memes")
            else:
                # Se não conseguir buscar novos, usa memes padrão
                self.memes_cache = self.get_fallback_memes()
        
        # Retorna uma seleção aleatória
        if self.memes_cache:
            return random.sample(self.memes_cache, min(count, len(self.memes_cache)))
        else:
            return self.get_fallback_memes()[:count]
    
    def get_fallback_memes(self):
        """Memes de fallback caso a API do Pinterest falhe"""
        return [
            {
                'url': 'https://i.pinimg.com/564x/a1/b2/c3/a1b2c3d4e5f6789012345678901234567890.jpg',
                'description': 'Meme BR Clássico',
                'width': 564,
                'height': 564
            },
            {
                'url': 'https://i.pinimg.com/736x/d4/e5/f6/d4e5f6789012345678901234567890abcd.jpg',
                'description': 'Humor Brasileiro',
                'width': 736,
                'height': 736
            }
        ]

# Instância da API
pinterest_api = PinterestMemesAPI()

@app.route('/')
def home():
    """Página inicial da API"""
    return jsonify({
        'message': 'Pinterest Memes BR API',
        'version': '1.0',
        'endpoints': {
            '/api/memes/br': 'Retorna memes brasileiros do Pinterest',
            '/api/memes/br/random': 'Retorna um meme brasileiro aleatório',
            '/api/memes/br/batch': 'Retorna um lote de memes (parâmetro count)'
        }
    })

@app.route('/api/memes/br')
def get_memes_br():
    """Endpoint principal para memes brasileiros"""
    try:
        count = int(request.args.get('count', 8))
        count = min(max(count, 1), 20)  # Entre 1 e 20
        
        memes = pinterest_api.get_memes_br(count)
        
        return jsonify({
            'success': True,
            'count': len(memes),
            'memes': memes,
            'source': 'Pinterest BR - Memes Brasileiros'
        })
    except Exception as e:
        logger.error(f"Erro na API: {e}")
        return jsonify({
            'success': False,
            'error': 'Erro interno do servidor',
            'memes': pinterest_api.get_fallback_memes()
        }), 500

@app.route('/api/memes/br/random')
def get_random_meme_br():
    """Retorna um meme brasileiro aleatório"""
    try:
        memes = pinterest_api.get_memes_br(1)
        meme = memes[0] if memes else pinterest_api.get_fallback_memes()[0]
        
        return jsonify({
            'success': True,
            'meme': meme,
            'source': 'Pinterest BR - Memes Brasileiros'
        })
    except Exception as e:
        logger.error(f"Erro na API: {e}")
        return jsonify({
            'success': False,
            'error': 'Erro interno do servidor',
            'meme': pinterest_api.get_fallback_memes()[0]
        }), 500

@app.route('/api/memes/br/batch')
def get_batch_memes_br():
    """Retorna um lote de memes brasileiros"""
    try:
        count = int(request.args.get('count', 8))
        count = min(max(count, 1), 20)
        
        memes = pinterest_api.get_memes_br(count)
        
        # Formato para facilitar integração com Google Sites
        formatted_memes = []
        for i, meme in enumerate(memes):
            formatted_memes.append({
                'id': i + 1,
                'image_url': meme['url'],
                'description': meme['description'],
                'width': meme.get('width', 400),
                'height': meme.get('height', 400),
                'html': f'''
                <div style="min-width:230px; background:#fffbe7; border-radius:12px; padding:10px; box-shadow:0 2px 8px #0002; text-align:center; margin:10px;">
                    <img src="{meme['url']}" alt="{meme['description']}" style="width:220px; max-height:220px; object-fit:cover; border-radius:8px;">
                    <p style="font-size:14px; color:#333; margin:8px 0 0 0;">{meme['description']}</p>
                </div>
                '''
            })
        
        return jsonify({
            'success': True,
            'count': len(formatted_memes),
            'memes': formatted_memes,
            'source': 'Pinterest BR - Memes Brasileiros',
            'timestamp': int(time.time())
        })
    except Exception as e:
        logger.error(f"Erro na API: {e}")
        return jsonify({
            'success': False,
            'error': 'Erro interno do servidor'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 