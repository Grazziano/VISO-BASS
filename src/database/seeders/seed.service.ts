import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Owner } from 'src/owners/schema/owner.schema';
import { VisoObject } from 'src/viso-object/schema/viso-object.schema';
import { VisoClass } from 'src/viso-class/schemas/viso-class.schema';
import { PageRankFriendship } from 'src/pagerank-friendship/schema/pagerank-friendship.schema';
import { ownersSeed } from './data/owner.seed';
import { objectSeed } from './data/object.seed';
import { classSeed } from './data/class.seed';
import { pagerankFriendshipSeed } from './data/pagerankFriendship.seed';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Owner.name)
    private readonly ownersModel: Model<Owner>,
    @InjectModel(VisoObject.name)
    private readonly visoObjectsModel: Model<VisoObject>,
    @InjectModel(VisoClass.name)
    private readonly visoClassesModel: Model<VisoClass>,
    @InjectModel(PageRankFriendship.name)
    private readonly pagerankModel: Model<PageRankFriendship>,
  ) {}

  async run() {
    this.logger.log('🚀 Starting seeding...');
    await this.seedOwners();
    await this.seedObjects();
    await this.seedClasses();
    await this.seedPagerankFriendship();
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

  private async seedClasses() {
    await this.visoClassesModel.deleteMany({});
    await this.visoClassesModel.insertMany(classSeed);
    this.logger.log(`🌱 Classes seeded: ${classSeed.length}`);
  }

  private async seedPagerankFriendship() {
    await this.pagerankModel.deleteMany({});
    await this.pagerankModel.insertMany(pagerankFriendshipSeed);
    this.logger.log(`🌱 Pagerank seeded: ${pagerankFriendshipSeed.length}`);
  }
}
