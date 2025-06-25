import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteractionModule } from './interaction/interaction.module';
import { MyObjectModule } from './my-object/my-object.module';
import { OnaEnvironmentModule } from './ona-environment/ona-environment.module';
import { PagerankFriendshipModule } from './pagerank-friendship/pagerank-friendship.module';
import { MyClassModule } from './my-class/my-class.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    InteractionModule,
    MyObjectModule,
    OnaEnvironmentModule,
    PagerankFriendshipModule,
    MyClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
