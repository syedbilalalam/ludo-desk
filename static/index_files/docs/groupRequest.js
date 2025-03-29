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
    //                 pass = true;
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
