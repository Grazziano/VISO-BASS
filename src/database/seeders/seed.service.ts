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
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

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

  private generateValidMAC(): string {
    const hex = '0123456789ABCDEF';
    const randomByte = () =>
      hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
    return (
      randomByte() +
      ':' +
      randomByte() +
      ':' +
      randomByte() +
      ':' +
      randomByte() +
      ':' +
      randomByte() +
      ':' +
      randomByte()
    );
  }

  private resolveCsvPath(): string {
    const p1 = path.resolve(process.cwd(), 'data', 'objects_profile.csv');
    const p2 = path.resolve(
      process.cwd(),
      'data',
      'Object Profiles',
      'objects_profile.csv',
    );
    if (fs.existsSync(p1)) return p1;
    if (fs.existsSync(p2)) return p2;
    return p1;
  }

  private csvFileExists(): boolean {
    try {
      return fs.existsSync(this.resolveCsvPath());
    } catch {
      return false;
    }
  }

  private parseObjectsCsv(csvContent: string): Array<{
    deviceType: number;
    offeredServices: number[];
    requiredApps: number[];
  }> {
    const lines = csvContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length < 2) return [];

    const rawHeaders = lines[0].split(',');
    const headers = rawHeaders.map((h) => h.replace(/\s+/g, ''));

    const deviceTypeIndex = headers.indexOf('device_type');
    const offServiceIndexes = headers
      .map((h, i) => (h.startsWith('id_off_service_') ? i : -1))
      .filter((i) => i !== -1);
    const reqAppIndexes = headers
      .map((h, i) => (h.startsWith('id_req_application_') ? i : -1))
      .filter((i) => i !== -1);

    const rows = lines.slice(1);
    const parsed = rows.map((row) => {
      const cols = row.split(',');
      const deviceType = parseInt(cols[deviceTypeIndex] || '0', 10) || 0;
      const offeredServices: number[] = offServiceIndexes
        .map((i) => parseInt((cols[i] || '').trim(), 10))
        .filter((n) => !isNaN(n));
      const requiredApps: number[] = reqAppIndexes
        .map((i) => parseInt((cols[i] || '').trim(), 10))
        .filter((n) => !isNaN(n));
      return { deviceType, offeredServices, requiredApps };
    });

    return parsed;
  }

  private resolveDescriptionCsvPath(): string {
    return path.resolve(
      process.cwd(),
      'data',
      'Object Description',
      'objects_description.csv',
    );
  }

  private descriptionFileExists(): boolean {
    try {
      return fs.existsSync(this.resolveDescriptionCsvPath());
    } catch {
      return false;
    }
  }

  private parseObjectsDescriptionCsv(csvContent: string): Array<{
    deviceId: number;
    userId: number;
    deviceType: number;
    brand: number;
    model: number;
  }> {
    const lines = csvContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length < 2) return [];
    const headers = lines[0]
      .split(',')
      .map((h) => h.trim().replace(/\s+/g, '').toLowerCase());
    const idIdx = headers.indexOf('id_device');
    const userIdx = headers.indexOf('id_user');
    const typeIdx = headers.indexOf('device_type');
    const brandIdx = headers.indexOf('device_brand');
    const modelIdx = headers.indexOf('device_model');
    const rows = lines.slice(1);
    return rows.map((row) => {
      const cols = row.split(',');
      return {
        deviceId: parseInt((cols[idIdx] || '0').trim(), 10) || 0,
        userId: parseInt((cols[userIdx] || '0').trim(), 10) || 0,
        deviceType: parseInt((cols[typeIdx] || '0').trim(), 10) || 0,
        brand: parseInt((cols[brandIdx] || '0').trim(), 10) || 0,
        model: parseInt((cols[modelIdx] || '0').trim(), 10) || 0,
      };
    });
  }

  async run() {
    this.logger.log('🚀 Starting seeding...');
    await this.seedOwners();
    // await this.seedObjects();
    await this.seedObjectsCsv();
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

  private async seedObjectsCsv() {
    await this.visoObjectsModel.deleteMany({});

    const owner =
      (await this.ownersModel
        .findOne({ email: 'joao.silva@example.com' })
        .exec()) || (await this.ownersModel.findOne().exec());

    if (this.csvFileExists()) {
      const csvPath = this.resolveCsvPath();
      this.logger.log(`📄 CSV encontrado: ${csvPath}`);
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const parsed = this.parseObjectsCsv(csvContent);
      const descriptions = this.descriptionFileExists()
        ? this.parseObjectsDescriptionCsv(
            fs.readFileSync(this.resolveDescriptionCsvPath(), 'utf-8'),
          )
        : [];

      let objectsFromCsv: any[] = [];
      if (descriptions.length > 0) {
        const profileByType = new Map<number, { offeredServices: number[]; requiredApps: number[] }>();
        for (const p of parsed) {
          profileByType.set(p.deviceType, {
            offeredServices: p.offeredServices,
            requiredApps: p.requiredApps,
          });
        }
        objectsFromCsv = descriptions.map((d, idx) => {
          const prof = profileByType.get(d.deviceType) || { offeredServices: [], requiredApps: [] };
          return {
            obj_networkMAC: this.generateValidMAC(),
            obj_name: `Device ${d.deviceId}`,
            obj_owner: owner?._id,
            obj_model: d.model ? `Model ${d.model}` : `Tipo ${d.deviceType}`,
            obj_brand: d.brand ? `Brand ${d.brand}` : `Marca ${d.deviceType}`,
            obj_function: prof.offeredServices.map((id) => `service_${id}`),
            obj_restriction: prof.requiredApps.map((id) => `req_app_${id}`),
            obj_limitation: ['none'],
            obj_access: (idx % 3) + 1,
            obj_location: (idx % 4) + 1,
            obj_qualification: (idx % 5) + 1,
            obj_status: 1,
          };
        });
      } else {
        objectsFromCsv = parsed.map((item, idx) => ({
          obj_networkMAC: this.generateValidMAC(),
          obj_name: `Dispositivo tipo ${item.deviceType}`,
          obj_owner: owner?._id,
          obj_model: `Tipo ${item.deviceType}`,
          obj_brand: `Marca ${item.deviceType}`,
          obj_function: item.offeredServices.map((id) => `service_${id}`),
          obj_restriction: item.requiredApps.map((id) => `req_app_${id}`),
          obj_limitation: ['none'],
          obj_access: (idx % 3) + 1,
          obj_location: (idx % 4) + 1,
          obj_qualification: (idx % 5) + 1,
          obj_status: 1,
        }));
      }

      await this.visoObjectsModel.insertMany(objectsFromCsv);
      this.logger.log(`🌱 Objects seeded (CSV): ${objectsFromCsv.length}`);
      return;
    }

    // Fallback para seed estático
    const objectSeedWithOwnerId = objectSeed.map((object) => ({
      ...object,
      obj_owner: owner?._id,
    }));

    await this.visoObjectsModel.insertMany(objectSeedWithOwnerId);
    this.logger.log(`🌱 Objects seeded: ${objectSeedWithOwnerId.length}`);
  }

  private resolveAdjacencyPath(): string {
    return path.resolve(
      process.cwd(),
      'data',
      'Adjacency matrices and SIoT Network',
      'SIoT.csv',
    );
  }

  private adjacencyFileExists(): boolean {
    try {
      return fs.existsSync(this.resolveAdjacencyPath());
    } catch {
      return false;
    }
  }

  private parseAdjacencyCsv(csvContent: string): number[][] {
    const lines = csvContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const matrix: number[][] = [];
    for (let idx = 0; idx < lines.length; idx++) {
      const parts = lines[idx].split(';').map((v) => v.trim());
      if (idx === 0) continue; // pula cabeçalho
      const numeric = parts
        .slice(1) // primeira coluna é índice da linha
        .map((v) => parseFloat(v))
        .map((v) => (isNaN(v) ? 0 : v));
      matrix.push(numeric);
    }
    return matrix;
  }

  private async forEachAdjacencyRow(
    limit: number,
    onRow: (index: number, row: number[]) => Promise<void>,
  ) {
    const fileStream = fs.createReadStream(this.resolveAdjacencyPath());
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    let lineIndex = -1;
    for await (const line of rl) {
      lineIndex++;
      if (lineIndex === 0) continue;
      if (lineIndex > limit) break;
      const parts = line.split(';').map((v) => v.trim());
      const row = parts
        .slice(1)
        .map((v) => parseFloat(v))
        .map((v) => (isNaN(v) ? 0 : v));
      await onRow(lineIndex - 1, row);
    }
  }

  private async getObjectsOrdered() {
    return this.visoObjectsModel.find().sort({ createdAt: 1 }).exec();
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
    const objects = await this.getObjectsOrdered();
    if (objects.length < 2) {
      this.logger.warn('⚠️ Não há objetos suficientes para criar pagerankFriendship');
      return;
    }
    if (this.adjacencyFileExists()) {
      const MAX_NEIGHBORS = 25;
      const n = objects.length;
      const batchSize = 1000;
      let batch: Array<{ rank_object: string; rank_adjacency: string[] }> = [];
      await this.forEachAdjacencyRow(n, async (i, row) => {
        const adj: string[] = [];
        for (let j = 0; j < Math.min(n, row.length); j++) {
          if (i !== j && (row[j] || 0) > 0) {
            adj.push(objects[j]._id.toString());
            if (adj.length >= MAX_NEIGHBORS) break;
          }
        }
        batch.push({ rank_object: objects[i]._id.toString(), rank_adjacency: adj });
        if (batch.length >= batchSize) {
          await this.pagerankModel.insertMany(batch, { ordered: false });
          batch = [];
        }
      });
      if (batch.length) await this.pagerankModel.insertMany(batch, { ordered: false });
      this.logger.log(`🌱 Pagerank seeded (dataset): ${n}`);
      return;
    }
    const pagerankSeedsWithObjects = objects.map((obj, index) => {
      const adjacents = objects
        .filter((_, i) => i !== index)
        .slice(0, Math.floor(Math.random() * 4) + 1)
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
    const objects = await this.getObjectsOrdered();
    if (objects.length === 0) {
      this.logger.warn('⚠️ Não há objetos para ambientes');
      return;
    }
    if (this.adjacencyFileExists()) {
      const MAX_NEIGHBORS = 25;
      const n = objects.length;
      const batchSize = 1000;
      let batch: any[] = [];
      await this.forEachAdjacencyRow(n, async (i, row) => {
        const neighbors: any[] = [];
        const weights: number[] = [];
        let total = 0;
        for (let j = 0; j < Math.min(n, row.length); j++) {
          const w = row[j] || 0;
          if (i !== j && w > 0) {
            neighbors.push(objects[j]._id);
            weights.push(w);
            total += w;
            if (neighbors.length >= MAX_NEIGHBORS) break;
          }
        }
        batch.push({
          env_object_i: objects[i]._id.toString(),
          env_total_interactions: total,
          env_total_valid: 0,
          env_total_new: 0,
          env_adjacency: weights,
          objects: neighbors,
        });
        if (batch.length >= batchSize) {
          await this.onaEnvironmentModel.insertMany(batch, { ordered: false });
          batch = [];
        }
      });
      if (batch.length) await this.onaEnvironmentModel.insertMany(batch, { ordered: false });
      this.logger.log(`🌱 Ona Environment seeded (dataset): ${n}`);
      return;
    }
    const onaEnvSeedWithObjects = onaEnvironmentSeed.map((env, index) => {
      const relatedObjects = objects.slice(index, index + 3).map((obj) => obj._id);
      return { ...env, objects: relatedObjects };
    });
    await this.onaEnvironmentModel.insertMany(onaEnvSeedWithObjects);
    this.logger.log(`🌱 Ona Environment seeded: ${onaEnvSeedWithObjects.length}`);
  }

  private async seedInteractions() {
    await this.interactionModel.deleteMany({});
    const objects = await this.getObjectsOrdered();
    if (objects.length < 2) {
      this.logger.warn('⚠️ Não há objetos suficientes para criar interações');
      return;
    }
    if (this.adjacencyFileExists()) {
      const MAX_NEIGHBORS = 10;
      const MAX_INTERACTIONS_PER_EDGE = 1;
      const n = objects.length;
      const batchSize = 2000;
      let batch: Partial<Interaction>[] = [];
      await this.forEachAdjacencyRow(n, async (i, row) => {
        let neighbors = 0;
        for (let j = 0; j < Math.min(n, row.length); j++) {
          if (i !== j && (row[j] || 0) > 0) {
            neighbors++;
            for (let k = 0; k < MAX_INTERACTIONS_PER_EDGE; k++) {
              const start = new Date();
              const end = new Date(start.getTime() + Math.floor(Math.random() * 60000));
              batch.push({
                inter_obj_i: objects[i]._id,
                inter_obj_j: objects[j]._id,
                inter_start: start,
                inter_end: end,
                inter_service: ((i + j + k) % 5) + 1,
                inter_feedback: Math.random() > 0.2,
              });
            }
            if (neighbors >= MAX_NEIGHBORS) break;
          }
        }
        if (batch.length >= batchSize) {
          await this.interactionModel.insertMany(batch, { ordered: false });
          batch = [];
        }
      });
      if (batch.length) await this.interactionModel.insertMany(batch, { ordered: false });
      this.logger.log(`🌱 Interactions seeded (dataset): done`);
      return;
    }
    const interactions: Partial<Interaction>[] = [];
    for (let i = 0; i < 1000; i++) {
      const objA = objects[Math.floor(Math.random() * objects.length)];
      let objB = objA;
      while (objB._id.equals(objA._id)) {
        objB = objects[Math.floor(Math.random() * objects.length)];
      }
      const start = new Date();
      const end = new Date(start.getTime() + Math.floor(Math.random() * 60000));
      interactions.push({
        inter_obj_i: objA._id,
        inter_obj_j: objB._id,
        inter_start: start,
        inter_end: end,
        inter_service: Math.floor(Math.random() * 5) + 1,
        inter_feedback: Math.random() > 0.2,
      });
    }
    await this.interactionModel.insertMany(interactions);
    this.logger.log(`🌱 Interactions seeded: ${interactions.length}`);
  }
}
