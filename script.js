

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
////////async function es la funcion para que los datos de mi pagina se carguen del servidor siempre que abramos nuestra web
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
createTable(miembros)
selectState(miembros)  
  
}
if ((window.location.href.includes("senate"))) {
  getData2("senate")
}else { 
  getData2("house")
}

console.log(window.location.href.includes("senate"));


////url de javasrip
//un string contiene una palabra

  
  function createTable(arrayDatos) {
    
  let tabla = document.getElementById("senate-data");
    let contenidotabla = `<thead>
    <tr>
        <th>Senators</th>
        <th>Party Affiliation</th>
        <th>State</th>
        <th>Years in Office</th>
        <th>% Votes with Party</th>
    </tr>
</thead>`;
    
    
  for (let index = 0; index < arrayDatos.length; index++) {

    contenidotabla += `<tr> 
       
       <td><a href=${arrayDatos[index].url}>${checkName(arrayDatos[index])}</a></td>
       <td>${arrayDatos[index].party}</td>
       <td>${arrayDatos[index].state}</td>
       <td>${arrayDatos[index].seniority}</td>
       <td>${arrayDatos[index].votes_with_party_pct}</td>
       </tr>`;
       
  }
  tabla.innerHTML = contenidotabla;
  
}
  


  
 /*function republicans(array) {
   let todosRepublicanos = [];
for (let index = 0; index < array.length; index++) {
  if (array[index].party === "R") {
    todosRepublicanos.push(array[index])
  }
}
  console.log(todosRepublicanos);

 }

republicans(miembros);
*/

//let partidos=["D","R"]     Recorrer todo el array      Si el partido del miembro está incluído en el array partidos => meter este miembro en el nuevo array

function todosPartidos(array) {   //Función para seleccionar a los miembros en función del partido al que pertenecen a traves de os checkbox
  let miembrosFiltrados =[];
  let partidos=[];
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  for (x of checkboxes){
    partidos.push(x.value);
  }

  for (let index = 0; index < array.length; index++) {
    if (partidos.includes(array[index].party)) {
      miembrosFiltrados.push(array[index]);
    } 
  }

  if(partidos.length == 0) { 
    return miembros;
  } else  {
    return miembrosFiltrados;
  } 
  
}
function getValue() {
  let checked=[];
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  for (x of checkboxes){
    checked.push(x.value);
  }
  console.log(checked);
}


////////
 //función para filtrar a los políticos republicanos
/*function filtrarRepublicanos(array) {
  let form= document.getElementById("republicanCheckboxes")
 let republicanos= []
 let partidos=["democrat", "republican", "independet"];
 for (let index = 0; index < array.length; index++) {
  if (partidos.includes(array[index].party)) {
    republicanos.push(array[index]);

  }
 }
 console.log(republicanos);
 
}
filtrarRepublicanos(miembros);

*/

function selectState(miembros) {

  let arrayEstados=[]
  for (let i = 0; i < miembros.length; i++) {
    if (!arrayEstados.includes(miembros[i].state)) {
      arrayEstados.push(miembros[i].state)
    }
    
  }
  let contenidoestados= "<option value='all' selected>All </option>"
  for (let index = 0; index < arrayEstados.length; index++) {
    contenidoestados= contenidoestados + "<option value=" + arrayEstados[index] + ">"  + arrayEstados[index] + "</option>"
    
  }
  
  

  document.getElementById("stateSelection").innerHTML=contenidoestados

}



function seleccionarEstados(array) {    // funciço para filtrar a los mimbros en función del estado que se ha seleciionado en el dropdown menu
  let stateSelected = []
  let stateValue = document.getElementById("stateSelection").value
  
  if(stateValue === "all") {
    createTable(array);
  } else {
    for (let index = 0; index < array.length; index++) {
      if (array[index].state === stateValue) {
        stateSelected.push(array[index])
      }
    }
    createTable(stateSelected)
  }  
}



/*function estadoLosAngeles() {
 let estadoValor = document.getElementById("stateSelection")
 let stateValue = estadoValor.value
}*/
  
  /*function estadosDesplegable() {
    
  let contenidoestados= "<option value='all' selected>All </option>"
  for (let index = 0; index < arrayEstados.length; index++) {
    contenidoestados= contenidoestados + "<option value=" + arrayEstados[index] + ">"  + arrayEstados[index] + "</option>"
    
  }

  document.getElementById("stateSelection").innerHTML=contenidoestados

  }

  estadosDesplegable()*/

/*

*/


function filtrarTodos() {

  let miembrosFiltrados = todosPartidos(miembros)
  seleccionarEstados(miembrosFiltrados)
}
 
