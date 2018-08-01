import { UsersRepository } from '../repositories/users.repository';
import { User } from '../models/user';
import { UserRole } from '../models/user-role';
import { UserRolesRepository } from '../repositories/user-roles.repository';

const validate = async (request: any, email: string, password: string, h: any) => {
    const isPasswordMatching: boolean = await UsersRepository.validatePassword(email, password);

    if (isPasswordMatching) {
        const matchedUser: User = await UsersRepository.retrieveByEmail(email);

        if (matchedUser.isActive) {
            const userRole: UserRole = await UserRolesRepository.retrieveByUserId(matchedUser.userId);

            return {
                credentials: {
                    userId: matchedUser.userId,
                    profile: matchedUser,
                    role: userRole.role
                },
                isValid: true
            };
        } else {
            return {
                credentials: null,
                isValid: false
            };
        }
    } else {
        return {
            credentials: null,
            isValid: false
        };
    }
};

const basicAuthenticationConfiguration: any = {
    validate: validate
};

export { basicAuthenticationConfiguration };
