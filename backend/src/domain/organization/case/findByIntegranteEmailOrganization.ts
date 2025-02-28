import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { Organization } from '../model/organization.entity';
import { IFindByIntegranteEmailOrganization } from '../port/iFindByIntegranteEmailOrganization';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { IOperatorRepository } from '../port/iOperatorRepository';

@Injectable()
export class FindByIntegranteEmailOrganization implements IFindByIntegranteEmailOrganization {
    constructor(
        @Inject(IOrganizationRepository)
        private readonly organizacionRepository: IOrganizationRepository,
        @Inject(IUserRepository)
        private readonly userRepository: IUserRepository,
        @Inject(IOperatorRepository)
        private operatorRepository: IOperatorRepository,
    ) { }

    async findByIntegranteEmail(email: string): Promise<Organization[]> {
        try {
            if (!email) {
                throw new Error("Email de usuario requerido")
            }
            const user = await this.userRepository.findByEmail(email)

            if (!user) {
                throw new Error("Usuario no encontrado")
            }

            let organizations = ((await this.operatorRepository.findByUserEmailAndStatus(user, "ACCEPTED")).map((aOperator) => aOperator.organization));
            organizations = organizations.concat(await this.organizacionRepository.findByOwner(user.id));

            // organizations = organizations.filter((org) => org !== null)

            const idsUnicos = new Set();

            organizations = organizations.filter(objeto => {
                if (!idsUnicos.has(objeto.id)) {
                    idsUnicos.add(objeto.id);
                    return true;
                }
                return false;
            });

            return organizations;
        } catch (error) {
            console.log("🚀 ~ file: findByIntegranteEmailOrganization.ts:23 ~ FindByIntegranteEmailOrganization ~ findByIntegranteEmail ~ error:", error)

        }

    }
}
