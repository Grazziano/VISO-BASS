import { Module } from '@nestjs/common';
import { VisoObjectService } from './viso-object.service';
import { VisoObjectController } from './viso-object.controller';

@Module({
  controllers: [VisoObjectController],
  providers: [VisoObjectService],
})
export class VisoObjectModule {}
