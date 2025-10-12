
let table;
let validRows = []; // qui salverò le righe corrette
let meanCol0 = 0; // valore base della media colonna 0 per capire se funziona
let stdCol1 = 0; // valore base della deviazione standard colonna 1
let modeCol2 = 0; // valore base della moda colonna 2
let medianCol3 = 0; // valore base della mediana colonna 4
let meanCol4 = 0; // media colonna 4
let stdCol4 = 0;  // deviazione standard colonna 4

function preload() {
  // Carico il dataset
  table = loadTable("dataset.csv", "csv", "header");
}


function setup() {
  createCanvas(800, 800);

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

   // 🔹 Calcola la media chiamando la tua funzione dedicata
  meanCol0 = calcMeanCol0(validRows);

  // 🔹 Calcola la deviazione standard chiamando la tua funzione dedicata
  stdCol1 = calcStdCol1(validRows);

  modeCol2 = calcModeCol2(validRows);

  medianCol3 = calcMedianCol3(validRows);

  meanCol4 = calcMeanCol4(validRows);
  stdCol4 = calcStdCol4(validRows);

}

function draw() {
  background(220);

  textAlign(CENTER, CENTER);
  textSize(20);
  fill(0);
text("Media colonna 0: " + meanCol0, width / 2, height / 2 - 20);
text("Deviazione standard colonna 1: " + stdCol1, width / 2, height / 2 + 20);
text("Moda colonna 2: " + modeCol2.join(", "), width / 2, height / 2 + 60);
text("Mediana colonna 3: " + medianCol3, width / 2, height / 2 + 100);
text("Media colonna 4: " + meanCol4, width / 2, height / 2 + 140);
text("Deviazione standard colonna 4: " + stdCol4, width / 2, height / 2 + 180);
}


// Questa funzione riceve una riga del dataset (array di valori)
// e restituisce true solo se la riga rispetta entrambe le regole:
// 1️⃣ Il valore della colonna 0 è multiplo di 5
// 2️⃣ Il valore della colonna 1 è un intero compreso tra 10 (incluso) e 50 (escluso)
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