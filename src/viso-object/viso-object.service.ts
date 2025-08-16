import { Injectable } from '@nestjs/common';
import { CreateVisoObjectDto } from './dto/create-viso-object.dto';
import { UpdateVisoObjectDto } from './dto/update-viso-object.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseVisoObjectDto } from './dto/response-viso-object.dto';
import { Model } from 'mongoose';
import { VisoObject, VisoObjectDocument } from './schema/viso-object.schema';
import { InjectModel } from '@nestjs/mongoose';
import { JwtPayload } from 'src/types/jwt-payload.type';

@Injectable()
export class VisoObjectService {
  constructor(
    @InjectModel(VisoObject.name)
    private visoObjectModel: Model<VisoObjectDocument>,
  ) {}

  async create(createVisoObjectDto: CreateVisoObjectDto, user: JwtPayload) {
    try {
      const object = new this.visoObjectModel({
        ...createVisoObjectDto,
        obj_owner: user.userId,
      });

      const savedObject = await object.save();
      return plainToInstance(ResponseVisoObjectDto, savedObject.toJSON());
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create object: ${error.message}`);
      }
      throw new Error('Failed to create object due to an unknown error');
    }
  }

  findAll(ownerId: string) {
    try {
      const objects = this.visoObjectModel
        .find({ obj_owner: ownerId })
        .lean()
        .exec();

      return plainToInstance(ResponseVisoObjectDto, objects);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find objects: ${error.message}`);
      }
      throw new Error('Failed to find objects due to an unknown error');
    }
  }

  findOne(id: string) {
    try {
      const object = this.visoObjectModel.findById(id).lean().exec();
      return plainToInstance(ResponseVisoObjectDto, object);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find object: ${error.message}`);
      }
      throw new Error('Failed to find object due to an unknown error');
    }
  }

  update(id: number, updateVisoObjectDto: UpdateVisoObjectDto) {
    console.log(updateVisoObjectDto);
    return `This action updates a #${id} visoObject`;
  }

  remove(id: number) {
    return `This action removes a #${id} visoObject`;
  }
}
