import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    email: string;

    @ApiProperty({ example: 'securePassword123', description: 'User password' })
    password: string;

    @ApiPropertyOptional({ example: 'John Doe', description: 'User display name' })
    name?: string;
}
