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

        throw new HttpException('NOT_FOUND', 404);
    }

    async getContest(contestId: string, count = 3): Promise<CodeforcesContestDTO> {
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
            if (error.response.status === 429 && count > 0) {
                return this.getContest(contestId, count - 1);
            }
            const comment = error?.response?.data?.comment;
            const statusError = comment && comment.includes('not found') ? 404 : 400;
            const messageError = statusError === 404 ? 'NOT_FOUND' : 'BAD_REQUEST';

            throw new HttpException(messageError, statusError);
        }
    }

    async getSubmissions(handle: string, contestId: string, count = 3) {
        try {
            const url = `${this.BASE_URL}/contest.status`;
            const query = { params: { contestId, handle } };
            const response = await this.httpService.get(url, query).toPromise();
            return response.data.result;
        } catch (error) {
            if (error.response.status === 429 && count > 0) {
                return this.getSubmissions(handle, contestId, count - 1);
            }
            throw new HttpException('BAD_REQUEST', 400);
        }
    }

    async getUser(handle: string, count = 3) {
        try {
            const url = `${this.BASE_URL}/user.info `;
            const query = { params: { handles: handle } };
            const response = await this.httpService.get(url, query).toPromise();
            const [result] = response.data.result;
            return result;
        } catch (error) {
            if (error.response.status === 429 && count > 0) {
                return this.getUser(handle, count - 1);
            }
            throw new HttpException('NOT_FOUND', 404);
        }
    }
}
