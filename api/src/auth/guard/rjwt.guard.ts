import { AuthGuard } from '@nestjs/passport';

export class RjwtGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
