import { DynamoDB } from "aws-sdk"
import { v4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  REGION,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY,
  SESSION_TOKEN,
  DYNAMO_DB_PRODUCTS,
  DYNAMO_DB_STOCKS
} = process.env;

const products = [1, 2, 3].map(() => ({
    id: v4(),
    description: 'Product from script',
    price: Math.ceil(Math.random() * 100),
    title: `Product ${Math.ceil(Math.random() * 1000)}`
  })
)

const productsInStock = products.map((product) => ({
  product_id: product.id,
  count: Math.ceil(Math.random() * 10)
}))

const db = new DynamoDB.DocumentClient({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    sessionToken: SESSION_TOKEN,
    secretAccessKey: SECRET_ACCESS_KEY,
  }
});

const newProducts = products.map((product) => {
  const { id, title, description, price } = product;
  return {
    PutRequest: {
      Item: {
        id,
        title,
        description,
        price
      }
    }
  };
});

const newProductsInStock = productsInStock.map((product) => {
  const { product_id, count } = product;
  return {
    PutRequest: {
      Item: {
        product_id,
        count
      }
    }
  }
})

const params = {
  RequestItems: {
    [DYNAMO_DB_PRODUCTS]: [...newProducts],
    [DYNAMO_DB_STOCKS]: [...newProductsInStock]
  }
};

const autoFillScript = async () => {
  await db.batchWrite(params).promise();
}

autoFillScript().then(() => console.log('Tables successfully filled with test examples'));