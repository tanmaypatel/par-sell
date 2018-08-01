import { hash, verify } from 'argon2';

export class PasswordService {
    static async hashPassword(password: string): Promise<string> {
        const hashedPassword: string = await hash(password);
        return hashedPassword;
    }

    static async verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
        return await verify(hashedPassword, password);
    }
}
