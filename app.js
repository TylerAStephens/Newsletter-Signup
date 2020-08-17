const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

require('dotenv').config()

console.log(process.env);

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;

  const options = {
    method: "POST",
    auth: process.env.API_KEY
  }

  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.listen(3000, function() {
  console.log("Local Server on 3000");
});
