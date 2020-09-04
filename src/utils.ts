import * as Kafka from 'node-rdkafka';
import { getMongoManager } from 'typeorm';

import Book from './BookModel';

export const setupKafkaConsumer = () => {
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
