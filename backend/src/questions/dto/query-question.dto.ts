import { QuestionLevel } from 'src/enums/questionLevel.enum';

export class QueryQuestionDTO {
    title?: string;
    url?: string;
    listId?: number;
    level?: QuestionLevel;
}
