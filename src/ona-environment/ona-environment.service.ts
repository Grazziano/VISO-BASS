import { Injectable } from '@nestjs/common';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';
import { UpdateOnaEnvironmentDto } from './dto/update-ona-environment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OnaEnvironment } from './schema/ona-enviroment.schema';

@Injectable()
export class OnaEnvironmentService {
  constructor(
    @InjectModel(OnaEnvironment.name)
    private onaEnvironmentModel: Model<OnaEnvironment>,
  ) {}

  create(createOnaEnvironmentDto: CreateOnaEnvironmentDto) {
    try {
      const onaEnvironment = new this.onaEnvironmentModel(
        createOnaEnvironmentDto,
      );
      const savedOnaEnvironment = onaEnvironment.save();
      return savedOnaEnvironment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create onaEnvironment: ${error.message}`);
      }
      throw new Error(
        'Failed to create onaEnvironment due to an unknown error',
      );
    }
  }

  async findAll() {
    try {
      const onaEnvironments = await this.onaEnvironmentModel
        .find()
        .lean()
        .exec();
      return onaEnvironments;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find onaEnvironment: ${error.message}`);
      }
      throw new Error('Failed to find onaEnvironment due to an unknown error');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} onaEnvironment`;
  }

  update(id: number, updateOnaEnvironmentDto: UpdateOnaEnvironmentDto) {
    console.log(updateOnaEnvironmentDto);
    return `This action updates a #${id} onaEnvironment`;
  }

  remove(id: number) {
    return `This action removes a #${id} onaEnvironment`;
  }
}
