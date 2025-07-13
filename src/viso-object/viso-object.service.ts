import { Injectable } from '@nestjs/common';
import { CreateVisoObjectDto } from './dto/create-viso-object.dto';
import { UpdateVisoObjectDto } from './dto/update-viso-object.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseVisoObjectDto } from './dto/response-viso-object.dto';
import { Model } from 'mongoose';
import { VisoObject, VisoObjectDocument } from './schema/viso-object.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class VisoObjectService {
  constructor(
    @InjectModel(VisoObject.name)
    private visoObjectModel: Model<VisoObjectDocument>,
  ) {}

  async create(createVisoObjectDto: CreateVisoObjectDto) {
    try {
      const object = new this.visoObjectModel(createVisoObjectDto);
      const savedObject = await object.save();
      return plainToInstance(ResponseVisoObjectDto, savedObject.toJSON());
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create object: ${error.message}`);
      }
      throw new Error('Failed to create object due to an unknown error');
    }
  }

  findAll() {
    try {
      const objects = this.visoObjectModel.find().lean().exec();
      return plainToInstance(ResponseVisoObjectDto, objects);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find objects: ${error.message}`);
      }
      throw new Error('Failed to find objects due to an unknown error');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} visoObject`;
  }

  update(id: number, updateVisoObjectDto: UpdateVisoObjectDto) {
    console.log(updateVisoObjectDto);
    return `This action updates a #${id} visoObject`;
  }

  remove(id: number) {
    return `This action removes a #${id} visoObject`;
  }
}
