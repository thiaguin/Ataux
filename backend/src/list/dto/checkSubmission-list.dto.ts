import { PayloadUserDTO } from 'src/users/dto/payload-user.dto';

export class CheckSubmissionListDTO {
    questions: number[];
    user?: PayloadUserDTO;
}
