async function createAuction(event, context) {
  const { title } = JSON.parse(event.body); // get the title from the data

  // create an auction object
  const auction = {
    title,
    status: 'OPEN',
    createdAt: Date.now()
  };

  return {
    statusCode: 201,
    body: JSON.stringify({ auction }),
  };
}

export const handler = createAuction;
