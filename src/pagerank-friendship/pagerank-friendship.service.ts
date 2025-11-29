import { Injectable } from '@nestjs/common';
import { CreatePagerankFriendshipDto } from './dto/create-pagerank-friendship.dto';
import { PageRankFriendship } from './schema/pagerank-friendship.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PagerankFriendshipService {
  constructor(
    @InjectModel(PageRankFriendship.name)
    private pagerankFriendshipModel: Model<PageRankFriendship>,
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

  async findAll() {
    try {
      const pagerankFriendships = await this.pagerankFriendshipModel.find();
      return pagerankFriendships;
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
    const total = await this.pagerankFriendshipModel.countDocuments().exec();
    return { total };
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
