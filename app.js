const serverFunctions = require('./serverFiles/serverFunctions.js');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const serverKey = fs.readFileSync('./ssl/server.key');
const serverCert = fs.readFileSync('./ssl/server.crt');
const server = http.createServer(null, app);
const sslServer = https.createServer({ cert: serverCert, key: serverKey }, app);

// creating web socket connection

const static_path = path.join(__dirname, './static');
app.use(express.json());
app.use(express.static(static_path));
app.get('/home', async (req, res) => {
    try {
        if(req.url === '/home'){
            res.sendFile(path.join(__dirname, './exes/execute.html'));
        } else {
            res.redirect('../home');
        }
    } catch {
        res.status(404);
    }
});
// serverFunctions.ng(app);
// serverFunctions.dh(app);
// serverFunctions.uh(app);
// serverFunctions.jh(app);
// serverFunctions.vh(app);
// serverFunctions.gs(app);
// serverFunctions.rh(app);
for(let index=0; index<7; index++){
    serverFunctions[Object.keys(serverFunctions)[index]](app);
}

server.listen(80);
sslServer.listen(443);