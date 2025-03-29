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
function scoreBoardManager(team) {
    const winingSeris = [58, 13.6, 26.6, 39.6];
    const targetedId = idDecoder(winingSeris[findChr(team, boardSerise)]);
    element("#score" + team).innerText = document.querySelectorAll("[ludoid='" + targetedId + "']").length;
}
function enemyGoatsCount(goats, friend) {
    let count = 0;
    for (let index = 0; index < goats.length; index++) {
        if (goats[index][0] !== friend) {
            count++;
        }
    }
    return count;
}
// function outAnimation(team) {
//     out.play();
//     sendMessTo("Yay 😁!", team);
// }
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
//                     pass = true;
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
function boardManager(vals, sync) {
    let sendingVals = new Object, keyVals = Object.keys(vals);
    for (let index = 0; index < keyVals.length; index++) {
        let elem = element('#' + keyVals[index]), id = vals[keyVlas[index]];
        if (turnCounter == getTurnRules) {
            sendingVals[elem.id] = id;
        }
        let targetedPlaceGoats = document.querySelectorAll(`[ludoid="${id}"]`);
        if (!isSafe(parseInt(id)) && targetedPlaceGoats.length > 0) {
            let removeableGoats = [];
            for (let indexb = 0; indexb < targetedPlaceGoats.length; indexb++) {
                if (elem.id[0] !== targetedPlaceGoats[indexb].id[0]) {
                    // removeableGoats.push(targetedPlaceGoats[indexb].id + '0');
                    removeableGoats[targetedPlaceGoats[indexb].id] = '0';
                }
            }
            if (removeableGoats.length > 0) {
                boardManager(removeableGoats, true);
                out.play();
                sendMessTo("Yay 😁!", boardSerise[turnCounter - 1]);
                cachedDataUpdater(removeableGoats);
                if (turnCounter === getTurnRules) {
                    // sendToSoc({ type: 'outStatusUpdate', outMaker: choosedTeam });
                    let send = new Object;
                    send[choosedTeam + "ad"] = (additionalTurns + removeableGoats.length);
                    send[choosedTeam + 'p'] = true;
                    serverManager(send);
                    delete (send);
                    pass = true;
                    additionalTurns += removeableGoats.length;
                }
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
    if (turnCounter == getTurnRules) {
        if (sync) {
            sendingVals['sync'] = 'yes';
        }
        serverManager(sendingVals);
    }
    updateGoatsToWindow();
    checkPlacements();
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
function stopAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
}
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
function disableAllEO(elems, exp) {
    for (let index = 0; index < elems.length; index++) {
        if (elems[index].getAttribute('worth') == exp) {
            continue;
        }
        elems[index].style.display = 'none';
    }
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
    disableAllEO(side.childNodes, value);
    diceThrow.play();
    skipAnimations = false;
    side.scrollTo({ top: 0 });
}
function fixedThrow(d1, d2, team) {
    shuffel.play();
    let left = element("#left" + team);
    let right = element("#right" + team);
    eneableAllImgs(left.childNodes);
    eneableAllImgs(right.childNodes);
    left.childNodes[left.childNodes.length - 1].style.display = "none";
    shuffel.loop = true;
    let count = 0;
    if (d1 != 7) {
        i3 = setInterval(() => {
            left.scrollTo({
                top: count,
            });
            if (skipAnimations) {
                clearInterval(i3);
                declareDice(left, d1.toString(), false);
            }
        }, 10);
        setTimeout(() => {
            if (!skipAnimations) {
                clearInterval(i3);
                declareDice(left, d1.toString(), false);
            }
        }, 1000);
    }
    else {
        left.childNodes[left.childNodes.length - 1].style.display = "inline";
        disableAllEO(left.childNodes, '7');
    }
    i4 = setInterval(() => {
        count += diceframeRateManager;
        if (right.scrollHeight <= count) {
            count = 0;
        };
        right.scrollTo({
            top: count
        });
        if (skipAnimations) {
            clearInterval(i4);
            declareDice(right, d2.toString(), true);
        }
    }, 10);
    setTimeout(() => {
        if (!skipAnimations) {
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
element("#skipBox").onclick = () => {
    element("#skipBox").style.display = "none";
    recoveryOurGoats();
    setTimeout(() => {
        diceVals = [0, 0, 0, 0];
        additionalTurns = 0;
        exitTurn();
    }, 2000);
}
function turnChecker(forced) {
    let confirmingexit = 0;
    for (let index = 0; index < ourgoats.length; index++) {
        let currentIdGoats = [];
        if (ourgoats[index].getAttribute("ludoid") != 0) {
            currentIdGoats = document.querySelectorAll("[ludoid='" + ourgoats[index].getAttribute("ludoid") + "']");
        }
        confirmingexit += goatsScorePredictorBarierd([ourgoats[index].id], true);
        let newparsingArr = [];
        if (currentIdGoats.length > 0) {
            newparsingArr[0] = currentIdGoats[0].id;
        }
        for (let indexb1 = 0; indexb1 < (currentIdGoats.length - 1); indexb1++) {
            for (let indexb = 1; indexb < (indexb1 + 2); indexb++) {
                newparsingArr[indexb] = currentIdGoats[indexb].id
            }
            if (newparsingArr.length > 1) {
                confirmingexit += goatsScorePredictorBarierd(newparsingArr, true);
            }
        }
    }
    if (confirmingexit == 0) {
        if (diceVals[0] == 0 && diceVals[1] == 0 && diceVals[2] == 0 && diceVals[3] == 0 || forced) {
            exitTurn();
            return "exitExecuted";
        }
        else {
            element("#skipBox").style.display = "flex";
        }
    }
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
                if (displayingMessage) {
                    element("#messageDisplay").style.bottom = "-20vh";
                    clearInterval(i42)
                    displayingMessage = false;
                }
                else {
                    window.onblur();
                    disableClickPrevention();
                }
            }
        };
    }
}
function disableClickPrevention() {
    document.onclick = () => { }
}
function rememberingCurrentVals() {
    for (let index = 0; index < allBoardGoats.length; index++) {
        oldRecovery[index] = (allBoardGoats[index].id + allBoardGoats[index].getAttribute("ludoid"));
    }
}
function recoveryOurGoats() {
    for (let index = 0; index < oldRecovery.length; index++) {
        if ((document.querySelector('#' + oldRecovery[index].slice(0, 2)).getAttribute("ludoid") == 58 && oldRecovery[index].slice(2) != 58) || (document.querySelector('#' + oldRecovery[index].slice(0, 2)).getAttribute("ludoid") == '.6' && oldRecovery[index].slice(2) != '.6')) {
            document.querySelector('#' + oldRecovery[index].slice(0, 2)).style.display = "inline";
            document.querySelector('#' + oldRecovery[index].slice(0, 2)).style.opacity = 1;
        }
        boardManager([oldRecovery[index]]);
    }
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
                for (let index = 0; index < ourgoats.length; index++) {
                    ourgoats[index].style.backgroundColor = "transparent";
                    ourgoats[index].onclick = () => {
                        goatFocusAnimation(ourgoats[index]);
                        enableClickPrevention();
                        goatsScorePredictorBarierd([ourgoats[index].id]);
                        turnChecker(true);
                    }
                }
                turnChecker(true);
            }, 3000);
        }
    }
}
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
function goatBlur() {
    clearInterval(i41);
    if (goatFocused !== null) {
        goatFocused.style.transform = "rotate(0deg)";
    }
    goatFocused = null;
}
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
function isFightingMembers(turnNum) {
    const team = boardSerise[turnNum - 1];
    if (element("#score" + team).innerText == 4) {
        return false;
    }
    else {
        return true;
    };
}
function setTurnIndexing() {
    turnIndexing = [];
    for (let index = 0; index < 4; index++) {
        if (document.querySelectorAll("[presence='true']")[index] !== undefined) {
            const currentVal = findChr(document.querySelectorAll("[presence='true']")[index].childNodes[1].classList[0][0], boardSerise) + 1;
            if (isFightingMembers(currentVal)) {
                turnIndexing[turnIndexing.length] = currentVal;
            }
        }
    }
    if (turnIndexing.length == 1) {
        showGame = false;
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
function initSockets() {
}
function onGameStart(notAll) {
    // connectServer(cachedData);
    setUpDataAtClientSide(cachedData);
    element("#dataId").innerText = data.id;
    ourgoats = document.getElementsByClassName(choosedTeam);
    setTurnIndexing();
    if (notAll) {
        fetchOldSessionData = true;
    }
    else {
        serverManager({ t: turnIndexing[0] });
        newTurn();
    }
    window.onbeforeunload = () => {
        return true;
    }
}
function allowExit() {
    let rtval = true;
    for (let index = 0; index < UPD.length; index++) {
        if (!UPD[index]) {
            rtval = false;
            break;
        }
    }
    return rtval;
}
function exitTurn() {
    if (additionalTurns == 0) {
        allowNewTurn = false;
        for (let index = 0; index < ourgoats.length; index++) {
            ourgoats[index].style.backgroundColor = "transparent";
            ourgoats[index].onclick = () => { }
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
function findChrNums(chr, string) {
    let count = 0;
    for (let index = 0; index < string.length; index++) {
        if (string[index] == chr) {
            count++;
        }
    }
    return count;
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
element("#startGame").onclick = () => {
    if (document.querySelectorAll("[presence='true']").length > 1) {
        unknownloadingStart();
        finalizeGameStart();
    }
    else {
        Swal.fire({ icon: "warning", text: "Waiting for other people to join." });
    }
}
const submenues = document.querySelectorAll(".subMenu");
element("#viewInfo").onclick = (e) => {
    if (e.target.classList.contains("subMenu") && showGame) {
        element("#viewInfo").style.display = "none";
    }
}
element("#logoPortion").onclick = () => {
    element("#viewInfo").style.display = "flex";
}
function serverManager(obj, imp) {
    if (!allowServer && imp != "most") {
        return 0;
    }
    qUFS[qUFS.length] = obj;
    if (qUFS.length == 1) {
        i10 = setInterval(() => {
            if (qUFS.length === 0) {
                clearInterval(i10);
            }
            else if (!serverBusy) {
                serverUpdater(qUFS[0]);
                qUFS = dequeueArr(qUFS);
            }
        }, 500);
    } else if (qUFS.length === 0) {
        noUploadsLeft = true;
    }
}
function startLudoRightNow() {
    unknownloadingStart();
    let sc = element("#startcontent");
    let ss = element("#startingScreen");
    setTimeout(() => {
        // element("#depname").style.display = "none";
        sc.style.opacity = "0.3";
        setTimeout(() => {
            sc.style.opacity = "1";
            setTimeout(() => {
                sc.style.letterSpacing = "1vw";
                setTimeout(() => {
                    sc.style.letterSpacing = "0vw";
                    ss.style.opacity = "0.9";
                    boardSize();
                    unknownloadingStop();
                    setTimeout(() => {
                        ss.style.opacity = "0";
                        setTimeout(() => {
                            ss.style.display = "none";
                            setTimeout(() => {
                                creatingVirtualProfile();
                            }, 1000);
                        }, 500);
                    }, 2000);
                }, 2000);
            }, 3000);
        }, 3000);
    }, 1000);
}
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