export class CreateUserDTO {
    email: string;
    name: string;
    password?: string;
    handle?: string;
    registration?: string;
    role?: string;
    confirmed: boolean;
}
