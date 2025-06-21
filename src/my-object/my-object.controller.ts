import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MyObjectService } from './my-object.service';
import { CreateMyObjectDto } from './dto/create-my-object.dto';
import { UpdateMyObjectDto } from './dto/update-my-object.dto';

@Controller('my-object')
export class MyObjectController {
  constructor(private readonly myObjectService: MyObjectService) {}

  @Post()
  create(@Body() createMyObjectDto: CreateMyObjectDto) {
    return this.myObjectService.create(createMyObjectDto);
  }

  @Get()
  findAll() {
    return this.myObjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.myObjectService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMyObjectDto: UpdateMyObjectDto,
  ) {
    return this.myObjectService.update(+id, updateMyObjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.myObjectService.remove(+id);
  }
}
