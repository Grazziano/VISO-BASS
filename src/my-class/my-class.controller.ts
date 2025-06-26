import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MyClassService } from './my-class.service';
import { CreateMyClassDto } from './dto/create-my-class.dto';
import { UpdateMyClassDto } from './dto/update-my-class.dto';

@Controller('my-class')
export class MyClassController {
  constructor(private readonly myClassService: MyClassService) {}

  @Post()
  create(@Body() createMyClassDto: CreateMyClassDto) {
    return this.myClassService.create(createMyClassDto);
  }

  @Get()
  findAll() {
    return this.myClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.myClassService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMyClassDto: UpdateMyClassDto) {
    return this.myClassService.update(+id, updateMyClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.myClassService.remove(+id);
  }
}
