import { Transform } from 'class-transformer';
import { IsMongoId } from 'class-validator';
import { trimString } from '../../common/utils/trimStringTransform.util';

export class IdParamDto {
  @Transform(trimString)
  @IsMongoId()
  id: string;
}
