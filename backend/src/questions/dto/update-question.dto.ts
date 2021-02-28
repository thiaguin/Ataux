import { QuestionLevel } from 'src/enums/questionLevel.enum';

export class UpdateQuestionDTO {
    title?: string;
    url?: string;
    listId?: number;
    level?: QuestionLevel;
}
