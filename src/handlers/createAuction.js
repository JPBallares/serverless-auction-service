import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../../lib/commonMiddleware';

const db = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const { title } = event.body;

  // create an auction object
  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: Date.now(),
    highestBid: {
      amount: 0,
    },
  };

  // store it in the database
  try {
    await db.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  } catch (err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(createAuction);
