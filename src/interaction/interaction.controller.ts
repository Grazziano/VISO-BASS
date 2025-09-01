import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('interaction')
@UseGuards(AuthGuard('jwt'))
@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  @ApiBody({ type: CreateInteractionDto })
  @ApiOperation({ summary: 'Create a new interaction' })
  @ApiResponse({
    status: 201,
    description: 'The interaction has been successfully created',
  })
  create(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionService.create(createInteractionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as interações' })
  @ApiResponse({ status: 200, description: 'Retorna todas as interações' })
  findAll() {
    return this.interactionService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'ID da interação' })
  @ApiOperation({ summary: 'Listar uma interação específica' })
  @ApiResponse({ status: 200, description: 'Retorna uma interação específica' })
  findOne(@Param('id') id: string) {
    return this.interactionService.findOne(id);
  }
}
