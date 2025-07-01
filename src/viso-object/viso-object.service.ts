import { Injectable } from '@nestjs/common';
import { CreateVisoObjectDto } from './dto/create-viso-object.dto';
import { UpdateVisoObjectDto } from './dto/update-viso-object.dto';

@Injectable()
export class VisoObjectService {
  create(createVisoObjectDto: CreateVisoObjectDto) {
    return 'This action adds a new visoObject';
  }

  findAll() {
    return `This action returns all visoObject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} visoObject`;
  }

  update(id: number, updateVisoObjectDto: UpdateVisoObjectDto) {
    return `This action updates a #${id} visoObject`;
  }

  remove(id: number) {
    return `This action removes a #${id} visoObject`;
  }
}
