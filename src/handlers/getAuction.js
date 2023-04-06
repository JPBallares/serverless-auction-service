import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../../lib/commonMiddleware';

const db = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
  let auction = null;
  const { id } = event.pathParameters;
  try {
    const result = await db.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    }).promise();

    auction = result.Item;
  } catch (err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  }

  if (!auction) throw new createError.NotFound(
    `Auction with id ${id} is not found!`
  );

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);
