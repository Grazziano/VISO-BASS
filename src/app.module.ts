import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InteractionModule } from './interaction/interaction.module';
import { OnaEnvironmentModule } from './ona-environment/ona-environment.module';
import { PagerankFriendshipModule } from './pagerank-friendship/pagerank-friendship.module';
import { VisoClassModule } from './viso-class/viso-class.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VisoObjectModule } from './viso-object/viso-object.module';
import { AuthModule } from './auth/auth.module';
import { OwnersModule } from './owners/owners.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Carrega os variáveis de ambiente do .env
    MongooseModule.forRoot(process.env.MONGO_URI!),
    InteractionModule,
    OnaEnvironmentModule,
    PagerankFriendshipModule,
    VisoClassModule,
    VisoObjectModule,
    AuthModule,
    OwnersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
