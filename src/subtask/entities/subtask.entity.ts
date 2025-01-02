/* eslint-disable prettier/prettier */
import { Task } from "src/task/entities/task.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subtask {

    @PrimaryGeneratedColumn()
    int_subtask_id: number;

    @Column()
    str_subtask_title: string;

    @Column()
    bln_subtask_completed: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dt_subtask_created_at: Date;

    @ManyToOne( () => Task, (task) => task.subtasks, { onDelete: 'CASCADE' })
    task: Task;
}
