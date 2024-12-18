/* eslint-disable prettier/prettier */

import { List } from "src/lists/entities/list.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    int_task_id: number;

    @Column()
    str_task_title: string;

    @Column({ nullable: true })
    str_task_description: string;

    @Column({ nullable: true, type: 'timestamp' })
    dt_task_due_date: Date;

    @Column({ default: false })
    bl_task_completed: boolean;

    @Column({ default: 3})
    int_task_priority: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dt_task_created_at: Date;

    @ManyToOne( () => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne( () => List, (list) => list.tasks, { onDelete: 'CASCADE' })
    list: List;

    @OneToMany( () => Subtask, (subtask) => subtask.task )
    subtasks: Subtask[];

}
