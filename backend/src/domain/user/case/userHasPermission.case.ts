import { Inject, Injectable } from '@nestjs/common';
// import { User } from '../model/user.entity';
import { Query } from "accesscontrol";
import ac from 'src/util/roleAccess/grantRoleAccess';
import { iUserHasPermission } from '../port/iUserHasPermission';
import { IUserRepository } from '../port/iUserRepository';

@Injectable()
export class UserHasPermission implements iUserHasPermission {
    constructor(
        @Inject(IUserRepository)
        private readonly userRepository: IUserRepository
    ) { }

    async grantAccess(userEmail: string, action: string, resource: string | Query): Promise<boolean> {

        const aUserEntity = await this.userRepository.findByEmail(userEmail);

        const somePermissions = aUserEntity.roles.map((aUserRole: any) => {
            const permission = ac
                .can(aUserRole.name)
            [action as keyof Query](resource as string);
            return permission;
        });

        const granted = somePermissions.some(
            (permission: any) => permission.granted
        );

        if (!granted) {
            throw new Error(
                "No cuenta con permisos para ejecutar esta acción",
            );
        }
        return granted;
    }

}