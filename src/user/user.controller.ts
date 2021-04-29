import { Put, ValidationPipe } from '@nestjs/common';
import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.decorator';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    @UseGuards(AuthGuard())
    async getCurrentUser(@User() user: UserEntity) {
        return await this.userService.findByUserName(user.username);
    }

    @Put()
    @UseGuards(AuthGuard())
    async update(@User() user: UserEntity, @Body(new ValidationPipe({ transform: true, whitelist: true })) data: UpdateUserDTO) {
        return await this.userService.updateUser(user.username, data);
    }
}
