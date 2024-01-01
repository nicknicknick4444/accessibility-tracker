const express = require("express");
const app = express();
const port = 3000;

app.use("/", express.static("/"));

app.get("/", (req, res) => {
    res.sendFile("/index.html", {root: __dirname});
});

app.get("/style.css", (req, res) => {
    res.sendFile("/style.css", {root: __dirname});
});

app.get("/script.js", (req, res) => {
    res.sendFile("/script.js", {root: __dirname});
});

app.get("/api-call.js", (req, res) => {
    res.sendFile("/api-call.js", {root: __dirname});
});

app.get("/images/favicon.ico", (req, res) => {
    res.sendFile("/images/favicon.ico", {root: __dirname});
});

app.get("/images/the_masthead.png", (req, res) => {
    res.sendFile("/images/the_masthead.png", {root: __dirname});
});

app.options("/", (req, res) => {
    res.setHeader("access-Control-Allow-Origin", "https://data.bus-data.dft.gov.uk/api/v1/datafeed/690/?api_key=d8107d46f33d80916102b16d79415dd3169a5dc4");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.sendStatus(204);
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}!`);
});

