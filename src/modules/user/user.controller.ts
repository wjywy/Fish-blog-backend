import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PassUser } from './dto/passUser.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('vertify')
  vertify(@Query() passUser: PassUser) {
    console.log(passUser, 'passuser');
    return this.userService.vertify(passUser);
  }
}
