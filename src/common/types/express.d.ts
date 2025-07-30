import { User } from '../../auth/schemas/user.schema';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
