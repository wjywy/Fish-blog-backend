import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { PassUser } from './dto/passUser.dto';
import { TokenVO } from './token.vo';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // 生成 token
  async certificate(user: User) {
    const payload = {
      id: user.password,
    };
    const token = this.jwtService.sign(payload);
    return token;
  }

  async vertify(passUser: PassUser) {
    const { password } = passUser;
    console.log(password, 'password');
    const pwd = await this.userRepository
      .createQueryBuilder('user')
      .where('user.password = :password', { password })
      .getOne();
    if (!pwd) {
      throw new NotFoundException({ info: '验证失败' });
    }
    console.log(pwd, 'pwd');
    const token = await this.certificate(pwd);
    if (pwd.password === password) {
      return { info: '验证成功', token: token };
    }
  }
}
