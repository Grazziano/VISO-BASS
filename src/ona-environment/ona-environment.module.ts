import { Module } from '@nestjs/common';
import { OnaEnvironmentService } from './ona-environment.service';
import { OnaEnvironmentController } from './ona-environment.controller';

@Module({
  controllers: [OnaEnvironmentController],
  providers: [OnaEnvironmentService],
})
export class OnaEnvironmentModule {}
