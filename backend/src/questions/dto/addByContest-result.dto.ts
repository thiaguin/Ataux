export class AddQuestionsByContestResult {
    resume: {
        SUCCESS: string[];
        ERROR: {
            questionId: string;
            error: {
                entity: string;
                type: string;
            };
        }[];
    };
    question?: {
        questionId: string;
        error?: {
            entity: string;
            type: string;
        };
    };
}
