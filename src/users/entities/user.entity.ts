/* eslint-disable prettier/prettier */
import { List } from "src/lists/entities/list.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    int_user_id: number;

    @Column({unique: true})
    str_user_username: string;

    @Column({unique: true})
    str_user_email: string;

    @Column()
    str_user_password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dt_user_created_at: Date;

    @OneToMany( () => List, (list) => list.user )
    lists: List[];
}
