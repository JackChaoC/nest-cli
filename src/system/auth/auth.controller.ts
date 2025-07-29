import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleEnum } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SkipJwt } from 'src/common/decorators/skip-jwt.decorator';
import { LoginDto } from './dto/login.dto.ts';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipJwt()
  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signin(@Body() dto: LoginDto) {
    const { username, password } = dto;
    return this.authService.signin(username);
  }

  @Post('/signup')
  signup(@Body() dto: any) {
    const { username, password } = dto;
    return this.authService.signup(username, password);
  }

  // @SkipJwt()
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  @Roles(RoleEnum.User)
  @Post('/test')
  test(@Body() dto: any) {
    return 'test success';
  }
}
