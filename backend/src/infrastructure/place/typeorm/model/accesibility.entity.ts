import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'accessibilities' })
export class Accessibility {
    @Column({ name: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;
}