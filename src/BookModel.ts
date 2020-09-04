import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export default class Book {

	@ObjectIdColumn()
	id: string;

	@Column()
	author: string;

	@Column()
	title: string;

	@Column()
	stock: number;
}
