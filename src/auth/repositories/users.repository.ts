import { omit, extend, map } from 'lodash';
import * as moment from 'moment';
import { Transaction, QueryBuilder } from 'knex';
import * as uuid from 'uuid/v4';

import { logger } from '../../logging/logger';
import { default as knex } from '../../repository/knex';
import { User } from '../models/user';
import { List } from 'immutable';
import { PasswordService } from '../services/password.service';

export class UsersRepository {
    static get TABLE_NAME(): string {
        return 'users';
    }

    static get DEFAULT_PAGE_SIZE(): number {
        return 10;
    }

    static async create(user: User, password: string, tx: Transaction = null): Promise<User> {
        try {
            if (user.userId) {
                throw new Error('User already has a userId');
            }

            user = user.merge({
                userId: uuid(),
                createdAt: moment.utc(),
                updatedAt: moment.utc()
            }) as User;

            const hashedPassword: string = await PasswordService.hashPassword(password);
            const serializedData: any = UsersRepository._serialize(user, hashedPassword);

            let queryBuilder: QueryBuilder = knex.insert(serializedData).into(UsersRepository.TABLE_NAME);

            if (tx) {
                queryBuilder = queryBuilder.transacting(tx);
            }

            await queryBuilder;
            return user;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    static async retrieveById(userId: string): Promise<User> {
        const users: User[] = await UsersRepository._retrieveByIds([userId]);
        return users.length ? users[0] : null;
    }

    static async retrieveByEmail(email: string): Promise<User> {
        const users: User[] = await UsersRepository._retrieveByEmails([email]);
        return users.length ? users[0] : null;
    }

    static async retrievePage(pageStart?: number, pageSize?: number): Promise<List<User>> {
        if (!pageStart) {
            pageStart = 0;
        }

        if (!pageSize) {
            pageSize = UsersRepository.DEFAULT_PAGE_SIZE;
        }

        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(UsersRepository.TABLE_NAME)
            .orderBy('updatedAt', 'desc')
            .offset(pageStart)
            .limit(pageSize);

        const rows: any[] = await queryBuilder;
        let users: User[] = [];

        if (rows.length) {
            users = map(rows, (currentRow: any) => {
                return UsersRepository._deserialize(currentRow);
            });
        }

        return List(users);
    }

    static async validatePassword(email: string, password: string): Promise<boolean> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(UsersRepository.TABLE_NAME)
            .where({
                email: email
            });

        const rows: any[] = await queryBuilder;

        if (rows.length) {
            const rawUserData: any = rows[0];
            return PasswordService.verifyPassword(rawUserData.password, password);
        }

        return false;
    }

    static _deserialize(userData: any): User {
        return new User(
            extend(omit(userData, 'password'), {
                isActive: userData.isActive ? true : false,
                createdAt: moment.utc(userData.createdAt),
                updatedAt: moment.utc(userData.updatedAt)
            })
        );
    }

    private static _serialize(user: User, hashedPassword: string): any {
        const serializedData: any = omit(user.toJS(), 'friends');

        extend(serializedData, {
            password: hashedPassword,
            createdAt: serializedData.createdAt ? serializedData.createdAt.toDate() : null,
            updatedAt: serializedData.updatedAt ? serializedData.updatedAt.toDate() : null
        });

        return serializedData;
    }

    private static async _retrieveByIds(userIds: string[]): Promise<User[]> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(UsersRepository.TABLE_NAME)
            .whereIn('userId', userIds);

        const rows: any[] = await queryBuilder;
        let users: User[] = [];

        if (rows.length) {
            users = map(rows, (currentRow: any) => {
                return UsersRepository._deserialize(currentRow);
            });
        }

        return users;
    }

    private static async _retrieveByEmails(emails: string[]): Promise<User[]> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(UsersRepository.TABLE_NAME)
            .whereIn('email', emails);

        const rows: any[] = await queryBuilder;
        let users: User[] = [];

        if (rows.length) {
            users = map(rows, (currentRow: any) => {
                return UsersRepository._deserialize(currentRow);
            });
        }

        return users;
    }
}
