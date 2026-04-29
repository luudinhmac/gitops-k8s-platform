import { ApiProperty } from '@nestjs/swagger';

export class Tag {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  slug?: string;
}
