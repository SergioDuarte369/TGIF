let colParties = new Vue({

  el: "#vue-table",
  data: {
    miembros: [],
    miembrosAlt: [],
    partidosFiltrados: [],
    valorEstado: [],
    stateSelected: "all",
    estados: [],
    partidosVue : [],
    miembrosMost : [],
    miembrosLeast : [],
    miembrosMostLoyal : [],
    miembrosLeastLoyal :[],


  },
  methods: {
    async getData2(chamber) {
      //await the response of the fetch call
      let response = await fetch(`https://api.propublica.org/congress/v1/115/${chamber}/members.json`, {
        method: "GET",
        dataType: 'json',
        headers: {
          "X-API-Key": "3jNf4eaSuovwps878tpWZf8q3Se6YpJqKhD39HWZ"
        }
      });
      let data = await response.json();
      this.miembros = data.results[0].members;
      this.miembrosAlt = this.miembros;
      let miembrosConValor = this.miembros.filter(member => member.votes_with_party_pct && member.votes_with_party_pct <= 100);
      this.llenarEstados();
      this.miembrosLeast =  this.arrayPorcentajeMiembrosLeast(this.miembros, `missed_votes_pct`);
      this.miembrosMost = this.arrayPorcentajeMiembrosMost(this.miembros, `missed_votes_pct`);
      this.miembrosLeastLoyal = this.arrayPorcentajeMiembrosMost(miembrosConValor, `votes_with_party_pct`)
      this.miembrosMostLoyal = this.arrayPorcentajeMiembrosLeast(miembrosConValor, `votes_with_party_pct`)

      console.log(this.miembros.filter(member => member.votes_with_party_pct))

      let partidos = [{
        "id": "Democrats",
        "number": this.contarRepresentantesPartidos("D"),
        "votes_with_party": this.contarVotesPartido("D")
      },
      {
        "id": "Republicans",
        "number": this.contarRepresentantesPartidos("R"),
        "votes_with_party": this.contarVotesPartido("R")
      },
      {
        "id": "Independents",
        "number": this.contarRepresentantesPartidos("I"),
        "votes_with_party": this.contarVotesPartido("I")
      },
      {
        "id": "Todos",
        "number": this.contarRepresentantesPartidos("all"),
        "votes_with_party": ((Number(this.contarVotesPartido("D")) + Number(this.contarVotesPartido("R")) + Number(this.contarVotesPartido("I"))) / 3).toFixed(2)
      }]
      this.partidosVue = partidos
      console.log(this.miembrosLeast);

    },

    checkName(miembro) {
      let fullName = ` `;

      if (miembro.first_name !== null) {
        fullName += miembro.first_name + " ";
      }
      if (miembro.middle_name !== null) {
        fullName += miembro.middle_name + " ";
      }
      if (miembro.last_name !== null) {
        fullName += miembro.last_name;
      }
      return fullName;
    },
    todosPartidos(array) { //Función para seleccionar a los miembros en función del partido al que pertenecen a traves de os checkbox
      let miembrosFiltrados = [];

      for (let index = 0; index < array.length; index++) {
        if (this.partidosFiltrados.includes(array[index].party)) {
          miembrosFiltrados.push(array[index]);

        }

      }
      if (this.partidosFiltrados.length == 0) {
        return array;
      } else {
        return miembrosFiltrados;
      }

    },
    seleccionarEstados(array) { // funciço para filtrar a los mimbros en función del estado que se ha seleciionado en el dropdown menu
      let membersFilterByState = [];



      if (this.stateSelected === "all") {
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


    llenarEstados() {
      let arrayEstados = [];
      for (let i = 0; i < this.miembros.length; i++) {
        if (!arrayEstados.includes(this.miembros[i].state)) {
          arrayEstados.push(this.miembros[i].state)
        }
      }
      this.estados = arrayEstados;
    },

    filtrarTodos() {

      let miembrosFiltrados = this.todosPartidos(this.miembros)
      this.seleccionarEstados(miembrosFiltrados)
    }, ////////////////////////funciones Attendance////////////////////////////////////////
     contarRepresentantesPartidos(party) {
      let totalPartido = []
      for (let index = 0; index < this.miembros.length; index++) {
        if (this.miembros[index].party === party) {
          totalPartido.push(this.miembros[index].party)
        }
        
      }
      if(party === "all"){
        return this.miembros.length;
      } else {
          return totalPartido.length;  
      }
      
    },
    
    contarVotesPartido(party) {
      let totalPartido = []
       
      for (let index = 0; index < this.miembros.length; index++) {
        if (this.miembros[index].party === party && this.miembros[index].votes_with_party_pct != undefined) {
          totalPartido.push(this.miembros[index].votes_with_party_pct) 
              
        }
         
      }
      let promedio = totalPartido.reduce((a,b) => a + b, 0)/totalPartido.length
    
      if (totalPartido.length === 0 ) {
        return 0
      } else {  
        return promedio.toFixed(2)
      }
    
    
        
    },
     totalVotos() {
      let votosPartido = []
      for (let index = 0; index < this.miembros.length; index++) {
          votosPartido.push(miembros[index].votes_with_party_pct )
  
        }  
    },
     porcentaje(array) {
      let miembrosPorcentaje = Math.round(array.length*0.1)
      return miembrosPorcentaje
  
      },
     arrayPorcentajeMiembrosMost(array, key) {
                      
        let orden = array.slice().sort((a,b) => a[key] - b[key])
      
        orden.slice(0, this.porcentaje(array))
      return orden.slice(0, this.porcentaje(array))
      },
       arrayPorcentajeMiembrosLeast(array, key) {
        let orden = array.slice().sort((a,b) => a[key] - b[key])
        orden.reverse()
        orden.slice(0, this.porcentaje(array))
        return orden.slice(0, this.porcentaje(array))
  
      },
  
  },

  mounted() {
    if ((window.location.href.includes("senate"))) {
      this.getData2("senate")
    } else {
      this.getData2("house")
    }
    
  },

})