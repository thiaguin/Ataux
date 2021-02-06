import { QuestionLevel } from 'src/enums/questionLevel.enum';

export class QueryQuestionDTO {
    id?: number;
    title?: string;
    url?: string;
    level?: QuestionLevel;
    contestId?: string;
    problemId?: string;
}
