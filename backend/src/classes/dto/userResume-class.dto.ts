import { PayloadUserDTO } from 'src/users/dto/payload-user.dto';
import { User } from 'src/users/users.entity';
import { QuestionResumeClass } from './questionResume-class.dto';

export class UserResumeClass {
    user?: User;
    questions?: QuestionResumeClass;
}
