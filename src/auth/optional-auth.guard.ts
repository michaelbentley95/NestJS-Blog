import { AuthGuard } from '@nestjs/passport';

export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    return user;
  }
}
