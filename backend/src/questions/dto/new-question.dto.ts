import { QuestionLevel } from 'src/enums/questionLevel.enum';

export class NewQuestionDTO {
    url: string;
    contestId: string;
    problemId: string;
    level: QuestionLevel;
    title: string;
    tags: string[];
}
