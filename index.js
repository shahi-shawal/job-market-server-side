const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId, MaxKey } = require('mongodb');
const cors = require('cors')
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser')
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000;


// middleaware
app.use(express.json())
app.use(cors({
  origin:[
    'http://localhost:5173'
  ],
  credentials:true
}))
app.use(cookieParser())

// shahishawal
// TJLhvZnLwt1ObX2X


// middleaware
const loger = (req, res, next)=>{
  console.log("loginfo:",req.method,req.url);
  next()
}

const verifytoken = (req, res, next)=>{
  const token = req?.cookies?.token
  console.log("token in the middleware",token);
  if(!token){
    return res.status(401).send({message:"unothorized access"})
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, decoded)=>{
    if (err) {
      return res.status(401).send({message:"unothorized access"})
    }
    req.user = decoded
    next()
  })
  // next()
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkv2aht.mongodb.net/?retryWrites=true&w=majority`;

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
    const applyCollection = database.collection("applyJob")
//    add a job data 
   app.post("/jobs", async(req, res)=>{
    const jobs= req.body
    console.log(jobs)
    const result = await jobCollection.insertOne(jobs)
    res.send(result)
   })


 // authsequre 

 app.post("/jwt", async(req, res)=>{
  const user = req.body;
  console.log("user for token",user);
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"1hr"})
  res.cookie('token', token,{
    httpOnly:true,
    secure:true,
    sameSite:true
  })
  .send({success:true})
 })

 app.post("/logout", async(req, res)=>{
  const user = req.body
  console.log("logout user",user)
  res.clearCookie("token", {maxAge:0}).send({success:true})
 })

  
//    get jobs in database
 



   app.get("/jobs", async(req, res)=>{
    const filter = req.query  
    console.log(filter)
    let query ={}
    if(filter.search){
      query = {
        job_title:{$regex: `${filter.search}`, $options: 'i'}
      }
    } 
    const result = await jobCollection.find(query).toArray();
    res.send(result)

   })
  


   app.get("/jobs/:id",loger,verifytoken, async (req, res) => {
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id),
    };
    console.log("req owner info", req.user);
    if (!req.user.email) {
      return res.status(403).send({massage:"forbiden access"})
    }
    const result = await jobCollection.findOne(query);
    console.log(result);
    res.send(result);
  });
   
   app.get("/jobs/01/:jb_category", async(req, res)=>{
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

  
  app.patch("/jobs/:id", async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedUSer = {
      $inc: {
        job_applicate_number: 1
      },
    };
    const result = await jobCollection.updateOne(
      filter,
      updatedUSer
    );
    res.send(result);
  });






  // update applicats
  // let totalSum = 0;
  // app.put("/jobs/:id", async (req, res) => {
  //   const id = req.params.id;
  //   const filter = { _id: new ObjectId(id) };
  //   const updatedUSer = 
  //   { $inc:{job_applicate_number: 1}  }
  //   const result = await jobCollection.updateOne(
  //     filter,
  //     updatedUSer
  //   );
  //   console.log(result);
  //   res.send(result);
  // });

  // Delete id 

  app.delete("/jobs/:id", async(req, res)=>{
    const id = req.params.id;
    const query = {
      _id: new ObjectId(id),
    };
    const result = await jobCollection.deleteOne(query);
    console.log(result);
    res.send(result);
  })

  // apply job 
  app.post("/applyJobs", async(req, res)=>{
    const jobs= req.body
    console.log(jobs)
    const result = await applyCollection.insertOne(jobs)
    console.log(result.insertedCount);
      res.send(result)
    
   })

  //  apply job get 

  app.get("/applyjobs",loger,verifytoken, async(req, res)=>{
    // console.log(req.query.email)
    console.log("req owner info", req.user);
    if (!req.user.email) {
      return res.status(403).send({massage:"forbiden access"})
    }
    const result = await applyCollection.find().toArray();
    res.send(result)
  })
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

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