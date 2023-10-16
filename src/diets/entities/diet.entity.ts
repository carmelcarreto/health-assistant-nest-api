import { Column, DeleteDateColumn, Entity } from "typeorm";

@Entity()
export class Diet {

    @Column({primary: true, generated: true})
    id: number;
    
    @Column()
    name: string;

    @DeleteDateColumn()
    deleteAt: Date;
}
