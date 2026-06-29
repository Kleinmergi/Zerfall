const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
let sVal = slider.value;

var NUM_DICE = slider.value,
    dt = 100;
var maxPlot = Math.min(NUM_DICE, 10000);
output.innerHTML = slider.value;

let changes2 = [];
let changes4 = [];
let changes8 = [];
let Diagramm = false;
var grenze = false;
slider.oninput = function() {
    NUM_DICE = this.value;
    maxPlot = Math.min(NUM_DICE, 10000);
    initGrid();
    output.innerHTML = this.value;
    resetArray(this.value);
    output.focus();
}

function resetArray(id) {
    if (id == 10000) {
        changes2 = [];
    }
    if (id == 25000) {
        changes4 = [];
    }
    if (id == 50000) {
        changes8 = [];
    }
    var grenze = false;
}

function setArray(id, value) {
    if (id == 10000) {
        changes2.push(value);
    }
    if (id == 25000) {
        changes4.push(value);;
    }
    if (id == 50000) {
        changes8.push(value);;
    }
}

if (urlParams.has('n')) {
    NUM_DICE = urlParams.get('n')
        // COLS = urlParams.get('n')
}

if (urlParams.has('t'))
    dt = urlParams.get('t');

//let diceValues = [];
let maxNum = 6;
if (urlParams.has('num'))
    maxNum = urlParams.get('num');
let sixes = [];
let changes = [];
let round = 0;
let remaining = NUM_DICE;
let change = 0;
let maxChange = 0;
let grid = document.getElementById("grid");
//let chart1 = document.getElementById("chart1");
let counter = document.getElementById("counter");
let wurf = document.getElementById("wurf");
let messwert = document.getElementById("messwert");
//let chart2 = document.getElementById("chart2");
var inter;
var res = window.innerWidth;
var gruppe = 1; //Math.round(Math.random())

var erste = false;

let l = Math.floor(Math.sqrt(maxPlot));
let size = Math.ceil(1 / (3) * res / l);

// Funktion zum Initialisieren des Gitters
function initGrid() {
    document.getElementById("Restart").style.background = "red";
    grenze = false;
    l = Math.floor(Math.sqrt(maxPlot));
    size = Math.ceil(1 / (3) * res / l);
    maxPlot = Math.min(NUM_DICE, 10000);
    remaining = NUM_DICE
    grid.innerHTML = ''
        //chart1.innerHTML = '';
    counter.innerHTML = "Verbliebende Cubetonium-Atome: " + NUM_DICE;
    //hart2.innerHTML = '';
    /*
    let lable = document.getElementById("lable");
    if (gruppe == 0)
        lable.innerHTML = "Isotope"
    else
        lable.innerHTML = "Zerfallsrate"
        */
    round = 0;
    sixes = [];
    changes = [];
    wurf.innerHTML = "<td>Zeit</td>";
    messwert.innerHTML = "<td>zerfallene Isotope</td>";

    for (let i = 0; i < NUM_DICE; i++) {
        if (i < maxPlot) {
            let die = document.createElement("div");
            die.className = "dice";
            die.id = "die" + i;
            //  die.style.top = Math.random()*res+"px";
            //	die.style.left = res/2+Math.random()*res+"px";
            die.style.height = die.style.width = size / 2 + "px"
            die.style.fontSize = 8 * size / 30 + "pt";
            die.style.borderRadius = size / 8 + "px"
            die.style.top = 2 * (i % l * 2 / 3) * size / 2 + "px";
            die.style.left = res / 6 + 2 * Math.floor(i / l) * size / 2 + "px";

            die.textContent = "1";
            grid.appendChild(die);
        }
        //diceValues.push(1);
        sixes.push(false);
        //document.getElementById("Restart").style.display = "none";
    }
}

initGrid();

// Funktion zum Würfeln eines Würfels
function rollDie(index) {
    let value = Math.floor(Math.random() * maxNum) + 1;
    // diceValues[index] = value;
    let die = document.getElementById("die" + index);
    if (index < maxPlot) {
        die.textContent = Math.floor(Math.random() * 5 + 1);
    }
    if (value == maxNum) {
        sixes[index] = true;
        //	console.log(value);
        //die.classList.add("six");
        if (index < maxPlot)
            die.remove();
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
    if (remaining == 0) {
        //document.getElementById("Start").style.background = "red";
        //document.getElementById("Start").innerHTML = "Restart";
        //document.getElementById("Restart").style.display = "none";
    }
}

// Funktion zum Starten des Spiels
function start() {
    navigator.clipboard.writeText(changes);
    //initGrid();
    if (document.getElementById("Start").innerHTML == "Restart") {
        resetArray(slider.value);
        grenze = false;
        plotChart();
        initGrid();
        document.getElementById("Start").style.background = "green";
        document.getElementById("Start").innerHTML = "Wurf"
            // document.getElementById("Restart").style.display = null;
    } else {


        //document.getElementById("Restart").display = null;
        rollAllDice();
    }
    //inter = setInterval(rollAllDice, dt)
}

function restart() {
    resetArray(slider.value);
    plotChart();
    initGrid();
    //inter = setInterval(rollAllDice, dt)
}
document.addEventListener('keydown', function(event) {
    if (event.code === 'KeyW') {
        if (remaining > 0)
            rollAllDice();
    }
});

addEventListener("volumechange", (event) => {
    if (remaining > 0)
        rollAllDice();
});



// Funktion zum Aktualisieren der Diagramme
function updateCharts() {
    //change = sixes.filter((value) => value).length-change;
    remaining = sixes.filter((value) => !value).length;
    let leftPos = round * 50;
    // let chart1 = document.getElementById("chart1");
    //let chart2 = document.getElementById("chart2");
    /*
    let bar1 = document.createElement("div");
    //  let bar2 = document.createElement("div");

    if (gruppe == 0) {
        bar1.className = "bar1";
        let height1 = remaining / NUM_DICE;
        bar1.style.height = height1 * 200 + "px";
        bar1.style.marginTop = 200 - height1 * 200 + "px";
        bar1.style.left = leftPos + "px";
    } else {
        bar1.className = "bar2"
        let height2 = change / maxChange;
        bar1.style.height = height2 * 200 + "px";
        bar1.style.marginTop = 200 - height2 * 200 + "px";
        bar1.style.left = leftPos + "px";
    }
    */
    let W = document.createElement("td");
    let mw = document.createElement("td");
    round++;

    if (remaining < NUM_DICE / 1000) {
        W.style.background = '#ddd';
        mw.style.background = '#ddd';
        if (!grenze) {
            W.style.background = "#d66"
                //mw.style.background = "#d66"
            grenze = !grenze;
        }
    }
    W.innerHTML += round + " s";
    mw.innerHTML += change;
    counter.innerHTML = "Verbleibende Cubetonium-Atome: " + remaining;
    wurf.appendChild(W);
    messwert.appendChild(mw);
    changes.push({ x: round, y: change });
    //console.log(remaining);
    setArray(slider.value, { x: round, y: change })

    plotChart();
    //chart1.appendChild(bar1);

}




// Funktion zum Herunterladen des Diagramms als PNG
function plotChart() {
    let down = document.getElementById("DownloadContainer");
    document.getElementById("v4").innerHTML = "";


    //var popupContent = document.getElementById("popup-content");
    //popupContent.innerHTML = "";
    // Definieren Sie Ihre Daten als Array von Objekten

    const data2 = changes2;
    const data4 = changes4;
    const data8 = changes8;
    // Definieren Sie die SVG-Abmessungen
    const width = 1000;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const svgWidth = width + margin.left + margin.right;
    const svgHeight = height + margin.top + margin.bottom;

    // Erstellen Sie das SVG-Element und fügen Sie es dem DOM hinzu
    let svg = d3.select('svg#v4')
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    /*
        // Definieren Sie die X- und Y-Skalen
        const xScale = d3.scaleLinear()
            .domain([0, 20])
            .range([0, width]);
        const yScale = d3.scaleLinear()
            .domain([0, maxChange])
            .range([height, 0]);
    /*
        // Erstellen Sie die X- und Y-Achsen
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
    */


    // Definieren Sie die X- und Y-Skalen
    const xScale = d3.scaleLinear()
        .domain([1, 41])
        .range([0, width]);
    const yScale = d3.scaleLinear()
        .domain([0, maxChange])
        .range([height, 0]);


    // Erstellen Sie die X- und Y-Achsen
    //const xAxis = d3.axisBottom(xScale);
    // const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale)
        .tickSize(-height)
        .tickPadding(10)
        .tickFormat((d) => d + "s");
    const yAxis = d3.axisLeft(yScale)
        .tickSize(-width)
        .tickPadding(10);

    xAxis.ticks(40);
    yAxis.ticks(20);

    // Fügen Sie die Achsen zum SVG-Element hinzu
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    /*
    // Erstellen Sie die Punkte
    svg.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .style("fill", "steelblue");
*/
    // Create line
    const line = d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y));




    // Erstellen eines transparenten Rechtecks, das die gesamte SVG-Fläche abdeckt
    var rect = svg.append("rect")
        .attr("class", "overlay")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("opacity", 0);

    // Erstellen von horizontalen und vertikalen Linien, um das Fadenkreuz zu bilden


    // Erstellen von Textfeldern, um die Koordinaten anzuzeigen
    var tooltip = svg.append("g")
        .attr("class", "tooltip")
        .style("display", "none");

    tooltip.append("rect")
        .attr("class", "hintergrund")
        .attr("x", 5)
        .attr("y", 15)
        .attr("width", 120)
        .attr("height", 20)
        .attr("fill", "#fff");

    tooltip.append("text")
        .attr("class", "coords")
        .attr("x", 5)
        .attr("y", 15)
        .text("X: ")
        .attr("fill", "#000");

    var crosshair = svg.append("g")
        .attr("class", "crosshair");

    crosshair.append("line")
        .attr("class", "horizontal")
        .attr("x1", 0)
        .attr("x2", svgWidth)
        .attr("y1", 0)
        .attr("y2", 0);

    crosshair.append("line")
        .attr("class", "vertical")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", svgWidth);

    /*tooltip.append("text")
        .attr("x", 5)
        .attr("y", 30)
        .text("Y: ");
    */
    var g = svg.append("g");
    // Fügen Sie ein Maus-Event-Listener für das SVG-Element hinzu
    rect.on("mousemove", function(event, d) {
        // Abrufen der Mausposition im SVG-Element
        var mouse = d3.pointer(event, g.node());
        console.log(mouse);
        var mouseX = mouse[0];
        var mouseY = mouse[1];
        var fakt = 1;
        if (mouseY < height / 2)
            fakt = -1;

        // Aktualisieren der horizontalen und vertikalen Linien
        crosshair.select(".horizontal")
            .attr("y1", mouseY)
            .attr("y2", mouseY);

        crosshair.select(".vertical")
            .attr("x1", mouseX)
            .attr("x2", mouseX);

        // Aktualisieren der Koordinaten im Textfeld
        tooltip.select(".hintergrund")
            .attr("x", mouseX + 12)
            .attr("y", mouseY - 40 - (fakt - 1) * 25);

        tooltip.select(".coords")
            .attr("x", mouseX + 15)
            .attr("y", mouseY - 25 * fakt)
            .attr("fill", "#000")
            .text("(" + (40 * mouseX / width + 1).toFixed(1) + " s| " + (maxChange * (height - mouseY) / height).toFixed(0) + " Bq)");
        /*
                tooltip.select("text:nth-child(2)")
                    .attr("x", mouseX + 5)
                    .attr("y", mouseY - 15)
                    .text("Y: " + (maxChange * (height - mouseY) / height).toFixed(0));
        */
        // Anzeigen des Fadenkreuzes und der Koordinaten
        crosshair.style("display", null);
        tooltip.style("display", null);
    });

    // Fügen Sie ein Maus-Event-Listener für das Verlassen des SVG-Elements hinzu
    g.on("mouseout", function() {
        // Ausblenden des Fadenkreuzes und der Koordinaten
        crosshair.style("display", "none");
        tooltip.style("display", "none");
    });

    var col = "blue";

    // Create path for the line
    svg
        .append("path")
        .datum(data2)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "steelblue")
        .style("fill", "none");

    // Create cross marks
    svg
        .selectAll(".dot2")
        .data(data2)
        .enter()
        .append("path")
        .attr("class", "dot")
        .attr("d", d3.symbol().type(d3.symbolCross))
        .attr("transform", (d) => "translate(" + xScale(d.x) + "," + yScale(d.y) + ")");


    // Create path for the line
    var Graph8 = svg.append("path")
        .datum(data8)
        .attr("class", "line")
        .attr("d", line)
        .on("mousemove", function(event, d) {
            col = "red"
            console.log("ha")
        })
        .style("stroke", "red")
        .style("fill", "none");

    // Create cross marks
    svg
        .selectAll(".dot8")
        .data(data8)
        .enter()
        .append("path")
        .attr("class", "dot")
        .attr("d", d3.symbol().type(d3.symbolCross))
        .attr("transform", (d) => "translate(" + xScale(d.x) + "," + yScale(d.y) + ")");
    // Create path for the line
    svg
        .append("path")
        .datum(data4)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "green")
        .style("fill", "none");

    // Create cross marks
    svg
        .selectAll(".dot4")
        .data(data4)
        .enter()
        .append("path")
        .attr("class", "dot")
        .attr("d", d3.symbol().type(d3.symbolCross))
        .attr("transform", (d) => "translate(" + xScale(d.x) + "," + yScale(d.y) + ")");


    // Create path for the line
    //console.log(down.innerHTML)
    //popupContent.innerHTML = down.innerHTML;
    //document.getElementById("popup").style.display = "block";
    /*
        domtoimage.toPng(down)
            .then(function(dataUrl) {
                var link = document.createElement('a');
                link.download = 'chart.png';
                link.href = dataUrl;
                link.click();
            });
    */
}

function saveChart() {
    plotChart();
    Diagramm = !Diagramm;
    if (Diagramm)
        document.getElementById("DownloadContainer").style.display = "block";
    else
        document.getElementById("DownloadContainer").style.display = "none";
}

function ausblenden() {
    //document.getElementById("popup").style.display = "none";
}