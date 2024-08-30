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
    app.get('/allproducts', async (req, res) => {

      const {page=1,limit=10,search='',brand='',category='',minPrice=0,maxPrice=Infinity,sortBy='dateAdded'} =req.query
      const skip = (page - 1)*limit  
      try {
      //   const searchQuery = search ? { productName: { $regex: search, $options: 'i' } } // Case-insensitive search
      // : {};

      const searchQuery = {
        ...(search && {productName: {$regex:search, $option: i}}),
        ...(brand && { brandName: brand}),
        ...(category && { productCategory: category}),
        ...(minPrice && maxPrice && { productPrice:{ $gte:parseFloat(minPrice), $lte:parseFloat(maxPrice)}})
      }

      const sortQuery = {}

      if(sortBy === 'priceAsc') {
        sortQuery.productPrice = 1
      }
      else if(sortBy === 'priceDesc') {
        sortQuery.productPrice = -1
      }
      else if(sortBy === 'dataAdded') {
        sortQuery.productPrice = -1
      }


        const products = await productCollection.find(searchQuery)
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sortQuery)
        .toArray()

        const totalProducts = await productCollection.countDocuments(searchQuery)
        console.log(totalProducts)
        const totalPages = Math.ceil(totalProducts / limit)

        res.json({
          products,
          totalPages,
          currentPage : parseInt(page),
          totalProducts
        });
        
      } catch (err) {
        console.log("Error fetching products", err);  // Corrected the error message
        res.status(500).send("Error fetching products");
      }
    });

    //get all the brand names 

    app.get('/brands', async (req, res) => {
      try{
        const brands = await productCollection.distinct('brandName')
        res.json(brands)
      }catch (err) {console.log(err)}
    })

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
