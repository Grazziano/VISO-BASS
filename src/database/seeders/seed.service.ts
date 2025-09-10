import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Owner } from 'src/owners/schema/owner.schema';
import { VisoObject } from 'src/viso-object/schema/viso-object.schema';
import { ownersSeed } from './data/owner.seed';
import { objectSeed } from './data/object.seed';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Owner.name) private readonly ownersModel: Model<Owner>,
    @InjectModel(VisoObject.name)
    private readonly visoObjectsModel: Model<VisoObject>,
  ) {}

  async run() {
    this.logger.log('🚀 Starting seeding...');

    await this.seedOwners();
    await this.seedObjects();

    this.logger.log('✅ Seeding finished!');
  }

  private async seedOwners() {
    await this.ownersModel.deleteMany({});
    await this.ownersModel.insertMany(ownersSeed);
    this.logger.log(`🌱 Owners seeded: ${ownersSeed.length}`);
  }

  private async seedObjects() {
    await this.visoObjectsModel.deleteMany({});
    await this.visoObjectsModel.insertMany(objectSeed);
    this.logger.log(`🌱 Objects seeded: ${objectSeed.length}`);
  }
}
