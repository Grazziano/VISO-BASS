import { Module } from '@nestjs/common';
import { MyObjectService } from './my-object.service';
import { MyObjectController } from './my-object.controller';

@Module({
  controllers: [MyObjectController],
  providers: [MyObjectService],
})
export class MyObjectModule {}
