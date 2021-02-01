import { UserClass } from '../../usersClasses/usersClasses.entity';

export class PayloadUserDTO {
    id: number;
    email: string;
    name: string;
    userClasses: UserClass[];
}
