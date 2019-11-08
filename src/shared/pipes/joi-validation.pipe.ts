import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: any) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
