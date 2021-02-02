import { QuestionLevel } from 'src/enums/questionLevel.enum';

export class CreateQuestionDTO {
    title: string;
    url: string;
    listId: number;
    level: QuestionLevel;
    tags: number[];
}
