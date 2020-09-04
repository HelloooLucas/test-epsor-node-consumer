import { createConnection, Connection } from 'typeorm';
import * as http from 'http';

import { setupKafkaConsumer } from './utils';

const main = async () => {
	const connection: Connection = await createConnection();
	console.log('🥭  Node Consumer connected to Mongo');

	const server = http.createServer();
	await server.listen(5000);
	console.log('🚀  Node Consumer server has started!');

	setupKafkaConsumer();
}

main();
