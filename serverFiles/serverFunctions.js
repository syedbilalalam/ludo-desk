const fs = require('fs');
const path = require('path');
const definedData = require('./consts/arrayConsts.js');
const webSocket = require('ws');
let freeSocketPorts = [];
const jsonNation = (stringified) => {
    if (typeof (stringified) !== 'string') {
        return false;
    }
    if ((stringified.search("\\{") !== -1 && stringified.search("\\}") !== -1) || (stringified.search("\\[") !== -1 && stringified.search("\\]") !== -1)) {
        return JSON.parse(stringified);
    } else {
        return false;
    }
}
const createWebSocket = async (port) => {
    if (freeSocketPorts[port]) {
        return false;
    }
    const ws = new webSocket.Server({ port: port });
    ws.on('connection', (_wss) => {
        _wss.on('message', (message) => {
            // let counting = 0
            message = message.toString();
            message = jsonNation(message);
            if (!message || message.body === undefined) {
                return 0;
            }
            const drivedPath = `./serverFiles/dataBase/socialData/${message.id}/data.json`;
            const dbData = jsonNation(fs.readFileSync(drivedPath).toString());
            if (!dbData) {
                return 0;
            }
            const receivedKeys = Object.keys(message.body);
            for (let index = 0; index < receivedKeys.length; index++) {
                dbData[receivedKeys[index]] = message.body[receivedKeys[index]];
            }
            fs.writeFileSync(drivedPath, JSON.stringify(dbData));
            ws.clients.forEach(client => {
                if (client !== _wss && client.readyState === webSocket.OPEN) {
                    client.send(JSON.stringify(message.body));
                }
            });
        });
    });
    freeSocketPorts[port] = true;
}
function gameGenerator(app) {
    app.post('/newGameGenerator', async (req, res) => {
        try {
            if (req.body.name !== undefined && req.body.team !== undefined) {
                const uname = req.body.name.slice(0, 7);
                const newId = parseInt(fs.readFileSync('./serverFiles/dataBase/idData.txt'));
                fs.writeFileSync('./serverFiles/dataBase/idData.txt', (newId + 1).toString());
                const dbDataPath = './serverFiles/dataBase/socialData/' + newId + '/';
                fs.mkdirSync(dbDataPath);
                const genaratingData = new Object;
                for (let index = 0; index < 4; index++) {
                    if (definedData[index] === req.body.team + 'n') {
                        genaratingData[definedData[index]] = uname;
                    } else {
                        genaratingData[definedData[index]] = 'Waiting for someone to join...';
                    }
                }
                for (let index = 4; index < 32; index++) {
                    genaratingData[definedData[index]] = '0';
                }
                genaratingData['t'] = 0;
                genaratingData['sts'] = 'pending';
                for (let index = 34; index < 38; index++) {
                    genaratingData[definedData[index]] = 0;
                }
                for (let index = 38; index < 42; index++) {
                    genaratingData[definedData[index]] = false;
                }
                genaratingData['tt'] = 0;
                genaratingData['adm'] = req.body.team;
                genaratingData['tp'] = 1;
                for (let index = 45; index < 49; index++) {
                    genaratingData[definedData[index]] = '0000';
                }
                fs.writeFileSync(dbDataPath + 'data.json', JSON.stringify(genaratingData));
                res.contentType('application/json');
                res.send(JSON.stringify({ id: newId }));
                res.status(200);
            } else {
                res.status(400);
                res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            }
            res.status(200);
        } catch (err) {
            res.status(404);
            res.send(JSON.stringify({ description: err }));
        }
    });
}
function downlaodHandler(app) {
    app.post('/download', async (req, res) => {
        try {
            res.contentType('application/json');
            // if (req.body.name !== undefined && req.body.team !== undefined && req.body.id !== undefined) {
            const drivedPath = 'dataBase/socialData/' + req.body.id + '/data.json';
            const dbData = jsonNation(fs.readFileSync('./serverFiles/' + drivedPath).toString());
            // if (!dbData) {
            //     res.status(400);
            //     res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            // }
            if (dbData[req.body.team + 'n'] === req.body.name) {
                res.sendFile(path.join(__dirname, './' + drivedPath));
                createWebSocket(req.body.id);
                res.status(200);
            }
            else {
                throw new Error('bad request!');
            }
            // } else {
            //     res.status(400);
            //     res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            // }
        } catch (err) {
            res.status(400);
            res.send(JSON.stringify({ description: 'Bad request!' }));
        }

    });
}
function uploadHandler(app) {
    app.post('/upload', async (req, res) => {
        try {
            res.contentType('application/json');
            // if (req.body.name !== undefined && req.body.team !== undefined && req.body.id !== undefined) {
            const drivedPath = `./serverFiles/dataBase/socialData/${req.body.id}/data.json`;
            const dbData = jsonNation(fs.readFileSync(drivedPath).toString());
            // if (!dbData) {
            //     res.status(400);
            //     res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            // }
            if (dbData[req.body.team + 'n'] === req.body.name) {
                const updateKeys = Object.keys(req.body.upData);
                for (let index = 0; index < updateKeys.length; index++) {
                    dbData[updateKeys[index]] = req.body.upData[updateKeys[index]];
                }
                fs.writeFileSync(drivedPath, JSON.stringify(dbData));
                res.send(JSON.stringify({ success: true }));
                res.status(200);
            }
            else {
                throw new Error('Bad Request!');
            }
            // } else {
            //     res.status(400);
            //     res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            // }
        } catch (err) {
            res.status(400);
            res.send(JSON.stringify({ description: 'Bad request!' }));
        }

    });
}
function validationHandler(app) {
    app.post('/validation', async (req, res) => {
        try {
            res.contentType('application/json');
            // if (req.body.name !== undefined && req.body.id !== undefined) {
            const drivedPath = `./serverFiles/dataBase/socialData/${req.body.id}/data.json`;
            // let error = false;
            // if (fs.existsSync(drivedPath)) {
            const uname = req.body.name.slice(0, 7);
            const fileData = jsonNation(fs.readFileSync(drivedPath).toString());
            if (!fileData) {
                res.status(400);
                res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            }
            const responseData = {};
            responseData['getTeams'] = [];
            let seats = 0;
            for (let index = 0; index < 4; index++) {
                if (fileData[definedData[index]] === 'Waiting for someone to join...' || fileData[definedData[index]] === uname) {
                    responseData['getTeams'].push(definedData[index][0]);
                    seats++;
                }
            }
            if (seats > 0) {
                responseData['availability'] = true;
            }
            else {
                responseData['availability'] = false;
            }
            res.send(JSON.stringify(responseData));
            // } else {
            //     res.status(400);
            //     res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            // }
            // } else {
            //     res.status(400);
            //     res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            // }
            res.status(200);
        } catch (err) {
            res.status(400);
            res.send(JSON.stringify({ description: 'Bad request!' }));
        }

    });
}
function joinHandler(app) {
    app.post('/join', async (req, res) => {
        try {
            // let error = false
            res.contentType('application/json');
            // if (req.body.name !== undefined && req.body.team !== undefined && req.body.id !== undefined) {
            const uname = req.body.name.slice(0, 7);
            const drivedPath = `./serverFiles/dataBase/socialData/${req.body.id}/data.json`;
            // if (fs.existsSync(drivedPath)) {
            const dbFile = jsonNation(fs.readFileSync(drivedPath).toString());
            if (!dbFile) {
                res.status(400);
                res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            }
            dbFile[req.body.team + 'n'] = uname;
            fs.writeFileSync(drivedPath, JSON.stringify(dbFile));
            res.send(JSON.stringify({ gameAdmin: dbFile['adm'], socketDataUpdater: { rn: dbFile['rn'], gn: dbFile['gn'], yn: dbFile['yn'], bn: dbFile['bn'] } }));
            // } else {
            // error = true;
            // }
            // } else {
            //     error = true;
            // }
            // if (error) {
            //     res.status(400);
            //     res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            // } else {
            //     res.status(200);
            // }
        } catch (err) {
            res.status(400);
            res.send(JSON.stringify({ description: 'Bad request!' }));
        }

    });
}
function gameStarter(app) {
    app.post('/gameStarter', async (req, res) => {
        try {
            let error = false
            res.contentType('application/json');
            const uname = req.body.name.slice(0, 7);
            const drivedPath = './serverFiles/dataBase/socialData/' + req.body.id + '/data.json';
            if (fs.existsSync(drivedPath)) {
                const dbFile = jsonNation(fs.readFileSync(drivedPath).toString());
                if (!dbFile) {
                    res.status(400);
                    res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
                }
                let players = 0
                for (let index = 0; index < 4; index++) {
                    if (dbFile[definedData[index]] !== 'Waiting for someone to join...') {
                        players++;
                    }
                }
                if (players > 1) {
                    for (let index = 0; index < 4; index++) {
                        if (dbFile[definedData[index]] === 'Waiting for someone to join...') {
                            dbFile[definedData[index]] = 'absent';
                        }
                    }
                }
                dbFile['sts'] = 'started';
                fs.writeFileSync(drivedPath, JSON.stringify(dbFile));
                res.send(JSON.stringify({ success: true, dbData: { rn: dbFile['rn'], gn: dbFile['gn'], yn: dbFile['yn'], bn: dbFile['bn'], sts: dbFile['sts'] } }));
                res.status(200);
            }
            // else {
            //         error = true;
            //     }
            // } else {
            //     error = true;
            // }
            // if (error) {
            //     res.status(400);
            //     res.send(JSON.stringify({ description: 'Bad request invaild information !' }));
            // } else {
            // }
        } catch (err) {
            res.send({ success: false });
            res.status(400);
            res.send(JSON.stringify({ description: 'Bad request!' }));
        }

    });
}
function reportsHandler(app) {
    app.post('/reportData', async (req, res) => {
        try {
            res.contentType('application/json');
            req.body['ipAddress'] = req.socket.remoteAddress;
            const drivedPath = './serverFiles/dataBase/userReports/reports.json';
            const oldData = jsonNation(fs.readFileSync(drivedPath).toString());
            oldData.push(req.body);
            fs.writeFileSync(drivedPath, JSON.stringify(oldData));
            res.status(200);
        } catch (err) {
            res.send(JSON.stringify({ description: err }));
            res.status(400);
        }

    });
}
module.exports = { ng: gameGenerator, dh: downlaodHandler, uh: uploadHandler, jh: joinHandler, vh: validationHandler, gs: gameStarter, rh: reportsHandler };