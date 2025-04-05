const fs = require('fs');
const path = require('path');
const nodeCrypto = require('crypto');
const fg = require('fast-glob');

const pastaJogo = './jogo';
const urlBase = 'https://SEU_USUARIO.github.io/jogo-launcher-demo'; // Altere aqui
const caminhoManifesto = './manifest.json';

function gerarHash(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return nodeCrypto.createHash('sha256').update(buffer).digest('hex');
}

async function gerarManifesto() {
  const arquivos = await fg(['**/*'], { cwd: pastaJogo, onlyFiles: true });

  const manifesto = arquivos.map((arquivo) => {
    const caminhoLocal = path.join(pastaJogo, arquivo);
    const hash = gerarHash(caminhoLocal);
    const url = `${urlBase}/${arquivo.replace(/\\/g, '/')}`;

    return {
      path: arquivo,
      hash,
      url,
    };
  });

  fs.writeFileSync(caminhoManifesto, JSON.stringify(manifesto, null, 2));
  console.log(`✅ Manifesto gerado com ${manifesto.length} arquivos.`);
}

gerarManifesto();
