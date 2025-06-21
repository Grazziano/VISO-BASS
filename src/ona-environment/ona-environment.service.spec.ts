import { Test, TestingModule } from '@nestjs/testing';
import { OnaEnvironmentService } from './ona-environment.service';

describe('OnaEnvironmentService', () => {
  let service: OnaEnvironmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnaEnvironmentService],
    }).compile();

    service = module.get<OnaEnvironmentService>(OnaEnvironmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
