import { Injectable, Logger } from '@nestjs/common';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async findAll() {
    this.logger.debug('Buscando todos os ambientes ONA');

    try {
      const onaEnvironments = await this.onaEnvironmentModel
        .find()
        .lean()
        .exec();

      this.logger.log(`${onaEnvironments.length} ambientes ONA encontrados`);
      return onaEnvironments;
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

  async countEnvironments(): Promise<{ total: number }> {
    const total = await this.onaEnvironmentModel.countDocuments().exec();
    return { total };
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
