import { Module } from '@nestjs/common';
import { VisoObjectService } from './viso-object.service';
import { VisoObjectController } from './viso-object.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VisoObject, VisoObjectSchema } from './schema/viso-object.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisoObject.name, schema: VisoObjectSchema },
    ]),
  ],
  controllers: [VisoObjectController],
  providers: [VisoObjectService],
})
export class VisoObjectModule {}
