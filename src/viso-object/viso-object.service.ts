import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateVisoObjectDto } from './dto/create-viso-object.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseVisoObjectDto } from './dto/response-viso-object.dto';
import { Model } from 'mongoose';
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
        `Criando novo objeto VISO: ${createVisoObjectDto.obj_name} para usuário: ${user.email}`,
      );

      const visoObjectData = {
        ...createVisoObjectDto,
        obj_owner: user.userId,
      };

      const visoObject = new this.visoObjectModel(visoObjectData);
      const savedVisoObject = await visoObject.save();

      this.logger.log(`Objeto VISO criado com sucesso: ${savedVisoObject._id}`);

      return plainToInstance(ResponseVisoObjectDto, savedVisoObject.toJSON());
    } catch (error) {
      this.logger.error(
        `Erro ao criar objeto VISO: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Failed to create object: Database error');
    }
  }

  async findAll(): Promise<ResponseVisoObjectDto[]> {
    try {
      this.logger.debug('Buscando todos os objetos VISO');

      const visoObjects = await this.visoObjectModel.find().lean().exec();

      this.logger.log(`${visoObjects.length} objetos VISO encontrados`);

      return plainToInstance(ResponseVisoObjectDto, visoObjects);
    } catch (error) {
      this.logger.error(
        `Erro ao buscar objetos VISO: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Failed to find objects: Database error');
    }
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
      throw new InternalServerErrorException('Failed to find object: Database error');
    }
  }
}
