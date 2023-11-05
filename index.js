const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
// const dotenv = require('dotenv');
// dotenv.config();
const port = process.env.PORT || 5001;

// middlewar
app.use(cors())
app.use(express.json());


// 8R87qornb9k38O0L

const uri = "mongodb+srv://mazharulislam3569:8R87qornb9k38O0L@cluster0.blnxmvz.mongodb.net/?retryWrites=true&w=majority";

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

    const jobsCollection = client.db('JobsDB').collection('allJobs')



    app.post('/addJobs',async (req,res)=>{
        console.log('post hitting');
        const jobs = req.body
        console.log(jobs);
        const result = await jobsCollection.insertOne(jobs)
        console.log(result);
        res.send(result)
    })

    app.get("/addJobs", async (req, res) => {
        const result = await jobsCollection.find().toArray();
        res.send(result);
      });
  




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('User port is running')
})

app.listen(port,()=>{
    console.log(`This is port: ${port}`);
})
