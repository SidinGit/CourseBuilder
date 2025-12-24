import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    email: string;
    
    @ApiProperty({ example: 'password123' })
    password: string;
    
    @ApiPropertyOptional({ example: 'John Doe' })  // For optional fields
    name?: string;
}