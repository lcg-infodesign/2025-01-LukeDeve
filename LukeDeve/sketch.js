
let table;
let validRows = []; // qui salverò le righe corrette
let meanCol0 = 0; // valore base della media colonna 0 per capire se funziona
let stdCol1 = 0; // valore base della deviazione standard colonna 1
let modeCol2 = 0; // valore base della moda colonna 2
let medianCol3 = 0; // valore base della mediana colonna 4
let meanCol4 = 0; // media colonna 4
let stdCol4 = 0;  // deviazione standard colonna 4

let col4Values = [];
let col4Positions = [];



function preload() {
  // Carico il dataset
  table = loadTable("dataset.csv", "csv", "header");
}

function setup() {
  createCanvas(800, 1000);

   // Ciclo su tutte le righe della tabella
  for (let r = 0; r < table.getRowCount(); r++) {
    // Prendo la riga corrente come array di valori
    let row = table.rows[r].arr;

    // Usa la funzione che hai scritto per verificare se la riga è valida
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


  // Dopo aver calcolato meanCol4 e stdCol4
col4Values = validRows.map(r => Number(r[4]));

// Calcolo le posizioni dei pallini una volta sola
let marginLeft = 80;
let marginRight = 80;
let yZero = 700; // riferimento verticale (y=0 del grafico)

col4Positions = col4Values.map(v => {
  let x = random(marginLeft + 10, width - marginRight - 10); // distribuzione orizzontale casuale
  let y = yZero - v; // posizione verticale reale
  return { x, y };
});
}


 function draw() {
  background(220);

  // --- Testi con statistiche ---
  textAlign(CENTER, CENTER);
  textSize(20);
  fill(0);
  text("Media colonna 0: " + meanCol0, width / 2, 40);
  text("Deviazione standard colonna 1: " + stdCol1, width / 2, 70);
  text("Moda colonna 2: " + modeCol2.join(", "), width / 2, 100);
  text("Mediana colonna 3: " + medianCol3, width / 2, 130);

  // --- Margini e riferimento verticale ---
  let marginLeft = 80;
  let marginRight = 80;
  let yZero = 700; // riferimento verticale per 0
  let graphWidth = width - marginLeft - marginRight;
  let graphTop = 550;
  let graphBottom = yZero;

  // --- Titolo grafico ---
  textAlign(CENTER, CENTER);
  textSize(22);
  fill(0, 0, 255);
  text("5th column - Mean and Std Dev", width / 2, graphTop - 30);

  // --- Scala verticale a sinistra ---
  let tickValues = [100, 75, 50, 25, 0, -25, -50, -75, -100];
  stroke(180);
  strokeWeight(1);
  fill(0);
  textSize(14);
  textAlign(RIGHT, CENTER);
  tickValues.forEach(val => {
    let y = yZero - val; // posizione reale verticale
    text(val, marginLeft - 10, y);
    line(marginLeft, y, width - marginRight, y); // linee orizzontali
  });

  // --- Rettangolo deviazione standard (arancione) ---
  noStroke();
  fill(255, 165, 0, 100);
  let yTop = yZero - (meanCol4 + stdCol4);
  let yBottom = yZero - (meanCol4 - stdCol4);
  rect(marginLeft, yTop, graphWidth, yBottom - yTop);

  
  // --- Linea media (blu) ---
  stroke(0, 0, 255);
  strokeWeight(5);
  let yMedia = yZero - meanCol4;
  line(marginLeft, yMedia, width - marginRight, yMedia);


  // --- Pallini della colonna 4 (posizione fissa) ---
  fill(0);
  noStroke();
  col4Positions.forEach(p => {
    ellipse(p.x, p.y, 10, 10);
  });

  // --- Testo sopra rettangolo deviazione standard ---
  fill(255,0, 0);
  textAlign(RIGHT, BOTTOM);
  text("Dev std: ± " + stdCol4.toFixed(2), width - marginRight, yTop - 5);


  // Testo linea media
  noStroke();
  fill(0, 0, 255);
  textAlign(LEFT, BOTTOM);
  text("Media: " + meanCol4.toFixed(2), marginLeft, yMedia - 2);

  
}


// Questa funzione riceve una riga del dataset (array di valori)
// e restituisce true solo se la riga rispetta entrambe le regole:
//  Il valore della colonna 0 è multiplo di 5
//  Il valore della colonna 1 è un intero compreso tra 10 (incluso) e 50 (escluso)
function isValidRow(row) {
  // Estrae i valori delle colonne come numeri
  let col0 = Number(row[0]);
  let col1 = Number(row[1]);

  // 1️⃣ Regola 1: col0 deve essere multiplo di 5
  // Per verificare se un numero è multiplo di 5 → resto della divisione per 5 deve essere 0
  let rule1 = col0 % 5 === 0;

  // 2️⃣ Regola 2: col1 deve essere un numero intero tra 10 e 50 (10 ≤ x < 50)
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

  // Somma tutti i valori e dividi per la lunghezza → media
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
  const colIndex = 2; // terza colonna
  const values = rows.map(r => Number(r[colIndex]));

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
  const colIndex = 3; // quarta colonna
  let values = rows.map(r => Number(r[colIndex]));

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
  const values = rows.map(r => Number(r[4]));
  if (values.length === 0) return 0;

  const sum = values.reduce((a, b) => a + b, 0);
  return sum / values.length;
}

// Calcola la deviazione standard della quinta colonna (column4)
function calcStdCol4(rows) {
  const values = rows.map(r => Number(r[4]));
  if (values.length === 0) return 0;

  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sumSq = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);

  return Math.sqrt(sumSq / values.length);
}