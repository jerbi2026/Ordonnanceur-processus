var processes = [];


function addProcess() {
  const processInput = document.getElementById('processInput').value;
  const te = document.getElementById('te').value;

  if (processInput >= 0 && te >= 0) {
    processes.push([parseInt(processInput), parseInt(te),parseInt(te),`Processus ${processes.length + 1}`]);
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

function runSRT() {
  const chartContainer = document.getElementById('chart-container');
  chartContainer.innerHTML = '';
  const processLabels = [];
  const executionTimes = [];
  const fileAttente = [];

  let tempsTotal = 0;
  function executeNextProcess() {
    processes = processes.sort((a, b) => {
      if (a[0] === b[0]) {
          return a[1] - b[1];
      } else {
          return a[0] - b[0];
      }
    });
    while (processes.length > 0 && processes[0][0] <= tempsTotal) {
      fileAttente.push(processes.shift());
    }
    if (fileAttente.length > 0) {
      const processusEnCours = fileAttente.reduce((min, p) => p[2] < min[2] ? p : min);
      const dureeExecution = Math.min(processusEnCours[2], 1);
      tempsTotal += dureeExecution;
      processusEnCours[2] -= dureeExecution;
      processLabels.push(processusEnCours[3]);
      executionTimes.push(tempsTotal);

      if (processusEnCours[2] > 0) {
          executeNextProcess();
      } else {
          // Passer au processus suivant
          fileAttente.splice(fileAttente.indexOf(processusEnCours), 1);
          executeNextProcess();
      }
    } else {
      processLabels.push('processeur vide');
      executionTimes.push(tempsTotal);
      tempsTotal++;
    }
  }
  executeNextProcess();





  const data = [{
    type: 'scatter',
    mode: 'markers+lines',
    x: executionTimes,
    y: processLabels,
    marker: { size: 12, color: 'rgb(137, 228, 0)' },
    line: { color: 'rgb(137, 228, 0,0.5)', width: 2 },
  }];

  const layout = {
    title: 'SRT',
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