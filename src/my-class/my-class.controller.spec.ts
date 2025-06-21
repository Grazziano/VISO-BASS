import { Test, TestingModule } from '@nestjs/testing';
import { MyClassController } from './my-class.controller';
import { MyClassService } from './my-class.service';

describe('MyClassController', () => {
  let controller: MyClassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyClassController],
      providers: [MyClassService],
    }).compile();

    controller = module.get<MyClassController>(MyClassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
