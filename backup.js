const cors = require("cors");
const express = require("express");
const app = express();
const port = 4800;
const fs = require("fs");
app.use(cors());
let bookData = []
bookData = JSON.parse(fs.readFileSync('bookStore.json', 'utf8'));

const crypto = require("crypto");

const dbName = "bookStore";
const books ="books"

// db
var MongoClient = require("mongodb").MongoClient;
const mongoUrl = "mongodb://localhost:27017"; // local
//  const mongoUrl

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const EventEmitter = require("events");
const { group, Console } = require("console");
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
myEmitter.setMaxListeners(20);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.get("/",function(req, res){
    res.end(JSON.stringify({ msg: "hello" }));
})

app.get("/getBooks", function (req, res) {
    try {
     
      const Type = req.query.type;
      if (!Type) {
        res.end(JSON.stringify({ Error: "InValid Data" }));
      } else {
        if (Type === 'book' || Type === "ebook" || Type ==='audiobook' || Type ==="all") {
            const desiredType = "book"; // Type to filter by

            // Filter data array by the desired type
            
            if(Type ==='all'){
                res.end(JSON.stringify({ Success: bookData }));
            }else{
                const filteredData = bookData.filter(item => item.type === desiredType);
                res.end(JSON.stringify({ Success: filteredData }));
            }
        } else {
          res.end(
            JSON.stringify({ Error: "Invalid Type , Kindly enter valid Type Key." })
          );
        }
      }
    } catch (e) {
      console.log("Error :", e);
      res.end(
        JSON.stringify({
          Error: "An error occurred while processing your request.",
        })
      );
    }
});

app.get("/addBooks", (req, res) => {
  try {
      
      
    const {id ,imgUrl,title,description,author,price,rating,type} = req.query
    console.log(id ,imgUrl,title,description,author,price,rating,type)
    if (!id||!imgUrl||!title||!description||!author||!price||!rating||!type) {
      res.end(JSON.stringify({ Error: "InValid Data" }));
    } else {
      let newData ={
          
          "id": Number(id),
          "imgUrl": imgUrl,
          "title": title,
          "description": description,
          "author": author,
          "price": Number(price),
          "rating": Number(rating),
          "type": type
        }
        console.log(newData,'newdata ADD')
        console.log(id.length>0 && imgUrl.length>0 && title.length>5 && description.length>10 && author.length>3 &&price.length>2 &&rating.length>0 &&type.length>3)
      if (id.length>0 && imgUrl.length>0 && title.length>5 && description.length>10 && author.length>3 &&price.length>2 &&rating.length>0 &&type.length>3) {
        console.log('inside condition')
        const foundItem = bookData.filter(item => item.id === newData.id);
        console.log(foundItem.length)
        console.log(foundItem.length>0)
        if (foundItem.length>0) {
            console.log(1)
            res.end(JSON.stringify({ Error: "Already This Book Is Exist" }));
        } else {
            bookData.push(newData)
            res.end(JSON.stringify({ Success: "ok" }));
            console.log(1)

        }
      } else {
        res.end(
          JSON.stringify({ Error: "Invalid Query Data." })
        );
      }
    }
  } catch (e) {
    res.end(JSON.stringify(`Error : ${e}`));
  }
});
  
app.get("/updateBook", (req, res) => {
  try {

const {id ,imgUrl,title,description,author,price,rating,type} = req.query
    
if (!id||!imgUrl||!title||!description||!author||!price||!rating||!type) {
  res.end(JSON.stringify({ Error: "InValid Data" }));
} else {
 let newData ={
      
      
      "imgUrl": imgUrl,
      "title": title,
      "description": description,
      "author": author,
      "price": Number(price),
      "rating": Number(rating),
      "type": type
    }
    
    console.log(description.length,'description.length')
    console.log(newData)
   
  if (id.length>0 && imgUrl.length>0 && title.length>5 && description.length>10 && author.length>3 &&price.length>2 &&rating.length>0 &&type.length>3) {
    const desiredId = Number(id); // Let's say we want to edit an item with ID 2

    
    const index = bookData.findIndex(item => item.id === desiredId);
    console.log(newData)
    console.log(index,'up')
    if (index !== -1) {
      // Modify the item at the found index
      bookData[index].title = newData.title;
      bookData[index].price = newData.price;
      bookData[index].description = newData.description;
      bookData[index].author = newData.author;
      bookData[index].type = newData.type;
      bookData[index].imgUrl = newData.imgUrl;
      bookData[index].rating = newData.rating;
    
      res.end(JSON.stringify({ Success: "ok" }));
    } else {
        res.end(JSON.stringify({ Error: "Counld not updated" }));
    }
    
  } else {
    res.end(
      JSON.stringify({ Error: "Invalid Query Data." })
    );
  }
}
    
  } catch (e) {
    res.end(JSON.stringify(`Error : ${e}`));
  }
});

app.get("/deleteBook", (req, res) => {
  try {

const {id ,imgUrl,title,description,author,price,rating,type} = req.query
    console.log(id)
   
if (!id) {
  res.end(JSON.stringify({ Error: "InValid Data" }));
} else {
  
    console.log(id.length)
    console.log(id.length>0)
  if (id.length>0 ) {
    const idToDelete = Number(id); // Specify the ID of the item you want to delete

      // Filter out the item with the specified ID
      let jsonData = bookData.filter(item => item.id !== idToDelete);
      console.log(jsonData.length)
     
      bookData = jsonData
      res.end(JSON.stringify({ Success: "ok" }));
    } else {
        res.end(
        JSON.stringify({ Error: "Invalid Query Data." })
        );
    }
    }
        
  } catch (e) {
    res.end(JSON.stringify(`Error : ${e}`));
  }
});

app.listen(port, () => {
  console.log(`Your Port Number is ${port}`);
});