import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { LoginDTO, RegisterDTO } from 'src/models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>, private jwtService: JwtService) { }

    async register(credentials: RegisterDTO) {
        try {
            const user = this.userRepo.create(credentials);
            await user.save();
            const payload = { username: user.username };
            const token = this.jwtService.sign(payload);
            return { user: { ...user.toJSON(), token } };
        }
        catch (err) {
            if (err.code === '23505') {
                throw new ConflictException('Username/Email has already been taken');
            }
            throw new InternalServerErrorException();
        }
    }

    async login(credentials: LoginDTO) {
        try {
            const user = await this.userRepo.findOne({ where: { email: credentials.email } });
            if (user && (await user.comparePassword(credentials.password))) {
                const payload = { username: user.username };
                const token = this.jwtService.sign(payload);
                return { user: { ...user.toJSON(), token } };
            }
            throw new Error();
        }
        catch (err) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
