import { Inject, Injectable } from '@nestjs/common';
import { IfindOperator } from '../port/iFindOperator';
import { OrganizationUser } from '../model/organization-user.entity';
import { IOperatorRepository } from '../port/iOperatorRepository';
import { Organization } from '../model/organization.entity';
import { User } from 'src/domain/user/model/user.entity';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';

@Injectable()
export class FindOperator implements IfindOperator {
    constructor(
        @Inject(IOperatorRepository)
        private operatorRepository: IOperatorRepository,
        @Inject(IUserRepository)
        private readonly userRepository: IUserRepository
    ) { }

    async findByOrgAndUser(orgId: string, userId: string): Promise<OrganizationUser> {
        try {
            const aOrganization = new Organization();
            aOrganization.id = orgId;

            const aUser = new User();
            aUser.id = userId;
            return await this.operatorRepository.findByUserAndOrganization(aOrganization, aUser);
        } catch (error) {
            console.log("🚀 ~ file: findOperator.case.ts:24 ~ FindOperator ~ findByOrgAndUser ~ error:", error)

        }
    }

    async findByUserAndStatus(email: string, status: string): Promise<OrganizationUser[]> {
        try {
            if (!email) {
                throw new Error("Email de usuario requerido")
            }
            const user = await this.userRepository.findByEmail(email)

            if (!user) {
                throw new Error("Usuario no encontrado")
            }

            return await this.operatorRepository.findByUserEmailAndStatus(user, status);
        } catch (error) {
            console.log("🚀 ~ file: findOperator.case.ts:24 ~ FindOperator ~ findByOrgAndUser ~ error:", error)

        }

    }
}
