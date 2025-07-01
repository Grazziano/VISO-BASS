import { Expose, Transform } from 'class-transformer';

export class ResponseVisoObjectDto {
  @Expose()
  _id: string;

  @Expose()
  obj_macRede: string;

  @Expose()
  obj_name: string;

  @Expose()
  obj_status: number;

  @Expose()
  @Transform(({ value }) => (value as Date).toISOString())
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => (value as Date).toISOString())
  updatedAt: Date;
}
