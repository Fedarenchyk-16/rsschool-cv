var arr = [], box, ei, ej, arr2 = [];
var savedArr = [];
var savedArr2 = [];
var completed = false;

var size = 4;
var presize = 4;

let stepsCounter = 0;
let firstTimeStart = true;
let firstTimeLeaders = true;
let firstOnClick = true;
let turnAudioOn = true;

function swap(arr, i1, j1, i2, j2) {
    t = arr[i1][j1];
    arr[i1][j1] = arr[i2][j2];
    arr[i2][j2] = t;
}

window.onload = function () {
    menu();
}

function menu() {
    for (let i = 1; i < 11; i++) {
        localStorage.setItem('player' + i + 'Steps', 'empty');
        localStorage.setItem('player' + i + 'Time', 'empty');
    }

    var message = document.createElement("div");
    message.id = 'message';
    message.classList.add('message');
    document.body.appendChild(message);
    message.innerHTML = "";

    var menu = document.createElement("div");
    menu.id = 'menu';
    menu.classList.add('menu');
    document.body.appendChild(menu);
    menu.innerHTML = "<nav class='navbar' id='navbar'><ul class='list'><li><button type='button' class='menuBt' id='newGameBt'>New game</button></li><li><button type='button' class='menuBt' id='contGameBt'>Continue game</button></li><li><button type='button' class='menuBt' id='leadersBt'>Leaders</button></li></ul></nav>";


    var gameFieldSize = document.createElement("div");
    gameFieldSize.id = 'fieldSize';
    gameFieldSize.classList.add('fieldSize');
    menu.appendChild(gameFieldSize);
    gameFieldSize.innerHTML = "<select class='fieldSizeSelect' id='fieldSizeSelect'> \n" +
        "<option value=\"3\">3х3</option> \n" +
        "<option value=\"4\" selected>4х4</option>\n" +
        "<option value=\"5\">5х5</option>" +
        "<option value=\"6\">6х6</option> \n" +
        "<option value=\"7\">7х7</option> \n" +
        "<option value=\"8\">8х8</option> \n" +
        "</select>";

    document.addEventListener('click', ev => {
        console.log(ev.target);

        if (ev.target === document.getElementById('newGameBt')) {
            var select = document.getElementById("fieldSizeSelect");
            size = select.value;

            if (firstTimeStart) {
                startNewGame();
                document.getElementById('fieldSizeSelect').style.visibility = 'hidden';
                //gameFieldSize.classList.add('unVisible');
                menu.classList.add('unVisible');
                message.innerHTML = "";
                firstTimeStart = false;
            } else {
                document.getElementById('fieldSizeSelect').style.visibility = 'hidden';
                document.getElementById('container').remove('unVisible');
                menu.classList.add('unVisible');
                message.innerHTML = "";
                startNewGame();
            }
        }
        if (ev.target === document.getElementById('contGameBt')) {
            var select = document.getElementById("fieldSizeSelect");
            size = select.value;
            //alert(size);

            if (firstTimeStart) {
                document.getElementById('fieldSizeSelect').style.visibility = 'hidden';
                continueGame();
                menu.classList.add('unVisible');
                message.innerHTML = "";
                firstTimeStart = false;
            } else {
                document.getElementById('fieldSizeSelect').style.visibility = 'hidden';
                document.getElementById('container').remove('unVisible');
                menu.classList.add('unVisible');
                message.innerHTML = "";
                continueGame();
            }
        }
        if (ev.target === document.getElementById('leadersBt')) {
            if (firstTimeLeaders) {
                document.getElementById('fieldSizeSelect').style.visibility = 'hidden';
                menu.classList.add('unVisible');
                message.innerHTML = "";
                showLeaders();
                firstTimeLeaders = false;
            } else {
                document.getElementById('fieldSizeSelect').style.visibility = 'hidden';
                document.getElementById('leaderContainer').remove('unVisible');
                menu.classList.add('unVisible');
                message.innerHTML = "";
                showLeaders();
            }
        }
    })
}


function showLeaders() {
    var leaderContainer = document.createElement("div");
    leaderContainer.id = 'leaderContainer';
    leaderContainer.classList.add('leaderContainer');
    document.body.appendChild(leaderContainer);

    var leaderTitle = document.createElement("div");
    leaderTitle.id = 'leaderTitle';
    leaderTitle.innerHTML = 'LEADERBOARD';
    leaderTitle.classList.add('leaderTitle');
    leaderContainer.appendChild(leaderTitle);

    for (let i = 1; i < 11; i++) {
        var personTime = localStorage.getItem('player' + i + 'Time');
        var personSteps = localStorage.getItem('player' + i + 'Steps');

        var person = document.createElement("p");
        person.id = 'player' + i;
        person.innerHTML = `Player${i}  --- Steps: ${personSteps}  -----  Time: ${personTime} min`;
        person.classList.add('person');
        leaderContainer.appendChild(person);
    }

    var toMenuButt = document.createElement("button");
    toMenuButt.id = 'toMenuLeaders';
    toMenuButt.classList.add('toMenu');
    toMenuButt.innerHTML = 'to Menu';
    leaderContainer.appendChild(toMenuButt);

    document.getElementById("toMenuLeaders").onclick = function () {
        clearInterval(timing);
        document.getElementById('leaderContainer').classList.add('unVisible');
        document.getElementById('menu').classList.remove('unVisible');
        document.getElementById('fieldSizeSelect').style.visibility = 'visible';
        document.getElementById('message').innerHTML = '<p>Your last game was SAVED.<br>You can continue it by clicking<br> on a button "Continue"</p>'
    }


}

function continueGame() {
    let copiedArr = localStorage.getItem('savedGameArr');

    var container = document.createElement("div");
    container.id = 'container';
    container.classList.add('container');
    document.body.appendChild(container);

    var timer = document.createElement("p");
    timer.id = 'timer';
    timer.classList.add('timer');
    container.appendChild(timer);
    document.getElementById('timer').innerHTML = `Timer: 0 min. 0 sec.`;

    var stepsCounterDiv = document.createElement("div");
    stepsCounterDiv.id = 'steps';
    stepsCounterDiv.classList.add('steps');
    container.appendChild(stepsCounterDiv);


    var gameBox = document.createElement("div");
    gameBox.id = 'box';
    container.appendChild(gameBox);

    box = document.getElementById("box");
    continueSavedGame();

    var newGameButt = document.createElement("button");
    newGameButt.id = 'reset';
    newGameButt.innerHTML = 'New Game';
    container.appendChild(newGameButt);

    var toMenuButt = document.createElement("button");
    toMenuButt.id = 'toMenu';
    toMenuButt.classList.add('toMenu');
    toMenuButt.innerHTML = 'to Menu';
    container.appendChild(toMenuButt);

    var muteButt = document.createElement("button");
    muteButt.id = 'mute';
    muteButt.classList.add('mute');
    muteButt.innerHTML = 'MUTE';
    container.appendChild(muteButt);
    if (turnAudioOn === false) {
        document.getElementById('mute').classList.add('pushed');
    } else {
        document.getElementById('mute').classList.remove('pushed');
    }

    document.getElementById("toMenu").onclick = function () {
        clearInterval(timing);
        completed = false;

        for (i = 0; i < size; ++i) {
            savedArr[i] = [];
            savedArr2[i] = []
            for (j = 0; j < size; ++j) {
                savedArr[i][j] = document.getElementById(i + " " + j).style.backgroundImage;
                savedArr2[i][j] = document.getElementById(i + " " + j).innerText;
            }
        }
        presize = size;
        console.log(savedArr);
        localStorage.setItem('savedGameArr', savedArr);
        localStorage.setItem('savedGameTimeMin', minutes);
        localStorage.setItem('savedGameTimeSec', seconds);
        localStorage.setItem('savedGameSteps', stepsCounter);

        document.getElementById('container').classList.add('unVisible');
        document.getElementById('menu').classList.remove('unVisible');
        document.getElementById('fieldSizeSelect').style.visibility = 'visible';
        document.getElementById('message').innerHTML = '<p>Your last game was SAVED.<br>You can continue it by clicking<br> on a button "Continue"</p>'
    }

    document.getElementById("mute").onclick = function () {
        if (turnAudioOn === true) {
            turnAudioOn = false;
            document.getElementById('mute').classList.add('pushed');
        } else {
            turnAudioOn = true;
            document.getElementById('mute').classList.remove('pushed');
        }
    }

    document.getElementById("reset").onclick = function () {
        completed = false;
        clearInterval(timing);
        newGame();
    }
}

function continuefirstClick() {
    stepsCounter = localStorage.getItem('savedGameSteps');
    minutes = localStorage.getItem('savedGameTimeMin');
    seconds = localStorage.getItem('savedGameTimeSec');

    timing = setInterval(updateTimer, 1000);

    document.getElementById('steps').innerHTML = 'Steps: ' + stepsCounter;

    string = localStorage.getItem('savedGameArr');
    string2 = localStorage.getItem('savedGameArr2');
    let savedArr = string.split(',');
    let savedArr2 = string2.split(',');
    console.log(savedArr);
    console.log(savedArr2);

    let a = 0;
    let b = 0;
    arr[a] = [];

    for (let i = 0; i < savedArr.length; i++) {
        //console.log(savedArr[i]);
        arr[a][b] = savedArr[i];

        if (savedArr[i] === '') {
            console.log('find');
            ei = a;
            ej = b;
        }
        if (b === presize - 1) {
            b = 0;
            a++;
            arr[a] = [];
        } else {
            b++;
        }

    }

    a = 0;
    b = 0;
    arr2[a] = [];
    for (let i = 0; i < savedArr2.length; i++) {
        //console.log(savedArr[i]);
        arr2[a][b] = savedArr2[i];

        if (savedArr2[i] === '') {
            console.log('find');
            ei = a;
            ej = b;
        }
        if (b === presize - 1) {
            b = 0;
            a++;
            arr2[a] = [];
        } else {
            b++;
        }

    }

    size = presize;
    var table = document.createElement("table"),
        tbody = document.createElement("tbody");
    table.id = 'table';
    table.appendChild(tbody);
    for (i = 0; i < presize; ++i) {
        var row = document.createElement("tr");
        for (j = 0; j < presize; ++j) {
            var cell = document.createElement("td");
            cell.id = i + " " + j;
            cell.onclick = cellClick;
            cell.innerText = arr2[i][j];
            cell.style.backgroundImage = arr[i][j];
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }

    if (box.childNodes.length == 1)
        box.removeChild(box.firstChild);
    box.appendChild(table);
}

function continueSavedGame() {
    continuefirstClick();
}


function startNewGame() {
    var container = document.createElement("div");
    container.id = 'container';
    container.classList.add('container');
    document.body.appendChild(container);

    var timer = document.createElement("p");
    timer.id = 'timer';
    timer.classList.add('timer');
    container.appendChild(timer);
    document.getElementById('timer').innerHTML = `Timer: 0 min. 0 sec.`;

    var stepsCounterDiv = document.createElement("div");
    stepsCounterDiv.id = 'steps';
    stepsCounterDiv.classList.add('steps');
    container.appendChild(stepsCounterDiv);


    var gameBox = document.createElement("div");
    gameBox.id = 'box';
    container.appendChild(gameBox);

    box = document.getElementById("box");
    newGame();

    var newGameButt = document.createElement("button");
    newGameButt.id = 'reset';
    newGameButt.innerHTML = 'New Game';
    container.appendChild(newGameButt);

    var toMenuButt = document.createElement("button");
    toMenuButt.id = 'toMenu';
    toMenuButt.classList.add('toMenu');
    toMenuButt.innerHTML = 'to Menu';
    container.appendChild(toMenuButt);

    var muteButt = document.createElement("button");
    muteButt.id = 'mute';
    muteButt.classList.add('mute');
    muteButt.innerHTML = 'MUTE';
    container.appendChild(muteButt);
    if (turnAudioOn === false) {
        document.getElementById('mute').classList.add('pushed');
    } else {
        document.getElementById('mute').classList.remove('pushed');
    }

    document.getElementById("toMenu").onclick = function () {
        clearInterval(timing);
        completed = false;

        for (i = 0; i < size; ++i) {
            savedArr[i] = [];
            savedArr2[i] = [];
            for (j = 0; j < size; ++j) {
                savedArr[i][j] = document.getElementById(i + " " + j).style.backgroundImage;
                savedArr2[i][j] = document.getElementById(i + " " + j).innerText;
            }
        }
        presize = size;
        console.log(savedArr);
        localStorage.setItem('savedGameArr', savedArr);
        localStorage.setItem('savedGameArr2', savedArr2);
        localStorage.setItem('savedGameTimeMin', minutes);
        localStorage.setItem('savedGameTimeSec', seconds);
        localStorage.setItem('savedGameSteps', stepsCounter);

        document.getElementById('container').classList.add('unVisible');
        document.getElementById('menu').classList.remove('unVisible');
        document.getElementById('fieldSizeSelect').style.visibility = 'visible';

        document.getElementById('message').innerHTML = '<p>Your last game was SAVED.<br>You can continue it by clicking<br> on a button "Continue"</p>'
    }

    document.getElementById("reset").onclick = function () {
        completed = false;
        clearInterval(timing);
        newGame();
    }

    document.getElementById("mute").onclick = function () {
        if (turnAudioOn === true) {
            turnAudioOn = false;
            document.getElementById('mute').classList.add('pushed');
        } else {
            turnAudioOn = true;
            document.getElementById('mute').classList.remove('pushed');
        }
    }
}

function cellClick(event) {
    if (!completed) {
        var event = event || window.event,
            el = event.srcElement || event.target,
            i = el.id.charAt(0),
            j = el.id.charAt(2);
        if ((i == ei && Math.abs(j - ej) == 1) || (j == ej && Math.abs(i - ei) == 1)) {
            if (turnAudioOn === true) {
                var audStandart = new Audio();
                audStandart.src = 'assets/25d7ee378d6addc (online-audio-converter.com).wav';
                audStandart.play();
            }
            //инкрементируем кол-во ходов
            stepsCounter++;
            var cell1 = document.getElementById(i + " " + j);
            var cellEmpty = document.getElementById(ei + " " + ej);
            var cellBuffer = document.getElementById(ei + " " + ej).style.backgroundImage;
            cellEmpty.innerHTML = el.innerHTML;
            cellEmpty.style.backgroundImage = cell1.style.backgroundImage;
            cell1.style.backgroundImage = cellBuffer;
            console.log(document.getElementById(ei + " " + ej).innerHTML);
            el.innerHTML = "";
            console.log(cell1 + "this is");
            ei = i;
            ej = j;
            var q = true;
            for (i = 0; i < size; ++i)
                for (j = 0; j < size; ++j)
                    if (i + j != (size - 1) * 2 && document.getElementById(i + " " + j).innerHTML != i * size + j + 1) {
                        q = false;
                        break;
                    }
            if (q) {
                completed = true;
                let wrote = false;
                let iterator = 0;
                for (let k = 1; k < 11; k++) {
                    if (!wrote) {
                        let dataSteps = localStorage.getItem('player' + k + 'Steps');
                        let dataTime = localStorage.getItem('player' + k + 'Time');
                        if (dataSteps === 'empty' && dataTime === 'empty') {
                            localStorage.setItem('player' + k + 'Steps', `${stepsCounter}`);
                            localStorage.setItem('player' + k + 'Time', `${minutes}.${seconds}`);
                            iterator = k;
                            wrote = true;
                        }
                    }
                }
                alert(`Victory! You solve puzzle in ${stepsCounter} moves and ${minutes}.${seconds} minutes. \n Your result was saved to LEADERBOARD as Player${iterator}`);
                clearInterval(timing);
                timing = null;
            }
        } else {
            //некуда двигать
            let buffEl = document.getElementById(i + " " + j);
            buffEl.classList.add('wrong');
            setInterval(function () {
                buffEl.classList.remove('wrong');
            }, 1000);
        }
        document.getElementById('steps').innerHTML = 'Steps: ' + stepsCounter;
    }
}

let minutes = 0;
let seconds = 0;

function updateTimer() {
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    console.log(`Timer: ${minutes} min. ${seconds} sec.`);
    document.getElementById('timer').innerHTML = `Timer: ${minutes} min. ${seconds} sec.`;
    seconds++;
}


let timing;
let firstTime = true;

function newGame() {
    stepsCounter = 0;

    if (firstTime) {
        firstTime = false;
        minutes = 0;
        seconds = 1;
    } else {
        minutes = 0;
        seconds = 0;
    }

    timing = setInterval(updateTimer, 1000);

    document.getElementById('steps').innerHTML = 'Steps: ' + stepsCounter;

    for (i = 0; i < size; ++i) {
        arr[i] = []
        for (j = 0; j < size; ++j) {
            if (i + j != (size - 1) * 2)
                arr[i][j] = i * size + j + 1;
            else
                arr[i][j] = "";
        }
    }
    ei = size - 1;
    ej = size - 1;
    for (i = 0; i < 1600; ++i)
        switch (Math.round(size * Math.random())) {
            case 0:
                if (ei != 0) swap(arr, ei, ej, --ei, ej);
                break; // up
            case 1:
                if (ej != size - 1) swap(arr, ei, ej, ei, ++ej);
                break; // right
            case 2:
                if (ei != size - 1) swap(arr, ei, ej, ++ei, ej);
                break; // down
            case 3:
                if (ej != 0) swap(arr, ei, ej, ei, --ej); // left
        }
    var table = document.createElement("table"),
        tbody = document.createElement("tbody");
    table.id = 'table';
    table.appendChild(tbody);
    for (i = 0; i < size; ++i) {
        var row = document.createElement("tr");
        for (j = 0; j < size; ++j) {
            var cell = document.createElement("td");
            cell.id = i + " " + j;
            cell.onclick = cellClick;
            cell.innerHTML = arr[i][j];
            if (size == 3) {
                if (arr[i][j] !== '') {
                    cell.style.backgroundImage = `url("assets/3x3/image (${arr[i][j]}).jpg")`;
                }
            } else if (size == 4) {
                if (arr[i][j] !== '') {
                    cell.style.backgroundImage = `url("assets/4x4/image (${arr[i][j]}).jpg")`;
                }
            } else if (size == 5) {
                if (arr[i][j] !== '') {
                    cell.style.backgroundImage = `url("assets/5x5/image (${arr[i][j]}).jpg")`;
                }
            } else if (size == 6) {
                if (arr[i][j] !== '') {
                    cell.style.backgroundImage = `url("assets/6x6/image (${arr[i][j]}).jpg")`;
                }
            } else if (size == 7) {
                if (arr[i][j] !== '') {
                    cell.style.backgroundImage = `url("assets/7x7/image (${arr[i][j]}).jpg")`;
                }
            } else if (size == 8) {
                if (arr[i][j] !== '') {
                    cell.style.backgroundImage = `url("assets/8x8/image (${arr[i][j]}).jpg")`;
                }
            }
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    if (box.childNodes.length == 1)
        box.removeChild(box.firstChild);
    box.appendChild(table);
}
