//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const request = require('request');
const axios = require('axios').default;

const app = new express();

const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {

    const firstName = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us7.api.mailchimp.com/3.0/lists/b9260871d8";
    const options = {
        method: "POST",
        auth: "max1:882e17cb0377ee8c51b1f30adf4df770-us7"
    };

    const requ = https.request(url, options, (resp) => {

        if (resp.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        resp.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });

    requ.write(jsonData);
    requ.end();
});

app.post("/success", (req, res) => {
    res.redirect("/");
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
    console.log("Server started on port " + port);
});

// API KEY
// 882e17cb0377ee8c51b1f30adf4df770-us7

// AUdience list iD
// b9260871d8