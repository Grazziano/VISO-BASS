import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Owner, OwnerDocument } from './schema/owner.schema';
import { IOwner } from './interfaces/owner.interface';

@Injectable()
export class OwnersService {
  private readonly logger = new Logger(OwnersService.name);

  constructor(
    @InjectModel(Owner.name) private ownerModel: Model<OwnerDocument>,
  ) {}

  async create(body: IOwner): Promise<Owner> {
    this.logger.log(`Tentativa de criação de usuário: ${String(body.email)}`);

    if (!body.email || !body.password) {
      this.logger.warn(
        `Tentativa de criação de usuário com dados incompletos: ${String(body.email)}`,
      );
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    try {
      const ownerExists = await this.findByEmail(body.email);

      if (ownerExists) {
        this.logger.warn(
          `Tentativa de criação de usuário já existente: ${String(body.email)}`,
        );
        throw new ConflictException('Usuário ja cadastrado');
      }

      const hash = await bcrypt.hash(body.password, 10);

      const user = new this.ownerModel({
        ...body,
        password: hash,
      });

      const savedUser = await user.save();
      this.logger.log(
        `Usuário criado com sucesso: ${String(savedUser.email)} (ID: ${String(
          savedUser._id,
        )})`,
      );

      return savedUser;
    } catch (error: unknown) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Erro ao processar cadastro para ${String(body.email)}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Erro ao processar cadastro');
    }
  }

  async findByEmail(email: string): Promise<Owner | null> {
    this.logger.debug(`Buscando usuário por email: ${email}`);

    try {
      const owner = await this.ownerModel.findOne({ email }).exec();

      if (owner) {
        this.logger.debug(`Usuário encontrado: ${email}`);
      } else {
        this.logger.debug(`Usuário não encontrado: ${email}`);
      }

      return owner;
    } catch (error) {
      this.logger.error(
        `Erro ao buscar usuário por email ${email}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Erro ao buscar usuário');
    }
  }

  async findAll(): Promise<Omit<Owner, 'password'>[]> {
    this.logger.debug('Listando todos os usuários');
    try {
      const owners = await this.ownerModel.find({}).select('-password').exec();
      return owners as unknown as Omit<Owner, 'password'>[];
    } catch (error) {
      this.logger.error(
        `Erro ao listar usuários: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Erro ao listar usuários');
    }
  }

  async updateRole(id: string, role: string): Promise<Omit<Owner, 'password'>> {
    this.logger.debug(`Atualizando papel do usuário ${id} para ${role}`);
    try {
      const updated = await this.ownerModel
        .findByIdAndUpdate(
          id,
          { $set: { role } },
          { new: true, projection: { password: 0 } },
        )
        .exec();
      if (!updated) {
        throw new BadRequestException('Usuário não encontrado');
      }
      return updated as unknown as Omit<Owner, 'password'>;
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar papel do usuário ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Erro ao atualizar papel do usuário',
      );
    }
  }

  async searchUsers(q: string): Promise<Omit<Owner, 'password'>[]> {
    this.logger.debug(`Buscando usuários por termo: ${q}`);
    try {
      if (!q || q.trim().length === 0) {
        return this.findAll();
      }
      const regex = new RegExp(q, 'i');
      const owners = await this.ownerModel
        .find({
          $or: [{ name: regex }, { email: regex }],
        })
        .select('-password')
        .exec();
      return owners as unknown as Omit<Owner, 'password'>[];
    } catch (error) {
      this.logger.error(
        `Erro na busca por usuários: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Erro ao buscar usuários');
    }
  }
}
