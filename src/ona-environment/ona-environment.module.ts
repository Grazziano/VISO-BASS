import { Module } from '@nestjs/common';
import { OnaEnvironmentService } from './ona-environment.service';
import { OnaEnvironmentController } from './ona-environment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OnaEnvironment,
  OnaEnvironmentSchema,
} from './schema/ona-enviroment.schema';
import { VisoObjectModule } from '../viso-object/viso-object.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OnaEnvironment.name, schema: OnaEnvironmentSchema },
    ]),
    VisoObjectModule,
  ],
  controllers: [OnaEnvironmentController],
  providers: [OnaEnvironmentService],
})
export class OnaEnvironmentModule {}
