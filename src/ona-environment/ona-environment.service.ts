import { Injectable } from '@nestjs/common';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';
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

  async findOne(id: string) {
    try {
      const onaEnvironment = await this.onaEnvironmentModel
        .findById(id)
        .lean()
        .exec();

      if (!onaEnvironment) {
        throw new Error(`onaEnvironment with id ${id} not found`);
      }

      return onaEnvironment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find onaEnvironment: ${error.message}`);
      }
      throw new Error('Failed to find onaEnvironment due to an unknown error');
    }
  }
}
