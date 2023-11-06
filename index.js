const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;


// middleaware
app.use(express.json())
app.use(cors())

// shahishawal
// TJLhvZnLwt1ObX2X



const uri = "mongodb+srv://shahishawal:TJLhvZnLwt1ObX2X@cluster0.lkv2aht.mongodb.net/?retryWrites=true&w=majority";

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

    const database = client.db("JobpostingDB");
    const jobCollection = database.collection("haiku");

//    add a job data 
   app.post("/jobs", async(req, res)=>{
    const jobs= req.body
    console.log(jobs)
    const result = await jobCollection.insertOne(jobs)
    res.send(result)
   })
  
//    get jobs in database

   app.get("/jobs", async(req, res)=>{
    const result = await jobCollection.find().toArray();
    res.send(result)

   })



    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get("/", (req, res)=>{
    res.send("JOB posting Server running")
})

app.listen(port,()=>{
    console.log(`Job server running on ${port}`);
})