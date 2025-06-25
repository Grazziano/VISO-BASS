import { Module } from '@nestjs/common';
import { MyClassService } from './my-class.service';
import { MyClassController } from './my-class.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MyClass, MyClassSchema } from './schemas/my-class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MyClass.name, schema: MyClassSchema }]),
  ],
  controllers: [MyClassController],
  providers: [MyClassService],
})
export class MyClassModule {}
