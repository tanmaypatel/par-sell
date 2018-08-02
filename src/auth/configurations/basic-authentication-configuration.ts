import { UsersRepository } from '../repositories/users.repository';
import { User } from '../models/user';
import { UserRole } from '../models/user-role';
import { UserRolesRepository } from '../repositories/user-roles.repository';
import { ICredentials } from '../models/credentials';
import { logger } from '../../logging/logger';

const validate = async (request: any, email: string, password: string, h: any) => {
    const isPasswordMatching: boolean = await UsersRepository.validatePassword(email, password);

    if (isPasswordMatching) {
        const matchedUser: User = await UsersRepository.retrieveByEmail(email);

        if (matchedUser.isActive) {
            const userRole: UserRole = await UserRolesRepository.retrieveByUserId(matchedUser.userId);

            const credentials: ICredentials = {
                userId: matchedUser.userId,
                profile: matchedUser,
                role: userRole.role
            };

            return {
                credentials: credentials,
                isValid: true
            };
        } else {

            logger.info(`Login attempt from inactive user with email ${email}`);

            return {
                credentials: null,
                isValid: false
            };
        }
    } else {

        logger.info(`Email or Password not matching for ${email}`);

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
