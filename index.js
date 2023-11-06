const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;


// middleaware
app.use(express.json())
app.use(cors())


app.get("/", (req, res)=>{
    res.send("JOB posting Server running")
})

app.listen(port,()=>{
    console.log(`Job server running on ${port}`);
})