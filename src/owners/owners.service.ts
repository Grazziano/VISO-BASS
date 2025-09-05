import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Owner, OwnerDocument } from './schema/owner.schema';
import { IOwner } from './interfaces/owner.interface';

@Injectable()
export class OwnersService {
  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async create(body: IOwner): Promise<Owner> {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    try {
      const ownerExists = await this.findByEmail(body.email);

      if (ownerExists) {
        throw new ConflictException('Usuário ja cadastrado');
      }

      const hash = await bcrypt.hash(body.password, 10);

      const user = new this.ownerModel({
        ...body,
        password: hash,
      });

      return await user.save();
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao processar cadastro');
    }
  }

  async findByEmail(email: string): Promise<Owner | null> {
    return this.ownerModel.findOne({ email }).exec();
  }
}
