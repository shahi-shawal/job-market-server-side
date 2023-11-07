const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const jobtypeCollection = database.collection("jobtype")
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

   app.get("/jobs/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id),
    };
    const result = await jobCollection.findOne(query);
    console.log(result);
    res.send(result);
  });
   
   app.get("/jobs/:jb_category", async(req, res)=>{
        const jobCat = req.params.jb_category
        const query = {jb_category:jobCat}
        const result = await jobCollection.find(query).toArray()
        res.send(result)
   })

   app.get("/jobstype", async(req, res)=>{
    const result = await jobtypeCollection.find().toArray();
    res.send(result)

   })

  //  updated id 
  app.put("/jobs/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const filter = { _id: new ObjectId(id) };
    const updatedUSer = {
      $set: {
        job_title: data.job_title,
        salary_range: data.salary_range,
        posted_name: data.posted_name,
        job_applicate_number: data.job_applicate_number,
        jb_dsc: data.jb_dsc,
        jb_category:data.jb_category,
        jb_post_date: data.jb_post_date,
        app_deadline:data.app_deadline,
        image:data.image
      },
    };
    const result = await jobCollection.updateOne(
      filter,
      updatedUSer
    );
    res.send(result);
  });

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