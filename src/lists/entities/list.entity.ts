/* eslint-disable prettier/prettier */

import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class List {

    @PrimaryGeneratedColumn()
    int_list_id: number;

    @Column()
    str_list_name: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dt_list_created_at: Date;

    @ManyToOne( () => User, (user) => user.lists, { onDelete: 'CASCADE' })
    user: User;

}
