function requestManager(url, data) {
    const oldTime = new Date().getTime();
    const promiseReq = new Promise((resolve, reject) => {
        const xhrReq = new XMLHttpRequest();
        xhrReq.open("POST", url, true);
        xhrReq.setRequestHeader("Content-Type", "application/json");
        // xhrReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhrReq.onload = () => {
            if (noInternet) {
                unknownloadingStop();
                noInternet = false;
            }
            pingManager(new Date().getTime() - oldTime);
            resolve(xhrReq.response);
        }
        xhrReq.onerror = () => {
            pingManager(999);
            unknownloadingStart();
            noInternet = true;
            reject("Couldn\'t connect to the server");
        }
        xhrReq.onloadend = ()=>{
            if(xhrReq.status >= 400){
                xhrReq.onerror();
            }
        }
        // let urlCode = new URLSearchParams(), dataKeys = Object.keys(data);
        // for (let index = 0; index < dataKeys.length; index++) {
        //     urlCode.append(dataKeys[index], data[dataKeys[index]]);
        // }
        // xhrReq.send(urlCode.toString());
        // try{
            xhrReq.send(JSON.stringify(data));
        // } catch(err){
        //     xhrReq.onerror();
        // }
    });
    return promiseReq;
}
function sendToSoc(objectData) {
    if (socketConn) {
        if (Object.keys(objectData).length > 0) {
            socket.send(JSON.stringify({ id: data.id, body: objectData }));
        }
    }
    else {
        socketPendingData.push(objectData);
    }
}
function cachedDataUpdater(responseObject) {
    const responseKeys = Object.keys(responseObject);
    for (let index = 0; index < responseKeys.length; index++) {
        cachedData[responseKeys[index]] = responseObject[responseKeys[index]];
    }
}
function finalizeGameStart() {
    let rtval = false;
    requestManager('./gameStarter', { name: data.name, id: data.id }).then((res) => {
        return res;
    }).then((response) => {
        const resData = JSON.parse(response);
        // const additionalData = JSON.parse(resData.additionalData);
        // webSocketUploader(additionalData);
        sendToSoc(resData.dbData);
        cachedDataUpdater(resData.dbData);
        setUpDataAtClientSide(cachedData);
        rtval = resData.success;
    })
    return rtval;
}
function setUpBoardsUsingServerDecoderData(dataR) {
    if (allowServer) {
        let updateableGoats = [];
        for (let index = 0; index < 4; index++) {
            for (let indexb = 0; indexb < 4; indexb++) {
                const elemIdName = boardSerise[index] + boardSecondarySerise[indexb];
                if (element('#' + elemIdName).getAttribute("ludoid") != idDecoder(dataR[elemIdName])) {
                    // updateableGoats.push(elemIdName + String(idDecoder(dataR[elemIdName])));
                    updateableGoats[elemIdName] = idDecoder(dataR[elemIdName]).toString();
                }
            }
        }
        if (Object.keys(updateableGoats).length > 0) {
            boardManager(updateableGoats);
        }
    }
}
function setUpDataAtClientSide(dataR) {
    cachedData = dataR;
    globalGameStatus = dataR.sts;
    if (globalGameStatus == "ended") {
        if (!loadAnimation) {
            element("#dataId").innerText = data.id;
            showGame = false;
            element("#viewInfo").style.display = "flex";
            allowServer = false;
        }
        element("#waitingRoom").style.display = "none";
        window.onbeforeunload = () => { };
    }
    else {
        tp = dataR.tp;
        if (totalTurns != dataR.tt && gameStarted) {
            totalTurns = dataR.tt;
            if (getTurnRules != turnCounter && turnCounter != 0) {
                fixedThrow(dataR[boardSerise[turnCounter - 1] + 'd1'], dataR[boardSerise[turnCounter - 1] + 'd2'], boardSerise[turnCounter - 1]);
            }
        }
        if (fetchOldSessionData) {
            additionalTurns = dataR[choosedTeam + 'ad'];
            pass = dataR[choosedTeam + 'p'];
            fetchOldSessionData = false;
        }
        if (getTurnRules != turnCounter) {
            setUpBoardsUsingServerDecoderData(dataR);
        }
        if (turnCounter != dataR.t && gameStarted) {
            turnCounter = dataR.t;
            setUpBoardsUsingServerDecoderData(dataR);
            if (dataR[choosedTeam + 'dv'] == "0000") {
                newTurn();
            }
            else if (dataR[choosedTeam + 'dv'] == "0066") {
                diceVals[2] = 6;
                diceVals[3] = 6;
                diceCounterUpdater();
                sixed[choosedTeam] = true;
                newTurn();
            }
            else {
                fixedThrow(dataR[choosedTeam + 'd1'], dataR[choosedTeam + 'd2'], choosedTeam);
                for (let index = 0; index < 4; index++) {
                    diceVals[index] = parseInt(dataR[choosedTeam + 'dv'][index]);
                }
                diceCounterUpdater();
                newTurn(null, diceVals);
            }
            // This block is responsible for disappering messages 
            for (let index = 0; index < turnIndexing.length; index++) {
                messagesTeams[turnIndexing[index] - 1].innerText = '';
            }
            // this block is responsible for show some message in specific teams
            if (turnCounter != 0 && turnCounter != getTurnRules) {
                element("#team" + boardSerise[turnCounter - 1]).innerText = "Current turn";
            }
            else if (turnCounter != 0) {
                element("#team" + choosedTeam).innerText = "Your turn!";
            }
        }
    }
    // if game status detected not started yet.
    if (!gameStarted) {
        for (let index = 0; index < 4; index++) {
            let joingingStatus = "false";
            const waitingStatus = (dataR[boardSerise[index] + 'n'] == "Waiting for someone to join...");
            const undStatus = (dataR[boardSerise[index] + 'n'] == "absent");
            if (!waitingStatus && !undStatus) {
                joingingStatus = "true";
                element("#name" + boardSerise[index]).innerText = dataR[boardSerise[index] + 'n'];
                document.querySelectorAll(".usNameRec")[index].style.fontStyle = "normal";
                document.querySelectorAll(".playstatus")[index].classList.add("presentHere");
                document.querySelectorAll(".playstatus")[index].innerText = "----Still In The Match";
            }
            else if (waitingStatus || undStatus) {
                document.querySelectorAll(".usNameRec")[index].style.fontStyle = "italic";
            }
            document.querySelectorAll(".dataName")[index].innerText = dataR[boardSerise[index] + 'n'];
            document.querySelectorAll(".usNameRec")[index].innerText = dataR[boardSerise[index] + 'n'];
            document.querySelectorAll(".usNameRec")[index].parentElement.setAttribute("presence", joingingStatus);
        }
        if (dataR.sts == "started") {
            loadAnimation = true;
            globalGameStatus = "started";
            if (allowServer) {
                unknownloadingStop();
                finalLoading();
            }
            showGame = true;
            element("#waitingRoom").style.display = "none";
            gameStarted = true;
            if (dataR.tt == 0) {
                onGameStart(false);
            }
            else {
                onGameStart(true);
            }
        }
    }
    // Assining ranks to the players
    for (let index = 0; index < 4; index++) {
        if (dataR[boardSerise[index] + 's'] != '0') {
            if (dataR[boardSerise[index] + 's'] != '7') {
                let dataRanking = `${numtoRank(dataR[boardSerise[index] + 's'])} Rank`;
                element("#team" + boardSerise[index]).innerText = dataRanking;
                document.querySelectorAll(".playstatus")[index].innerText = "---" + dataRanking;
            }
            else {
                let dataRanking = "Last";
                element("#team" + boardSerise[index]).innerText = dataRanking;
                document.querySelectorAll(".playstatus")[index].innerText = "---" + dataRanking;
            }
        }
        else if (turnIndexing.length == 1 && dataR[boardSerise[turnIndexing[0] - 1] + 's'] == '0') {
            let dataRanking = "Last";
            element("#team" + boardSerise[turnIndexing[0] - 1]).innerText = dataRanking;
            document.querySelectorAll(".playstatus")[turnIndexing[0] - 1].innerText = "---" + dataRanking;
            let send = new Object;
            send[boardSerise[turnIndexing[0] - 1] + 's'] = '7';
            serverManager(send);
            delete (send);
        }
    }
}
element('#socialGate').onclick = createMessageSendRequest;
function messageLauncher(mesObj) {
    if(mesObj.body.length > 120){
        mesObj.body = mesObj.body.slice(0,120);
    }
    let timing = mesObj.body.length * 1000;
    if(timing < 5000){
        timing = 3000;
    }
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Close >>',
        timer: timing,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: mesObj.type,
        title: mesObj.name,
        text: mesObj.body,
    });
    notifiSound.play();
}
function reportRequestGenerator(){
    Swal.fire({
        title: 'Feel free to report ! 🤗!',
        input: 'textarea',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Close <<',
        confirmButtonText: 'Send To Devloper',
        preConfirm: (e)=>{
            if(e.length === 0){
                Swal.showValidationMessage('Type something in the complain box ?');
            }
        }
    }).then((eventData)=>{
        if(eventData.isConfirmed){
            requestManager('./reportData', {userId: ((data.id).toString() + choosedTeam), time: new Date().toString(), problem: eventData.value});
            messageLauncher({name:'', body: 'We shared your problem(s) with the developer', type:'success'});
        }
    });
}
function createMessageSendRequest(){
    Swal.fire({
        title: 'Send Message:',
        input: 'text',
        showConfirmButton: true,
        confirmButtonText: "Send 👋",
        showCancelButton: true,
        cancelButtonText: 'Back <<',
        showDenyButton: true,
        denyButtonText: 'Report ?',
        preConfirm: (data)=>{
            if(data.length === 0){
                Swal.showValidationMessage('Type something in the message box ?');
            } else if(data.length > 120){
                data = data.slice(0,100) + '....';
            }
            return data;
        }
    }).then((dataRec)=>{
        if(dataRec.isConfirmed){
            if(socketConn){
                sendToSoc({type: 'userMessage', data: {sender: (getTurnRules-1), mes: dataRec.value}});
                // messageLauncher({name: '', body: 'Message Sent', type: 'success'});
                Swal.fire({
                    icon : 'success',
                    text: 'Message Sent!',
                    showConfirmButton: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timer: 2000,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to send message !',
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        } else if(dataRec.isDenied){
            reportRequestGenerator();
        }
    });
}
function socketDataManager(message) {
    message = JSON.parse(message.data);
    if (message.type === 'outStatusUpdate') {
        outAnimation(message.outMaker);
    }else if(message.type === 'userMessage'){
        messageLauncher({name:teamNames[message.data.sender].innerText + ':', body: message.data.mes});
    }
    else {
        cachedDataUpdater(message);
        setUpDataAtClientSide(cachedData);
    }
};
function connectServer() {
    // connectingToSocket = true;
    // return new Promise((resolve) => {
    requestManager('./download', { name: data.name, id: data.id, team: data.team }).then((response) => {
        return JSON.parse(response);
    }).then((res) => {
        setUpDataAtClientSide(res);
        if (clientUpdate) {
            socket = new WebSocket(`ws://${window.location.host}:${data.id}`);
            socket.addEventListener('open', () => {
                console.log('The connection was successfull !');
                socketConn = true;
                // connectingToSocket = false;
                let pendingDataLimts = socketPendingData.length
                for (let index = 0; index < pendingDataLimts; index++) {
                    sendToSoc(socketPendingData[index]);
                    socketPendingData.splice(0, 1);
                }
            });
            socket.addEventListener('message', socketDataManager);
            socket.addEventListener('close', () => {
                socketConn = false;
                console.log('Connection is closed');
                // let realTimeHandleri1 = setInterval(() => {
                if (!socketConn) {
                    // socket = new WebSocket(`ws://${window.location.host}:${data.id}`);
                    setTimeout(() => {
                        connectServer();
                    }, 2000);
                }
            });
        }
    }).catch((err) => {
        if (clientUpdate) {
            setTimeout(() => {
                connectServer();
            }, 2000);
        }
    });
    // });
}
function serverUpdater(sendData) {
    if (gameStarted) {
        serverBusy = true;
        let furtherQ = false, syncingStatus = true;
        if (sendData['fe'] !== undefined) {
            furtherQ = true;
            delete (sendData['fe']);
        } else if (sendData['sync'] === 'yes') {
            syncingStatus = false;
            delete (sendData['sync']);
        }
        requestManager('./upload', { name: data.name, team: data.team, id: data.id, upData: sendData }).then((res) => {
            return res;
        }).then(() => {
            if (syncingStatus) {
                sendToSoc(sendData);
            }
            serverBusy = false;
        }).catch(() => {
            if (furtherQ) {
                sendData['fe'] = "yes";
            } else if (!syncingStatus) {
                sendData['sync'] = 'yes';
            }
            setTimeout(() => {
                serverUpdater(sendData);
            }, 2000);
        });
    }
}
function connectGame() {
    Swal.fire({
        title: 'Connect to the Game?',
        html: '<button onclick="createGame()" class="swal2-styled swal2-confirm">Create</button><button onclick="joinGame()" class="swal2-confirm swal2-styled">Join</button>',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: 'Back <<',
    }).then((res) => {
        if (res.isDismissed) {
            creatingVirtualProfile();
        }
    });
}
function creatingVirtualProfile() {
    const nameinp = Swal.fire({
        title: 'Enter your name ?',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off',
            autocomplete: 'off',
            placeHolder: 'Enter your name',
        },
        confirmButtonText: 'Next',
        preConfirm: (value) => {
            if (value === "") {
                Swal.showValidationMessage('Enter your name !');
            }
            else {
                data.name = value;
                localStorage.setItem("name", value);
                connectGame();
            }
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).getInput();
    if (localStorage.getItem("name") !== null) {
        nameinp.value = localStorage.getItem("name");
    }
    nameinp.oninput = () => {
        if (nameinp.value.slice(-1) == ' ') {
            nameinp.value = nameinp.value.slice(0, -1);
        }
        if (nameinp.value.length > 7) {
            nameinp.value = nameinp.value.slice(0, 7);
        }
    }
}
function swalRadioOpts(file, inpOpts, addata) {
    let sendingData = { name: data.name };
    if (addata) {
        sendingData['id'] = data.id;
    }
    Swal.fire({
        title: 'Choose yourt prefered team ?',
        input: 'radio',
        inputOptions: inpOpts,
        confirmButtonText: 'CHOOSE',
        showCancelButton: true,
        cancelButtonText: 'Back <<',
        showLoaderOnConfirm: true,
        preConfirm: (logData) => {
            if (logData === null) {
                Swal.showValidationMessage('Select your prefered team !');
            } else {
                data.team = logData;
                sendingData['team'] = data.team;
                choosedTeam = data.team;
                teamChoosed();
                return requestManager(file, sendingData).then((response) => {
                    return JSON.parse(response);
                }).catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    )
                });
            }
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((teamData) => {
        if (teamData.isDismissed) {
            if (!addata) {
                connectGame();
            }
            else {
                joinGame();
            }
        } else {
            const ddata = teamData.value;
            // if (ddata.id !== undefined) {
            //     data.id = ddata.id;
            // }
            if (!addata) {
                data.id = ddata.id;
            } else {
                sendToSoc(ddata.socketDataUpdater);
            }
            element("#idrecshare").innerText = `"${data.id}"`;
            element("#waitingRoom").style.display = "flex";
            clientUpdate = true;
            connectServer();
            if (!addata) {
                element("#startGame").style.display = "inline-block";
            } else if (ddata.gameAdmin == data.team) {
                element("#startGame").style.display = "inline-block";
            }
            else {
                element("#startGame").style.display = "none";
            }
        }
    });
}
function createGame() {
    swalRadioOpts('./newGameGenerator', boardFullS, false);
}
function joinGame() {
    let guess = 0;
    Swal.fire({
        title: 'Enter joining id ?',
        confirmButtonText: 'JOIN',
        input: 'number',
        showCancelButton: true,
        cancelButtonText: 'Back <<',
        inputAttributes: {
            autocomplate: 'off',
            autocapitalize: 'off',
        },
        showLoaderOnConfirm: true,
        preConfirm: (value) => {
            if (value == '') {
                Swal.showValidationMessage('Enter your joining ID !');
            }
            else {
                guess = value;
                return requestManager('./validation', {
                    name: data.name,
                    id: value
                }).then(response => {
                    return response;
                }).catch(error => {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    );
                });
            }
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then((res) => {
        if (res.isDismissed) {
            connectGame();
        } else {
            let rDData = JSON.parse(res.value);
            if (!rDData.availability) {
                Swal.fire({
                    icon: 'error',
                    text: 'Try again! You enterd invalid id.',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then(() => {
                    joinGame();
                });
            } else {
                if (rDData.availability) {
                    data.id = guess;
                }
                const fetchedTeams = rDData.getTeams;
                let inpOpts = new Object;
                for (let index = 0; index < fetchedTeams.length; index++) {
                    inpOpts[fetchedTeams[index]] = boardFullS[fetchedTeams[index]];
                }
                swalRadioOpts('./join', inpOpts, true);
            }
        }
    });

}
creatingVirtualProfile();
// startLudoRightNow();