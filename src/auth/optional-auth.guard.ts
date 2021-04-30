import { AuthGuard } from '@nestjs/passport';

export class OptionalAuthGuard extends AuthGuard() {
  handleRequest(err, user) {
    return user;
  }
}
