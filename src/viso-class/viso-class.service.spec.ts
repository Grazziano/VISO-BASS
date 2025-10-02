import { Test, TestingModule } from '@nestjs/testing';
import { VisoClassService } from './viso-class.service';

describe('MyClassService', () => {
  let service: VisoClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisoClassService],
    }).compile();

    service = module.get<VisoClassService>(VisoClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
