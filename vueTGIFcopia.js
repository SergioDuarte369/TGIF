let colParties = new Vue ({

el : "#vue-table",
data: {
  miembros : [],
  miembrosAlt : [],
  partidosFiltrados : [],
  valorEstado : [],
  stateSelected : "all",
  estados : [],
  
  

},
methods : {
  async getData2(chamber) {
    //await the response of the fetch call
    let response = await fetch(`https://api.propublica.org/congress/v1/115/${chamber}/members.json`, {
        method: "GET",
        dataType: 'json',
        headers: {
            "X-API-Key":  "3jNf4eaSuovwps878tpWZf8q3Se6YpJqKhD39HWZ"
        }
    });
    let data = await response.json();
    this.miembros = data.results[0].members;
    this.miembrosAlt = this.miembros;
    this.llenarEstados();
  },

  checkName (miembro) {
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
  },
  todosPartidos(array) {   //Función para seleccionar a los miembros en función del partido al que pertenecen a traves de os checkbox
    let miembrosFiltrados =[];
  
    for (let index = 0; index < array.length; index++) {
      if (this.partidosFiltrados.includes(array[index].party)) {
        miembrosFiltrados.push(array[index]);
        
      } 
      
    }
    if(this.partidosFiltrados.length == 0) { 
      return array;
    } else  {
     return miembrosFiltrados;
    } 
    
  },
   seleccionarEstados(array) {    // funciço para filtrar a los mimbros en función del estado que se ha seleciionado en el dropdown menu
    let membersFilterByState = [];



    if(this.stateSelected === "all") {      
      this.miembrosAlt = array;
    } else {
      for (let index = 0; index < array.length; index++) {
        if (array[index].state === this.stateSelected) {
          membersFilterByState.push(array[index])
        }
      }
      this.miembrosAlt = membersFilterByState;
    }  
  },
    

llenarEstados(){
  let arrayEstados= [];
  for (let i = 0; i < this.miembros.length; i++) {
    if (!arrayEstados.includes(this.miembros[i].state)) {
      arrayEstados.push(this.miembros[i].state)
    }
  }
  this.estados =  arrayEstados;
},  

filtrarTodos() {

  let miembrosFiltrados = this.todosPartidos(this.miembros)
  this.seleccionarEstados(miembrosFiltrados)
},

},


mounted(){
  if ((window.location.href.includes("senate"))) {
    this.getData2("senate")
  }else { 
    this.getData2("house")
  }
}, 

})

   
  
