import { Module } from '@nestjs/common';
import { VisoClassService } from './viso-class.service';
import { MyClassController } from './viso-class.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VisoClass, VisoClassSchema } from './schemas/viso-class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisoClass.name, schema: VisoClassSchema },
    ]),
  ],
  controllers: [MyClassController],
  providers: [VisoClassService],
})
export class VisoClassModule {}
