import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Owner } from 'src/owners/schema/owner.schema';
import { VisoObject } from 'src/viso-object/schema/viso-object.schema';
import { VisoClass } from 'src/viso-class/schemas/viso-class.schema';
import { PageRankFriendship } from 'src/pagerank-friendship/schema/pagerank-friendship.schema';
import { OnaEnvironment } from 'src/ona-environment/schema/ona-enviroment.schema';
import { Interaction } from 'src/interaction/schema/interaction.schema';
import { ownersSeed } from './data/owner.seed';
import { objectSeed } from './data/object.seed';
import { classSeed } from './data/class.seed';
import { pagerankFriendshipSeed } from './data/pagerankFriendship.seed';
import { onaEnvironmentSeed } from './data/onaEnviroment.seed';
import { interactionsSeed } from './data/interaction.seed';

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
    @InjectModel(OnaEnvironment.name)
    private readonly onaEnvironmentModel: Model<OnaEnvironment>,
    @InjectModel(Interaction.name)
    private readonly interactionModel: Model<Interaction>,
  ) {}

  async run() {
    this.logger.log('🚀 Starting seeding...');
    await this.seedOwners();
    await this.seedObjects();
    await this.seedClasses();
    await this.seedPagerankFriendship();
    await this.seedOnaEnvironment();
    await this.seedInteractions();
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

  private async seedOnaEnvironment() {
    await this.onaEnvironmentModel.deleteMany({});
    await this.onaEnvironmentModel.insertMany(onaEnvironmentSeed);
    this.logger.log(`🌱 Ona Environment seeded: ${onaEnvironmentSeed.length}`);
  }

  private async seedInteractions() {
    await this.interactionModel.deleteMany({});
    await this.interactionModel.insertMany(interactionsSeed);
    this.logger.log(`🌱 Interactions seeded: ${interactionsSeed.length}`);
  }
}
