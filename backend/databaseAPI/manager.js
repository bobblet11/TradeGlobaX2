
import { MongoClient, ServerApiVersion } from 'mongodb';

const USER = "root"
const PASSWORD = "jBsSDLrf3WrUWZU9"
const DB_NAME = "tradeGlobaX"
const uri = "mongodb+srv://"+USER+":"+PASSWORD+"@cluster0.mpisr9t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


export async function connectDB(){
    let db = null
    try {
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        db = client.db(DB_NAME);
        console.log('Connected to ' + DB_NAME + ' db.');
        return db
    }catch(error){
        console.log('Database connection failed:', err)
        return db
    }
}

export async function getPriceInstance(db, symbol, count){
  // Replace with your collection name
  const collection = db.collection('coin');

  let n = parseInt(count)
  if (n === 1){
    console.log(`Getting latest priceInstance`)
  }else{
    console.log(`Getting latest ${n} priceInstances`)
  }
  const coin = await collection.findOne(
    { symbol: symbol }, // Assuming 'id' is the coin symbol
    { projection: { priceInstances: { $slice: -n } } } // Get the last n price instances
  );

  if (!coin || !coin.priceInstances || coin.priceInstances.length === 0) {
    throw new Error({message: "No price instances found for this coin."});
  }
  
  const latestPriceInstances = coin.priceInstances.reverse();
  console.log(`found ${coin.priceInstances.length} priceInstances`)
  return latestPriceInstances
}



export async function getCoinMetadata(db, symbol){
  // Replace with your collection name
  const collection = db.collection('coin');

  const coin = await collection.findOne(
    { symbol: symbol }, // Assuming 'symbol' is the coin symbol
    { projection: { priceInstances: 0 } } // Exclude priceInstances from the result
  );

  if (!coin) {
    throw new Error({message: "No coin found."});
  }
  console.log(`coin found ${coin}`);
  return coin
}
  
  


export async function insertCoin(db, coinMetadata){
  // Replace with your collection name
  const collection = db.collection('coin');

  //check if coin exists
  const existingCoin = await collection.findOne({ symbol: coinMetadata.symbol });
  if (existingCoin) {
      console.log(`Coin with symbol ${coinMetadata.symbol} already exists.`);
      throw new Error(`Coin with symbol ${coinMetadata.symbol} already exists.`);
  }

  // Insert the document
  const result = await collection.insertOne(coinMetadata);
  console.log(`New document created with the following id: ${result.insertedId}`);
}




export async function insertPriceInstance(db, coinPriceInstance){
  // Replace with your collection name
  const collection = db.collection('coin');

  const existingTimestamp = await collection.findOne({
    symbol: coinPriceInstance.symbol, // Ensure you are looking for the correct coin
    'priceInstances.timestamp': coinPriceInstance.timestamp // Use dot notation without spaces
  });

  if (existingTimestamp){
    console.log(`Price instance with timestamp ${coinPriceInstance.timestamp} already exists for coin ${coinPriceInstance.symbol}.`);
    throw new Error(`Price instance with timestamp ${coinPriceInstance.timestamp} already exists for coin ${coinPriceInstance.symbol}.`);
  }

  // Update the coin document by pushing a new price entry
  const result = await collection.updateOne(
    { symbol: coinPriceInstance.symbol }, // Find the coin by symbol
    { $push: { priceInstances: coinPriceInstance } } // Push new price data into priceInstances array
  );


  if (result.modifiedCount === 0) {
      throw new Error(`Coin with symbol ${ coinPriceInstance.symbol} not found.`);
  }

  console.log(`priceInstance data inserted into coin with symbol ${ coinPriceInstance.symbol}.`);
}




