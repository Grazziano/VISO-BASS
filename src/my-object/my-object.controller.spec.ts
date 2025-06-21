import { Test, TestingModule } from '@nestjs/testing';
import { MyObjectController } from './my-object.controller';
import { MyObjectService } from './my-object.service';

describe('MyObjectController', () => {
  let controller: MyObjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyObjectController],
      providers: [MyObjectService],
    }).compile();

    controller = module.get<MyObjectController>(MyObjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
