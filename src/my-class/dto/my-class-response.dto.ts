import { Expose } from 'class-transformer';

export class MyClassResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
