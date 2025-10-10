import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Configurar níveis de log baseado no ambiente
  const logLevels =
    process.env.NODE_ENV === 'production'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'debug', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger: logLevels as (
      | 'error'
      | 'warn'
      | 'debug'
      | 'log'
      | 'verbose'
      | 'fatal'
    )[],
  });

  // Usar Winston logger como logger principal
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  logger.log(
    `Aplicação iniciando em modo: ${process.env.NODE_ENV || 'development'}`,
  );
  logger.log(`Níveis de log ativos: ${logLevels.join(', ')}`);

  app.enableCors();
  logger.log('CORS habilitado');

  app.useGlobalFilters(new HttpExceptionFilter());
  logger.log('Filtros globais configurados');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  logger.log('Pipes de validação configurados');

  const config = new DocumentBuilder()
    .setTitle('VISO-B.A.S.S. API')
    .setDescription(
      `<h3>VISO-Based API for Structured Storage</h3>

  <p>
    Esta API fornece um sistema completo para gerenciamento de objetos IoT e suas interações, 
    baseado no modelo <b>VISO</b>.
  </p>

  <h4>Funcionalidades Principais:</h4>
  <ul>
    <li>🔐 <b>Autenticação JWT</b>: Sistema seguro de login e registro</li>
    <li>📱 <b>Objetos VISO</b>: Gerenciamento de dispositivos IoT</li>
    <li>🔗 <b>Interações</b>: Rastreamento de interações entre objetos</li>
    <li>📊 <b>Analytics</b>: Análise de dados e métricas</li>
    <li>🏷️ <b>Classes</b>: Categorização de objetos</li>
    <li>🌐 <b>Ambientes</b>: Gestão de ambientes ONA</li>
    <li>📈 <b>PageRank</b>: Sistema de ranking de amizades</li>
  </ul>

  <h4>Rate Limiting:</h4>
  <p>
    A API implementa rate limiting para proteger contra abuso:
  </p>
  <ul>
    <li>Endpoints gerais: <b>10 req/s</b>, <b>20 req/10s</b>, <b>100 req/min</b></li>
    <li>Login: <b>5 tentativas/min</b></li>
    <li>Registro: <b>2 req/s</b></li>
  </ul>

  <h4>Autenticação:</h4>
  <p>
    Use o token JWT no header:
    <code>Authorization: Bearer &lt;token&gt;</code>
  </p>
      `,
    )
    .setVersion('1.0.0')
    .setContact(
      'Equipe VISO-BASS',
      'https://github.com/Grazziano/VISO-BASS',
      'grazzianofagundes@gmail.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Digite o token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Endpoints de autenticação e autorização')
    .addTag('object', 'Gerenciamento de objetos VISO')
    .addTag('interaction', 'Interações entre objetos')
    .addTag('class', 'Classes e categorias de objetos')
    .addTag('ona-environment', 'Ambientes ONA')
    .addTag('pagerank-friendship', 'Sistema de ranking de amizades')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  logger.log('Documentação Swagger configurada em /api');

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Aplicação rodando na porta ${port}`);
  logger.log(`📚 Documentação disponível em: http://localhost:${port}/api`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Erro ao inicializar a aplicação:', error);
  process.exit(1);
});
