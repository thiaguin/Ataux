import { Question } from '../questions.entity';

export class FindAllQuestionDTO {
    data: Question[];
    count: number;
}
