import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Faq {
    @Column({ name: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'question' })
    question: string;

    @Column({ name: 'answer' })
    answer: string;

    @Column({name: 'button_route', nullable: true})
    button_route: string;
}
