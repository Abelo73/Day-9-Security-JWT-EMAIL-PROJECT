const express = require("express");
const port = 5000;

const app = express();

app.get("/api", (req, res)=>{
    res.send("Hello World");
})

app.listen(prot, () => {
  console.log(`Server is running on port ${port}`);
});
