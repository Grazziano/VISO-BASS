import { Test, TestingModule } from '@nestjs/testing';
import { VisoObjectController } from './viso-object.controller';
import { VisoObjectService } from './viso-object.service';

describe('VisoObjectController', () => {
  let controller: VisoObjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisoObjectController],
      providers: [VisoObjectService],
    }).compile();

    controller = module.get<VisoObjectController>(VisoObjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
