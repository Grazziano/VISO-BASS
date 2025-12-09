import { Injectable, Logger } from '@nestjs/common';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, PipelineStage } from 'mongoose';
import { OnaEnvironment } from './schema/ona-enviroment.schema';

@Injectable()
export class OnaEnvironmentService {
  private readonly logger = new Logger(OnaEnvironmentService.name);

  constructor(
    @InjectModel(OnaEnvironment.name)
    private onaEnvironmentModel: Model<OnaEnvironment>,
  ) {}

  async create(createOnaEnvironmentDto: CreateOnaEnvironmentDto) {
    this.logger.log(
      `Criando novo ambiente ONA: ${JSON.stringify(createOnaEnvironmentDto)}`,
    );

    try {
      const onaEnvironment = new this.onaEnvironmentModel(
        createOnaEnvironmentDto,
      );
      const savedOnaEnvironment = await onaEnvironment.save();

      this.logger.log(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Ambiente ONA criado com sucesso: ${savedOnaEnvironment._id}`,
      );
      return savedOnaEnvironment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao criar ambiente ONA: ${error.message}`,
          error.stack,
        );
        throw new Error(`Failed to create onaEnvironment: ${error.message}`);
      }
      this.logger.error('Erro desconhecido ao criar ambiente ONA');
      throw new Error(
        'Failed to create onaEnvironment due to an unknown error',
      );
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    this.logger.debug('Buscando todos os ambientes ONA');

    try {
      page = Math.max(1, Math.floor(Number(page) || 1));
      limit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 10)));
      const skip = (page - 1) * limit;
      const [total, items] = await Promise.all([
        this.onaEnvironmentModel.countDocuments().exec(),
        this.onaEnvironmentModel
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);
      this.logger.log(
        `${items.length} ambientes ONA retornados (total: ${total})`,
      );
      return { items, total, page, limit };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao buscar ambientes ONA: ${error.message}`,
          error.stack,
        );
        throw new Error(`Failed to find onaEnvironment: ${error.message}`);
      }
      this.logger.error('Erro desconhecido ao buscar ambientes ONA');
      throw new Error('Failed to find onaEnvironment due to an unknown error');
    }
  }

  // async countEnvironments(): Promise<{ objects: string[]; total: number }> {
  //   this.logger.debug('Listando objetos únicos em ambientes ONA');
  //   try {
  //     const result = await this.onaEnvironmentModel
  //       .aggregate([
  //         {
  //           $facet: {
  //             neighbors: [
  //               { $unwind: '$objects' },
  //               { $group: { _id: '$objects' } },
  //             ],
  //             envI: [{ $group: { _id: '$env_object_i' } }],
  //           },
  //         },
  //         {
  //           $project: {
  //             neighborsIds: {
  //               $map: { input: '$neighbors', as: 'd', in: '$$d._id' },
  //             },
  //             envIIds: { $map: { input: '$envI', as: 'd', in: '$$d._id' } },
  //           },
  //         },
  //         {
  //           $project: {
  //             all: { $setUnion: ['$neighborsIds', '$envIIds'] },
  //           },
  //         },
  //       ])
  //       .exec();
  //     const all = (result && result[0] && result[0].all) || [];
  //     const items = all.map((x: any) => String(x));
  //     this.logger.log(`Objetos únicos em ambientes ONA: ${items.length}`);
  //     return { objects: items, total: items.length };
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       this.logger.error(
  //         `Erro ao listar objetos únicos de ambientes ONA: ${error.message}`,
  //         error.stack,
  //       );
  //       throw new Error(
  //         `Failed to list unique environment objects: ${error.message}`,
  //       );
  //     }
  //     this.logger.error(
  //       'Erro desconhecido ao listar objetos únicos de ambientes ONA',
  //     );
  //     throw new Error(
  //       'Failed to list unique environment objects due to an unknown error',
  //     );
  //   }
  // }

  async countEnvironments(): Promise<{ objects: string[]; total: number }> {
    this.logger.debug('Listando objetos únicos em ambientes ONA');
    try {
      const neighborsIds = (
        await this.onaEnvironmentModel.distinct('objects').exec()
      ).map((v: unknown) => String(v));
      const envIIds = (
        await this.onaEnvironmentModel.distinct('env_object_i').exec()
      ).map((v: unknown) => String(v));

      const unique = Array.from(new Set([...neighborsIds, ...envIIds]));

      this.logger.log(`Objetos únicos em ambientes ONA: ${unique.length}`);
      return { objects: unique, total: unique.length };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao listar objetos únicos de ambientes ONA: ${error.message}`,
          error.stack,
        );
        throw new Error(
          `Failed to list unique environment objects: ${error.message}`,
        );
      }
      this.logger.error(
        'Erro desconhecido ao listar objetos únicos de ambientes ONA',
      );
      throw new Error(
        'Failed to list unique environment objects due to an unknown error',
      );
    }
  }

  async countObjectsAggregation(environmentId?: string): Promise<{
    environments: { environmentId: string; objectsCount: number }[];
    totalObjects: number;
  }> {
    this.logger.debug('Agregando número de objetos por ambiente ONA');
    try {
      const pipeline: PipelineStage[] = [];
      if (environmentId) {
        pipeline.push({ $match: { _id: new Types.ObjectId(environmentId) } });
      }
      pipeline.push({
        $project: {
          environmentId: { $toString: '$_id' },
          objectsCount: { $size: { $ifNull: ['$objects', []] } },
        },
      });

      if (!environmentId) {
        pipeline.push({
          $group: {
            _id: null,
            environments: {
              $push: {
                environmentId: '$environmentId',
                objectsCount: '$objectsCount',
              },
            },
            totalObjects: { $sum: '$objectsCount' },
          },
        });
        pipeline.push({
          $project: { _id: 0, environments: 1, totalObjects: 1 },
        });
        const resArr = await this.onaEnvironmentModel
          .aggregate(pipeline)
          .exec();
        const resDoc = (resArr?.[0] ?? {}) as Record<string, unknown>;
        const envsUnknown = resDoc.environments;
        const environments = Array.isArray(envsUnknown)
          ? envsUnknown.map((e) => {
              const obj = e as Record<string, unknown>;
              const environmentIdStr = String(obj.environmentId);
              const countVal = obj.objectsCount;
              const objectsCount =
                typeof countVal === 'number' ? countVal : Number(countVal ?? 0);
              return { environmentId: environmentIdStr, objectsCount };
            })
          : [];
        const totalRaw = resDoc.totalObjects;
        const totalObjects =
          typeof totalRaw === 'number' ? totalRaw : Number(totalRaw ?? 0);
        this.logger.log(
          `Agregação concluída: ${environments.length} ambientes, total de objetos ${totalObjects}`,
        );
        return { environments, totalObjects };
      } else {
        const resArr = await this.onaEnvironmentModel
          .aggregate(pipeline)
          .exec();
        const firstDoc = (resArr?.[0] ?? {}) as Record<string, unknown>;
        const envIdRaw = firstDoc.environmentId;
        const envIdStr =
          typeof envIdRaw === 'string'
            ? envIdRaw
            : envIdRaw &&
                typeof (envIdRaw as { toString: () => string }).toString ===
                  'function'
              ? (envIdRaw as { toString: () => string }).toString()
              : String(environmentId);
        const countRaw = firstDoc.objectsCount;
        const count =
          typeof countRaw === 'number' ? countRaw : Number(countRaw ?? 0);
        this.logger.log(
          `Ambiente ${envIdStr} possui ${count} objetos agregados`,
        );
        return {
          environments: [{ environmentId: envIdStr, objectsCount: count }],
          totalObjects: count,
        };
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao agregar objetos por ambiente ONA: ${error.message}`,
          error.stack,
        );
        throw new Error(
          `Failed to aggregate environment objects: ${error.message}`,
        );
      }
      this.logger.error(
        'Erro desconhecido na agregação de objetos por ambiente ONA',
      );
      throw new Error(
        'Failed to aggregate environment objects due to an unknown error',
      );
    }
  }

  async findLast(): Promise<any> {
    return this.onaEnvironmentModel
      .findOne()
      .sort({ createdAt: -1 }) // último registro inserido
      .exec();
  }

  async findOne(id: string) {
    this.logger.debug(`Buscando ambiente ONA por ID: ${id}`);

    try {
      const onaEnvironment = await this.onaEnvironmentModel
        .findById(id)
        .lean()
        .exec();

      if (!onaEnvironment) {
        this.logger.warn(`Ambiente ONA não encontrado: ${id}`);
        throw new Error(`onaEnvironment with id ${id} not found`);
      }

      this.logger.log(`Ambiente ONA encontrado: ${id}`);
      return onaEnvironment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(
          `Erro ao buscar ambiente ONA ${id}: ${error.message}`,
          error.stack,
        );
        throw new Error(`Failed to find onaEnvironment: ${error.message}`);
      }
      this.logger.error(`Erro desconhecido ao buscar ambiente ONA: ${id}`);
      throw new Error('Failed to find onaEnvironment due to an unknown error');
    }
  }
}
