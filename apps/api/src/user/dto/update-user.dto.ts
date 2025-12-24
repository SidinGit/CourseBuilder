import { PartialType } from '@nestjs/swagger';  // Changed from mapped-types for Swagger support
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { }
