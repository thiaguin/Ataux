import { CodeforcesSubmissionDTO } from 'src/codeforces/dto/codeforces-submission.dto';

export class CheckSubmissionQuestionDTO {
    handle: string;
    listQuestionId: number;
    listId: number;
    questionId: number;
    submissions?: CodeforcesSubmissionDTO[];
    userId: number;
    limitTime: string;
}
