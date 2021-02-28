import { CodeforcesContestDTO } from './codeforces-contest.dto';
import { CodeforcesProblemDTO } from './codeforces-problem.dto';

export class CodeforcesSubmissionDTO {
    id: string;
    contestId: string;
    creationTimeSeconds: string;
    relativeTimeSeconds: string;
    problem: CodeforcesProblemDTO;
    author: CodeforcesContestDTO;
    programmingLanguage: string;
    verdict: string;
    testset: string;
    passedTestCount: string;
    timeConsumedMillis: string;
    memoryConsumedBytes: string;
    points: string;
}
