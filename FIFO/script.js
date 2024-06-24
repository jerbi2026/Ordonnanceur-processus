var processes = [];


function addProcess() {
  const processInput = document.getElementById('processInput').value;
  const te = document.getElementById('te').value;

  if (processInput >= 0 && te >= 0) {
    processes.push([parseInt(processInput), parseInt(te),`Processus ${processes.length + 1}`]);
    document.getElementById('processInput').value = '';
    document.getElementById('te').value = '';


    const tbody = document.getElementById('processes');
    const newRow = tbody.insertRow(-1);

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);

    cell1.innerHTML = `Processus ${processes.length}`;
    cell2.innerHTML = processInput;
    cell3.innerHTML = te;
  }

  
}

function runFIFO() {
  const chartContainer = document.getElementById('chart-container');
  chartContainer.innerHTML = '';

  const processLabels = [];
  const executionTimes = [];  
  let currentTime = 0;

  // Tri des processus en fonction du temps d'arrivée
  processes = processes.sort((a, b) => a[0] - b[0]);

  processes.forEach((process) => {
    if (currentTime >= process[0]) {
        // Si le temps d'arrivée du processus est inférieur ou égal au temps actuel
        const processStartTime = Math.max(currentTime, process[0]); // Utilisez le temps d'arrivée ou le temps actuel, le plus grand des deux
        for (let i = 0; i < process[1]; i++) {
            processLabels.push(process[2]);
            executionTimes.push(processStartTime + i);
        }
        currentTime = processStartTime + process[1]; // Mise à jour du temps actuel
    } else {
        // Si le temps d'arrivée du processus est supérieur au temps actuel
        for (let i = 0; i < (process[0] - currentTime); i++) {
            processLabels.push('processeur vide');
            executionTimes.push(currentTime + i);
        }
        for (let i = 0; i < process[1]; i++) {
            processLabels.push(process[2]);
            executionTimes.push(process[0] + i);
        }
        currentTime = process[0] + process[1]; // Mise à jour du temps actuel
    }

  });

  const data = [{
    type: 'scatter',
    mode: 'markers+lines',
    x: executionTimes,
    y: processLabels,
    marker: { size: 12, color: 'rgb(9, 9, 106)' },
    line: { color: 'rgb(9, 9, 106,0.5)', width: 2 },
  }];

  const layout = {
    title: 'FIFO',
    xaxis: { title: "Temps d'execution Time" },
    yaxis: { title: 'Processeus', tickvals: processLabels, ticktext: processLabels },
    showlegend: false,
    
  };

  Plotly.newPlot('chart-container', data, layout);

  const tab_exec = document.getElementById('table_exec');
  
  const table = document.getElementById('processes2');
  table.innerHTML = '';

  let j=0;
  while(j<processLabels.length){
    const newRow = table.insertRow(-1);
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    cell1.innerHTML = executionTimes[j];
    cell2.innerHTML = processLabels[j];
    j++;
  }
  
  tab_exec.style.display='block';


}