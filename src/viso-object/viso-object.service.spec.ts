import { Test, TestingModule } from '@nestjs/testing';
import { VisoObjectService } from './viso-object.service';

describe('VisoObjectService', () => {
  let service: VisoObjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisoObjectService],
    }).compile();

    service = module.get<VisoObjectService>(VisoObjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
