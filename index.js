const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5001;

// middlewar
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.blnxmvz.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const jobsCollection = client.db('JobsDB').collection('allJobs')
    const applyCollection = client.db('JobsDB').collection('applyFrom')


    app.post('/addJobs',async (req,res)=>{
        const jobs = req.body
        console.log(jobs);
        const result = await jobsCollection.insertOne(jobs)
        console.log(result);
        res.send(result)
    })

// _id,name,image,title,category,salary,description,postingD,applicantsN,applicantsD

app.get("/addJobs/:id", async (req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await jobsCollection.findOne(query)
  res.send(result)
});

    app.put('/addJobs/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
        const options = { upsert: true }
        const updatedJob = req.body
        const job = {
          $set: {
            name:updatedJob.name,
            image:updatedJob.image, 
            title:updatedJob.title, 
            category:updatedJob.category, 
            salary:updatedJob.salary, 
            description:updatedJob.description, 
            postingD:updatedJob.postingD, 
            applicantsN:updatedJob.applicantsN, 
            applicantsD:updatedJob.applicantsD
          }

        }

      const result = await jobsCollection.updateOne(filter,job,options)
      res.send(result)
    })




    app.post('/apply',async (req,res)=>{
        const apply = req.body
        console.log(apply);
        const result = await applyCollection.insertOne(apply)
        console.log(result);
        res.send(result)
    })


    app.get("/apply", async (req, res) => {
        let query = {}
        console.log('email',req.query?.email);
        if(req.query?.email){
          query = {email:req.query.email}
        }
        const result = await applyCollection.find(query).toArray()
        res.send(result)
      });

      

      
    app.get("/addJobs", async (req, res) => {
        const result = await jobsCollection.find().toArray();
        res.send(result);
      });


   


      app.delete("/addJobs/:id", async (req, res) => {
        const id = req.params.id;
        console.log("id", id);
        const query = {
          _id: new ObjectId(id),
        };
        const result = await jobsCollection.deleteOne(query);
        console.log(result);
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
