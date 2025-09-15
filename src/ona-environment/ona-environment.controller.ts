import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OnaEnvironmentService } from './ona-environment.service';
import { CreateOnaEnvironmentDto } from './dto/create-ona-environment.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('ona-environment')
@UseGuards(AuthGuard('jwt'))
@Controller('ona-environment')
export class OnaEnvironmentController {
  constructor(private readonly onaEnvironmentService: OnaEnvironmentService) {}

  @Post()
  @ApiOperation({ summary: 'Cria novo ambiente' })
  @ApiBody({ type: CreateOnaEnvironmentDto })
  create(@Body() createOnaEnvironmentDto: CreateOnaEnvironmentDto) {
    return this.onaEnvironmentService.create(createOnaEnvironmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os ambientes' })
  @ApiResponse({ status: 200, type: [CreateOnaEnvironmentDto] })
  findAll() {
    return this.onaEnvironmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Encontra ambiente pelo id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: CreateOnaEnvironmentDto })
  findOne(@Param('id') id: string) {
    return this.onaEnvironmentService.findOne(id);
  }
}
