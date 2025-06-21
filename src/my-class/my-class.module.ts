import { Module } from '@nestjs/common';
import { MyClassService } from './my-class.service';
import { MyClassController } from './my-class.controller';

@Module({
  controllers: [MyClassController],
  providers: [MyClassService],
})
export class MyClassModule {}
