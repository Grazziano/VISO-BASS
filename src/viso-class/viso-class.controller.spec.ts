import { Test, TestingModule } from '@nestjs/testing';
import { MyClassController } from './viso-class.controller';
import { VisoClassService } from './viso-class.service';

describe('MyClassController', () => {
  let controller: MyClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyClassController],
      providers: [VisoClassService],
    }).compile();

    controller = module.get<MyClassController>(MyClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
