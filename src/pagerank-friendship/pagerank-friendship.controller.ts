import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PagerankFriendshipService } from './pagerank-friendship.service';
import { CreatePagerankFriendshipDto } from './dto/create-pagerank-friendship.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('pagerank-friendship')
@UseGuards(AuthGuard('jwt'))
@Controller('pagerank-friendship')
export class PagerankFriendshipController {
  constructor(
    private readonly pagerankFriendshipService: PagerankFriendshipService,
  ) {}

  @ApiBody({ type: CreatePagerankFriendshipDto })
  @ApiOperation({ summary: 'Cria nova amizade pagerank' })
  @ApiResponse({ status: 200, type: CreatePagerankFriendshipDto })
  @Post()
  create(@Body() createPagerankFriendshipDto: CreatePagerankFriendshipDto) {
    return this.pagerankFriendshipService.create(createPagerankFriendshipDto);
  }

  @ApiOperation({ summary: 'Lista todas as amizades pagerank' })
  @ApiResponse({ status: 200, type: [CreatePagerankFriendshipDto] })
  @Get()
  findAll() {
    return this.pagerankFriendshipService.findAll();
  }

  @ApiOperation({ summary: 'Lista as amizades pagerank mais relevantes' })
  @ApiResponse({ status: 200, type: [CreatePagerankFriendshipDto] })
  @ApiResponse({ status: 200, type: [CreatePagerankFriendshipDto] })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('relevant')
  async getRelevant(@Query('limit') limit: number = 10) {
    return this.pagerankFriendshipService.findMostRelevant(limit);
  }

  @Get('count')
  @ApiOperation({
    summary: 'Contar total de amizades',
    description:
      'Retorna o número total de registros existentes na coleção de amizades.',
  })
  @ApiResponse({
    status: 200,
    description: 'Total de amizades retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 125 },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  countEnvironments() {
    return this.pagerankFriendshipService.countFriendships();
  }

  @Get('last')
  @ApiOperation({
    summary: 'Retorna a última amizade PageRank criada',
    description:
      'Busca e retorna o registro mais recente da coleção pagerank-friendship.',
  })
  @ApiResponse({
    status: 200,
    description: 'Último registro retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '68c3b2efbc71370247719ab1' },
        pr_obj_i: { type: 'string', example: '507f1f77bcf86cd799439011' },
        pr_obj_j: { type: 'string', example: '507f1f77bcf86cd799439012' },
        pr_score: { type: 'number', example: 0.87 },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-05T12:32:11.123Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-05T12:32:11.123Z',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token JWT inválido ou ausente' })
  getLastFriendship() {
    return this.pagerankFriendshipService.findLast();
  }

  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID do pagerank-friendship',
  })
  @ApiOperation({ summary: 'Busca amizades pagerank pelo id' })
  @ApiResponse({ status: 200, type: CreatePagerankFriendshipDto })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagerankFriendshipService.findOne(id);
  }
}
