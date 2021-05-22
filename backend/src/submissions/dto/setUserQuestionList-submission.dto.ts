import { CodeforcesSubmissionDTO } from 'src/codeforces/dto/codeforces-submission.dto';

export class SetUserQuestionListSubmission {
    questionId: number;
    userListId: number;
    submission: CodeforcesSubmissionDTO;
    userId: number;
    listId: number;
    penalty: number;
    createdTime: Date;
}
