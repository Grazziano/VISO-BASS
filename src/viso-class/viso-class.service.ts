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

  async findAll(): Promise<VisoClassResponseDto[]> {
    try {
      this.logger.debug('Buscando todas as classes VISO');

      const myClasses = await this.visoClassModel.find().lean().exec();

      this.logger.log(`${myClasses.length} classes VISO encontradas`);

      return plainToInstance(VisoClassResponseDto, myClasses);
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
