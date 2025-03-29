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
const imgnGoats = document.querySelectorAll(".imginaryGoats");
const gPredictrs = document.querySelectorAll(".predict");
const bcmian = element("#backMain");
const goats = document.querySelectorAll(".goats");
const allBoardGoats = document.querySelectorAll(".ptype");
const teamNames = document.querySelectorAll(".teamNames");
const board = element("#board");
let cachedData = new Object, connectingToSocket = false, socketPendingData = [], noUploadsLeft = true, socket, socketConn=  false, i42, goatFocused = null, i41, noInternet = false, oldData = '', loadAnimation = false, allowServer = true, showGame = false, globalGameStatus = "pending", gameended = false, tp = 0, t3, qUFS = [], i10, serverBusy = false, t9, t8, i8, totalTurns = 0, serverOnDoneIndex = [], fetchOldSessionData = false, UPD = [], animationRunning = false, skipAnimations = false, ourgoats = document.getElementsByClassName(choosedTeam), turnIndexing = [], gameStarted = false, clientUpdate = false, data = new Object, getTurnRules, t1, additionalTurns = 0, oldRecovery = [], i4, i3, diceframeRateManager = 10, sixed = new Object, winedGoats = 0, diceVals = [0, 0, 0, 0], diceCounter = [0, 0, 0, 0, 0, 0], pat = 2, turnCounter = 0, homedGoats = 0, i2, pass = false;
for (let index = 0; index < 4; index++) {
    sixed[boardSerise[index]] = false;
}
let h = { pak: "assalamoalikum", india: "hi", afgan: "N" }
function popOb(obj) {
    let rtob = new Object;
    for (let index = 0; index < ((Object.keys(obj).length) - 1); index++) {
        rtob[Object.keys(obj)[index]] = obj[Object.keys(obj)[index]];
    }
    return rtob;
}
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
    if(string.length === 0){
        return 'false';
    }
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
function cDetect(con) {
    if (con == 1) {
        return true;
    }
    else {
        return false;
    }
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
function imageDetector(elem) {
    if (elem.offsetHeight > 0 && elem.offsetWidth > 0) {
        return true;
    }
    else {
        return false;
    };
};
function signInverter(num) {
    let x = num * (-2);
    return (x + num);
};
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
function bBoxes(size) {
    return ((board.offsetHeight / 15) * size);
}
function getRd(num) {
    return (board.offsetHeight / (652 / num));
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
function updateGoatsToWindow() {
    let allworkinggoats = document.querySelectorAll("[ludoid]");
    for (let index = 0; index < allworkinggoats.length; index++) {
        if (allworkinggoats[index].getAttribute("ludoid") > 0) {
            putGoats(allworkinggoats[index], allworkinggoats[index].getAttribute("ludoid"), "ludoid");
        };
    };
};
function checkPlacements() {
    groupCompain();
    setAtHome();
};
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
    element('#socialGate').onmouseover = ()=>{
        element('#socialGate').style.height = bBoxes(1.2) + 'px';
        element('#socialGate').style.width = bBoxes(1.2) + 'px';
        element('#socialGate').style.left = (board.offsetLeft + bBoxes(6.9)) + 'px';
        element('#socialGate').style.top = (board.offsetTop + bBoxes(6.9)) + 'px';
        element('#socialGate').style.boxShadow = `${getRd(10)}px ${getRd(10)}px ${getRd(10)}px ${getRd(0.5)}px rgba(26, 26, 26, 0.864)`;
        element('#socialGate').style.borderRadius = getRd(30)+ 'px';
    }
    element('#socialGate').onmouseout = ()=>{
        element('#socialGate').style.height = bBoxes(1) + 'px';
        element('#socialGate').style.width = bBoxes(1) + 'px';
        element('#socialGate').style.left = (board.offsetLeft + bBoxes(7)) + 'px';
        element('#socialGate').style.top = (board.offsetTop + bBoxes(7)) + 'px';
        element('#socialGate').style.boxShadow = `${getRd(3)}px ${getRd(3)}px ${getRd(7)}px ${getRd(0.5)}px rgba(26, 26, 26, 0.864)`;
        element('#socialGate').style.borderRadius = getRd(20)+ 'px';
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
window.onload = () => {
    boardSize();
};
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
    if (winedGoats == 4 && !gameended) {
        gameended = true;
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
function arrayElemsEqualityCheckerForLudoGoats(arr) {
    let unequals = true;
    for (let index = 0; index < arr.length; index++) {
        if (arr[0][0] != arr[index][0]) {
            unequals = false;
        }
    }
    return unequals;
}
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
function goatsScorePredictorBarierd(arrElem, softcopy) {
    if (!softcopy) {
        for (let index = 0; index < gPredictrs.length; index++) {
            gPredictrs[index].style.top = "200vh";
            gPredictrs[index].style.left = "200vw";
        }
    }
    clearTimeout(t1);
    let softdata = 0, focusedGoats = arrElem.length, prediction = [];
    for (let index = 0; index < arrElem.length; index++) {
        if (document.querySelector('#' + arrElem[0]).getAttribute("ludoid") != document.querySelector('#' + arrElem[index]).getAttribute("ludoid")) {
            return 0;
        }
    }
    for (let index = 0; index < diceCounter.length; index++) {
        if (diceCounter[index] == focusedGoats) {
            prediction[prediction.length] = String(index + 1) + "s";
        }
    }
    let subScore = 0;
    for (let index = 0; index < 2; index++) {
        subScore += diceVals[index];
    }
    if (subScore != 0 && focusedGoats == 1) {
        prediction[prediction.length] = subScore + 'a';
    }
    subScore = 0;
    for (let index = 0; index < diceVals.length; index++) {
        if (diceVals[index] % focusedGoats == 0 && diceVals[index] != 0) {
            prediction[prediction.length] = (diceVals[index] / focusedGoats) + "d";
        }
    }
    for (let index = 0; index < prediction.length; index++) {
        let decodedPradtion = parseInt(prediction[index].slice(0, -1));
        let modelLudoID = parseInt(document.querySelector('#' + arrElem[0]).getAttribute("ludoid"));
        let wkidd = modelLudoID + decodedPradtion;
        if (modelLudoID == 0) {
            if (decodedPradtion == 6 && prediction[index].slice(-1) != 'a') {
                wkidd = 2;
            }
            else {
                continue;
            }
        }
        if (wkidd < 59) {
            if (wkidd > 52 && !pass) {
                wkidd = wkidd - 52;
            }
            let indexing = parseInt(modelLudoID), run = true;
            for (let indexb = (indexing + 1); indexb <= (indexing + decodedPradtion); indexb++) {
                if (powerAllower(focusedGoats, indexb) == "denined" && !isSafe(indexb)) {
                    run = false;
                }
            }
            if (run) {
                if (softcopy) {
                    softdata++;
                }
                else {
                    let datad;
                    element("#d" + (index + 1) + "pre").setAttribute("wkfor", JSON.stringify(arrElem));
                    element("#d" + (index + 1) + "pre").setAttribute("wkid", wkidd);
                    element("#d" + (index + 1) + "pre").setAttribute("fakeDicePrice", prediction[index]);
                    datad = putAtBoard(wkidd, element("#d" + (index + 1) + "pre").offsetWidth / 2, element("#d4pre").offsetHeight / 2);
                    element("#d" + (index + 1) + "pre").innerText = (decodedPradtion * focusedGoats);
                    element("#d" + (index + 1) + "pre").style.left = datad.x + "px";
                    element("#d" + (index + 1) + "pre").style.top = datad.y + "px";
                }
            }
        }
    }
    enableClickPrevention();
    if (softcopy) {
        return softdata;
    }
    else {
        for (let index = 0; index < gPredictrs.length; index++) {
            gPredictrs[index].onclick = () => {
                element("#messageDisplay").style.bottom = "-20vh";
                displayingMessage = false;
                window.onblur();
                let efftelemsIds = JSON.parse(gPredictrs[index].getAttribute('wkfor'));
                for (let indexb = 0; indexb < efftelemsIds.length; indexb++) {
                    let gtd = []
                    gtd[efftelemsIds[indexb]] = gPredictrs[index].getAttribute("wkid");
                    boardManager(gtd);
                }
                let dp = gPredictrs[index].getAttribute("fakeDicePrice");
                if (dp.slice(-1) == 's') {
                    for (let indexb = 0; indexb < 2; indexb++) {
                        for (let indexc = 0; indexc < diceVals.length; indexc++) {
                            if (dp[0] == diceVals[indexc]) {
                                diceVals[indexc] = 0;
                                break;
                            }
                        }
                    }
                }
                else if (dp.slice(-1) == 'a') {
                    for (let indexb = 0; indexb < 2; indexb++) {
                        diceVals[indexb] = 0;
                    }
                }
                else if (dp.slice(-1) == 'd') {
                    for (let indexb = 0; indexb < diceVals.length; indexb++) {
                        if ((dp[0] * focusedGoats) == diceVals[indexb]) {
                            diceVals[indexb] = 0;
                            break;
                        }
                    }
                }
                diceCounterUpdater();
                if (turnChecker(false) == "exitExecuted") {
                    return 0;
                }
            }
        }
    }
}
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
                    parsingGoatsIDs[indexb] = focusedGoats[indexb].getAttribute('vid');
                }
                goatsScorePredictorBarierd(parsingGoatsIDs);
            }
        }
    }
}
function goatsAtMessageAppender(goat, nums, sarr) {
    for (let index = 0; index < nums; index++) {
        let elem = document.createElement("img");
        elem.alt = "goat";
        elem.classList.add("mfam");
        elem.classList.add("imginaryGoats");
        elem.setAttribute("vid", sarr[index + 1]);
        elem.setAttribute("focused", "not");
        elem.src = "./index_files/media/coded/" + goat + "g.svg";
        element("#messageDisplay").append(elem);
    };
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
let displayingMessage = false;
function messageSetter(arr) {
    let r, g, y, b, temptrash = rgybDecode(arr);
    r = temptrash.r;
    g = temptrash.g;
    y = temptrash.y;
    b = temptrash.b;
    element("#messageDisplay").innerHTML = '';
    element("#messageDisplay").style.bottom = "15vh";
    startImaginGoatsAnimation();
    displayingMessage = true;
    goatsAtMessageAppender("r", r, temptrash.rids);
    goatsAtMessageAppender("g", g, temptrash.gids);
    goatsAtMessageAppender("y", y, temptrash.yids);
    goatsAtMessageAppender("b", b, temptrash.bids);
    boardSize();
    imaginaryGoatsSetup();
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
function maxArr(arr) {
    let maxVal = arr[0];
    let sideIndexing = 0;
    for (let index = 0; index < arr.length; index++) {
        if (arr[index] > maxVal) {
            maxVal = arr[index];
            sideIndexing = index;
        }
    }
    return sideIndexing;
}
function newGoatDetector(allGoatsIds) {
    let timeingArray = [];
    for (let index = 0; index < allGoatsIds.length; index++) {
        timeingArray[index] = parseInt(element('#' + allGoatsIds[index]).getAttribute("timing"));
    }
    return allGoatsIds[maxArr(timeingArray)];
}