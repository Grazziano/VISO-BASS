import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  create(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionService.create(createInteractionDto);
  }

  @Get()
  findAll() {
    return this.interactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interactionService.findOne(id);
  }
}
