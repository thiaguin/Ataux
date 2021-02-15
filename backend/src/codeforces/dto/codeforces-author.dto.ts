class CodeforcesMemberDTO {
    member: string;
}
export class CodeforcesAuthorDTO {
    contestId: string;
    members: CodeforcesMemberDTO[];
    participantType: string;
    ghost: boolean;
    startTimeSeconds: string;
    teamId: string;
    teamName: string;
    room: string;
}
