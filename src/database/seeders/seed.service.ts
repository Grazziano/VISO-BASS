import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Owner } from 'src/owners/schema/owner.schema';
import { ownersSeed } from './data/owner.seed';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Owner.name) private readonly ownersModel: Model<Owner>,
  ) {}

  async run() {
    console.log('🌱 Iniciando seed...');

    // Evita duplicados
    const count = await this.ownersModel.countDocuments();

    if (count === 0) {
      await this.ownersModel.insertMany(ownersSeed);
      console.log('✅ Usuários seed inseridos!');
    } else {
      console.log('⚠️ Já existem usuários no banco, nada foi feito.');
    }

    process.exit(0); // encerra processo
  }
}
