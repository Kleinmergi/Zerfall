const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

var NUM_DICE = 2000, dt = 100;

if (urlParams.has('n')) {
  NUM_DICE = urlParams.get('n')
 // COLS = urlParams.get('n')
}

if (urlParams.has('t'))
	dt = urlParams.get('t');	

let diceValues = [];
let maxNum = 15;
if (urlParams.has('num'))
	maxNum = urlParams.get('num');
let sixes = [];
let round = 0;
let remaining = 0;
let change = 0;
let maxChange = 0;
let grid = document.getElementById("grid");
let chart1 = document.getElementById("chart1");
let counter = document.getElementById("counter");
//let chart2 = document.getElementById("chart2");
var inter;
var res = window.innerWidth/2;
var gruppe = Math.round(Math.random())


// Funktion zum Initialisieren des Gitters
function initGrid() {
  grid.innerHTML = ''
  chart1.innerHTML = '';
  counter.innerHTML= ''+NUM_DICE;
  //hart2.innerHTML = '';
  let lable = document.getElementById("lable");
  if(gruppe == 0)
     lable.innerHTML ="Isotope"
  else 
     lable.innerHTML = "Zerfallsrate"
  round = 0;
  sixes = [];
  for (let i = 0; i < NUM_DICE; i++) {
    let die = document.createElement("div");
    die.className = "dice";
    die.id = "die" + i;
	die.style.top = Math.random()*res+"px";
	die.style.left = res/2+Math.random()*res+"px";
    //die.textContent = "1";
    grid.appendChild(die);
    diceValues.push(1);
    sixes.push(false);
  }
}

initGrid();

// Funktion zum Würfeln eines Würfels
function rollDie(index) {
  let die = document.getElementById("die" + index);
  let value = Math.floor(Math.random() * maxNum) + 1;
  diceValues[index] = value;
  //die.textContent = value;
  if (value == maxNum) {
    sixes[index] = true;
//	console.log(value);
    die.classList.add("six");
    change++;
  }
}

// Funktion zum Würfeln aller Würfel
function rollAllDice() {
  change = 0;
  for (let i = 0; i < NUM_DICE; i++) {
    if (!sixes[i]) {
      rollDie(i);
    }
  }
  if (change > maxChange) {
    maxChange = change;
  }
  updateCharts();
  //round++;
}

// Funktion zum Starten des Spiels
function start() {
  initGrid();
  rollAllDice();
  inter =setInterval(rollAllDice, dt);
}


// Funktion zum Aktualisieren der Diagramme
function updateCharts() {
  remaining = sixes.filter((value) => !value).length;
  //change = sixes.filter((value) => value).length-change;
  let leftPos = round * 50;
 // let chart1 = document.getElementById("chart1");
  //let chart2 = document.getElementById("chart2");
  let bar1 = document.createElement("div");
//  let bar2 = document.createElement("div");

if(gruppe == 0){
  bar1.className = "bar1";
  let height1 = remaining / NUM_DICE;
  bar1.style.height = height1 * 200 + "px";
  bar1.style.marginTop = 200 - height1 * 200 + "px";
  bar1.style.left = leftPos + "px";
}
else{
  bar1.className = "bar2"
  let height2 = change/maxChange;
  bar1.style.height = height2 * 200 + "px";
  bar1.style.marginTop = 200 - height2 * 200 + "px";
  bar1.style.left = leftPos + "px";
}
  counter.innerHTML = remaining;
  //console.log(remaining);
  if(remaining ==0)
	  clearInterval(inter);
  chart1.appendChild(bar1);
  round++;
}

