# 🔐 NestJS JWT Authentication - Complete Reference Guide

> A plug-and-play reference for implementing JWT authentication in NestJS projects.

---

## 📁 File Structure

```
src/auth/
├── dto/
│   ├── login.dto.ts          # Login request shape
│   └── register.dto.ts       # Register request shape
├── guards/
│   └── jwt-auth.guard.ts     # Route protector (gatekeeper)
├── strategies/
│   └── jwt.strategy.ts       # Token validator (worker)
├── auth.controller.ts        # Public endpoints (login/register)
├── auth.module.ts            # Wires everything together
└── auth.service.ts           # Business logic (create/verify tokens)
```

---

## 🔄 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AUTHENTICATION FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   REGISTER / LOGIN                                   │   │
│  │                  (auth.controller.ts)                               │   │
│  │                                                                     │   │
│  │   POST /auth/register  ──→  auth.service.register()                 │   │
│  │   POST /auth/login     ──→  auth.service.login()                    │   │
│  │                                      │                              │   │
│  │                                      ▼                              │   │
│  │                         ┌────────────────────────┐                  │   │
│  │                         │  jwtService.sign({     │                  │   │
│  │                         │    sub: user.id,       │                  │   │
│  │                         │    email: user.email   │                  │   │
│  │                         │  })                    │                  │   │
│  │                         └────────────────────────┘                  │   │
│  │                                      │                              │   │
│  │                                      ▼                              │   │
│  │                         { access_token: "eyJhbG..." }               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      │ Client stores token                  │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   PROTECTED REQUEST                                  │   │
│  │                                                                     │   │
│  │   GET /user  +  Header: "Authorization: Bearer eyJhbG..."           │   │
│  │                                      │                              │   │
│  │                                      ▼                              │   │
│  │              ┌──────────────────────────────────────┐               │   │
│  │              │      JwtAuthGuard                    │               │   │
│  │              │   (jwt-auth.guard.ts)                │               │   │
│  │              │                                      │               │   │
│  │              │  "Is there a valid token?"           │               │   │
│  │              │         │                            │               │   │
│  │              │         │ Uses strategy name 'jwt'   │               │   │
│  │              │         ▼                            │               │   │
│  │              │  ┌──────────────────────────────┐   │               │   │
│  │              │  │      JwtStrategy              │   │               │   │
│  │              │  │   (jwt.strategy.ts)           │   │               │   │
│  │              │  │                               │   │               │   │
│  │              │  │  1. Extract token from header │   │               │   │
│  │              │  │  2. Verify with JWT_SECRET    │   │               │   │
│  │              │  │  3. Check expiration          │   │               │   │
│  │              │  │  4. Call validate(payload)    │   │               │   │
│  │              │  │  5. Return user data          │   │               │   │
│  │              │  └──────────────────────────────┘   │               │   │
│  │              │                   │                  │               │   │
│  │              └───────────────────┼──────────────────┘               │   │
│  │                         ┌────────┴────────┐                         │   │
│  │                         │                 │                         │   │
│  │                    Valid ✅           Invalid ❌                    │   │
│  │                         │                 │                         │   │
│  │                         ▼                 ▼                         │   │
│  │               ┌─────────────────┐  ┌─────────────────┐              │   │
│  │               │   Controller    │  │ 401 Unauthorized│              │   │
│  │               │   request.user  │  │ Request blocked │              │   │
│  │               │   = { userId,   │  └─────────────────┘              │   │
│  │               │      email }    │                                   │   │
│  │               └─────────────────┘                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Quick Setup Checklist

### Step 1: Install Packages

```bash
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
pnpm add -D @types/passport-jwt @types/bcrypt
```

### Step 2: Environment Variables

Add to `.env`:
```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=7d
```

### Step 3: Import ConfigModule in AppModule

```typescript
// app.module.ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // ... other modules
  ],
})
export class AppModule {}
```

---

## 📄 File Templates

### auth.module.ts

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION') as any,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

### auth.service.ts

```typescript
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.userService.create({
      email: registerDto.email,
      password: hashedPassword,
      name: registerDto.name,
    });

    // Generate token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { access_token: token };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return { access_token: token };
  }
}
```

### jwt.strategy.ts

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || '',
    });
  }

  async validate(payload: JwtPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}
```

### jwt-auth.guard.ts

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### login.dto.ts

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}
```

### register.dto.ts

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  name?: string;
}
```

### auth.controller.ts

```typescript
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

---

## 🛡️ Using the Guard

### Protect entire controller

```typescript
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  // All routes protected
}
```

### Protect single route

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
getProfile() {
  // Only this route protected
}
```

### Access current user in controller

```typescript
import { Request } from '@nestjs/common';

@Get('me')
@UseGuards(JwtAuthGuard)
getMe(@Request() req) {
  // req.user contains { userId, email } from validate()
  return req.user;
}
```

---

## 🔑 Key Concepts

| Concept | Explanation |
|---------|-------------|
| **JWT (JSON Web Token)** | Encoded token containing user data, signed with secret |
| **Strategy** | Defines HOW to validate a token |
| **Guard** | Decides IF a route can be accessed |
| **Payload** | Data encoded in the token (sub, email, etc.) |
| **Bearer Token** | Token sent in `Authorization: Bearer <token>` header |

---

## 🔧 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `secretOrKey undefined` | Add fallback: `secretOrKey: configService.get('JWT_SECRET') \|\| ''` |
| `expiresIn` type error | Cast to any: `configService.get('JWT_EXPIRATION') as any` |
| Strategy not found | Ensure JwtStrategy is in providers array of AuthModule |
| ConfigService undefined | Import ConfigModule in AuthModule's JwtModule.registerAsync |

---

## 📚 Dependencies

```json
{
  "dependencies": {
    "@nestjs/jwt": "^11.x",
    "@nestjs/passport": "^11.x",
    "passport": "^0.7.x",
    "passport-jwt": "^4.x",
    "bcrypt": "^6.x"
  },
  "devDependencies": {
    "@types/passport-jwt": "^4.x",
    "@types/bcrypt": "^6.x"
  }
}
```

---

*Created as reference guide for CourseBuilder project - December 2024*
