import { Injectable } from '@nestjs/common';
import { CreatePagerankFriendshipDto } from './dto/create-pagerank-friendship.dto';
import { PageRankFriendship } from './schema/pagerank-friendship.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  VisoObject,
  VisoObjectDocument,
} from 'src/viso-object/schema/viso-object.schema';

@Injectable()
export class PagerankFriendshipService {
  constructor(
    @InjectModel(PageRankFriendship.name)
    private pagerankFriendshipModel: Model<PageRankFriendship>,
    @InjectModel(VisoObject.name)
    private visoObjectModel: Model<VisoObjectDocument>,
  ) {}

  async create(createPagerankFriendshipDto: CreatePagerankFriendshipDto) {
    try {
      const pagerankFriendship = new this.pagerankFriendshipModel(
        createPagerankFriendshipDto,
      );
      const savedPagerankFriendship = await pagerankFriendship.save();
      return savedPagerankFriendship;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to create pagerankFriendship: ${error.message}`,
        );
      }
      throw new Error(
        'Failed to create pagerankFriendship due to an unknown error',
      );
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
      const [total, items] = await Promise.all([
        this.pagerankFriendshipModel.countDocuments().exec(),
        this.pagerankFriendshipModel
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);

      // collect unique rank_object ids
      const objectIds = new Set<string>();
      for (const it of items) {
        if (it?.rank_object) objectIds.add(String(it.rank_object));
      }

      let populatedItems = items;
      if (objectIds.size > 0) {
        const visoObjects = await this.visoObjectModel
          .find({ _id: { $in: Array.from(objectIds) } })
          .lean()
          .exec();
        const visoMap = new Map<string, any>(
          visoObjects.map((o: any) => [String(o._id), o]),
        );

        populatedItems = items.map((it) => ({
          ...it,
          rank_object: visoMap.get(String(it.rank_object)) || it.rank_object,
        }));
      }

      return { items: populatedItems, total, page, limit };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find pagerankFriendship: ${error.message}`);
      }
      throw new Error(
        'Failed to find pagerankFriendship due to an unknown error',
      );
    }
  }

  async countFriendships(): Promise<{ total: number }> {
    try {
      const res = await this.pagerankFriendshipModel
        .aggregate([
          {
            $project: {
              edges: { $size: { $ifNull: ['$rank_adjacency', []] } },
            },
          },
          { $group: { _id: null, total: { $sum: '$edges' } } },
        ])
        .exec();
      const total = (res?.[0]?.total as number) ?? 0;
      return { total };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to count friendships: ${error.message}`);
      }
      throw new Error('Failed to count friendships due to an unknown error');
    }
  }

  async findLast(): Promise<any> {
    return this.pagerankFriendshipModel
      .findOne()
      .sort({ createdAt: -1 }) // último inserido
      .exec();
  }

  async findOne(id: string) {
    try {
      const pagerankFriendship =
        await this.pagerankFriendshipModel.findById(id);

      if (!pagerankFriendship) {
        throw new Error(`pagerankFriendship with id ${id} not found`);
      }

      return pagerankFriendship;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find pagerankFriendship: ${error.message}`);
      }
      throw new Error(
        'Failed to find pagerankFriendship due to an unknown error',
      );
    }
  }

  // async findMostRelevant(limit: number) {
  //   const results = await this.pagerankFriendshipModel.find().lean();

  //   // Lógica para ordenar por número de adjacências (maior relevância = mais conexões)
  //   const sorted = results
  //     .map((result) => ({
  //       ...result,
  //       relevanceScore: result.rank_adjacency.length,
  //     }))
  //     .sort((a, b) => b.relevanceScore - a.relevanceScore);

  //   return sorted.slice(0, limit);
  // }

  async findMostRelevant(limit: number) {
    const results = await this.pagerankFriendshipModel.find().lean();

    const sorted = results
      .map((result) => {
        // Garante que rank_adjacency é um array válido
        const adjacency = Array.isArray(result.rank_adjacency)
          ? result.rank_adjacency
          : [];

        // Conta apenas IDs únicos
        const uniqueAdjacency = new Set(adjacency);
        const uniqueCount = uniqueAdjacency.size;

        return {
          ...result,
          relevanceScore: uniqueCount, // número de IDs diferentes
        };
      })
      // Ordena em ordem decrescente pelo número de IDs únicos
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Retorna apenas o número de resultados solicitado
    return sorted.slice(0, limit);
  }
}
