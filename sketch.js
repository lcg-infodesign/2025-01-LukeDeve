
let table;
let validRows = []; // qui salverò le righe corrette dopo averle filtrate
let meanCol0 = 0; // valore base della media colonna 0 per capire se funziona
let stdCol1 = 0; // valore base della deviazione standard colonna 1
let modeCol2 = 0; // valore base della moda colonna 2
let medianCol3 = 0; // valore base della mediana colonna 4
let meanCol4 = 0; // valore base media colonna 4
let stdCol4 = 0;  // valore base deviazione standard colonna 4


// Variabili globali per grafico prima colonna
let col0Values = [];
let minCol0 = 0;
let maxCol0 = 0;
let marginLeft_col0 = 80;
let marginRight_col0 = 80;

// Variabili globali per grafico della terza colonna
let col2Values = [];       // valori della colonna 2
let curvePoints = [];      // punti della curva per il draw
let yModaLine = 0;     // coordinata Y per disegnare la riga della moda
let marginLeftModa = 80;
let marginRightModa = 80;

// Variabili globali per grafico della quinta colonna
let col4Values = [];
let col4Positions = [];
let marginLeft = 80;
let marginRight = 80;
let yZero = 1200; // riferimento verticale (y=0 del grafico)


//----FINE VARIABILI GLOBALI---

//carico il dataset prima di setup
function preload() {
  table = loadTable("dataset.csv", "csv", "header");
}




function setup() {
  createCanvas(800, 1500);

   // Ciclo su tutte le righe della tabella
  for (let r = 0; r < table.getRowCount(); r++) {
    // Prendo la riga corrente come array di valori
    let row = table.rows[r].arr;

    // Usa la funzione per verificare se la riga è valida
    if (isValidRow(row)) {
      // Se è valida, la aggiungiamo all’array validRows
      validRows.push(row);
    }
  }

   // tutti i calcoli per le statistiche
  meanCol0 = calcMeanCol0(validRows);
  stdCol1 = calcStdCol1(validRows);
  modeCol2 = calcModeCol2(validRows);
  medianCol3 = calcMedianCol3(validRows);
  meanCol4 = calcMeanCol4(validRows);
  stdCol4 = calcStdCol4(validRows);


  
// --- GRAFICO per la colonna 0:  do valore alle globali col0Values, minCol0, maxCol0 ---
 col0Values = validRows.map(r => Number(r[0])); // estraggo solo i valori in posizione 0 - quindi colonna 0
  if (col0Values.length > 0) {
    minCol0 = Math.min(...col0Values);
    maxCol0 = Math.max(...col0Values);
  } else {
    // caso nessun dato valido: lasciare min/max a 0 (o un valore di default)
    minCol0 = 0;
    maxCol0 = 0;
  }
  //--- Fine grafico colonna 0 ---


  // ---- GRAFICO colonna 2 -----
  //do valore alla globale col2Values estraendo i valori filtrati della colonna 2
col2Values = validRows.map(r => Number(r[2])); // estraggo solo i valori in posizione 2 - quindi colonna 2

// Parametri grafico
let graphWidthModa = width - marginLeftModa - marginRightModa; //width è la larghezza del canvas
let yBaseModa = 800; // linea di base della curva

let xStepModa = graphWidthModa / (col2Values.length - 1); //col2Values.length  è il numero di punti che creano la curva (cioè quanti valori validi ci sono nella colonna 2).
//il -1 alla fine serve per dividere lo spazio equamente fra i punti e fare in modo che vadano dalla sinistra alla destra del grafico

// Trova il massimo e il minimo per scalare la curva
let maxValModa = Math.max(...col2Values); //funzione di p5 per calcolare il max matematico 
let minValModa = Math.min(...col2Values);

// Calcola le posizioni dei punti della curva dando valore alla globale curvePoints
// Creiamo un array di oggetti {x, y, val} per disegnare la curva della colonna 2
curvePoints = col2Values.map((v, i) => {
  // Calcola la posizione X del punto i-esimo
  // Parte da marginLeftModa e aggiunge uno step costante per ogni punto
  let x = marginLeftModa + i * xStepModa;
  // Calcola la posizione Y del punto i-esimo
  // map() serve a trasformare il valore v (tra minValModa e maxValModa)
  // nella posizione verticale sullo schermo (tra yBaseModa e yBaseModa-200)
  let y = map(v, minValModa, maxValModa, yBaseModa, yBaseModa - 200);
  // Restituisce un oggetto che contiene:
  // x: coordinata orizzontale
  // y: coordinata verticale
  // val: il valore reale della colonna 2
  return {x, y, val: v};
});

// Calcola la posizione verticale (y) corrispondente al valore della moda
yModaLine = map(modeCol2, minValModa, maxValModa, yBaseModa, yBaseModa - 200);
//map(valore, valore min x, valore max x , valore min y, valore max y)

//--- Fine grafico colonna 2 -----




//----GRAFCO COLONNA 4----
  // Dopo aver calcolato meanCol4 e stdCol4
col4Values = validRows.map(r => Number(r[4]));  // estraggo solo i valori in posizione 4 - quindi colonna 4

// Calcola le posizioni dei punti dando valore alla globale col4Positions
// Creiamo un array di oggetti {x, y } per disegnare i pallini della colonna 4
col4Positions = col4Values.map(v => {
  let x = random(marginLeft + 10, width - marginRight - 10); // distribuzione orizzontale casuale ogni refresh, tanto mi interessa la posizione verticale
  let y = yZero - v; // posizione verticale reale
  return { x, y };
});
//----FINE GRAFICO COLONNA 4----
}




 function draw() {
  push();
  background(255, 250, 240); // colore di sfondo
  pop();  

  push();

  // Titolo 
textAlign(CENTER, CENTER);
textSize(28);
fill(0); 
textStyle(BOLD);
text("ASSIGNMENT 1: load a datased", width / 2, 60);

// Sottotitolo
textSize(20);
textStyle(NORMAL);
text("Luca Golinelli", width / 2, 90);

// --- Riquadro titolo ---
fill(200, 200, 100, 50); // colore di riempimento (RGBA)
stroke(100);
strokeWeight(5);
rect(100, 30, 600, 80, 10); // x, y, larghezza, altezza

  pop();


  push();

  // --- GRAFICO MEDIA COLONNA 0 --- //
  
  //variabile per la posizione della riga arancione - creo una variabile perche senno dovrei riscriverla un sacco di volte
let yLine_col0 = 300; // posizione verticale della riga aranciano

// --- Riquadro grafico colonna 0 ---
fill(180, 100, 0,50);
stroke(180, 100, 0);
strokeWeight(5);
rect(60, 200, 680, 150,10);

// --- Titolo grafico colonna 0 ---
textAlign(CENTER, CENTER);
textSize(22);
strokeWeight(0);
fill(180, 100, 0); 
textStyle(BOLD);
text("1st column - Min, Max and Mean", width / 2, yLine_col0 - 70); // width / 2. centra il tutto orizzontalmente

// linea arancione (da min a max)
stroke(255, 80, 0);
strokeWeight(12);
let xMin_col0 = marginLeft_col0; //riscrivo le variabili per chiarezza cosi ho xmax e xmin
let xMax_col0 = width - marginRight_col0; 
line(xMin_col0, yLine_col0, xMax_col0, yLine_col0); //coordinate del punto inziale e finale x1, y1, x2, y2

// Etichette dei valori min e max
noStroke();
fill(0);
textAlign(LEFT, CENTER); // il testo parte dalla destra del punto dato sotto (xMin_col0)
textSize(16);
text("Min: " + minCol0.toFixed(2), xMin_col0, yLine_col0 - 20);

textAlign(RIGHT, CENTER);// il testo arriva alla sinistra del punto dato sotto (xMin_col0)
text("Max: " + maxCol0.toFixed(2), xMax_col0, yLine_col0 - 20);

// --- Pallino della media ---
let meanDot = map(meanCol0, minCol0, maxCol0, xMin_col0, xMax_col0); //creo la variabile per la posizione x del pallino della media
fill(0, 0, 255); // blu
noStroke();
ellipse(meanDot, yLine_col0, 25, 25); // la posizione y è fissa siccome deve stare all'altezza della linea, la x è calcolata sopra

// Testo sopra il pallino
fill(0);
textAlign(CENTER, BOTTOM); // il testo sarà sopra l'altezza y data sotto, quindi sara scritto sopra il punto
text("Mean: " + meanCol0.toFixed(2), meanDot, yLine_col0 - 18); //.toFixed(2) arrotonda a 2 cifre decimali
// --- FINE GRAFICO MEDIA COLONNA 0 --- //

pop();


  push();
  // --- Testo con dev std della prima colonnas ---
  textAlign(CENTER, CENTER);
  textSize(22);
  fill(0, 0, 255);
  textStyle(BOLD);
  text("2nd column Standard Deviation: " + stdCol1.toFixed(2), width / 2, 420)

  // --- Riquadro testo deviazione standard colonna 1 ---
fill(0, 180, 180,50);
stroke(0, 180, 180);
strokeWeight(5);
rect(190, 395, 420, 50,10);
    
  pop();


push();
  // --- GRAFICO MODA COLONNA 2 ---

  // --- Riquadro grafico colonna 2 (moda) ---
fill(255, 200, 240,150);
stroke(255, 0, 0);
strokeWeight(5);
rect(60, 490, 680, 320,10);

  // Titolo del grafico
textAlign(CENTER, CENTER);
textSize(22);
strokeWeight(0);
fill(255, 0, 0);
textStyle(BOLD);
text("3rd column - Mode", width / 2, 520);

// --- Curva  ---
noFill();
stroke(0, 150, 255); 
strokeWeight(5);
beginShape(); // inizio a definire una forma

// Per ogni punto nell'array curvePoints, aggiunge un vertice della curva
// Ogni punto p contiene le coordinate x e y già calcolate in precedenza
// curveVertex() crea una linea morbida che passa per tutti questi punti
curvePoints.forEach(p => curveVertex(p.x, p.y));

endShape(); //chiudo la forma (sensa questo e il begin inizio e fine della curva si unirebbero )

// Riga orizzontale all’altezza della moda
stroke(255, 0, 0); // rossa
strokeWeight(4);
drawingContext.setLineDash([40, 20]);  //funzione p5 per linea tratteggiata [lunghezza tratto, spazio]
line(80, yModaLine, width - 80, yModaLine);
drawingContext.setLineDash([]); // reset per tornare a linea continua

// Etichetta del valore della moda
noStroke();
fill(255, 0, 0);
textAlign(LEFT, BOTTOM);
textSize(16);
text("Mode: " + modeCol2, 650, yModaLine - 5);

// --- FINE GRAFICO MODA COLONNA 2 ---

  pop();


  push();
  // --- Riquadro testo mediana quarta colonna ---
fill(0, 120, 255,50);
stroke(0, 120, 255);
strokeWeight(5);
rect(250, 870, 300, 60,10);
  // --- Testo mediana quarta colonna  ---
  textAlign(CENTER, CENTER);
  textSize(22);
  strokeWeight(0);
  fill(0, 0, 255);
  textStyle(BOLD);
  text("4th column median: " + medianCol3, width / 2, 900);
pop();


push();
  // --- GRAFICO colonna 4 ---

  

//calcolo variabile larghezza del grafico
  let graphWidth = width - marginLeft - marginRight;


  // --- Riquadro grafico colonna 4 ---
fill(0, 200, 0,50);
stroke(0, 200, 0);
strokeWeight(2);
rect(35, 1000, 725, 350,10);

  // --- Titolo grafico ---
  textAlign(CENTER, CENTER);
  textSize(22);
  strokeWeight(0);
  fill(0, 200, 0);
  textStyle(BOLD);
  text("5th column - Mean and Std Dev", width / 2, 1050);

  // --- Scala verticale a sinistra ---
  let tickValues = [100, 75, 50, 25, 0, -25, -50, -75, -100]; //scrivo una array con i valori che voglio sulla scala
  stroke(180);
  strokeWeight(1);
  fill(0);
  textSize(14);
  textAlign(RIGHT, CENTER);
  tickValues.forEach(val => {
    let y = yZero - val; // calcolo la posizione y per ogni valore della scala e quindi anche ogni liena orizzontale grigia
    text(val, marginLeft - 10, y); // text(valore, posizione x, posizione y)
    line(marginLeft, y, width - marginRight, y); // linee orizzontali
  });

  // --- Rettangolo deviazione standard (arancione) ---
  noStroke();
  fill(255, 165, 0, 100);
  let yTop = yZero - (meanCol4 + stdCol4); // calcolo la posizione y top del rettangolo arancione sottraendo la somma tra media e deviazione standard
  let yBottom = yZero - (meanCol4 - stdCol4); // calcolo la posizione y bottom del rettangolo arancione sottraendo la differenza tra media e deviazione standard
  rect(marginLeft, yTop, graphWidth, yBottom - yTop); //creo il rettangolo arancione



  // --- Linea media (blu) ---
  stroke(0, 0, 255);
  strokeWeight(5);
  let yMedia = yZero - meanCol4; //calcolo la posizione y della linea della media
  line(marginLeft, yMedia, width - marginRight, yMedia); //disegno la linea della media


  // --- Pallini --
  fill(0);
  noStroke();
  //richiamando la funzione random in setup i pallini si ridistribuiscono orizzontalmente in modo casuale
  col4Positions.forEach(p => {
    ellipse(p.x, p.y, 10, 10);
  });

  // --- Testo sopra rettangolo deviazione standard ---
  fill(255,0, 0);
  textAlign(RIGHT, BOTTOM);
  text("Std Dev: ± " + stdCol4.toFixed(2), width - marginRight, yTop - 5);


  // Testo linea media
  noStroke();
  fill(0, 0, 255);
  textAlign(LEFT, BOTTOM);
  text("Mean: " + meanCol4.toFixed(2), marginLeft, yMedia - 2);

  // --- FINE grafco colonna 4 ---
  pop();  
}



// Questa funzione riceve una riga del dataset (array di valori)
// e restituisce true solo se la riga rispetta entrambe le regole:
//  Il valore della colonna 0 è multiplo di 5
//  Il valore della colonna 1 è un intero compreso tra 10 (incluso) e 50 (escluso)
function isValidRow(row) {
  // Estrae i valori delle colonne come numeri
  let col0 = Number(row[0]);
  let col1 = Number(row[1]);

  // Regola 1: col0 deve essere multiplo di 5
  // Per verificare se un numero è multiplo di 5 → resto della divisione per 5 deve essere 0
  let rule1 = col0 % 5 === 0;

  // Regola 2: col1 deve essere un numero intero tra 10 e 50 (10 ≤ x < 50)
  // Controlliamo che non sia NaN, che sia intero e nel range corretto
  let rule2 = !isNaN(col1) && Number.isInteger(col1) && col1 >= 10 && col1 < 50;

  // Se entrambe le regole sono vere, la riga è valida
  return rule1 && rule2;
}

// Calcola la media della colonna 0 del dataset filtrato
function calcMeanCol0(rows) {
  // Estrae i valori della prima colonna e li converte in numeri
  let values = rows.map(r => Number(r[0]));

  // Controllo di sicurezza: se l’array è vuoto, restituisco 0
  if (values.length === 0) return 0;

  // Somma tutti i valori e dividi per la lunghezza -> media
  let sum = values.reduce((a, b) => a + b, 0);
  let mean = sum / values.length;

  return mean;
}

// Calcola la deviazione standard della colonna 1 del dataset filtrato
function calcStdCol1(rows) {
  // Estraggo i valori della colonna 1
  let values = rows.map(r => Number(r[1]));

  // Controllo di sicurezza
  if (values.length === 0) return 0;

  // Calcolo la media
  let mean = values.reduce((a, b) => a + b, 0) / values.length;

  // Calcolo la somma dei quadrati delle differenze
  let sumSq = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);

  // Deviazione standard
  let std = Math.sqrt(sumSq / values.length);

  return std;
}

// Calcola la moda della terza colonna (column2) delle righe valide
function calcModeCol2(rows) {
  let values = rows.map(r => Number(r[2])); // estraggo i valori della colonna 2

  const freq = {}; // oggetto per contare le occorrenze
  values.forEach(v => {
    if (!isNaN(v)) {
      freq[v] = (freq[v] || 0) + 1;
    }
  });

  let maxCount = 0;
  let mode = [];

  for (let key in freq) {
    if (freq[key] > maxCount) {
      maxCount = freq[key];
      mode = [Number(key)];
    } else if (freq[key] === maxCount) {
      mode.push(Number(key));
    }
  }

  return mode;
}

// Calcola la mediana della quarta colonna (column3) delle righe valide
function calcMedianCol3(rows) {
  
  let values = rows.map(r => Number(r[3])); // estraggo i valori della colonna 3

  // Rimuove eventuali NaN
  values = values.filter(v => !isNaN(v));

  if (values.length === 0) return 0;

  // Ordina i valori
  values.sort((a, b) => a - b);

  const mid = Math.floor(values.length / 2);

  if (values.length % 2 === 0) {
    // Numero pari di elementi → media dei due centrali
    return (values[mid - 1] + values[mid]) / 2;
  } else {
    // Numero dispari → elemento centrale
    return values[mid];
  }
}

// Calcola la media della quinta colonna (column4)
function calcMeanCol4(rows) {
  let values = rows.map(r => Number(r[4])); // estraggo i valori della colonna 4
  // Controllo di sicurezza: se l’array è vuoto, restituisco 0
  if (values.length === 0) return 0;

  // Somma tutti i valori e dividi per la lunghezza -> media
  let sum = values.reduce((a, b) => a + b, 0);
  let mean = sum / values.length;

  return mean;
}

// Calcola la deviazione standard della quinta colonna (column4)
function calcStdCol4(rows) {
  let values = rows.map(r => Number(r[4])); // estraggo i valori della colonna 4
  
  // Controllo di sicurezza
  if (values.length === 0) return 0;

  // Calcolo la media
  let mean = values.reduce((a, b) => a + b, 0) / values.length;

  // Calcolo la somma dei quadrati delle differenze
  let sumSq = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);

  // Deviazione standard
  let std = Math.sqrt(sumSq / values.length);

  return std;
}