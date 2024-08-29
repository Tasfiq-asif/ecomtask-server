const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.onhj8vc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const productCollection = client.db('JobTask').collection('products');

    // Save product
    app.post('/products', async (req, res) => {
      const product = req.body;
      try {
        const result = await productCollection.insertOne(product);
        res.send(result);
      } catch (err) {
        console.log("Error inserting product", err);
        res.status(500).send("Error inserting product");
      }
    });

    // Fetch all products
    app.get('/allproducts', async (req, res) => {  // Corrected the route path
      try {
        const result = await productCollection.find().toArray();  // Corrected the collection reference
        res.send(result);
        console.log(result);
      } catch (err) {
        console.log("Error fetching products", err);  // Corrected the error message
        res.status(500).send("Error fetching products");
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  } finally {
    // Optionally close the client connection if needed
    // await client.close();
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
