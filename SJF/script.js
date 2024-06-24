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

function runSJF() {
  const chartContainer = document.getElementById('chart-container');
  chartContainer.innerHTML = '';
  const processLabels = [];
  const executionTimes = [];
  let currentTime = 0;
  const processQueue = [];

  processes = processes.sort((a, b) => {
    if (a[0] === b[0]) {
        return a[1] - b[1];
    } else {
        return a[0] - b[0];
    }
  });

  let i = 0;
  while (i < processes.length || processQueue.length > 0 ) {
    if (i === 0) {
      currentTime=processes[i][0];
        for (let j = 0; j < processes[i][1]; j++) {
            processLabels.push(processes[i][2]);
            executionTimes.push(currentTime);
            currentTime++;
        }
        i++;
        processes = processes.filter((process) => process != processes[0]);
    } else {
        processQueue.length = 0;
        for (let j = 0; j < processes.length; j++) {
            if (processes[j][0] <= currentTime) {
                processQueue.push(processes[j]);
            }
        }

        if (processQueue.length !== 0) {
          processQueue.sort((a, b) => a[1] - b[1]);
          for (let j = 0; j < processQueue[0][1]; j++) {
              processLabels.push(processQueue[0][2]);
              executionTimes.push(currentTime);
              currentTime++;
          }
          processes = processes.filter((process) => process !== processQueue[0]);
      } else {
          processLabels.push('processeur vide');
          executionTimes.push(currentTime);
          currentTime++;
      }
      i++;
    }
  }

  // Output the result
  for (let i = 0; i < processLabels.length; i++) {
      console.log(`Time ${executionTimes[i]}: ${processLabels[i]}`);
  }





  const data = [{
    type: 'scatter',
    mode: 'markers+lines',
    x: executionTimes,
    y: processLabels,
    marker: { size: 12, color: 'rgba(255, 0, 0, 0.8)' },
    line: { color: 'rgba(255, 0, 0, 0.5)', width: 2 },
  }];

  const layout = {
    title: 'SJF',
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