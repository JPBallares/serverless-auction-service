import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import createError from 'http-errors';

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

export const handler = middy(getAuction)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
