import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateVisoObjectDto } from './dto/create-viso-object.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseVisoObjectDto } from './dto/response-viso-object.dto';
import { Model, Types } from 'mongoose';
import { VisoObject, VisoObjectDocument } from './schema/viso-object.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'src/auth/types/jwt-payload.interface';

@Injectable()
export class VisoObjectService {
  private readonly logger = new Logger(VisoObjectService.name);

  constructor(
    @InjectModel(VisoObject.name)
    private visoObjectModel: Model<VisoObjectDocument>,
  ) {}

  async create(
    createVisoObjectDto: CreateVisoObjectDto,
    user: JwtPayload,
  ): Promise<ResponseVisoObjectDto> {
    try {
      this.logger.log(
        `Criando novo objeto VISO: ${String(createVisoObjectDto.obj_name)} para usuário: ${String(
          user.email,
        )}`,
      );

      const visoObjectData = {
        ...createVisoObjectDto,
        obj_owner: user.userId,
      };

      const visoObject = new this.visoObjectModel(visoObjectData);
      const savedVisoObject = await visoObject.save();

      this.logger.log(
        `Objeto VISO criado com sucesso: ${String(savedVisoObject._id)}`,
      );

      return plainToInstance(ResponseVisoObjectDto, savedVisoObject.toJSON());
    } catch (error) {
      this.logger.error(
        `Erro ao criar objeto VISO: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Failed to create object: Database error',
      );
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    items: ResponseVisoObjectDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      this.logger.debug(
        `Buscando objetos VISO - page: ${page}, limit: ${limit}`,
      );

      // sanitize inputs
      page = Math.max(1, Math.floor(Number(page) || 1));
      limit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 10))); // cap limit to 100

      const skip = (page - 1) * limit;

      const [total, visoObjects] = await Promise.all([
        this.visoObjectModel.countDocuments().exec(),
        this.visoObjectModel
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);

      this.logger.log(
        `${visoObjects.length} objetos VISO retornados (total: ${total})`,
      );

      return {
        items: plainToInstance(ResponseVisoObjectDto, visoObjects),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao buscar objetos VISO: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Failed to find objects: Database error',
      );
    }
  }

  async search(params: {
    name?: string;
    brand?: string;
    model?: string;
    ownerId?: string;
    mac?: string;
    status?: number;
    access?: number;
    location?: number;
    qualification?: number;
    functionIncludes?: string[];
    restrictionIncludes?: string[];
    limitationIncludes?: string[];
    page?: number;
    limit?: number;
  }): Promise<{
    items: ResponseVisoObjectDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const {
        name,
        brand,
        model,
        ownerId,
        mac,
        status,
        access,
        location,
        qualification,
        functionIncludes,
        restrictionIncludes,
        limitationIncludes,
      } = params;

      let { page = 1, limit = 10 } = params;
      page = Math.max(1, Math.floor(Number(page) || 1));
      limit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 10)));

      const filter: Record<string, unknown> = {};

      if (name && name.trim().length > 0) {
        filter.obj_name = { $regex: name.trim(), $options: 'i' };
      }
      if (brand && brand.trim().length > 0) {
        filter.obj_brand = { $regex: brand.trim(), $options: 'i' };
      }
      if (model && model.trim().length > 0) {
        filter.obj_model = { $regex: model.trim(), $options: 'i' };
      }
      if (mac && mac.trim().length > 0) {
        filter.obj_networkMAC = { $regex: mac.trim(), $options: 'i' };
      }
      if (typeof status === 'number') {
        filter.obj_status = status;
      }
      if (typeof access === 'number') {
        filter.obj_access = access;
      }
      if (typeof location === 'number') {
        filter.obj_location = location;
      }
      if (typeof qualification === 'number') {
        filter.obj_qualification = qualification;
      }
      if (ownerId && ownerId.trim().length > 0) {
        try {
          filter.obj_owner = new Types.ObjectId(ownerId.trim());
        } catch {
          // ignore invalid id
        }
      }
      if (Array.isArray(functionIncludes) && functionIncludes.length > 0) {
        filter.obj_function = { $all: functionIncludes };
      }
      if (
        Array.isArray(restrictionIncludes) &&
        restrictionIncludes.length > 0
      ) {
        filter.obj_restriction = { $all: restrictionIncludes };
      }
      if (Array.isArray(limitationIncludes) && limitationIncludes.length > 0) {
        filter.obj_limitation = { $all: limitationIncludes };
      }

      const skip = (page - 1) * limit;

      this.logger.debug(
        `Busca avançada de objetos VISO - filtros: ${JSON.stringify(filter)} | page: ${page}, limit: ${limit}`,
      );

      const [total, visoObjects] = await Promise.all([
        this.visoObjectModel.countDocuments(filter).exec(),
        this.visoObjectModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);

      this.logger.log(
        `${visoObjects.length} objetos VISO retornados na busca (total filtrado: ${total})`,
      );

      return {
        items: plainToInstance(ResponseVisoObjectDto, visoObjects),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Erro na busca avançada de objetos VISO: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Failed to search objects: Database error',
      );
    }
  }

  async countObjects(): Promise<{ total: number }> {
    this.logger.debug('Contando objetos VISO');
    try {
      const total = await this.visoObjectModel.countDocuments().exec();
      this.logger.log(`Total de objetos VISO: ${total}`);
      return { total };
    } catch (error) {
      this.logger.error(
        `Erro ao contar objetos VISO: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Failed to count objects: Database error',
      );
    }
  }

  async countObjectsByStatus(): Promise<
    { status_code: number; status: string; total: number }[]
  > {
    try {
      const agg = await this.visoObjectModel
        .aggregate<{
          _id: number;
          total: number;
        }>([
          { $group: { _id: '$obj_status', total: { $sum: 1 } } },
          { $sort: { _id: 1 } },
        ])
        .exec();

      const labels: Record<number, string> = {
        1: 'online',
        2: 'offline',
        3: 'manutenção',
      };

      return agg.map((r) => ({
        status_code: Number(r._id),
        status: labels[Number(r._id)] ?? String(r._id),
        total: r.total,
      }));
    } catch (error) {
      this.logger.error(
        `Erro ao contar objetos por status: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to count objects by status: ${(error as Error).message}`,
      );
    }
  }

  async findLast(): Promise<unknown> {
    return await this.visoObjectModel
      .findOne()
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async findOne(id: string): Promise<ResponseVisoObjectDto> {
    this.logger.debug(`Buscando objeto VISO por ID: ${id}`);

    try {
      const visoObject = await this.visoObjectModel.findById(id).lean().exec();

      if (!visoObject) {
        this.logger.warn(`Objeto VISO não encontrado: ${id}`);
        throw new NotFoundException(`Object with id ${id} not found`);
      }

      this.logger.log(`Objeto VISO encontrado: ${id}`);
      return plainToInstance(ResponseVisoObjectDto, visoObject);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        `Erro ao buscar objeto VISO ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Failed to find object: Database error',
      );
    }
  }
}
