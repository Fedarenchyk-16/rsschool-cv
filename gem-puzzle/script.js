var arr = [], box, ei,ej;

let stepsCounter = 0;
let firstTimeStart = true;
let firstTimeLeaders = true;

function swap(arr,i1,j1,i2,j2){
    t = arr[i1][j1];
    arr[i1][j1] = arr[i2][j2];
    arr[i2][j2] = t;
}
window.onload = function() {
   menu();
}

function menu(){

    localStorage.setItem('player1', 'empty');
    localStorage.setItem('player2', 'empty');
    localStorage.setItem('player3', 'empty');
    localStorage.setItem('player4', 'empty');
    localStorage.setItem('player5', 'empty');
    localStorage.setItem('player6', 'empty');

    var menu = document.createElement("div");
    menu.id = 'menu';
    menu.classList.add('menu');
    document.body.appendChild(menu);
    menu.innerHTML = "<nav class='navbar' id='navbar'><ul class='list'><li><button type='button' class='menuBt' id='newGameBt'>New game</button></li><li><button type='button' class='menuBt' id='contGameBt'>Continue game</button></li><li><button type='button' class='menuBt' id='leadersBt'>Leaders</button></li></ul></nav>";

    document.addEventListener('click', ev => {
        console.log(ev.target);
        if (ev.target === document.getElementById('newGameBt')){
            if (firstTimeStart) {
                startNewGame();
                menu.classList.add('unVisible');
                firstTimeStart = false;
            }else{
                document.getElementById('container').remove('unVisible');
                menu.classList.add('unVisible');
                startNewGame();
            }
        }
        if (ev.target === document.getElementById('contGameBt')){
            //startNewGame();
        }
        if (ev.target === document.getElementById('leadersBt')){
            //startNewGame();
            if (firstTimeLeaders){
                menu.classList.add('unVisible');
                showLeaders();
                firstTimeLeaders = false;
            }else{
                document.getElementById('leaderContainer').remove('unVisible');
                menu.classList.add('unVisible');
                showLeaders();
            }
        }
    })
}


function showLeaders(){
    var leaderContainer = document.createElement("div");
    leaderContainer.id = 'leaderContainer';
    leaderContainer.classList.add('leaderContainer');
    document.body.appendChild(leaderContainer);

    var leaderTitle = document.createElement("div");
    leaderTitle.id = 'leaderTitle';
    leaderTitle.innerHTML = 'Our Leaders';
    leaderTitle.classList.add('leaderTitle');
    leaderContainer.appendChild(leaderTitle);

    for (let i = 1; i < 7; i++) {
        var personItem = localStorage.getItem('player'+ i);

        var person = document.createElement("p");
        person.id = 'player'+ i;
        person.innerHTML =`Player${i}  ------  Steps: ${personItem}  -----  Time: Time`;
        person.classList.add('person');
        leaderContainer.appendChild(person);
    }

    var toMenuButt = document.createElement("button");
    toMenuButt.id = 'toMenuLeaders';
    toMenuButt.classList.add('toMenu');
    toMenuButt.innerHTML = 'to Menu';
    leaderContainer.appendChild(toMenuButt);

    document.getElementById("toMenuLeaders").onclick = function (){
        clearInterval(timing);
        document.getElementById('leaderContainer').classList.add('unVisible');
        document.getElementById('menu').classList.remove('unVisible');
    }



}


function startNewGame(){
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

    document.getElementById("toMenu").onclick = function (){
        clearInterval(timing);
        document.getElementById('container').classList.add('unVisible');
        document.getElementById('menu').classList.remove('unVisible');
    }

    document.getElementById("reset").onclick = function (){
        clearInterval(timing);
        newGame();
    }
}

function cellClick(event) {
    var event = event || window.event,
        el = event.srcElement || event.target,
        i = el.id.charAt(0),
        j = el.id.charAt(2);
    if((i == ei && Math.abs(j - ej) == 1) || (j == ej && Math.abs(i - ei) == 1)){
        //инкрементируем кол-во ходов
        stepsCounter++;
        document.getElementById(ei + " " + ej).innerHTML = el.innerHTML;
        console.log(document.getElementById(ei + " " + ej).innerHTML);
        el.innerHTML = "";
        ei = i;
        ej = j;
        var q = true;
        for(i = 0; i < 4; ++i)
            for(j = 0; j < 4; ++j)
                if(i + j != 6 && document.getElementById(i + " " + j).innerHTML != i*4 + j + 1){
                    q = false;
                    break;
                }
        if(q) alert("Victory!");
    }else{
        //некуда двигать
        let buffEl = document.getElementById(i + " " + j);
        buffEl.classList.add('wrong');
        setInterval(function () {
            buffEl.classList.remove('wrong');
        }, 1000);
    }
    document.getElementById('steps').innerHTML = 'Steps: '+ stepsCounter;
}

let minutes = 0;
let seconds = 0;

function updateTimer(){
    if (seconds === 60){
        seconds = 0;
        minutes++;
    }
    console.log(`Timer: ${minutes} min. ${seconds} sec.`);
    document.getElementById('timer').innerHTML = `Timer: ${minutes} min. ${seconds} sec.`;
    seconds++;
}



let timing;
let firstTime = true;

function newGame(){
    stepsCounter = 0;

    if (firstTime) {
        firstTime = false;
        minutes = 0;
        seconds = 1;
    }else{
        minutes = 0;
        seconds = 0;
    }

    timing = setInterval(updateTimer, 1000);

    document.getElementById('steps').innerHTML = 'Steps: '+ stepsCounter;

    for(i = 0; i < 4; ++i){
        arr[i] = []
        for(j = 0; j < 4; ++j){
            if(i + j != 6)
                arr[i][j] = i*4 + j + 1;
            else
                arr[i][j] = "";
        }
    }
    ei = 3;
    ej = 3;
    for(i = 0; i < 1600; ++i)
        switch(Math.round(3*Math.random())){
            case 0: if(ei != 0) swap(arr,ei,ej,--ei,ej); break; // up
            case 1: if(ej != 3) swap(arr,ei,ej,ei, ++ej); break; // right
            case 2: if(ei != 3) swap(arr,ei,ej,++ei,ej); break; // down
            case 3: if(ej != 0) swap(arr,ei,ej,ei,--ej); // left
        }
    var table = document.createElement("table"),
        tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for(i = 0; i < 4; ++i){
        var row = document.createElement("tr");
        for(j = 0; j < 4; ++j){
            var cell = document.createElement("td");
            cell.id = i + " " + j;
            cell.onclick = cellClick;
            cell.innerHTML = arr[i][j];
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    if(box.childNodes.length == 1)
        box.removeChild(box.firstChild);
    box.appendChild(table);
}
