import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { CodeforcesContestDTO } from './dto/codeforces-contest.dto';
import { CodeforcesProblemDTO } from './dto/codeforces-problem.dto';

@Injectable()
export class CodeforcesService {
    private httpService: HttpService;
    private BASE_URL: string;

    constructor() {
        this.httpService = new HttpService();
        this.BASE_URL = 'https://codeforces.com/api/';
    }

    getProblem(contest: CodeforcesContestDTO, problemId: string): CodeforcesProblemDTO {
        for (const problem of contest?.problems) {
            if (problem.index === problemId) {
                return problem;
            }
        }

        throw new HttpException('NotFound', 404);
    }

    async getContest(contestId: string): Promise<CodeforcesContestDTO> {
        try {
            const url = `${this.BASE_URL}/contest.standings`;
            const query = {
                params: {
                    contestId: contestId,
                    from: 1,
                    count: 1,
                },
            };

            const response = await this.httpService.get(url, query).toPromise();
            return response.data.result;
        } catch (error) {
            const comment = error?.response?.data?.comment;
            const statusError = comment && comment.includes('not found') ? 404 : 400;
            const messageError = statusError === 404 ? 'NotFound' : 'BadRequest';

            throw new HttpException(messageError, statusError);
        }
    }
}
