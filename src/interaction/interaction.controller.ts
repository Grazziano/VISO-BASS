import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
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

  @Get('count-by-day')
  @ApiQuery({
    name: 'period',
    enum: ['week', 'month'],
    required: false,
    description: 'Define o período (week ou month)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna o número de interações por dia no período especificado',
    schema: {
      example: [
        { _id: '2025-09-08', total: 5 },
        { _id: '2025-09-09', total: 12 },
        { _id: '2025-09-12', total: 3 },
      ],
    },
  })
  async countByDay(@Query('period') period: 'week' | 'month' = 'week') {
    return this.interactionService.countInteractionsByDay(period);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, description: 'ID da interação' })
  @ApiOperation({ summary: 'Listar uma interação específica' })
  @ApiResponse({ status: 200, description: 'Retorna uma interação específica' })
  findOne(@Param('id') id: string) {
    return this.interactionService.findOne(id);
  }
}
