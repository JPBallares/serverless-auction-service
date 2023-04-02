import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = JSON.parse(event.body); // get the title from the data

  // create an auction object
  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: Date.now()
  };

  // store it in the database
  await db.put({
    TableName: 'AuctionsTable',
    Item: auction,
  }).promise(); // use promises (async/await) instead of default callbacks

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = createAuction;
