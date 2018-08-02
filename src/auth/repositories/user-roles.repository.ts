import { extend, map } from 'lodash';
import * as moment from 'moment';
import { QueryBuilder, Transaction } from 'knex';

import { logger } from '../../logging/logger';
import { default as knex } from '../../repository/knex';
import { UserRole } from '../models/user-role';
import { User } from '../models/user';
import { Role } from '../models/role';

export class UserRolesRepository {
    static get TABLE_NAME(): string {
        return 'user_role';
    }

    static async create(user: User, role: Role, tx: Transaction = null): Promise<UserRole> {
        try {

            const userRole: UserRole = new UserRole({
                userId: user.userId,
                role: role,
                createdAt: moment.utc(),
                updatedAt: moment.utc()
            });

            const serializedData: any = UserRolesRepository._serialize(userRole);

            let queryBuilder: QueryBuilder = knex.insert(serializedData)
                .into(UserRolesRepository.TABLE_NAME);

            if (tx) {
                queryBuilder = queryBuilder.transacting(tx);
            }

            await queryBuilder;
            return userRole;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }

    static async retrieveByUserId(userId: string): Promise<UserRole> {
        const users: UserRole[] = await UserRolesRepository._retrieveByUserIds([userId]);
        return users.length ? users[0] : null;
    }

    private static _serialize(userRole: UserRole): any {
        const serializedData: any = userRole.toJS();

        extend(serializedData, {
            createdAt: serializedData.createdAt ? serializedData.createdAt.toDate() : null,
            updatedAt: serializedData.updatedAt ? serializedData.updatedAt.toDate() : null
        });

        return serializedData;
    }

    private static _deserialize(userRoleData: any): UserRole {
        return new UserRole(
            extend(userRoleData, {
                createdAt: moment.utc(userRoleData.createdAt),
                updatedAt: moment.utc(userRoleData.updatedAt)
            })
        );
    }

    private static async _retrieveByUserIds(userIds: string[]): Promise<UserRole[]> {
        const queryBuilder: QueryBuilder = knex
            .select('*')
            .from(UserRolesRepository.TABLE_NAME)
            .whereIn('userId', userIds);

        const rows: any[] = await queryBuilder;
        let userRoles: UserRole[] = [];

        if (rows.length) {
            userRoles = map(rows, (currentRow: any) => {
                return UserRolesRepository._deserialize(currentRow);
            });
        }

        return userRoles;
    }
}
