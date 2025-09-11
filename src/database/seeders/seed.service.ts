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
// import { pagerankFriendshipSeed } from './data/pagerankFriendship.seed';
import { onaEnvironmentSeed } from './data/onaEnviroment.seed';
// import { interactionsSeed } from './data/interaction.seed';

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

    const owner = await this.ownersModel
      .findOne({
        email: 'joao.silva@example.com',
      })
      .exec();

    const objectSeedWithOwnerId = objectSeed.map((object) => ({
      ...object,
      obj_owner: owner?._id,
    }));

    await this.visoObjectsModel.insertMany(objectSeedWithOwnerId);
    this.logger.log(`🌱 Objects seeded: ${objectSeedWithOwnerId.length}`);
  }

  private async seedClasses() {
    await this.visoClassesModel.deleteMany({});

    // Busca todos os objetos já inseridos
    const objects = await this.visoObjectsModel.find().exec();

    // Mapeia os seeds das classes atribuindo objetos
    const classSeedWithObjects = classSeed.map((cls, index) => {
      // Distribui os objetos entre as classes
      const relatedObjects = objects
        .slice(index, index + 2) // pega 2 objetos por classe só de exemplo
        .map((obj) => obj._id);

      return {
        ...cls,
        objects: relatedObjects, // campo que referencia os objetos
      };
    });

    await this.visoClassesModel.insertMany(classSeedWithObjects);
    this.logger.log(`🌱 Classes seeded: ${classSeedWithObjects.length}`);
  }

  private async seedPagerankFriendship() {
    await this.pagerankModel.deleteMany({});

    // Busca todos os objetos já inseridos
    const objects = await this.visoObjectsModel.find().exec();

    // Se não houver objetos, não há como criar as relações
    if (objects.length < 2) {
      this.logger.warn(
        '⚠️ Não há objetos suficientes para criar pagerankFriendship',
      );
      return;
    }

    // Cria seeds dinamicamente
    const pagerankSeedsWithObjects = objects.map((obj, index) => {
      // Pega alguns objetos diferentes como adjacentes
      const adjacents = objects
        .filter((_, i) => i !== index) // remove o próprio objeto
        .slice(0, Math.floor(Math.random() * 4) + 1) // escolhe até 4 adjacentes aleatórios
        .map((o) => o._id.toString());

      return {
        rank_object: obj._id.toString(),
        rank_adjacency: adjacents,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await this.pagerankModel.insertMany(pagerankSeedsWithObjects);
    this.logger.log(`🌱 Pagerank seeded: ${pagerankSeedsWithObjects.length}`);
  }

  private async seedOnaEnvironment() {
    await this.onaEnvironmentModel.deleteMany({});

    // Busca todos os objetos já inseridos
    const objects = await this.visoObjectsModel.find().exec();

    // Mapeia os seeds dos ambientes atribuindo objetos
    const onaEnvSeedWithObjects = onaEnvironmentSeed.map((env, index) => {
      // Atribui alguns objetos por ambiente
      const relatedObjects = objects
        .slice(index, index + 3) // pega 3 objetos por ambiente só de exemplo
        .map((obj) => obj._id);

      return {
        ...env,
        objects: relatedObjects, // campo de referência
      };
    });

    await this.onaEnvironmentModel.insertMany(onaEnvSeedWithObjects);
    this.logger.log(
      `🌱 Ona Environment seeded: ${onaEnvSeedWithObjects.length}`,
    );
  }

  private async seedInteractions() {
    await this.interactionModel.deleteMany({});

    // Busca objetos já salvos
    const objects = await this.visoObjectsModel.find().exec();

    if (objects.length < 2) {
      this.logger.warn('⚠️ Não há objetos suficientes para criar interações');
      return;
    }

    const interactions: Partial<Interaction>[] = [];

    for (let i = 0; i < 1000; i++) {
      // escolhe dois objetos diferentes
      const objA = objects[Math.floor(Math.random() * objects.length)];

      let objB = objA;

      while (objB._id.equals(objA._id)) {
        objB = objects[Math.floor(Math.random() * objects.length)];
      }

      // gera tempos fictícios
      const start = new Date();
      const end = new Date(start.getTime() + Math.floor(Math.random() * 60000)); // até +60s

      interactions.push({
        inter_obj_i: objA._id,
        inter_obj_j: objB._id,
        inter_start: start,
        inter_end: end,
        inter_service: Math.floor(Math.random() * 5) + 1, // serviço 1 a 5
        inter_feedback: Math.random() > 0.2, // 80% true, 20% false
      });
    }

    await this.interactionModel.insertMany(interactions);
    this.logger.log(`🌱 Interactions seeded: ${interactions.length}`);
  }
}
