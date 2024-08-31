const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000 ;
const { MongoClient, ServerApiVersion } = require('mongodb');


// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174','https://jobtask-43023.web.app/'],
  credentials: true,
  optionSuccessStatus: 200,
};

const corsConfig = {
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
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

      const {page=1,itemsPerPage=10,search='',brand='',category='',minPrice=0,maxPrice=10000000000,sortBy='dateAdded'} =req.query
      const skip = (parseInt(page) - 1)* parseInt(itemsPerPage)
      try {
      //   const searchQuery = search ? { productName: { $regex: search, $options: 'i' } } // Case-insensitive search
      // : {};

       // Debugging logs to verify parameters
      console.log(`Page: ${page}, Items Per Page: ${itemsPerPage}, Skip: ${skip}`);
      console.log(req.query)

      const searchQuery = {
          ...(search && { productName: { $regex: search, $options: 'i' } }),
          ...(brand && { brandName: brand }),
          ...(category && { productCategory: category }),
          ...(minPrice && maxPrice && { productPrice: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) } })
    };


      const sortQuery = {}

    if (sortBy === 'priceAsc') {
        sortQuery.productPrice = 1;
      } else if (sortBy === 'priceDesc') {
        sortQuery.productPrice = -1;
      } else {
        sortQuery.dateAdded = -1; // Default sorting
      }

      // Ensure stable sorting by adding _id as a secondary criterion
      sortQuery._id = 1;

        const products = await productCollection.find(searchQuery)
        .skip(skip)
        .limit(parseInt(itemsPerPage))
        .sort(sortQuery)
        .toArray()

        const totalProducts = await productCollection.countDocuments(searchQuery)

        const totalPages = Math.ceil(totalProducts / parseInt(itemsPerPage))

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
        const brands = await productCollection.aggregate([
          { $group:{_id:"$brandName"}},
          { $project:{_id:0,brandName: "$_id"}}
        ]).toArray();

        res.json(brands.map(b=>b.brandName))
      }catch (err) {console.log(err)}
    })

    //get all the product categories

    app.get('/category',async (req,res)=>{
      const category = await productCollection.aggregate([
        {$group:{_id: "$productCategory"}},
        {$project:{_id:0,productCategory: "$_id" }}
      ]).toArray()
      res.json(category.map(pc => pc.productCategory))
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
