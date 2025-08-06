import { Injectable } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Interaction } from './schema/interaction.schema';
import { Model } from 'mongoose';

@Injectable()
export class InteractionService {
  constructor(
    @InjectModel(Interaction.name)
    private interactionModel: Model<Interaction>,
  ) {}

  create(createInteractionDto: CreateInteractionDto) {
    try {
      const interaction = new this.interactionModel(createInteractionDto);
      const savedInteraction = interaction.save();
      return savedInteraction;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to create interaction: ${error.message}`);
      }
      throw new Error('Failed to create interaction due to an unknown error');
    }
  }

  findAll() {
    try {
      const interactions = this.interactionModel.find().lean().exec();
      return interactions;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to find interaction: ${error.message}`);
      }
      throw new Error('Failed to find interaction due to an unknown error');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} interaction`;
  }

  update(id: number, updateInteractionDto: UpdateInteractionDto) {
    console.log(updateInteractionDto);
    return `This action updates a #${id} interaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} interaction`;
  }
}
