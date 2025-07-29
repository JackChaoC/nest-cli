import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';


@Injectable()
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(username: string) {
    // 在头部设置jwt
    const user = await this.userService.findByName(username);

    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles.map((role) => role.name),
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  signup(username: string, password: string) {
    return this.userService.create({ username, password });
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findByName(username);
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
