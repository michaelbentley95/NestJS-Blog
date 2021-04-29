import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { UpdateUserDTO } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) { }

    async findByUserName(username: string): Promise<UserEntity> {
        return this.userRepo.findOne({ where: { username: username } });
    }

    async updateUser(username: string, data: UpdateUserDTO) {
        await this.userRepo.update({ username: username }, data);
        return this.findByUserName(username);
    }
}
