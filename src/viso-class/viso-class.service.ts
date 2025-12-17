import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VisoClass, VisoClassDocument } from './schemas/viso-class.schema';
import { isValidObjectId, Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { CreateVisoClassDto } from './dto/create-viso-class.dto';
import { VisoClassResponseDto } from './dto/viso-class-response.dto';

@Injectable()
export class VisoClassService {
  private readonly logger = new Logger(VisoClassService.name);

  constructor(
    @InjectModel(VisoClass.name)
    private visoClassModel: Model<VisoClassDocument>,
  ) {}

  async create(
    createVisoClassDto: CreateVisoClassDto,
  ): Promise<VisoClassResponseDto> {
    try {
      this.logger.log(
        `Criando nova classe VISO: ${String(createVisoClassDto.class_name)}`,
      );

      for (const object of createVisoClassDto.objects) {
        if (!isValidObjectId(object)) {
          this.logger.warn(`ID de objeto inválido: ${object}`);
          throw new Error('Invalid object ID');
        }
      }

      const newMyClass = new this.visoClassModel(createVisoClassDto);
      const savedMyClass = await newMyClass.save();

      this.logger.log(
        `Classe VISO criada com sucesso: ${String(savedMyClass._id)}`,
      );

      return plainToInstance(VisoClassResponseDto, savedMyClass.toJSON());
    } catch (error) {
      this.logger.error(
        `Erro ao criar classe VISO: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to create class: ${(error as Error).message}`,
      );
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    items: VisoClassResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      this.logger.debug('Buscando todas as classes VISO');

      page = Math.max(1, Math.floor(Number(page) || 1));
      limit = Math.max(1, Math.min(100, Math.floor(Number(limit) || 10)));
      const skip = (page - 1) * limit;

      const [total, myClasses] = await Promise.all([
        this.visoClassModel.countDocuments().exec(),
        this.visoClassModel
          .find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
      ]);

      this.logger.log(
        `${myClasses.length} classes VISO retornadas (total: ${total})`,
      );

      return {
        items: plainToInstance(VisoClassResponseDto, myClasses),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao buscar classes VISO: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to find classes: ${(error as Error).message}`,
      );
    }
  }

  async countClasses(): Promise<{ total: number }> {
    const total = await this.visoClassModel.countDocuments().exec();
    return { total };
  }

  async countObjectsByClass(): Promise<
    { class_id: string; class_name: string; total: number }[]
  > {
    try {
      const results = await this.visoClassModel
        .aggregate<{
          class_id: string;
          class_name: string;
          total: number;
        }>([
          {
            $project: {
              class_id: '$_id',
              class_name: 1,
              total: { $size: { $ifNull: ['$objects', []] } },
            },
          },
          { $sort: { total: -1, class_name: 1 } },
        ])
        .exec();

      return results.map((r) => ({
        class_id: String(r.class_id),
        class_name: r.class_name,
        total: r.total,
      }));
    } catch (error) {
      this.logger.error(
        `Erro ao contar objetos por classe: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to count objects by class: ${(error as Error).message}`,
      );
    }
  }

  async findLast(): Promise<unknown> {
    return this.visoClassModel.findOne().sort({ createdAt: -1 }).lean().exec();
  }

  async findOne(id: string): Promise<VisoClassResponseDto> {
    this.logger.debug(`Buscando classe VISO por ID: ${id}`);

    const isValid = isValidObjectId(id);

    if (!isValid) {
      this.logger.warn(`ID inválido fornecido: ${id}`);
      throw new NotFoundException(`MyClass with id ${id} not found`);
    }

    try {
      const myClass = await this.visoClassModel
        .findById({ _id: id })
        .lean()
        .exec();

      if (!myClass) {
        this.logger.warn(`Classe VISO não encontrada: ${id}`);
        throw new NotFoundException(`MyClass with id ${id} not found`);
      }

      this.logger.log(`Classe VISO encontrada: ${id}`);

      return plainToInstance(VisoClassResponseDto, myClass);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(
        `Erro ao buscar classe VISO ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to find class: ${(error as Error).message}`,
      );
    }
  }
}
