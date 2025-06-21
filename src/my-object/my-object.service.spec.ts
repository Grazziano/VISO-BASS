import { Test, TestingModule } from '@nestjs/testing';
import { MyObjectService } from './my-object.service';

describe('MyObjectService', () => {
  let service: MyObjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyObjectService],
    }).compile();

    service = module.get<MyObjectService>(MyObjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
