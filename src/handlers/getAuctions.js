import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../../lib/commonMiddleware';

const db = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  let auctions = [];

  try {
    const result = await db.scan({
      TableName: process.env.AUCTIONS_TABLE_NAME,
    }).promise();

    auctions = result.Items;
  } catch (err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = commonMiddleware(getAuctions);
