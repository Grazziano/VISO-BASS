import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: auto;">
        <h1 style="color: #2c3e50;">👋 Bem-vindo à <span style="color:#16a085;">API VISO-BASS</span></h1>
        <p>
          Uma API projetada para <strong>armazenamento estruturado e eficiente de dados</strong> 
          no contexto da <em>Social IoT</em>, baseada no modelo <strong>VISO</strong>.
        </p>
        
        <h2 style="margin-top: 20px; color: #34495e;">⚙️ Principais características</h2>
        <ul>
          <li>🚀 Desenvolvida com <strong>NestJS + TypeScript</strong></li>
          <li>💾 Persistência no <strong>MongoDB</strong> (Mongoose)</li>
          <li>🐳 Containerização via <strong>Docker / Docker Compose</strong></li>
          <li>🔐 Autenticação <strong>JWT</strong> (rotas públicas e protegidas)</li>
          <li>📦 Estrutura modular: <code>objects</code>, <code>classes</code>, <code>interactions</code>, <code>environments</code>, <code>relations</code></li>
          <li>🌱 Seeders para dados iniciais</li>
          <li>🎓 Projeto originado em pesquisa acadêmica na <strong>UFPEL</strong></li>
        </ul>
        
        <h2 style="margin-top: 20px; color: #34495e;">📡 Endpoints principais</h2>
        <ul>
          <li><code>GET /api</code> — lista todos os endpoints disponíveis</li>
          <li><code>POST /auth/register</code> — registro de usuário</li>
          <li><code>POST /auth/login</code> — login / obtenção de token</li>
          <li>🔒 Rotas protegidas (JWT):
            <ul>
              <li><code>/object</code></li>
              <li><code>/class</code></li>
              <li><code>/interaction</code></li>
              <li><code>/ona-environment</code></li>
              <li><code>/pagerank-friendship</code></li>
            </ul>
          </li>
        </ul>
        
        <p style="margin-top: 20px;">
          📖 Para mais detalhes (variáveis de ambiente, execução via Docker, testes, modelo de dados), consulte o 
          <a href="https://github.com/Grazziano/VISO-BASS" target="_blank" style="color:#2980b9;">README do projeto</a>.
        </p>
        
        <footer style="margin-top: 30px; font-size: 14px; color: #7f8c8d;">
          — Desenvolvido com ❤️ por <strong>Grazziano Borges Fagundes</strong>
        </footer>
      </div>
    `;
  }
}
