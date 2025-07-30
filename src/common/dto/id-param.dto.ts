import { Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { trimString } from '../../common/utils/trimStringTransform.util';
import { ApiProperty } from '@nestjs/swagger';

export class IdParamDto {
  @ApiProperty({
    description: 'The ID of the task',
    example: '66a6a6a6a6a6a6a6a6a6a6a6',
  })
  @Transform(trimString)
  @IsMongoId()
  id: string;
}
