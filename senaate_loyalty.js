let miembros;

async function getData2(chamber) {
  //await the response of the fetch call
  let response = await fetch(`https://api.propublica.org/congress/v1/115/${chamber}/members.json`, {
      method: "GET",
      dataType: 'json',
      headers: {
          "X-API-Key":  "3jNf4eaSuovwps878tpWZf8q3Se6YpJqKhD39HWZ"
      }
  });
  let data = await response.json();
   miembros = data.results[0].members;
createTableLeast(arrayPorcentajeMiembrosLeast(miembros))
createTableMost(arrayPorcentajeMiembrosMost(miembros))  
createTableNumbersAndVotes();

let democratas = [{"id":"Democrats", "number": contarRepresentantesPartidos("D"), "votes with party": contarVotesPartido("D")}]
let republicanos = [{"id": "Republicans", "number": contarRepresentantesPartidos("R"), "votes with party": contarVotesPartido("R")}]
let independientes = [{"id": "Independents","number": contarRepresentantesPartidos("I"), "votes with party": contarVotesPartido("I")}]
let total = [{"id": "Todos", "number": contarRepresentantesPartidos("all"), "vote with party":(Number(contarVotesPartido("D")) + Number(contarVotesPartido("R")) + Number(contarVotesPartido("I"))) / 3 }]


}
if ((window.location.href.includes("senate"))) {
  getData2("senate")
}else { 
  getData2("house")
}




function contarRepresentantesPartidos(party) {
  let totalPartido = []
  for (let index = 0; index < miembros.length; index++) {
    if (miembros[index].party === party) {
      totalPartido.push(miembros[index].party)
    }
    
  }
  if(party === "all"){
    return miembros.length;
  } else {
      return totalPartido.length;  
  }
 
}

function checkName(miembro) {
  let fullName=` `;
  
  if (miembro.first_name!==null) {
    fullName += miembro.first_name + " "; 
  }
  if (miembro.middle_name !==null) {
    fullName += miembro.middle_name + " ";
  }
  if (miembro.last_name !== null) {
    fullName += miembro.last_name;
  }
  return fullName;
}

function contarVotesPartido(party) {
  let totalPartido = []
   
  for (let index = 0; index < miembros.length; index++) {
    if (miembros[index].party === party && miembros[index].votes_with_party_pct != undefined) {
      totalPartido.push(miembros[index].votes_with_party_pct) 
          
    }
     
  }
  let promedio = totalPartido.reduce((a,b) => a + b, 0)/totalPartido.length

  if (totalPartido.length === 0 ) {
    return 0
  } else {  
    return promedio.toFixed(2)
  }    
}



function createTableNumbersAndVotes() {

  let tablaNumbersAndVotes = document.getElementById("numbers-votes")
  let contenidoTablaNumbers = `
    <thead>
                        <tr>
                            <th>Party</th>
                            <th>Number of Reps</th>
                            <th>% Voted with Party</th>
                        </tr>
                    </thead>
                      <tbody>
                        <tr>
                            <td>Republican</td>
                            <td>${contarRepresentantesPartidos("R")}</td>
                            <td>${contarVotesPartido("R")}</td>
                        </tr>
                        <tr>
                            <td>Democrat</td>
                            <td>${contarRepresentantesPartidos("D")}</td>
                            <td>${contarVotesPartido("D")}</td>
                        </tr>
                        <tr>
                            <td>Independent</td>
                            <td>${contarRepresentantesPartidos("I")}</td>
                            <td>${contarVotesPartido("I")}</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>${contarRepresentantesPartidos("all")}</td>
                            <td>${((Number(contarVotesPartido("D")) + Number(contarVotesPartido("R")) + Number(contarVotesPartido("I"))) / 3).toFixed(2)}</td>
                        </tr>
                    </tbody>`
                    tablaNumbersAndVotes.innerHTML = contenidoTablaNumbers;
  
                    }

                    function porcentaje(array) {
                      let miembrosPorcentaje = Math.round(array.length*0.1)
                      return miembrosPorcentaje
  
                      } 

                    function arrayPorcentajeMiembrosMost(array) {
                      
                      let orden = array.slice().sort((a,b) => a.votes_with_party_pct - b.votes_with_party_pct)
                      orden.reverse()
                      return orden.slice(0, porcentaje(array))
                    }
                    
                    
  
                    function arrayPorcentajeMiembrosLeast(array) {
                      let orden = array.slice().sort((a,b) => a.votes_with_party_pct - b.votes_with_party_pct)
                      orden.slice(0, porcentaje(array))
                      return orden.slice(0, porcentaje(array))
  
                    }

                    function createTableLeast(array) {
                      let tablaLeast = document.getElementById("least_loyal")
                      contenidoTablaLeast =`
                      <thead>
                                          <tr>
                                              <th>Name</th>
                                              <th>Number Party Votes</th>
                                              <th>% Party Votes</th>
                                          </tr>
                                      </thead>
                                    `
                                    for (let index = 0; index < array.length; index++) {
  
                                      contenidoTablaLeast += `<tr> 
                                         
                                         <td>${checkName(array[index])}</td>
                                         <td>${array[index].total_votes}</td>
                                         <td>${array[index].votes_with_party_pct}</td>
                                         </tr>`;
                                         
                                    }
                                     
                                      tablaLeast.innerHTML = contenidoTablaLeast;
                   
                    }

                    function createTableMost(array) {
                      let basura = []
                      let tablaMost = document.getElementById("most_loyal")
                      contenidoTablaMost =`
                      <thead>
                                          <tr>
                                              <th>Name</th>
                                              <th>Number Party Votes</th>
                                              <th>% Party Votes</th>
                                          </tr>
                                      </thead>
                                    `
                                    for (let index = 0; index < array.length; index++) {
  
                                      contenidoTablaMost += `<tr> 
                                         
                                         <td>${checkName(array[index])}</td>
                                         <td>${array[index].total_votes}</td>
                                         <td>${array[index].votes_with_party_pct}</td>
                                         </tr>`;
                                         if (array[index].votes_with_party_pct === undefined) {
                                           basura.push(array[index].votes_with_party_pct)
                                         }
                                    }
                                     
                                      tablaMost.innerHTML = contenidoTablaMost;
                   
                    }
                      
                    
                
                    
  
  
