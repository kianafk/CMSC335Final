const http = require('http');
const path = require("path");
const fs = require('fs');
const express = require("express"); 
const app = express(); 
const bodyParser = require("body-parser"); 
const { table } = require('console');

require("dotenv").config({ path: path.resolve(__dirname, '.env') }) 

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

const databaseAndCollection = {db: `${process.env.MONGO_DB_NAME}`, collection:`${process.env.MONGO_COLLECTION}`};
const { MongoClient, ServerApiVersion } = require('mongodb');
const e = require('express');
const req = require('express/lib/request');
const { response } = require('express');

app.use(bodyParser.urlencoded({extended:false}));
app.set("views", path.resolve(__dirname, ""));
app.set("view engine", "ejs");

app.get("/", (request, response) => {
  const variables = {};
  response.render("index", variables);

});

app.get("/placeOrder", (request, response) => {
  const variables = {};
  response.render("placeOrder", variables);
});

app.post("/processOrder", (request, response) => {
  let {name, email, quantity, shipping} =  request.body;
  async function main() {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.numfpdv.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
        let newOrder = {name: `${name}`, email:`${email}`, quantity:`${quantity}`, shipping:`${shipping}`};
        const result = await client.db(databaseAndCollection.db).collection(databaseAndCollection.collection).insertOne(newOrder);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

  const variables = {
      name: name,
      email: email,
      quantity: quantity,
      shipping: shipping,
      email1: email.split("@")[0],
      email2: email.split("@")[1],
  };
  response.render("processOrder", variables);
});

const portNumber = process.argv[2];

app.listen(portNumber); 

console.log(`Web server is running at http://localhost:${portNumber}`);
process.stdout.write("Type stop to shutdown the server: ");

process.stdin.setEncoding("utf8"); 
process.stdin.on('readable', () => {  
	let dataInput = process.stdin.read();
	if (dataInput !== null) {
		let command = dataInput.trim();
		if (command === "stop") {
			console.log("Shutting down the server");
            process.exit(0); 
        } else if (command === "itemsList") {
            console.log(jsonFile.itemsList);
            process.stdout.write("Type stop to shutdown the server: ");
            process.stdin.resume();
            
        } else {
			console.log(`Invalid command: ${command}`);
            process.stdout.write("Type stop to shutdown the server: ");
            process.stdin.resume();
		}
    }
});


app.get("/processOrder", (request, response) => {
  const variables = {};
  response.render("processOrder", variables);
});



app.post("/processReviewApplication", (request, response) => {
  let {email} =  request.body;
  let name;
  let quantity;
  let shipping;

  async function main() {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.numfpdv.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  try {
        await client.connect();
        let filter = {email: email};
     let result = await client.db(databaseAndCollection.db)
                        .collection(databaseAndCollection.collection)
                        .findOne(filter);

   if (result) {
      name = result.name;
      quantity = result.quantity;
      shipping = result.shipping;
   }else {
    name = "NONE";
    quantity = "NONE";
    email = "NONE";
    shipping = "NONE";
    email1 = "NONE";
    email2 = "NONE";
    
   }
   email1 = email.split("@")[0];
   email2 = email.split("@")[1];
   const variables = {
    name: name,
    email: email,
    quantity: quantity,
    shipping: shipping,
    email1: email1,
    email2: email2 }

  response.render("processOrder", variables);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
  }

main().catch(console.error);

});


app.get("/processFindOrder", function(request, res){
  
  let name;
  let quantity;
  let shipping;
  let email1;
  let email2;
  let email = request.query.email;
    console.log(email);

    async function main() {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.numfpdv.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  try {
        await client.connect();
        let filter = {email: email};
     let result = await client.db(databaseAndCollection.db)
                        .collection(databaseAndCollection.collection)
                        .findOne(filter);

    console.log(result);
   if (result) {
      name = result.name;
      quantity = result.quantity;
      shipping = result.shipping;
   }else {
    name = "NONE";
    quantity = "NONE";
    email = "NONE";
    shipping = "NONE";
    email1 = "NONE";
    email2 = "NONE";
    
   }
   email1 = email.split("@")[0];
   email2 = email.split("@")[1];
   const variables = {
    name: name,
    email: email,
    quantity: quantity,
    shipping: shipping,
    email1: email1,
    email2: email2
  };
  res.render("processOrder", variables);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
  }

main().catch(console.error);

});

app.get("/findOrder", (request, response) => {
  const variables = {};
  response.render("findOrder", variables);
});
