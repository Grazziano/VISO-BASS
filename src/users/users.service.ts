import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    try {
      const userExists = await this.findByEmail(email);

      if (userExists) {
        throw new ConflictException('Usuário ja cadastrado');
      }

      const hash = await bcrypt.hash(password, 10);

      const user = new this.userModel({ email, password: hash });

      return await user.save();
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao processar cadastro');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
