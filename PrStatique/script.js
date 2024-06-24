var processes = [];


function addProcess() {
  const processInput = document.getElementById('processInput').value;
  const te = document.getElementById('te').value;
  const pr = document.getElementById('pr').value;


  if (processInput >= 0 && te >= 0 && pr>0) {
    processes.push([parseInt(processInput), parseInt(te),parseInt(te),`Processus ${processes.length + 1}`,parseInt(pr)]);
    document.getElementById('processInput').value = '';
    document.getElementById('te').value = '';
    document.getElementById('pr').value='';



    const tbody = document.getElementById('processes');
    const newRow = tbody.insertRow(-1);

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);

    cell1.innerHTML = `Processus ${processes.length}`;
    cell2.innerHTML = processInput;
    cell3.innerHTML = te;
    cell4.innerHTML=pr;
  }

  
}

function runPrioriteStatique() {
  const chartContainer = document.getElementById('chart-container');
  chartContainer.innerHTML = '';
  const processLabels = [];
  const executionTimes = [];
  const fileAttente = [];

  let tempsTotal = 0;

  function executeNextProcess() {
    processes = processes.sort((a, b) => {
      a[0] - b[0];
    });

    console.log("Processes sorted:", processes);

    while (processes.length > 0 && processes[0][0] <= tempsTotal) {
      fileAttente.push(processes.shift());
    }

    console.log("File d'attente:", fileAttente);

    if (fileAttente.length > 0) {
      const processusEnCours = fileAttente.reduce((min, p) => p[2] < min[2] ? p : min);
      const dureeExecution = Math.min(processusEnCours[2], 1);
      tempsTotal += dureeExecution;
      processusEnCours[2] -= dureeExecution;
      processLabels.push(processusEnCours[3]);
      executionTimes.push(tempsTotal);

      console.log("Execution en cours:", processusEnCours);

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
      console.log("Aucun processus en file d'attente, tempsTotal incrémenté:", tempsTotal);
    }
  }

  executeNextProcess();

  const data = [{
    type: 'scatter',
    mode: 'markers+lines',
    x: executionTimes,
    y: processLabels,
    marker: { size: 12, color: 'rgb(0, 0, 0)' },
    line: { color: 'rgb(0, 0, 0,0.5)', width: 2 },
  }];

  const layout = {
    title: 'Priorité Statique',
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
