import { createConnection, Connection, getMongoManager } from 'typeorm';
import * as http from 'http';
import * as Kafka from 'node-rdkafka';

import Book from './models/Book';

const main = async () => {
	const connection: Connection = await createConnection();
	console.log('🥭  Node Consumer connected to Mongo');

	const server = http.createServer();
	await server.listen(5000);
	console.log('🚀  Node Consumer server has started!');

	var consumer = new Kafka.KafkaConsumer({
		'group.id': 'epsor',
		'metadata.broker.list': 'localhost:9092',
	}, {});
	consumer.connect();

	consumer
		.on('ready', function() {
			consumer.subscribe(['quickstart-events']);
			consumer.consume();
		})
		.on('data', async function(data) {
			const bookData = data && data.value && JSON.parse(data.value.toString());

			const manager = getMongoManager();

			const book = new Book();
			book.title = bookData.title;
			book.author = bookData.author;
			book.stock = bookData.stock;
			await manager.save(book);

			console.log('BOOK HAS BEEN SAVED TO MONGO');
			console.log(book);
		})
}

main();
