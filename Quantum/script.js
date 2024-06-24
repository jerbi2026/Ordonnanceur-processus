var processes = [];
quantum;

function valider(){
  quantum = document.getElementById('quantum').value;
  if(quantum>0){
    document.getElementById('quantum').disabled = true;
    document.getElementById('valider').disabled = true;
    
  }
  else{
    alert("veuillez saisir un quantum > 0")
    quantum=1;
  }
}

function addProcess() {
  const processInput = document.getElementById('processInput').value;
  const te = document.getElementById('te').value;
  

  if (processInput >= 0 && te > 0 ) {
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
  if(quantum <= 0){
    alert("veuillez saisir un quantum plus grand")
  }

  
}

function runSJF() {
  const chartContainer = document.getElementById('chart-container');
  chartContainer.innerHTML = '';
  const processLabels = [];
  const executionTimes = [];
  let currentTime = 0;
  
  processes.sort((a, b) => a[0] - b[0]);
  
  
 
  while (processes.length > 0) {
      const currentProcess = processes.shift();
  
      if (currentProcess[0] > currentTime ) {
        nb=0;
        for(let j=0;j<processes.length;j++){
          if(processes[0][0]>=currentProcess[0]){
            nb++;
          }
        }
        if(nb<1){
          processLabels.push('processeur vide');
          executionTimes.push(currentTime);
          currentTime = currentProcess[0];
        }
          
      }
  
      const timeSlice = Math.min(quantum, currentProcess[2]);
  
      for (let i = 0; i < timeSlice; i++) {
          processLabels.push(currentProcess[3]);
          executionTimes.push(currentTime);
          currentTime++;
          currentProcess[2]--;
      }
  
      if (currentProcess[2] > 0) {
          // If the process has remaining time, put it back into the queue
          processes.push(currentProcess);
      }
      else{
        processes.filter(process=>{process!=currentProcess})
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
    marker: { size: 12, color: 'rgb(167, 167, 8)' },
    line: { color: 'rgb(167, 167, 8,0.5)', width: 2 },
  }];

  const layout = {
    title: 'Round Robin',
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