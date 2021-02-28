import { PayloadUserDTO } from 'src/users/dto/payload-user.dto';

class UserResume {
    id: number;
    userId: number;
    listId: number;
    user: PayloadUserDTO;
}

export class ListResumeDTO {
    id: number;
    classId: number;
    title: string;
    expirationTime: string;
    createdAt: string;
    updatedAt: string;
    users: UserResume;
    questionsCount: number;
}
