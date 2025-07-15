import { Module } from '@nestjs/common';
import { OnaEnvironmentService } from './ona-environment.service';
import { OnaEnvironmentController } from './ona-environment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OnaEnvironment,
  OnaEnvironmentSchema,
} from './schema/ona-enviroment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnaEnvironment.name, schema: OnaEnvironmentSchema },
    ]),
  ],
  controllers: [OnaEnvironmentController],
  providers: [OnaEnvironmentService],
})
export class OnaEnvironmentModule {}
