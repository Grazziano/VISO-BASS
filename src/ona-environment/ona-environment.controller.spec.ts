import { Test, TestingModule } from '@nestjs/testing';
import { OnaEnvironmentController } from './ona-environment.controller';
import { OnaEnvironmentService } from './ona-environment.service';

describe('OnaEnvironmentController', () => {
  let controller: OnaEnvironmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnaEnvironmentController],
      providers: [OnaEnvironmentService],
    }).compile();

    controller = module.get<OnaEnvironmentController>(OnaEnvironmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
