import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../../lib/commonMiddleware';
import { getAuctionById } from './getAuction';

const db = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;
  const auction = await getAuctionById(id);

  if (!auction) throw new createError.NotFound(
    `Auction with id ${id} is not found!`
  );

  if (auction.highestBid?.amount >= amount) throw new createError.Forbidden(
    `Your bid must be higher than ${auction.highestBid?.amount}`
  );

  let updatedAuction = {};

  try {
    const result = await db.update({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
      UpdateExpression: 'set highestBid.amount = :amount',
      ExpressionAttributeValues: {
        ':amount': amount,
      },
      ReturnValues: 'ALL_NEW',
    }).promise();

    updatedAuction = result.Attributes;
  } catch (err) {
    console.log(err);
    throw new createError.InternalServerError(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid);
