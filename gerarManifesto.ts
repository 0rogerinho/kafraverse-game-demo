const fs = require('fs');
const path = require('path');
const nodeCrypto = require('crypto');
const fg = require('fast-glob');

const pastaJogo = './jogo';
const urlBase = 'https://0rogerinho.github.io/kafraverse-game-demo'; // Altere aqui
const caminhoManifesto = './manifest.json';

function gerarHash(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return nodeCrypto.createHash('sha256').update(buffer).digest('hex');
}

async function gerarManifesto() {
  const arquivos = await fg(['**/*'], { cwd: pastaJogo, onlyFiles: true });

  const files = arquivos.map((arquivo) => {
    const caminhoLocal = path.join(pastaJogo, arquivo);
    const hash = gerarHash(caminhoLocal);
    const url = `${urlBase}/${arquivo.replace(/\\/g, '/')}`;
    return {
      path: arquivo,
      hash,
      url,
    };
  });

  const manifesto = { files };

  fs.writeFileSync(caminhoManifesto, JSON.stringify(manifesto, null, 2));
  console.log(`✅ Manifesto gerado com ${files.length} arquivos.`);
}

gerarManifesto();
