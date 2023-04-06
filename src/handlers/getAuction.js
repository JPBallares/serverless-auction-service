import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../../lib/commonMiddleware';

const db = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  try {
    const result = await db.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    }).promise();

    return result.Item;
  } catch (err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  }
}

async function getAuction(event, context) {
  const { id } = event.pathParameters;

  const auction = await getAuctionById(id);

  if (!auction) throw new createError.NotFound(
    `Auction with id ${id} is not found!`
  );

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);
