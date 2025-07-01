import { Expose } from 'class-transformer';

export class VisoClassResponseDto {
  @Expose()
  id: string;

  @Expose()
  class_name: string;

  @Expose()
  class_function: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
