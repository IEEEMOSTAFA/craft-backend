const express = require('express')
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express()




app.use(cors());
app.use(express.json())


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9p6xc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db('craftStore').collection('products');
    const registerCollection = client.db('register').collection('visitors');




    // crud operation start::

    // Create:
    app.post('/addCraft', async(req,res) =>{
     const user = req.body;
     console.log('New User',user);

     const result = await productCollection.insertOne(user)
     console.log(result);
     res.send(result);
    })
    // create for register:
    app.post('/addRegister', async(req,res) =>{
     const user = req.body;
     console.log('New User',user);

     const result = await registerCollection.insertOne(user)
     console.log(result);
     res.send(result);
    })

    // Read:

    app.post('/addCraft', async(req,res) =>{
     const user = req.body;
     console.log('New User',user);

     const result = await productCollection.insertOne(user)
     console.log(result);
     res.send(result);
    })

    // Read:
    app.get("/myCraft/:email", async (req, res) =>{
      const email = req.params.email;
      console.log('getting user email',email);

      const result = await productCollection.find({email:req.params.email}).toArray()
      res.send(result);

     

    })
    // Read:
    app.get("/singleproducts/:id", async (req, res) =>{
      const result = await productCollection.findOne({_id: new ObjectId(req.params.id)});
      res.send(result);

    })

    //Update
    app.put("/updateProduct/:id",async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      console.log('updating user',id);
      const data = {
        $set: {
          name: req.body.name,
          price: req.body.price,
          brandName: req.body.brandName,
          imgUrl: req.body.imgUrl,
          type: req.body.type,
        }
      }
      const result = await productCollection.updateOne(query,data);
      console.log(result);
      res.send(result);
    })

    // Delete:
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await productCollection.deleteOne(filter);
      console.log(result);
      res.send(result);


    })












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();        // kaj shesh a ata close hoye jabe
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World! This is Craft Store')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
