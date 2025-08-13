import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VisoObjectService } from './viso-object.service';
import { CreateVisoObjectDto } from './dto/create-viso-object.dto';
import { UpdateVisoObjectDto } from './dto/update-viso-object.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('object')
export class VisoObjectController {
  constructor(private readonly visoObjectService: VisoObjectService) {}

  @Post()
  create(@Body() createVisoObjectDto: CreateVisoObjectDto) {
    return this.visoObjectService.create(createVisoObjectDto);
  }

  @Get()
  findAll() {
    return this.visoObjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visoObjectService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVisoObjectDto: UpdateVisoObjectDto,
  ) {
    return this.visoObjectService.update(+id, updateVisoObjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visoObjectService.remove(+id);
  }
}
