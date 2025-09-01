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
  @ApiOperation({ summary: 'Create an ona-environment' })
  @ApiBody({ type: CreateOnaEnvironmentDto })
  create(@Body() createOnaEnvironmentDto: CreateOnaEnvironmentDto) {
    return this.onaEnvironmentService.create(createOnaEnvironmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all ona-environment' })
  @ApiResponse({ status: 200, type: [CreateOnaEnvironmentDto] })
  findAll() {
    return this.onaEnvironmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an ona-environment by id' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.onaEnvironmentService.findOne(+id);
  }
}
