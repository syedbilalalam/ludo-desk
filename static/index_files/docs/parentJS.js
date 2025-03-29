function element(iddata) {
    return document.querySelector(iddata);
}
let choosedTeam = "r";
const boardSerise = ['r', 'g', 'y', 'b'], boardFullS = { r: 'Red', g: 'Green', y: 'Yellow', b: 'Blue' };
const boardSecondarySerise = ['a', 'b', 'c', 'd'];
const defaultPath = "./index_files/media/audio/ludo-sfx/";
const diceThrow = new Audio(defaultPath + "diceThrow.mp3");
const success = new Audio(defaultPath + "success.mp3");
const movement = new Audio(defaultPath + "movement.mp3");
const notifiSound = new Audio(defaultPath + 'notification.mp3')
const out = new Audio(defaultPath + "out.mp3");
const messagesTeams = document.querySelectorAll(".teamMesses");
const shuffel = new Audio(defaultPath + "shuffel.mp3");
const winner = new Audio(defaultPath + "winner.mp3");
const finalWinner = new Audio(defaultPath + "finalWinner.mp3");
const gPredictrs = document.querySelectorAll(".predict");
const bcmian = element("#backMain");
const goats = document.querySelectorAll(".goats");
const allBoardGoats = document.querySelectorAll(".ptype");
const teamNames = document.querySelectorAll(".teamNames");
const board = element("#board");
let boolVars = { displayingMessage: false, restartServer: false, uploadCreateCon: false, uploading: false, connectingToSocket: false, socketConn: false, noInternet: false, loadAnimation: false, allowServer: true, showGame: false, gameended: false, serverBusy: false, fetchOldSessionData: false, skipAnimations: false, gameStarted: false, clientUpdate: false, pass: false };
let  imgnGoats = document.querySelectorAll(".imginaryGoats"), takePoses = 1, peoples = [], messageLefts = '', cachedData = new Object, socketPendingData = [], socket, i42, goatFocused = null, i41, oldData = '', globalGameStatus = "pending", tp = 0, t3, qUFS = [], i10, t9, t8, i8, totalTurns = 0, serverOnDoneIndex = [], UPD = [], ourGoats = document.getElementsByClassName(choosedTeam), turnIndexing = [], data = new Object, getTurnRules, t1, additionalTurns = 0, oldRecovery = new Object, i4, i3, diceframeRateManager = 10, sixed = new Object, winedGoats = 0, diceVals = [0, 0, 0, 0], diceCounter = [0, 0, 0, 0, 0, 0], pat = 2, turnCounter = 0, homedGoats = 0, i2;
for (let index = 0; index < 4; index++) {
    sixed[boardSerise[index]] = false;
}
let h = { pak: "assalamoalikum", india: "hi", afgan: "N" }
function dequeueArr(arr) {
    for (let index = 0; index < (arr.length - 1); index++) {
        arr[index] = arr[index + 1];
    }
    arr.pop();
    return arr;
}
function findChr(chr, string) {
    for (let index = 0; index < string.length; index++) {
        if (string[index] == chr) {
            return index;
        }
    }
    return 'false';
}
function sendMessTo(string, team) {
    clearTimeout(t3);
    if (oldData != "") {
        element("#team" + team).innerText = oldData;
    }
    if (turnCounter != 0) {
        oldData = element("#team" + team).innerText;
        element("#team" + team).innerText = string;
        t3 = setTimeout(() => {
            element("#team" + team).innerText = oldData;
        }, 2000);
    }
}
function cachedDataUpdater(responseObject) {
    const responseKeys = Object.keys(responseObject);
    for (let index = 0; index < responseKeys.length; index++) {
        cachedData[responseKeys[index]] = responseObject[responseKeys[index]];
    }
}
function idEncoder(id) {
    let returningData = id;
    if (choosedTeam == 'r' || id == 0) {
        return returningData;
    }
    if (id > 52) {
        id = parseFloat("52" + ('.' + String(id - 52)));
    }
    if (id % 1 == 0) {
        returningData = parseInt(id) + (13 * (getTurnRules - 1));
    }
    else {
        returningData = parseFloat(id) + (13 * (getTurnRules - 1));
    }
    if (parseInt(returningData) > 52) {
        returningData -= 52;
    }
    if (returningData <= 0) {
        returningData += 52;
    }
    if (returningData % 1 != 0) {
        returningData = parseFloat(returningData.toFixed(1));
    }
    if (returningData % 1 != 0 && returningData > 52) {
        returningData = 52 + parseInt(returningData.toString().slice(-1));
    }
    return returningData;
}
function idDecoder(id) {
    let pointednum = 0, tid;
    if (choosedTeam == 'r' || id == 0) {
        return id;
    }
    if (id > 52) {
        id = 52 + ((id - 52) / 10);
    }
    if (String(id).slice(-2, -1) == ".") {
        pointednum = parseFloat("0" + String(id).slice(-2));
        id -= pointednum;
    }
    tid = id - (13 * (getTurnRules - 1));
    if (tid < 1) {
        tid += 52;
    };
    if (pointednum != 0) {
        tid += pointednum;
    }
    if (tid > 52) {
        tid += parseInt(tid.toString().slice(-1));
        tid -= pointednum;
    }
    return tid;
};
function isSafe(id) {
    if (id == 0) {
        return true;
    }
    let safty = false;
    for (let index = 2; index <= 41; index += 13) {
        if (id == index) {
            safty = true;
        }
    }
    for (let index = 10; index <= 49; index += 13) {
        if (id == index) {
            safty = true;
        }
    }
    if (id > 52) {
        safty = true;
    }
    else if (String(id).slice(-2, -1) == '.') {
        safty = true;
    }
    return safty;
}
function pingManager(data) {
    let extraSign = "";
    if (data > 200) {
        element("#pingDisplay").style.color = "rgb(255, 0, 0)";
    }
    else if (data > 100) {
        element("#pingDisplay").style.color = "rgb(0, 8, 255)";
    }
    else if (data > 50) {
        element("#pingDisplay").style.color = "rgb(255, 140, 0)";
    }
    else {
        element("#pingDisplay").style.color = "rgb(0, 176, 0)";
    }
    if (data == 999) {
        extraSign = '+';
    }
    element("#pingDisplay").innerText = `${extraSign}${data}ms`;
}
function requestManager(url, data) {
    const oldTime = new Date().getTime();
    const promiseReq = new Promise((resolve, reject) => {
        const xhrReq = new XMLHttpRequest();
        xhrReq.open("POST", url, true);
        xhrReq.setRequestHeader("Content-Type", "application/json");
        // xhrReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhrReq.onload = () => {
            if (boolVars.noInternet) {
                unknownloadingStop();
                boolVars.noInternet = false;
            }
            pingManager(new Date().getTime() - oldTime);
            resolve(xhrReq.response);
        }
        xhrReq.onerror = () => {
            if (xhrReq.status === 0) {
                pingManager(999);
                unknownloadingStart();
                boolVars.noInternet = true;
            }
            reject("Failed to connect with a response of " + xhrReq.status);
        }
        xhrReq.onloadend = () => {
            if (xhrReq.status >= 400) {
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
function eneableAllImgs(elems) {
    for (let index = 0; index < elems.length; index++) {
        elems[index].style.display = 'inline-block';
    }
};
function declareDice(side, value, sa) {
    if (sa) {
        stopAudio(shuffel);
    }
    disableAllEO(side.children, value);
    diceThrow.play();
    boolVars.skipAnimations = false;
    side.scrollTo({ top: 0 });
}
function disableAllEO(elems, exp) {
    for (let index = 0; index < elems.length; index++) {
        if (elems[index].getAttribute('worth') == exp) {
            continue;
        }
        elems[index].style.display = 'none';
    }
}
function fixedThrow(d1, d2, team) {
    shuffel.play();
    let left = element("#left" + team);
    let right = element("#right" + team);
    eneableAllImgs(left.children);
    eneableAllImgs(right.children);
    left.children[left.children.length - 1].style.display = "none";
    shuffel.loop = true;
    let count = 0;
    if (d1 != 7) {
        i3 = setInterval(() => {
            left.scrollTo({
                top: count,
            });
            if (boolVars.skipAnimations) {
                clearInterval(i3);
                declareDice(left, d1.toString(), false);
            }
        }, 10);
        setTimeout(() => {
            if (!boolVars.skipAnimations) {
                clearInterval(i3);
                declareDice(left, d1.toString(), false);
            }
        }, 1000);
    }
    else {
        left.children[left.children.length - 1].style.display = "inline";
        disableAllEO(left.children, '7');
    }
    i4 = setInterval(() => {
        count += diceframeRateManager;
        if (right.scrollHeight <= count) {
            count = 0;
        };
        right.scrollTo({
            top: count
        });
        if (boolVars.skipAnimations) {
            clearInterval(i4);
            declareDice(right, d2.toString(), true);
        }
    }, 10);
    setTimeout(() => {
        if (!boolVars.skipAnimations) {
            clearInterval(i4);
            declareDice(right, d2.toString(), true);
        }
        if (d1 == '6' && d2 == '6' && !sixed[team]) {
            sendMessTo("Great😘!", team);
            success.play();
            sixed[team] = true;
        }
        else if (sixed[team]) {
            sixed[team] = false;
        }
    }, 3000);
};
function dicevalsToserver(arr) {
    let codedDicevals = '';
    for (let index = 0; index < 4; index++) {
        codedDicevals += arr[index].toString();
    }
    let send = new Object;
    send[choosedTeam + "dv"] = codedDicevals;
    cachedDataUpdater(send);
    setUpDataAtClientSide(cachedData);
    serverManager(send);
    delete (send);
}
function diceCounterUpdater() {
    for (let index = 0; index < diceCounter.length; index++) {
        diceCounter[index] = 0;
    }
    for (let index = 0; index < diceCounter.length; index++) {
        for (let indexb = 0; indexb < diceVals.length; indexb++) {
            if (diceVals[indexb] == (index + 1)) {
                diceCounter[index]++;
            }
        }
    }
    dicevalsToserver(diceVals);
}
function myTurn(store) {
    if (store == undefined) {
        clearInterval(i2);
        element("#diceRunner").style.display = "block";
        let count = 0;
        i2 = setInterval(() => {
            if (count > 100) {
                count = 0;
            }
            if (count % 2 == 0) {
                element("#diceRunner").style.opacity = "1";
            }
            else {
                element("#diceRunner").style.opacity = "0";
            };
            count++;
        }, 400);
    }
    else {
        return store;
    }
};
function goatFocusAnimation(elem) {
    clearInterval(i41);
    if (goatFocused !== null) {
        goatFocused.style.transform = "rotate(0deg)";
    }
    goatFocused = null;
    let count = 0;
    i41 = setInterval(() => {
        if (count > 99) {
            count = 0;
        }
        if (count % 2 == 0) {
            elem.style.transform = "rotate(20deg)";
        }
        else {
            elem.style.transform = "rotate(-20deg)";
        }
        count++;
    }, 500);
    goatFocused = elem;
}
function disableClickPrevention() {
    document.onclick = () => { }
}
function goatBlur() {
    clearInterval(i41);
    if (goatFocused !== null) {
        goatFocused.style.transform = "rotate(0deg)";
    }
    goatFocused = null;
}
window.onblur = () => {
    for (let index = 0; index < gPredictrs.length; index++) {
        gPredictrs[index].style.top = "200vh";
        gPredictrs[index].style.left = "200vw";
    }
    goatBlur();
};
function enableClickPrevention() {
    document.onclick = () => {
        document.onclick = (e) => {
            if (e.target.classList.value.search("mfam") === -1 || e.target.classList.value.search("prefam") !== -1) {
                if (boolVars.displayingMessage) {
                    element("#messageDisplay").style.bottom = "-20vh";
                    clearInterval(i42)
                    boolVars.displayingMessage = false;
                }
                else {
                    window.onblur();
                    disableClickPrevention();
                }
            }
        };
    }
}
function powerAllower(power, id) {
    let elemts = document.querySelectorAll("[ludoid='" + id + "']");
    let secondaryEntering = 0;
    for (let index = 0; index < elemts.length; index++) {
        if (elemts[index].id[0] == choosedTeam) {
            secondaryEntering++;
        }
    }
    if (elemts.length <= power || secondaryEntering > 0) {
        return "allowed";
    }
    else {
        return "denined";
    }
}
function bBoxes(size) {
    return ((board.offsetHeight / 15) * size);
}
function signInverter(num) {
    let x = num * (-2);
    return (x + num);
};
function zeroe(num) {
    if (num < 10 && num > -10) {
        return '0' + num;
    }
    else {
        return num.toString();
    }
}
function putAtBoard(id, sbw, sbh) {
    let x, y, z;
    if (id == 13) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * 0));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * 7));
        z = 108;
    }
    else if (id == 26) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * 7));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * 0));
        z = 101;
    }
    else if (id == 39) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * 14));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * 7));
        z = 108;
    }
    else if (id == 52) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * 7));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * 14));
        z = 115;
    }
    else if (id < 7) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * 6));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * (15 - id)));
        z = parseInt("1" + zeroe(15 - (id - 1)));
    }
    else if (id > 6 && id < 13) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * (6 - (id - 6))));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * 8));
        z = 109;
    }
    else if (id > 13 && id < 14) {
        let winingnums = (id - 13) * 10;
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * (winingnums)));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * 7));
        z = 108;
    }
    else if (id > 13 && id < 20) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * (id - 14)));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * 6));
        z = 107;
    }
    else if (id > 19 && id < 26) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * (6)));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * (signInverter((id - 20) - 5))));
        z = parseInt("1" + zeroe(signInverter((id - 20) - 6)));
    }
    else if (id > 26 && id < 27) {
        let winingnums = (id - 26) * 10;
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * (7)));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * (winingnums)));
        z = parseInt("1" + zeroe(winingnums + 1));
    }
    else if (id > 26 && id < 33) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * (8)));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * (id - 27)));
        z = parseInt("1" + zeroe(id - 26));
    }
    else if (id > 32 && id < 39) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * ((id - 33) + 9)));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * (6)));
        z = 107;
    }
    else if (id > 39 && id < 40) {
        let winingnums = (id - 39) * 10;
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * (14 - winingnums)));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * (7)));
        z = 108;
    }
    else if (id > 39 && id < 46) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * (14 - (id - 40))));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * (8)));
        z = 109;
    }
    else if (id > 45 && id < 52) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * (8)));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * ((id - 46) + 9)));
        z = parseInt("1" + zeroe((id - 46) + 10));
    }
    else if (id > 52) {
        x = (board.offsetLeft + (((bBoxes(1) / 2) - (sbw)) + (board.offsetHeight / 15) * (7)));
        y = (board.offsetTop + (((bBoxes(1) / 2) - (sbh)) + (board.offsetHeight / 15) * (14 - (id - 52))));
        z = parseInt("1" + zeroe(15 - (id - 52)));
    };
    return { x: x, y: y, z: z };
};
function exitTurn() {
    if (additionalTurns <= 0) {
        allowNewTurn = false;
        for (let index = 0; index < ourGoats.length; index++) {
            ourGoats[index].style.backgroundColor = "transparent";
            ourGoats[index].onclick = () => { }
        }
        let sendingTurn = turnIndexing[findChr(turnCounter, turnIndexing) + 1];
        if (sendingTurn === undefined) {
            sendingTurn = turnIndexing[0];
        }
        let i7 = setInterval(() => {
            if (qUFS.length == 0) {
                // rdv
                let send = new Object;
                send[choosedTeam + "dv"] = "0000";
                send['t'] = sendingTurn;
                cachedDataUpdater(send);
                setUpDataAtClientSide(cachedData);
                send["fe"] = "yes";
                serverManager(send);
                delete (send);
                clearInterval(i7);
            }
        }, 1000);
    }
    else {
        additionalTurns--;
        let send = new Object;
        send[choosedTeam + "ad"] = additionalTurns;
        serverManager(send);
        delete (send);
        newTurn();
    }
}
function turnChecker(forced) {
    let confirmingExit = 0;
    for (let index = 0; index < ourGoats.length; index++) {
        let currentIdGoats = [];
        if (ourGoats[index].getAttribute("ludoid") != 0) {
            currentIdGoats = document.querySelectorAll("[ludoid='" + ourGoats[index].getAttribute("ludoid") + "']");
        }
        confirmingExit += goatsScorePredictorBarierd([ourGoats[index]], true);
        let newparsingArr = [];
        if (currentIdGoats.length > 0) {
            newparsingArr[0] = currentIdGoats[0];
        }
        for (let indexb1 = 0; indexb1 < (currentIdGoats.length - 1); indexb1++) {
            for (let indexb = 1; indexb < (indexb1 + 2); indexb++) {
                newparsingArr[indexb] = currentIdGoats[indexb];
            }
            if (newparsingArr.length > 1) {
                confirmingExit += goatsScorePredictorBarierd(newparsingArr, true);
            }
        }
    }
    if (confirmingExit === 0) {
        if (diceVals[0] == 0 && diceVals[1] == 0 && diceVals[2] == 0 && diceVals[3] == 0 || forced) {
            exitTurn();
            return "exitExecuted";
        }
        else {
            element("#skipBox").style.display = "flex";
        }
    }
}
function dicePriceDecider(dp, focusedGoats) {
    let boolsArr = [false, false, false, false];
    if (dp.type === 's') {
        for (let indexb = 0; indexb < focusedGoats; indexb++) {
            for (let indexc = 0; indexc < diceVals.length; indexc++) {
                if (dp.score == diceVals[indexc] && !boolsArr[indexc]) {
                    // diceVals[indexc] = 0;
                    boolsArr[indexc] = true;
                    break;
                }
            }
        }
    }
    else if (dp.type === 'a') {
        for (let indexb = 0; indexb < 2; indexb++) {
            // diceVals[indexb] = 0;
            boolsArr[indexb] = true;
        }
    }
    else if (dp.type === 'd') {
        for (let indexb = 0; indexb < diceVals.length; indexb++) {
            if ((dp.score * focusedGoats) == diceVals[indexb] && !boolsArr[indexb]) {
                // diceVals[indexb] = 0;
                boolsArr[indexb] = true;
                break;
            }
        }
    }
    return boolsArr;
}
function goatsScorePredictorBarierd(arrElem, softcopy) {
    if (!softcopy) {
        for (let index = 0; index < gPredictrs.length; index++) {
            gPredictrs[index].style.top = "200vh";
            gPredictrs[index].style.left = "200vw";
        }
    }
    clearTimeout(t1);
    let softdata = 0, focusedGoats = arrElem.length, prediction = [];
    for (let index = 0; index < focusedGoats; index++) {
        if (arrElem[0].getAttribute("ludoid") != arrElem[index].getAttribute("ludoid")) {
            return 0;
        }
    }
    // s is for cont how many time e.g 3 is comming for barries or non-bariers repectively
    for (let index = 0; index < diceCounter.length; index++) {
        if (diceCounter[index] == focusedGoats) {
            // prediction[prediction.length] = String(index + 1) + "s";
            prediction.push({ score: (index + 1), type: 's' });
        }
    }
    // a method is to find total sum of all dices
    let subScore = 0;
    for (let index = 0; index < 2; index++) {
        subScore += diceVals[index];
    }
    if (subScore != 0 && focusedGoats == 1) {
        // prediction[prediction.length] = subScore + 'a';
        prediction.push({ score: subScore, type: 'a' });
    }
    subScore = 0;
    // d method is for divied scores for bariers
    for (let index = 0; index < diceVals.length; index++) {
        if (diceVals[index] % focusedGoats === 0 && diceVals[index] != 0) {
            // prediction[prediction.length] = (diceVals[index] / focusedGoats) + "d";
            prediction.push({ score: (diceVals[index] / focusedGoats), type: 'd' });
        }
    }
    let usedIds = [];
    for (let index = 0; index < prediction.length; index++) {
        // let prediction[index].score = parseInt(prediction[index].slice(0, -1));
        let modelLudoId = parseInt(arrElem[0].getAttribute("ludoid"));
        let wkidd = modelLudoId + prediction[index].score;
        if (modelLudoId == 0) {
            if (prediction[index].score == 6 && prediction[index].type !== 'a') {
                wkidd = 2;
            }
            else {
                continue;
            }
        }
        if (wkidd < 59) {
            if (wkidd > 52 && !boolVars.pass) {
                wkidd = wkidd - 52;
            }
            let indexing = parseInt(modelLudoId), run = true;
            for (let indexb = (indexing + 1); indexb <= (indexing + prediction[index].score); indexb++) {
                if (powerAllower(focusedGoats, indexb) === "denined" && !isSafe(indexb)) {
                    run = false;
                }
            }
            if (run && findChr(wkidd, usedIds) === 'false') {
                if (softcopy) {
                    softdata++;
                }
                else {
                    let datad;
                    // gPredictrs[index].setAttribute("wkfor", arrElem[index].id);
                    // gPredictrs[index].setAttribute("wkid", wkidd);
                    // gPredictrs[index].setAttribute("fakeDicePrice", JSON.stringify(prediction[index]));
                    datad = putAtBoard(wkidd, gPredictrs[index].offsetWidth / 2, gPredictrs[0].offsetHeight / 2);
                    gPredictrs[index].innerText = (prediction[index].score * focusedGoats);
                    gPredictrs[index].style.left = datad.x + "px";
                    gPredictrs[index].style.top = datad.y + "px";
                    gPredictrs[index].onclick = () => {
                        element("#messageDisplay").style.bottom = "-20vh";
                        boolVars.displayingMessage = false;
                        window.onblur();
                        // let efftelemsIds = JSON.parse(gPredictrs[index].getAttribute('wkfor'));
                        for (let indexb = 0; indexb < arrElem.length; indexb++) {
                            let gtd = new Object;
                            // gtd[efftelemsIds[indexb]] = gPredictrs[index].getAttribute("wkid");
                            gtd[arrElem[indexb].id] = wkidd.toString();
                            boardManager(gtd);
                        }
                        // let dp = JSON.parse(gPredictrs[index].getAttribute("fakeDicePrice"));
                        let dpd = dicePriceDecider(prediction[index], focusedGoats);
                        for (let indexb = 0; indexb < 4; indexb++) {
                            if (dpd[indexb]) {
                                diceVals[indexb] = 0;
                            }
                        }
                        diceCounterUpdater();
                        if (turnChecker() === "exitExecuted") {
                            return 0;
                        }
                    }
                }
                usedIds.push(wkidd);
            }
        }
    }
    enableClickPrevention();
    if (softcopy) {
        return softdata;
    }
    // else {
    // for (let index = 0; index < gPredictrs.length; index++) {
    // gPredictrs[index].onclick = () => {
    //     element("#messageDisplay").style.bottom = "-20vh";
    //     boolVars.displayingMessage = false;
    //     window.onblur();
    //     let efftelemsIds = JSON.parse(gPredictrs[index].getAttribute('wkfor'));
    //     for (let indexb = 0; indexb < efftelemsIds.length; indexb++) {
    //         let gtd = new Object;
    //         gtd[efftelemsIds[indexb]] = gPredictrs[index].getAttribute("wkid");
    //         boardManager(gtd);
    //     }
    //     let dp = JSON.parse(gPredictrs[index].getAttribute("fakeDicePrice"));
    //     dp = dicePriceDecider(dp, focusedGoats);
    //     for(let indexb=0; indexb<4;indexb++){
    //         if(dp[index]){
    //             diceVals[index]=0;
    //         }
    //     }
    //     diceCounterUpdater();
    //     if (turnChecker() === "exitExecuted") {
    //         return 0;
    //     }
    // }
    // }
    // }
}
function newTurn(abc, dvSet) {
    if (turnCounter == getTurnRules) {
        if (abc == undefined && dvSet == undefined) {
            rememberingCurrentVals();
            myTurn();
        }
        else {
            if (dvSet !== undefined) {
                diceVals = dvSet;
            }
            else {
                diceVals[0] = abc.d1;
                diceVals[1] = abc.d2;
                if (diceVals[0] == 7) {
                    diceVals[0] = 0;
                }
                if (diceVals[0] == 6 && diceVals[1] == 6 && !sixed[choosedTeam]) {
                    diceVals[0] = 0;
                    diceVals[1] = 0;
                    diceVals[2] = 6;
                    diceVals[3] = 6;
                    // sixed[choosedTeam] = true;
                    setTimeout(() => {
                        // sendMessTo("Great😘!", boardSerise[turnCounter - 1]);
                        // success.play();
                        newTurn();
                    }, 3000);
                    dicevalsToserver(diceVals);
                    return 0;
                }
                if (sixed[choosedTeam]) {
                    let distraction = 0;
                    if (diceVals[0] == 6) {
                        distraction++;
                        diceVals[0] = 0;
                    }
                    if (diceVals[1] == 6) {
                        distraction++;
                        diceVals[1] = 0;
                    }
                    if (distraction != 0) {
                        diceVals[2] = 0;
                        diceVals[3] = 0;
                    }
                    sixed[choosedTeam] = false;
                }
            }
            diceCounterUpdater();
            setTimeout(() => {
                for (let index = 0; index < ourGoats.length; index++) {
                    ourGoats[index].style.backgroundColor = "transparent";
                    ourGoats[index].onclick = () => {
                        goatFocusAnimation(ourGoats[index]);
                        enableClickPrevention();
                        goatsScorePredictorBarierd([ourGoats[index]]);
                        turnChecker();
                    }
                }
                turnChecker(true);
            }, 3000);
        }
    }
}
function setUpBoardsUsingServerDecoderData(dataR) {
    if (boolVars.allowServer) {
        let updateableGoats = new Object;
        for (let index = 0; index < 4; index++) {
            for (let indexb = 0; indexb < 4; indexb++) {
                const elemIdName = boardSerise[index] + boardSecondarySerise[indexb];
                if (element('#' + elemIdName).getAttribute("ludoid") != idDecoder(dataR[elemIdName])) {
                    updateableGoats[elemIdName] = idDecoder(dataR[elemIdName]).toString();

                }
            }
        }
        if (Object.keys(updateableGoats).length > 0) {
            boardManager(updateableGoats);
        }
    }
}
function unknownloadingStop() {
    element("#loadMess").innerText = "Connected!";
    element("#loadingGear").style.display = "none";
    t8 = setTimeout(() => {
        element("#unknownLoading").style.top = "-60px";
    }, 3000);
    clearInterval(i8);
}
function unknownloadingStart() {
    clearTimeout(t8);
    clearInterval(i8);
    element("#loadMess").innerText = "Connecting to server...";
    element("#loadingGear").style.display = "inline";
    element("#unknownLoading").style.top = "5vh";
    let count = 360;
    i8 = setInterval(() => {
        if (count <= 0) {
            count = 360;
        }
        element("#loadingGear").style.transform = "rotate(" + count + "deg)";
        count -= 10;
    }, 10);
}
function finalLoading() {
    element("#loading").style.display = "flex";
    let count = 0;
    let i9 = setInterval(() => {
        if (count > 100) {
            clearInterval(i9);
            element("#loading").style.display = "none";
        }
        element("#progressBar").style.width = (count + '%');
        count += 10;
    }, 500);
}
function reportRequestGenerator() {
    Swal.fire({
        title: 'Feel free to report ! 🤗!',
        input: 'textarea',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Close <<',
        confirmButtonText: 'Send To Devloper',
        preConfirm: (e) => {
            if (e.length === 0) {
                Swal.showValidationMessage('Type something in the complain box ?');
            }
        }
    }).then((eventData) => {
        if (eventData.isConfirmed) {
            requestManager('./reportData', { userId: ((data.id).toString() + choosedTeam), time: new Date().toString(), problem: eventData.value });
            messageLauncher({ name: '', body: 'We shared your problem(s) with the developer', type: 'success' });
        }
    });
}
function createMessageSendRequest() {
    let messageFiring = Swal.fire({
        title: 'Send Message:',
        input: 'text',
        inputValue: messageLefts,
        showConfirmButton: true,
        confirmButtonText: "Send 👋",
        showCancelButton: true,
        cancelButtonText: 'Back <<',
        showDenyButton: true,
        denyButtonText: 'Report ?',
        preConfirm: (data) => {
            if (data.length === 0) {
                Swal.showValidationMessage('Type something in the message box ?');
            } else if (data.length > 120) {
                data = data.slice(0, 100) + '....';
            }
            return data;
        }
    });
    let formattedInput = messageFiring.getInput();
    formattedInput.oninput = () => {
        messageLefts = formattedInput.value;
    }
    messageFiring.then((dataRec) => {
        if (dataRec.isConfirmed) {
            if (boolVars.socketConn) {
                sendToSoc({ type: 'userMessage', data: { sender: (getTurnRules - 1), mes: dataRec.value } });
                // messageLauncher({name: '', body: 'Message Sent', type: 'success'});
                Swal.fire({
                    icon: 'success',
                    text: 'Message Sent!',
                    showConfirmButton: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    timer: 2000,
                });
                messageLefts = '';
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'Failed to send message !',
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
        } else if (dataRec.isDenied) {
            reportRequestGenerator();
        }
    });
}
function onGameStart(notAll) {
    element('#socialGate').onclick = createMessageSendRequest;
    // connectServer(cachedData);
    setUpDataAtClientSide(cachedData);
    element("#dataId").innerText = data.id;
    ourGoats = document.getElementsByClassName(choosedTeam);
    setTurnIndexing();
    if (notAll) {
        boolVars.fetchOldSessionData = true;
    }
    else {
        serverManager({ t: turnIndexing[0] });
        newTurn();
    }
    window.onbeforeunload = () => {
        return true;
    }
}
function numtoRank(num) {
    if (num == 1) {
        return "1st";
    }
    else if (num == 2) {
        return "2nd";
    }
    else if (num == 3) {
        return "3rd";
    }
    else {
        return num + "th";
    }
}
function setUpDataAtClientSide(dataR) {
    globalGameStatus = dataR.sts;
    if (globalGameStatus == "ended") {
        if (!boolVars.loadAnimation) {
            element("#dataId").innerText = data.id;
            boolVars.showGame = false;
            element("#viewInfo").style.display = "flex";
            boolVars.allowServer = false;
        }
        element("#waitingRoom").style.display = "none";
        window.onbeforeunload = () => { };
    }
    else {
        tp = dataR.tp;
        if (totalTurns != dataR.tt && boolVars.gameStarted) {
            totalTurns = dataR.tt;
            if (getTurnRules != turnCounter && turnCounter != 0) {
                fixedThrow(dataR[boardSerise[turnCounter - 1] + 'd1'], dataR[boardSerise[turnCounter - 1] + 'd2'], boardSerise[turnCounter - 1]);
            }
        }
        if (boolVars.fetchOldSessionData) {
            additionalTurns = dataR[choosedTeam + 'ad'];
            boolVars.pass = dataR[choosedTeam + 'p'];
            boolVars.fetchOldSessionData = false;
        }
        if (getTurnRules != turnCounter) {
            setUpBoardsUsingServerDecoderData(dataR);
        }
        if (turnCounter != dataR.t && boolVars.gameStarted) {
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
    if (!boolVars.gameStarted) {
        for (let index = 0; index < 4; index++) {
            let joingingStatus = "false";
            const waitingStatus = (dataR[boardSerise[index] + 'n'] == "Waiting for someone to join...");
            const undStatus = (dataR[boardSerise[index] + 'n'] == "absent");
            if (!waitingStatus && !undStatus) {
                joingingStatus = "true";
                element("#name" + boardSerise[index]).innerText = dataR[boardSerise[index] + 'n'];
                document.querySelectorAll(".usNameRec")[index].style.fontStyle = "normal";
                // document.querySelectorAll(".playstatus")[index].classList.add("presentHere");
                // document.querySelectorAll(".playstatus")[index].innerText = "----Still In The Match";
            }
            else if (waitingStatus || undStatus) {
                document.querySelectorAll(".usNameRec")[index].style.fontStyle = "italic";
            }
            document.querySelectorAll(".dataName")[index].innerText = dataR[boardSerise[index] + 'n'];
            document.querySelectorAll(".usNameRec")[index].innerText = dataR[boardSerise[index] + 'n'];
            document.querySelectorAll(".usNameRec")[index].parentElement.setAttribute("presence", joingingStatus);
        }
        if (dataR.sts == "started") {
            boolVars.loadAnimation = true;
            globalGameStatus = "started";
            if (boolVars.allowServer) {
                unknownloadingStop();
                finalLoading();
            }
            boolVars.showGame = true;
            element("#waitingRoom").style.display = "none";
            boolVars.gameStarted = true;
            if (dataR.tt == 0) {
                onGameStart(false);
            }
            else {
                onGameStart(true);
            }
        }
    }
    // Assining ranks to the players
    // for (let index = 0; index < 4; index++) {
    //     if (dataR[boardSerise[index] + 's'] != '0') {
    //         if (dataR[boardSerise[index] + 's'] != '7') {
    //             let dataRanking = `${numtoRank(dataR[boardSerise[index] + 's'])} Rank`;
    //             element("#team" + boardSerise[index]).innerText = dataRanking;
    //             document.querySelectorAll(".playstatus")[index].innerText = "---" + dataRanking;
    //         }
    //         else {
    //             let dataRanking = "Last";
    //             element("#team" + boardSerise[index]).innerText = dataRanking;
    //             document.querySelectorAll(".playstatus")[index].innerText = "---" + dataRanking;
    //         }
    //     }
    //     else if (turnIndexing.length == 1 && dataR[boardSerise[turnIndexing[0] - 1] + 's'] == '0') {
    //         let dataRanking = "Last";
    //         element("#team" + boardSerise[turnIndexing[0] - 1]).innerText = dataRanking;
    //         document.querySelectorAll(".playstatus")[turnIndexing[0] - 1].innerText = "---" + dataRanking;
    //         let send = new Object;
    //         send[boardSerise[turnIndexing[0] - 1] + 's'] = '7';
    //         serverManager(send);
    //         delete (send);
    //     }
    // }
}
function sendToSoc(objectData) {
    if (typeof (objectData) !== 'object') {
        return 0;
    }
    if (boolVars.socketConn) {
        if (Object.keys(objectData).length > 0) {
            socket.send(JSON.stringify({ id: data.id, body: objectData }));
        }
    }
    else {
        socketPendingData.push(objectData);
    }
}
function messageLauncher(mesObj) {
    if (mesObj.body.length > 120) {
        mesObj.body = mesObj.body.slice(0, 120);
    }
    let timing = mesObj.body.length * 1000;
    if (timing < 5000) {
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
function socketDataManager(message) {
    message = JSON.parse(message.data);
    if (message.type === 'outStatusUpdate') {
        outAnimation(message.outMaker);
    } else if (message.type === 'userMessage') {
        messageLauncher({ name: teamNames[message.data.sender].innerText + ':', body: message.data.mes });
    }
    else {
        cachedDataUpdater(message);
        setUpDataAtClientSide(cachedData);
    }
};
function connectServer() {
    // boolVars.connectingToSocket = true;
    // return new Promise((resolve) => {
    requestManager('./download', { name: data.name, id: data.id, team: data.team }).then((response) => {
        return JSON.parse(response);
    }).then((res) => {
        cachedDataUpdater(res);
        setUpDataAtClientSide(cachedData);
        if (boolVars.clientUpdate) {
            socket = new WebSocket(`ws://${window.location.host}:${data.id}`);
            socket.addEventListener('open', () => {
                boolVars.socketConn = true;
                // boolVars.connectingToSocket = false;
                let pendingDataLimts = socketPendingData.length
                for (let index = 0; index < pendingDataLimts; index++) {
                    sendToSoc(socketPendingData[index]);
                    socketPendingData.splice(0, 1);
                }
            });
            socket.addEventListener('message', socketDataManager);
            socket.addEventListener('close', () => {
                boolVars.socketConn = false;
                // let realTimeHandleri1 = setInterval(() => {
                // if (!boolVars.socketConn) {
                if (boolVars.uploading) {
                    boolVars.uploadCreateCon = true;
                } else {
                    // socket = new WebSocket(`ws://${window.location.host}:${data.id}`);
                    setTimeout(() => {
                        connectServer();
                    }, 2000);
                }
                // }
            });
        }
    }).catch((err) => {
        if (boolVars.clientUpdate) {
            if (boolVars.uploading) {
                boolVars.uploadCreateCon = true;
            } else {
                setTimeout(() => {
                    connectServer();
                }, 2000);
            }
        }
    });
    // });
}
function serverUpdater(sendData) {
    if (boolVars.gameStarted) {
        boolVars.serverBusy = true;
        let furtherQ = false, syncingStatus = true;
        if (sendData['fe'] !== undefined) {
            furtherQ = true;
            delete (sendData['fe']);
        } else if (sendData['sync'] === 'yes') {
            syncingStatus = false;
            delete (sendData['sync']);
        }
        boolVars.uploading = true;
        requestManager('./upload', { name: data.name, team: data.team, id: data.id, upData: sendData }).then((res) => {
            return res;
        }).then(() => {
            if (syncingStatus) {
                sendToSoc(sendData);
            }
            if (!boolVars.socketConn && boolVars.uploadCreateCon) {
                boolVars.restartServer = true;
            }
            boolVars.serverBusy = false;
            boolVars.uploading = false;
            boolVars.uploadCreateCon = false;
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
function serverManager(obj, imp) {
    if (!boolVars.allowServer && imp != "most") {
        return 0;
    }
    qUFS[qUFS.length] = obj;
    if (qUFS.length == 1) {
        i10 = setInterval(() => {
            if (qUFS.length === 0) {
                if (boolVars.restartServer) {
                    connectServer();
                    boolVars.restartServer = false;
                }
                clearInterval(i10);
            }
            else if (!boolVars.serverBusy) {
                serverUpdater(qUFS[0]);
                qUFS = dequeueArr(qUFS);
            }
        }, 500);
    }
    // else if (qUFS.length === 0) {
    //     boolVars.noUploadsLeft = true;
    // }
}
function winnerFinal(winnername) {
    element("#canvas").style.display = "block";
    initConfetti();
    render();
    finalWinner.play();
    Swal.fire({
        icon: 'info',
        text: winnername + " won this match",
    }).then(() => { setTurnIndexing(); });
}
function setAtHome() {
    let a, b, c, d;
    if (choosedTeam == 'r') {
        a = 'r';
        b = 'g';
        c = 'y';
        d = 'b';
    }
    else if (choosedTeam == 'g') {
        a = 'g';
        b = 'y';
        c = 'b';
        d = 'r';
    }
    else if (choosedTeam == 'y') {
        a = 'y';
        b = 'b';
        c = 'r';
        d = 'g';
    }
    else if (choosedTeam == 'b') {
        a = 'b';
        b = 'r';
        c = 'g';
        d = 'y';
    };
    if (element('#' + a + "a").getAttribute("ludoid") == 0) {
        element('#' + a + "a").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + a + "a").offsetWidth / 2)) + (board.offsetHeight / 15) * 2)) + "px";
        element('#' + a + "a").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + a + "a").offsetHeight)) + (board.offsetHeight / 15) * 11)) + "px";
    };
    if (element('#' + a + "b").getAttribute("ludoid") == 0) {
        element('#' + a + "b").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + a + "b").offsetWidth / 2)) + (board.offsetHeight / 15) * 4)) + "px";
        element('#' + a + "b").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + a + "b").offsetHeight)) + (board.offsetHeight / 15) * 11)) + "px";
    };
    if (element('#' + a + "c").getAttribute("ludoid") == 0) {
        element('#' + a + "c").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + a + "c").offsetWidth / 2)) + (board.offsetHeight / 15) * 2)) + "px";
        element('#' + a + "c").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + a + "c").offsetHeight)) + (board.offsetHeight / 15) * 13)) + "px";
    };
    if (element('#' + a + "d").getAttribute("ludoid") == 0) {
        element('#' + a + "d").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + a + "d").offsetWidth / 2)) + (board.offsetHeight / 15) * 4)) + "px";
        element('#' + a + "d").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + a + "d").offsetHeight)) + (board.offsetHeight / 15) * 13)) + "px";
    };
    if (element('#' + b + "a").getAttribute("ludoid") == 0) {
        element('#' + b + "a").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + b + "a").offsetWidth / 2)) + (board.offsetHeight / 15) * 2)) + "px";
        element('#' + b + "a").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + b + "a").offsetHeight)) + (board.offsetHeight / 15) * 2)) + "px";
    };
    if (element('#' + b + "b").getAttribute("ludoid") == 0) {
        element('#' + b + "b").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + b + "b").offsetWidth / 2)) + (board.offsetHeight / 15) * 4)) + "px";
        element('#' + b + "b").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + b + "b").offsetHeight)) + (board.offsetHeight / 15) * 2)) + "px";
    };
    if (element('#' + b + "c").getAttribute("ludoid") == 0) {
        element('#' + b + "c").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + b + "c").offsetWidth / 2)) + (board.offsetHeight / 15) * 2)) + "px";
        element('#' + b + "c").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + b + "c").offsetHeight)) + (board.offsetHeight / 15) * 4)) + "px";
    };
    if (element('#' + b + "d").getAttribute("ludoid") == 0) {
        element('#' + b + "d").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + b + "d").offsetWidth / 2)) + (board.offsetHeight / 15) * 4)) + "px";
        element('#' + b + "d").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + b + "d").offsetHeight)) + (board.offsetHeight / 15) * 4)) + "px";
    };
    if (element('#' + c + "a").getAttribute("ludoid") == 0) {
        element('#' + c + "a").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + c + "a").offsetWidth / 2)) + (board.offsetHeight / 15) * 11)) + "px";
        element('#' + c + "a").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + c + "a").offsetHeight)) + (board.offsetHeight / 15) * 2)) + "px";
    };
    if (element('#' + c + "b").getAttribute("ludoid") == 0) {
        element('#' + c + "b").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + c + "b").offsetWidth / 2)) + (board.offsetHeight / 15) * 13)) + "px";
        element('#' + c + "b").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + c + "b").offsetHeight)) + (board.offsetHeight / 15) * 2)) + "px";
    };
    if (element('#' + c + "c").getAttribute("ludoid") == 0) {
        element('#' + c + "c").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + c + "c").offsetWidth / 2)) + (board.offsetHeight / 15) * 11)) + "px";
        element('#' + c + "c").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + c + "c").offsetHeight)) + (board.offsetHeight / 15) * 4)) + "px";
    };
    if (element('#' + c + "d").getAttribute("ludoid") == 0) {
        element('#' + c + "d").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + c + "d").offsetWidth / 2)) + (board.offsetHeight / 15) * 13)) + "px";
        element('#' + c + "d").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + c + "d").offsetHeight)) + (board.offsetHeight / 15) * 4)) + "px";
    };
    if (element('#' + d + "a").getAttribute("ludoid") == 0) {
        element('#' + d + "a").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + d + "a").offsetWidth / 2)) + (board.offsetHeight / 15) * 11)) + "px";
        element('#' + d + "a").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + d + "a").offsetHeight)) + (board.offsetHeight / 15) * 11)) + "px";
    };
    if (element('#' + d + "b").getAttribute("ludoid") == 0) {
        element('#' + d + "b").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + d + "b").offsetWidth / 2)) + (board.offsetHeight / 15) * 13)) + "px";
        element('#' + d + "b").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + d + "b").offsetHeight)) + (board.offsetHeight / 15) * 11)) + "px";
    };
    if (element('#' + d + "c").getAttribute("ludoid") == 0) {
        element('#' + d + "c").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + d + "c").offsetWidth / 2)) + (board.offsetHeight / 15) * 11)) + "px";
        element('#' + d + "c").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + d + "c").offsetHeight)) + (board.offsetHeight / 15) * 13)) + "px";
    };
    if (element('#' + d + "d").getAttribute("ludoid") == 0) {
        element('#' + d + "d").style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element('#' + d + "d").offsetWidth / 2)) + (board.offsetHeight / 15) * 13)) + "px";
        element('#' + d + "d").style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element('#' + d + "d").offsetHeight)) + (board.offsetHeight / 15) * 13)) + "px";
    };
    element("#score" + a).setAttribute("controller", "internal");
    winedGoats = document.querySelectorAll("[ludoid='58']").length;
    element("#score" + a).innerText = winedGoats;
    if (winedGoats == 4 && !boolVars.gameended) {
        boolVars.gameended = true;
        let send = new Object;
        send[choosedTeam + 's'] = tp;
        send['tp'] = (tp + 1)
        serverManager(send);
        delete (send);
    }
    element("#score" + a).style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element("#score" + a).offsetWidth / 2)) + (board.offsetHeight / 15) * 7)) + "px";
    element("#score" + a).style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element("#score" + a).offsetHeight / 2)) + (board.offsetHeight / 15) * 8)) + "px";
    element("#score" + b).style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element("#score" + b).offsetWidth / 2)) + (board.offsetHeight / 15) * 6)) + "px";
    element("#score" + b).style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element("#score" + b).offsetHeight / 2)) + (board.offsetHeight / 15) * 7)) + "px";
    element("#score" + c).style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element("#score" + c).offsetWidth / 2)) + (board.offsetHeight / 15) * 7)) + "px";
    element("#score" + c).style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element("#score" + c).offsetHeight / 2)) + (board.offsetHeight / 15) * 6)) + "px";
    element("#score" + d).style.left = (board.offsetLeft + (((bBoxes(1) / 2) - (element("#score" + d).offsetWidth / 2)) + (board.offsetHeight / 15) * 8)) + "px";
    element("#score" + d).style.top = (board.offsetTop + (((bBoxes(1) / 2) - (element("#score" + d).offsetHeight / 2)) + (board.offsetHeight / 15) * 7)) + "px";
    element("#team" + a).style.left = (board.offsetLeft) + "px";
    element("#team" + a).style.top = (board.offsetTop + bBoxes(9)) + "px";
    element("#team" + b).style.left = (board.offsetLeft) + "px";
    element("#team" + b).style.top = (board.offsetTop + (bBoxes(5))) + "px";
    element("#team" + c).style.left = (board.offsetLeft + bBoxes(9)) + "px";
    element("#team" + c).style.top = (board.offsetTop + (bBoxes(5))) + "px";
    element("#team" + d).style.left = (board.offsetLeft + bBoxes(9)) + "px";
    element("#team" + d).style.top = (board.offsetTop + bBoxes(9)) + "px";
    element("#dicet" + a).style.left = (board.offsetLeft) + "px";
    element("#dicet" + a).style.top = (board.offsetTop + bBoxes(14)) + "px";
    element("#dicet" + b).style.left = (board.offsetLeft) + "px";
    element("#dicet" + b).style.top = (board.offsetTop) + "px";
    element("#dicet" + c).style.left = (board.offsetLeft + bBoxes(9)) + "px";
    element("#dicet" + c).style.top = (board.offsetTop) + "px";
    element("#dicet" + d).style.left = (board.offsetLeft + bBoxes(9)) + "px";
    element("#dicet" + d).style.top = (board.offsetTop + bBoxes(14)) + "px";
    element("#name" + a).style.left = (board.offsetLeft + bBoxes(2.2)) + "px";
    element("#name" + a).style.top = (board.offsetTop + bBoxes(14)) + "px";
    element("#name" + b).style.left = (board.offsetLeft + bBoxes(2.2)) + "px";
    element("#name" + b).style.top = (board.offsetTop) + "px";
    element("#name" + c).style.left = (board.offsetLeft + bBoxes(11.2)) + "px";
    element("#name" + c).style.top = (board.offsetTop) + "px";
    element("#name" + d).style.left = (board.offsetLeft + bBoxes(11.2)) + "px";
    element("#name" + d).style.top = (board.offsetTop + bBoxes(14)) + "px";
};
function putGoats(elem, id, type) {
    if (id == 0) {
        elem.setAttribute(type, 0);
        setAtHome();
        return false;
    }
    else {

        let position = putAtBoard(id, elem.offsetWidth / 2, elem.offsetHeight);
        elem.style.left = position.x + "px";
        elem.style.top = position.y + "px";
        elem.style.zIndex = position.z;
        elem.setAttribute(type, id);
    };
    return true;
};
function scoreBoardManager(team) {
    const winingSeris = [58, 13.6, 26.6, 39.6];
    const targetedId = idDecoder(winingSeris[findChr(team, boardSerise)]);
    element("#score" + team).innerText = document.querySelectorAll("[ludoid='" + targetedId + "']").length;
}
function standarizeGoats(vals) {
    let keysOfVals = Object.keys(vals);
    for (let index = 0; index < keysOfVals.length; index++) {
        vals[keysOfVals[index]] = idEncoder(vals[keysOfVals[index]]).toString();
    }
    return vals;
}
function updateGoatsToWindow() {
    let allworkinggoats = document.querySelectorAll("[ludoid]");
    for (let index = 0; index < allworkinggoats.length; index++) {
        if (allworkinggoats[index].getAttribute("ludoid") > 0) {
            putGoats(allworkinggoats[index], allworkinggoats[index].getAttribute("ludoid"), "ludoid");
        };
    };
};
function displaceGoat(goatID, elem, deleteReq) {
    if (goatID !== null) {
        elem = element('#' + goatID);
    }
    elem.style.opacity = 0;
    setTimeout(() => {
        elem.style.display = "none";
        if (deleteReq == "root") {
            elem.remove();
        }
    }, 1000);
};
function rgybDecode(arr) {
    let r = 0, g = 0, y = 0, b = 0, rids = [], gids = [], yids = [], bids = [];
    for (let index = 0; index < arr.length; index++) {
        if (arr[index][0] == "r") {
            r++;
            rids[r] = arr[index];
        }
        else if (arr[index] == "ga" || arr[index] == "gb" || arr[index] == "gc" || arr[index] == "gd") {
            g++;
            gids[g] = arr[index];
        }
        else if (arr[index][0] == "y") {
            y++;
            yids[y] = arr[index];
        }
        else if (arr[index][0] == "b") {
            b++;
            bids[b] = arr[index];
        };
    };
    return { r: r, g: g, y: y, b: b, rids: rids, gids: gids, yids: yids, bids: bids }
}
function imageDetector(elem) {
    if (elem.offsetHeight > 0 && elem.offsetWidth > 0) {
        return true;
    }
    else {
        return false;
    };
};
function startImaginGoatsAnimation() {
    clearInterval(i42);
    let count = 0;
    i42 = setInterval(() => {
        if (count > 99) {
            count = 0;
        }
        if (count % 2 == 0) {
            for (let index = 0; index < imgnGoats.length; index++) {
                imgnGoats[index].style.transform = "rotate(20deg)";
            }
        }
        else {
            for (let index = 0; index < imgnGoats.length; index++) {
                imgnGoats[index].style.transform = "rotate(5deg)";
            }
        }
        count++;
    }, 500);
}
function goatsAtMessageAppender(goat, nums, sarr) {
    for (let index = 0; index < nums; index++) {
        let elem = document.createElement("img");
        elem.alt = "goat";
        elem.classList.add("mfam");
        elem.classList.add("imginaryGoats");
        elem.setAttribute("vid", sarr[(index + 1)]);
        elem.setAttribute("focused", "not");
        elem.src = "./index_files/media/coded/" + goat + "g.svg";
        element("#messageDisplay").append(elem);
    };
};
function imaginaryGoatsSetup() {
    let imggoats = document.querySelectorAll("[vid]"), focusedGoats = document.querySelectorAll("[focused='yes']");
    for (let index = 0; index < imggoats.length; index++) {
        imggoats[index].onclick = () => {
            if (imggoats[index].getAttribute("vid")[0] == choosedTeam) {
                focusedGoats = document.querySelectorAll("[focused='yes']");
                if (element("#" + imggoats[index].getAttribute("vid")).onclick !== null && focusedGoats.length == 0) {
                    element("#" + imggoats[index].getAttribute("vid")).onclick();
                }
                else {
                    for (let indexb = 0; indexb < gPredictrs.length; indexb++) {
                        gPredictrs[indexb].style.top = "200vh"
                        gPredictrs[indexb].style.left = "200vw"
                    }
                }
                if (imggoats[index].getAttribute("focused") == "not") {
                    imggoats[index].setAttribute("focused", "yes");
                    imggoats[index].style.backgroundColor = "rgb(255,255,255)";
                }
                else {
                    imggoats[index].setAttribute("focused", "not");
                    imggoats[index].style.backgroundColor = "transparent";
                }
            }
            focusedGoats = document.querySelectorAll("[focused='yes']");
            if (focusedGoats.length > 0) {
                let parsingGoatsIDs = [];
                for (let indexb = 0; indexb < focusedGoats.length; indexb++) {
                    parsingGoatsIDs[indexb] = element('#' + focusedGoats[indexb].getAttribute('vid'));
                }
                goatsScorePredictorBarierd(parsingGoatsIDs);
            }
        }
    }
}
function messageSetter(arr) {
    let r, g, y, b, temptrash = rgybDecode(arr);
    r = temptrash.r;
    g = temptrash.g;
    y = temptrash.y;
    b = temptrash.b;
    element("#messageDisplay").innerHTML = '';
    element("#messageDisplay").style.bottom = "15vh";
    boolVars.displayingMessage = true;
    goatsAtMessageAppender("r", r, temptrash.rids);
    goatsAtMessageAppender("g", g, temptrash.gids);
    goatsAtMessageAppender("y", y, temptrash.yids);
    goatsAtMessageAppender("b", b, temptrash.bids);
    startImaginGoatsAnimation();
    imgnGoats = document.querySelectorAll(".imginaryGoats");
    boardSize();
    imaginaryGoatsSetup();
};
function groupRequest(arr, id) {
    let r, g, y, b, temptrash = rgybDecode(arr), type;
    r = temptrash.r;
    g = temptrash.g;
    y = temptrash.y;
    b = temptrash.b;
    if (g + y + b == 0 && r == 2) {
        type = "rbg";
    }
    else if (r + y + b == 0 && g == 2) {
        type = "gbg";
    }
    else if (g + r + b == 0 && y == 2) {
        type = "ybg";
    }
    else if (g + y + r == 0 && b == 2) {
        type = "bbg";
    }
    else {
        type = "group";
    };
    // if (type == "group" && !isSafe(id) && !arrayElemsEqualityCheckerForLudoGoats(arr)) {
    //     let exceptingIndex = newGoatDetector(arr);
    //     for (let index = 0; index < arr.length; index++) {
    //         if (arr[index][0] == exceptingIndex[0]) {
    //             continue;
    //         }
    //         else {
    //             element('#' + arr[index]).setAttribute("ludoid", '0');
    //             out.play();
    //             sendMessTo("Yay 😁!", boardSerise[turnCounter - 1]);
    //             if (exceptingIndex[0] == choosedTeam) {
    //                 let send = new Object;
    //                 send[arr[index]] = '0';
    //                 send[choosedTeam + "ad"] = (additionalTurns + 1);
    //                 send[choosedTeam + 'p'] = true;
    //                 serverManager(send);
    //                 delete (send);
    //                 boolVars.pass = true;
    //                 additionalTurns++;
    //             }
    //         }
    //     }
    //     groupCompain();
    // }
    // else {
    for (let index = 0; index < arr.length; index++) {
        element("#" + arr[index]).style.opacity = 0;
        element("#" + arr[index]).setAttribute("visibility", "hidden");
    }
    const gimg = document.createElement("img");
    gimg.src = "./index_files/media/coded/" + type + ".svg";
    gimg.alt = "group";
    gimg.classList.add("goats");
    gimg.classList.add("sgoats");
    gimg.classList.add("mfam");
    gimg.setAttribute("group", "0");
    gimg.setAttribute("groupchilds", arr.length);
    gimg.style.height = (board.offsetHeight / (652 / 50)) + "px";
    gimg.style.borderRadius = (board.offsetHeight / (652 / 5)) + "px";
    gimg.style.display = "inline";
    board.append(gimg);
    if (id.slice(-2) == ".6" || id == "58") {
        putGoats(gimg, id, "group");
        gimg.style.opacity = "0";
    }
    else {
        let i = setInterval(() => {
            putGoats(gimg, id, "group");
            if (imageDetector(gimg)) {
                gimg.style.opacity = 1;
                clearInterval(i);
            };
        }, 100);
    }
    gimg.onclick = () => {
        messageSetter(arr, id);
        enableClickPrevention();
    };
    // }
}
function groupCompain() {
    const allOfGroups = document.querySelectorAll("[group]");
    for (let index = 0; index < allOfGroups.length; index++) {
        allOfGroups[index].style.left = "200vw";
        allOfGroups[index].style.top = "200vw";
        displaceGoat(null, allOfGroups[index], "root");
    }
    const allinvisibleGoats = document.querySelectorAll("[visibility='hidden']");
    for (let index = 0; index < allinvisibleGoats.length; index++) {
        if (allinvisibleGoats[index].getAttribute("destination") == "no") {
            allinvisibleGoats[index].setAttribute("visibility", "visible");
            allinvisibleGoats[index].style.opacity = 1;
        }
    }
    const allludoGoats = document.querySelectorAll("[ludoid]");
    for (let index = 0; index < allludoGoats.length; index++) {
        if (allludoGoats[index].getAttribute("ludoid") == 0) {
            continue;
        }
        const hereID = allludoGoats[index].getAttribute("ludoid");
        const cIDElems = document.querySelectorAll("[ludoid='" + hereID + "']");
        if (cIDElems.length > 1) {
            let sarrids = [];
            for (let indexb = 0; indexb < cIDElems.length; indexb++) {
                cIDElems[indexb].setAttribute("visibility", "hidden");
                cIDElems[indexb].style.opacity = 0;
                sarrids[indexb] = cIDElems[indexb].id;
            }
            groupRequest(sarrids, cIDElems[0].getAttribute("ludoid"));
        }
    }
}
function checkPlacements() {
    groupCompain();
    setAtHome();
};
function boardManager(vals, sync) {
    let keyVals = Object.keys(vals);
    for (let index = 0; index < keyVals.length; index++) {
        let elem = element('#' + keyVals[index]), id = vals[keyVals[index]].toString();
        let targetedPlaceGoats = document.querySelectorAll(`[ludoid="${id}"]`);
        if (!isSafe(parseInt(id)) && targetedPlaceGoats.length > 0) {
            let removeableGoats = new Object;
            for (let indexb = 0; indexb < targetedPlaceGoats.length; indexb++) {
                if (elem.id[0] !== targetedPlaceGoats[indexb].id[0]) {
                    // removeableGoats.push(targetedPlaceGoats[indexb].id + '0');
                    removeableGoats[targetedPlaceGoats[indexb].id] = '0';
                }
            }
            if (Object.keys(removeableGoats).length > 0) {
                out.play();
                sendMessTo("Yay 😁!", boardSerise[turnCounter - 1]);
                // cachedDataUpdater(removeableGoats);
                if (turnCounter === getTurnRules) {
                    // sendToSoc({ type: 'outStatusUpdate', outMaker: choosedTeam });
                    let send = new Object;
                    send[choosedTeam + "ad"] = (additionalTurns + Object.keys(removeableGoats).length);
                    send[choosedTeam + 'p'] = true;
                    serverManager(send);
                    delete (send);
                    boolVars.pass = true;
                    additionalTurns += Object.keys(removeableGoats).length;
                }
                boardManager(removeableGoats, true);
            }
        }
        if (id != elem.getAttribute("ludoid")) {
            for (let index = 0; index < allBoardGoats.length; index++) {
                if (elem.id == allBoardGoats[index].id) {
                    continue;
                }
                allBoardGoats[index].setAttribute("timing", '0');
            }
            elem.setAttribute("timing", '5');
            movement.play();
        }
        if (id.slice(-2) == ".6" || id == '58') {
            elem.setAttribute("destination", "yes");
        }
        else {
            elem.setAttribute("destination", "no");
            elem.style.opacity = '1';
        }
        if (id == '58' && elem.getAttribute("ludoid") != '58' || id.slice(-2) == ".6" && elem.getAttribute("ludoid").slice(-2) != ".6") {
            if (id == 58 && elem.getAttribute("ludoid") != 58) {
                let send = new Object;
                send[choosedTeam + "ad"] = (additionalTurns + 1);
                serverManager(send);
                delete (send);
                additionalTurns++;
            }
            if (element("#score" + elem.id[0]).innerText == '3') {
                setTimeout(() => {
                    winnerFinal(document.querySelectorAll(".usNameRec")[findChr(elem.id[0], boardSerise)].innerText);
                    document.querySelectorAll(".attendent")[findChr(elem.id[0], boardSerise)].setAttribute("presence", "false");
                    // if(turnCounter === getTurnRules && findChr(turnCounter,turnCounter) === 'false'){
                        // exitTurn();
                    // }
                }, 2000);
                additionalTurns = 0;
            }
            else {
                winner.play();
            }
            elem.setAttribute("destination", "yes");
            elem.style.opacity = 0;
        }
        if (putGoats(elem, id, "ludoid")) {
            scoreBoardManager(elem.id[0]);
        }
    }
    let standardComData = standarizeGoats(vals);
    cachedDataUpdater(standardComData);
    if (turnCounter == getTurnRules) {
        if (sync) {
            standardComData['sync'] = 'yes';
        }
        serverManager(standardComData);
    }
    updateGoatsToWindow();
    checkPlacements();
};
function teamChoosed() {
    setAtHome();
    if (choosedTeam == 'r') {
        getTurnRules = 1;
    }
    else if (choosedTeam == 'g') {
        bcmian.style.transform = "rotate(-90deg)";
        getTurnRules = 2;
    }
    else if (choosedTeam == 'y') {
        bcmian.style.transform = "rotate(-180deg)";
        getTurnRules = 3;
    }
    else if (choosedTeam == 'b') {
        bcmian.style.transform = "rotate(90deg)";
        getTurnRules = 4;
    };
};
function getRd(num) {
    return (board.offsetHeight / (652 / num));
}
function boardSize() {
    const winHeight = window.innerHeight - 70;
    if (winHeight - window.innerWidth == 0) {
        board.style.height = winHeight + "px";
        board.style.width = window.innerWidth + "px";
    }
    else if (winHeight - window.innerWidth > 0) {
        board.style.width = window.innerWidth + "px";
        board.style.height = window.innerWidth + "px";
    }
    else {
        board.style.height = winHeight + "px";
        board.style.width = winHeight + "px";
    };
    const scores = document.querySelectorAll(".scores");
    const teamsMesses = document.querySelectorAll(".teamMesses");
    const dices = document.querySelectorAll(".dices");
    const dside = document.querySelectorAll(".dside");
    for (let index = 0; index < dside.length; index++) {
        dside[index].style.width = bBoxes(1) + 'px';
        dside[index].style.boxShadow = `${getRd(6)}px ${getRd(3)}px ${getRd(6)}px ${getRd(0.5)}px rgba(26, 26, 26, 0.864)`;
        dside[index].style.borderRadius = getRd(10) + 'px';
    };
    for (let index = 0; index < gPredictrs.length; index++) {
        gPredictrs[index].style.width = bBoxes(1) + "px";
        gPredictrs[index].style.height = bBoxes(1) + "px";
        gPredictrs[index].style.borderRadius = getRd(30) + "px";
        gPredictrs[index].style.fontSize = getRd(30) + "px";
    };
    for (let index = 0; index < teamsMesses.length; index++) {
        teamsMesses[index].style.width = bBoxes(6) + "px";
        teamsMesses[index].style.height = bBoxes(1) + "px";
    };
    for (let index = 0; index < dices.length; index++) {
        dices[index].style.height = bBoxes(1) + "px";
        dices[index].style.width = bBoxes(2) + "px";
    };
    for (let index = 0; index < teamNames.length; index++) {
        teamNames[index].style.fontSize = getRd(30) + "px";
        teamNames[index].style.width = getRd(130) + "px";
        teamNames[index].style.height = bBoxes(1) + "px";
    };
    for (let index = 0; index < dices.length; index++) {
        dices[index].style.borderWidth = getRd(3) + "px";
        dices[index].style.borderRadius = getRd(10) + "px";
    };
    for (let index = 0; index < messagesTeams.length; index++) {
        messagesTeams[index].style.fontSize = getRd(30) + "px";
    };
    for (let index = 0; index < imgnGoats.length; index++) {
        imgnGoats[index].style.marginLeft = getRd(15) + "px";
    };
    for (let index = 0; index < scores.length; index++) {
        scores[index].style.fontSize = getRd(25) + "px";
    };
    for (let index = 0; index < goats.length; index++) {
        goats[index].style.height = getRd(50) + "px";
        goats[index].style.borderRadius = getRd(5) + "px";
    };
    bcmian.style.height = board.offsetHeight + "px";
    bcmian.style.width = board.offsetHeight + "px";
    bcmian.style.left = board.offsetLeft + "px";
    bcmian.style.top = board.offsetTop + "px";
    diceframeRateManager = getRd(10);
    element("#messageDisplay").style.borderRadius = getRd(10) + "px";
    element("#messageDisplay").style.padding = getRd(10) + "px";
    element("#messageDisplay").style.height = getRd(80) + "px";
    element("#diceRunner").style.height = bBoxes(6) + "px";
    element("#diceRunner").style.width = bBoxes(6) + "px";
    element("#diceRunner").style.top = (board.offsetTop + bBoxes(9)) + "px";
    element("#diceRunner").style.left = board.offsetLeft + "px";
    element("#skipBox").style.height = bBoxes(3) + "px";
    element("#skipBox").style.width = bBoxes(3) + "px";
    element("#skipBox").style.top = (board.offsetTop + bBoxes(6)) + "px";
    element("#skipBox").style.left = (board.offsetLeft + bBoxes(6)) + "px";
    element("#skipBox").style.fontSize = getRd(40) + "px";
    element('#socialGate').style.borderWidth = getRd(0.3) + 'px';
    element('#socialGate').onmouseover = () => {
        element('#socialGate').style.height = bBoxes(1.2) + 'px';
        element('#socialGate').style.width = bBoxes(1.2) + 'px';
        element('#socialGate').style.left = (board.offsetLeft + bBoxes(6.9)) + 'px';
        element('#socialGate').style.top = (board.offsetTop + bBoxes(6.9)) + 'px';
        element('#socialGate').style.boxShadow = `${getRd(10)}px ${getRd(10)}px ${getRd(10)}px ${getRd(0.5)}px rgba(26, 26, 26, 0.864)`;
        element('#socialGate').style.borderRadius = getRd(30) + 'px';
    }
    element('#socialGate').onmouseout = () => {
        element('#socialGate').style.height = bBoxes(1) + 'px';
        element('#socialGate').style.width = bBoxes(1) + 'px';
        element('#socialGate').style.left = (board.offsetLeft + bBoxes(7)) + 'px';
        element('#socialGate').style.top = (board.offsetTop + bBoxes(7)) + 'px';
        element('#socialGate').style.boxShadow = `${getRd(3)}px ${getRd(3)}px ${getRd(7)}px ${getRd(0.5)}px rgba(26, 26, 26, 0.864)`;
        element('#socialGate').style.borderRadius = getRd(20) + 'px';
    }
    element('#socialGate').onmouseout();
    updateGoatsToWindow();
    teamChoosed();
    checkPlacements();
    setTimeout(() => {
        updateGoatsToWindow();
        teamChoosed();
        checkPlacements();
    }, 2000);
};
window.onresize = boardSize;
window.onresize();
window.onload = boardSize;
// function boardManager(vals, sync) {
//     let sendingVals = new Object;
//     for (let index = 0; index < vals.length; index++) {
//         if (turnCounter == getTurnRules) {
//             sendingVals[vals[index].slice(0, 2)] = String(idEncoder(vals[index].slice(2)));
//         }
//         let elem = element('#' + vals[index].slice(0, 2)), id = vals[index].slice(2);
//         let targetedPlaceGoats = document.querySelectorAll(`[ludoid="${id}"]`);
//         if (!isSafe(parseInt(id)) && targetedPlaceGoats.length > 0) {
//             let removeableGoats = [];
//             for (let indexb = 0; indexb < targetedPlaceGoats.length; indexb++) {
//                 if (elem.id[0] !== targetedPlaceGoats[indexb].id[0]) {
//                     removeableGoats.push(targetedPlaceGoats[indexb].id + '0');
//                 }
//             }
//             if (removeableGoats.length > 0) {
//                 boardManager(removeableGoats, true);
//                 out.play();
//                 sendMessTo("Yay 😁!", boardSerise[turnCounter - 1]);
//                 cachedDataUpdater(removeableGoats);
//                 if (turnCounter === getTurnRules) {
//                     // sendToSoc({ type: 'outStatusUpdate', outMaker: choosedTeam });
//                     let send = new Object;
//                     send[choosedTeam + "ad"] = (additionalTurns + removeableGoats.length);
//                     send[choosedTeam + 'p'] = true;
//                     serverManager(send);
//                     delete (send);
//                     boolVars.pass = true;
//                     additionalTurns += removeableGoats.length;
//                 }
//             }
//         }
//         if (id != elem.getAttribute("ludoid")) {
//             for (let index = 0; index < allBoardGoats.length; index++) {
//                 if (elem.id == allBoardGoats[index].id) {
//                     continue;
//                 }
//                 allBoardGoats[index].setAttribute("timing", '0');
//             }
//             elem.setAttribute("timing", '5');
//             movement.play();
//         }
//         if (vals[index].slice(-2) == ".6" || vals[index].slice(2) == "58") {
//             element('#' + vals[index].slice(0, 2)).setAttribute("destination", "yes");
//         }
//         else {
//             element('#' + vals[index].slice(0, 2)).setAttribute("destination", "no");
//             element('#' + vals[index].slice(0, 2)).style.opacity = 1;
//         }
//         if (id == 58 && elem.getAttribute("ludoid") != '58' || id.slice(-2) == ".6" && elem.getAttribute("ludoid").slice(-2) != ".6") {
//             if (id == 58 && elem.getAttribute("ludoid") != 58) {
//                 let send = new Object;
//                 send[choosedTeam + "ad"] = (additionalTurns + 1);
//                 serverManager(send);
//                 delete (send);
//                 additionalTurns++;
//             }
//             if (element("#score" + elem.id[0]).innerText == '3') {
//                 setTimeout(() => {
//                     winnerFinal(document.querySelectorAll(".usNameRec")[findChr(elem.id[0], boardSerise)].innerText);
//                     document.querySelectorAll(".attendent")[findChr(elem.id[0], boardSerise)].setAttribute("presence", "false");
//                 }, 2000);
//                 additionalTurns = 0;
//             }
//             else {
//                 winner.play();
//             }
//             element('#' + vals[index].slice(0, 2)).setAttribute("destination", "yes");
//             element('#' + vals[index].slice(0, 2)).style.opacity = 0;
//         }
//         if (putGoats(elem, id, "ludoid")) {
//             scoreBoardManager(elem.id[0]);
//         }
//     }
//     if (turnCounter == getTurnRules) {
//         cachedDataUpdater(sendingVals);
//         if (sync) {
//             sendingVals['sync'] = 'yes';
//         }
//         serverManager(sendingVals);
//     }
//     updateGoatsToWindow();
//     checkPlacements();
// };
function throwDices(single) {
    let newscore1 = 0, newscore2 = 0;
    if (!single) {
        do {
            newscore1 = parseInt(Math.random() * 10);
        } while (newscore1 <= 0 || newscore1 > 6);
    } else {
        newscore1 = 7;
    }
    do {
        newscore2 = parseInt(Math.random() * 10);
    } while (newscore2 <= 0 || newscore2 > 6);
    if (pat != 2) {
        newscore1 = pat[0];
        newscore2 = pat[1];
    }
    fixedThrow(newscore1, newscore2, choosedTeam);
    return { d1: newscore1, d2: newscore2 };
};
element("#diceRunner").onclick = () => {
    element("#diceRunner").style.display = "none";
    clearInterval(i2);
    let store, condition = false;
    if (winedGoats == 3) {
        condition = true;
    }
    store = throwDices(condition);
    let send = new Object;
    send[choosedTeam + "d1"] = String(store.d1);
    send[choosedTeam + "d2"] = String(store.d2);
    send["tt"] = (totalTurns + 1);
    cachedDataUpdater(send);
    setUpDataAtClientSide(cachedData);
    serverManager(send);
    delete (send);
    newTurn(store);
};
function stopAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
}
element("#skipBox").onclick = () => {
    element("#skipBox").style.display = "none";
    recoveryOurGoats();
    // setTimeout(() => {
    diceVals = [0, 0, 0, 0];
    additionalTurns = 0;
    exitTurn();
    // }, 2000);
}
function rememberingCurrentVals() {
    for (let index = 0; index < allBoardGoats.length; index++) {
        oldRecovery[allBoardGoats[index].id] = allBoardGoats[index].getAttribute("ludoid");
    }
}
function recoveryOurGoats() {
    let oldKeys = Object.keys(oldRecovery);
    for (let index = 0; index < oldKeys.length; index++) {
        if ((element('#' + oldKeys[index]).getAttribute("ludoid") == 58 && oldRecovery[index].slice(2) != 58) || (element('#' + oldKeys[index]).getAttribute("ludoid") == '.6' && oldRecovery[index].slice(2) != '.6')) {
            element('#' + oldKeys[index]).style.display = "inline";
            element('#' + oldKeys[index]).style.opacity = 1;
        }
        boardManager(oldRecovery);
    }
}
function isFightingMembers(turnNum) {
    const team = boardSerise[turnNum - 1];
    if (element("#score" + team).innerText == 4) {
        return false;
    }
    else {
        return true;
    };
}
const peoplesUpdater = () => {
    peoples = [];
    for (let index = 0; index < turnIndexing.length; index++) {
        peoples[index] = turnIndexing[index];
    }
}
function setTurnIndexing() {
    turnIndexing = [];
    for (let index = 0; index < 4; index++) {
        if (document.querySelectorAll("[presence='true']")[index] !== undefined) {
            const currentVal = findChr(document.querySelectorAll("[presence='true']")[index].children[1].classList[0][0], boardSerise) + 1;
            if (isFightingMembers(currentVal)) {
                turnIndexing[turnIndexing.length] = currentVal;
            }
        }
    }
    if (peoples.length > turnIndexing.length) {
        for (let index = 0; index < peoples.length; index++) {
            if (findChr(peoples[index], turnIndexing) === 'false') {
                const drivedPosition = numtoRank(takePoses);
                document.querySelectorAll(".playstatus")[peoples[index] - 1].innerText = `----${drivedPosition} Rank`;
                element("#team" + boardSerise[peoples[index] - 1]).innerText = `${drivedPosition} Rank`;
                let send = new Object;
                send[boardSerise[peoples[index] - 1] + 's'] = drivedPosition.toString();
                serverManager(send);
                delete (send);
                takePoses++;
                break;
            }
        }
        peoplesUpdater();
    } else if (peoples.length === 0) {
        peoplesUpdater();
    }
    if (turnIndexing.length == 1) {
        document.querySelectorAll(".playstatus")[turnIndexing[0] - 1].innerText = '----Last 😩';
        element("#team" + boardSerise[turnIndexing[0] - 1]).innerText = 'Last 😩';
        boolVars.showGame = false;
        element("#viewInfo").style.display = "flex";
        serverManager({ sts: "ended" }, "most");
        if (turnIndexing[0] == getTurnRules) {
            let send = new Object;
            send[choosedTeam + 's'] = '7';
            serverManager(send);
            delete (send);
        }
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
element("#startGame").onclick = () => {
    if (document.querySelectorAll("[presence='true']").length > 1) {
        unknownloadingStart();
        finalizeGameStart();
    }
    else {
        Swal.fire({ icon: "warning", text: "Waiting for other people to join." });
    }
}
element("#viewInfo").onclick = (e) => {
    if (e.target.classList.contains("subMenu") && boolVars.showGame) {
        element("#viewInfo").style.display = "none";
    }
}
element("#logoPortion").onclick = () => {
    element("#viewInfo").style.display = "flex";
}
// function allowExit() {
//     let rtval = true;
//     for (let index = 0; index < UPD.length; index++) {
//         if (!UPD[index]) {
//             rtval = false;
//             break;
//         }
//     }
//     return rtval;
// }
// function findChrNums(chr, string) {
//     let count = 0;
//     for (let index = 0; index < string.length; index++) {
//         if (string[index] == chr) {
//             count++;
//         }
//     }
//     return count;
// }
// const submenues = document.querySelectorAll(".subMenu");
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
            boolVars.clientUpdate = true;
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
unknownloadingStart();
function startLudoRightNow() {
    let sc = element("#startcontent");
    let ss = element("#startingScreen");
    // setTimeout(() => {
    // element("#depname").style.display = "none";
    // sc.style.opacity = "0.3";
    // setTimeout(() => {
    // sc.style.opacity = "1";
    // setTimeout(() => {
    // sc.style.letterSpacing = "1vw";
    setTimeout(() => {
        sc.style.letterSpacing = "0vw";
        ss.style.opacity = "0.9";
        boardSize();
        unknownloadingStop();
        setTimeout(() => {
            ss.style.opacity = "0";
            setTimeout(() => {
                ss.style.display = "none";
                // setTimeout(() => {
                creatingVirtualProfile();
                // }, 1000);
            }, 500);
        }, 2000);
    }, 2000);
    // }, 3000);
    // }, 3000);
    // }, 1000);
}
element('#gotoHome').onclick =()=>{
    window.location.reload();
}
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        startLudoRightNow();
    }
}
// creatingVirtualProfile();