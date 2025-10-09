import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a welcome HTML message containing "API VISO-BASS"', () => {
      // Obtém o resultado da função
      const result = appController.getHello();

      // Verifica se o resultado é uma string
      expect(typeof result).toBe('string');

      // Verifica se a string contém um trecho específico
      expect(result).toContain('API VISO-BASS');

      expect(result).toContain(
        'Desenvolvida com <strong>NestJS + TypeScript</strong>',
      );
      expect(result).toContain(
        'Desenvolvido com ❤️ por <strong>Grazziano Borges Fagundes</strong>',
      );
    });
  });
});
