import { UserRole } from 'src/enums/userRole.enum';

export class CreateUserClassDTO {
  role: UserRole;
  classId: number;
  userId: number;
}
