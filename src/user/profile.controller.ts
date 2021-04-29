import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('profiles')
export class ProfileController {
    constructor(private userService: UserService) { }

    @Get('/:username')
    async findProfile(@Param('username') username: string) {
        const user = await this.userService.findByUserName(username);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }
}
