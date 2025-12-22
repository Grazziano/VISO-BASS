import { Injectable, Logger } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Interaction } from './schema/interaction.schema';
import { Model } from 'mongoose';
import {
  VisoObject,
  VisoObjectDocument,
} from '../viso-object/schema/viso-object.schema';

@Injectable()
export class InteractionService {
  private readonly logger = new Logger(InteractionService.name);

  constructor(
    @InjectModel(Interaction.name)
    private interactionModel: Model<Interaction>,
    @InjectModel(VisoObject.name)
    private visoObjectModel: Model<VisoObjectDocument>,
  ) {}

  async create(createInteractionDto: CreateInteractionDto) {
    try {
      const interaction = new this.interactionModel(createInteractionDto);
      const savedInteraction = await interaction.save();
      return savedInteraction;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create interaction: ${error.message}`);
      }
      throw new Error('Failed to create interaction due to an unknown error');
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    try {
      page = Math.max(1, Math.floor(Number(page) || 1));
      limit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 10)));
      const skip = (page - 1) * limit;
      const [total, interactions] = await Promise.all([
        this.interactionModel.countDocuments().exec(),
        this.interactionModel
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);
      // collect unique object ids referenced in interactions
      const objectIds = new Set<string>();
      for (const it of interactions) {
        if (it?.inter_obj_i) objectIds.add(String(it.inter_obj_i));
        if (it?.inter_obj_j) objectIds.add(String(it.inter_obj_j));
      }

      let items = interactions;
      if (objectIds.size > 0) {
        const visoObjects = await this.visoObjectModel
          .find({ _id: { $in: Array.from(objectIds) } })
          .lean()
          .exec();
        const visoMap = new Map<string, any>(
          visoObjects.map((o: any) => [String(o._id), o]),
        );

        items = interactions.map((it) => ({
          ...it,
          inter_obj_i: visoMap.get(String(it.inter_obj_i)) || it.inter_obj_i,
          inter_obj_j: visoMap.get(String(it.inter_obj_j)) || it.inter_obj_j,
        }));
      }

      this.logger.debug(
        `${items.length} interações retornadas (total: ${total})`,
      );

      return { items, total, page, limit };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find interaction: ${error.message}`);
      }
      throw new Error('Failed to find interaction due to an unknown error');
    }
  }

  async countInteractionsByDay(
    period: 'week' | 'month',
  ): Promise<{ _id: string; total: number }[]> {
    try {
      const now = new Date();
      const startDate =
        period === 'week'
          ? new Date(now.setDate(now.getDate() - 7))
          : new Date(now.setMonth(now.getMonth() - 1));

      return await this.interactionModel.aggregate<{
        _id: string;
        total: number;
      }>([
        {
          $match: {
            createdAt: { $gte: startDate }, // só interações recentes
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }, // agrupa por dia
            },
            total: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } }, // ordena por data crescente
      ]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find interaction: ${error.message}`);
      }
      throw new Error('Failed to find interaction due to an unknown error');
    }
  }

  async getTimeSeries(
    range: '7d' | '30d',
  ): Promise<{ date: string; interactions: number }[]> {
    try {
      const days = range === '7d' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const results = await this.interactionModel.aggregate<{
        date: string;
        interactions: number;
      }>([
        {
          $match: {
            createdAt: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            interactions: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            date: '$_id',
            interactions: 1,
          },
        },
      ]);

      return results;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find interaction: ${error.message}`);
      }
      throw new Error('Failed to find interaction due to an unknown error');
    }
  }

  // async getTimeSeries(
  //   range: '7d' | '30d',
  // ): Promise<{ date: string; interactions: number }[]> {
  //   try {
  //     const days = range === '7d' ? 7 : 30;
  //     const startDate = new Date();
  //     startDate.setDate(startDate.getDate() - days);

  //     const results = await this.interactionModel.aggregate([
  //       {
  //         $match: {
  //           inter_start: { $gte: startDate }, // filtra pelas datas da interação!
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: {
  //             $dateToString: { format: '%Y-%m-%d', date: '$inter_start' },
  //           },
  //           interactions: { $sum: 1 },
  //         },
  //       },
  //       { $sort: { _id: 1 } },
  //       {
  //         $project: {
  //           _id: 0,
  //           date: '$_id',
  //           interactions: 1,
  //         },
  //       },
  //     ]);

  //     return results;
  //   } catch (error) {
  //     throw new Error(
  //       `Failed to get time-series: ${error instanceof Error ? error.message : error}`,
  //     );
  //   }
  // }

  async countInteractions(): Promise<{ total: number }> {
    try {
      const total = await this.interactionModel.countDocuments().exec();
      this.logger.debug(`Total de interações: ${total}`);
      return { total };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to count interactions: ${error.message}`);
      }
      throw new Error('Failed to count interactions due to an unknown error');
    }
  }

  async findLast(): Promise<unknown> {
    return this.interactionModel
      .findOne()
      .sort({ createdAt: -1 }) // ordena do mais recente para o mais antigo
      .exec();
  }

  async findOne(id: string) {
    try {
      const interaction = await this.interactionModel
        .findById(id)
        .lean()
        .exec();
      return interaction;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find interaction: ${error.message}`);
      }
      throw new Error('Failed to find interaction due to an unknown error');
    }
  }

  async search(params: {
    name?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: any[]; total: number; page: number; limit: number }> {
    try {
      let { page = 1, limit = 10 } = params;
      page = Math.max(1, Math.floor(Number(page) || 1));
      limit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 10)));
      const skip = (page - 1) * limit;

      const filter: Record<string, unknown> = {};
      const { name } = params;

      if (typeof name === 'string' && name.trim().length > 0) {
        const visoObjects = (await this.visoObjectModel
          .find({
            obj_name: { $regex: name.trim(), $options: 'i' },
          })
          .select({ _id: 1 })
          .lean()
          .exec()) as unknown as Array<{ _id: string }>;
        const ids = visoObjects.map((o) => String(o._id));
        if (ids.length === 0) {
          return { items: [], total: 0, page, limit };
        }
        filter.$or = [
          { inter_obj_i: { $in: ids } },
          { inter_obj_j: { $in: ids } },
        ];
      }

      const [total, interactionsRaw] = await Promise.all([
        this.interactionModel.countDocuments(filter).exec(),
        this.interactionModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);
      const interactions = interactionsRaw as unknown as Array<
        Record<string, unknown>
      >;

      const objectIds = new Set<string>();
      for (const it of interactions) {
        const oi = it['inter_obj_i'];
        const oj = it['inter_obj_j'];
        const toIdStr = (v: unknown) =>
          typeof v === 'string'
            ? v
            : v &&
                typeof (v as { toString: () => string }).toString === 'function'
              ? (v as { toString: () => string }).toString()
              : '';
        if (oi !== undefined && oi !== null) objectIds.add(toIdStr(oi));
        if (oj !== undefined && oj !== null) objectIds.add(toIdStr(oj));
      }

      let items: Array<Record<string, unknown>> = interactions;
      if (objectIds.size > 0) {
        const visoObjects = (await this.visoObjectModel
          .find({ _id: { $in: Array.from(objectIds) } })
          .lean()
          .exec()) as unknown as Array<
          Record<string, unknown> & { _id: string }
        >;
        const visoMap = new Map<string, Record<string, unknown>>(
          visoObjects.map((o) => [String(o._id), o]),
        );

        items = interactions.map((it) => ({
          ...it,
          inter_obj_i: visoMap.get(String(it.inter_obj_i)) || it.inter_obj_i,
          inter_obj_j: visoMap.get(String(it.inter_obj_j)) || it.inter_obj_j,
        })) as Array<Record<string, unknown>>;
      }

      this.logger.debug(
        `${items.length} interações retornadas na busca (total filtrado: ${total})`,
      );

      return { items, total, page, limit };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to search interactions: ${error.message}`);
      }
      throw new Error('Failed to search interactions due to an unknown error');
    }
  }
}
