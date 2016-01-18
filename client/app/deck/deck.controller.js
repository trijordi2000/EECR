'use strict';

(function() {

  class DeckController {
    constructor(Auth, $scope, $http, socket, _, $log, $filter, cartas) {
      this.$filter = $filter;
      this.$http = $http;
      this.$log = $log;
      this.$scope = $scope;
      $scope.actionFull = false;
      $scope.allFiltro = {
        calidad: '',
        coste: '',
        tipo: '',
        arena: ''
      };
      $scope.calidadFiltroTexto = 'Calidad: Todos';
      this.calidades = ['Common', 'Rare', 'Epic'];
      $scope.costeFiltroTexto = 'Coste: Todos';
      this.costes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
      $scope.tipoFiltroTexto = 'Tipo: Todos';
      this.tipos = ['Troop', 'Spell', 'Building'];
      $scope.arenaFiltroTexto = 'Arena: Todos';
      this.arenas = ['Training Camp', 'Goblin Stadium', 'Bone Pit', 'Barbarian Bowl', "P.E.K.K.A's Playhouse", 'Spell Valley', 'Royal Arena'];

      // Mazo Actual
      this.me = Auth.getCurrentUser();
      var id = Auth.getCurrentUser()._id;
      this.deck = [];

      cartas.getCartas.then(response => {
        this.cartas = response;
        $http.get('/api/users/'+id+'/deck').then(response => {
          var deckX = response.data;
          for(var i in deckX){
            var carta = $filter('filter')(this.cartas, {'_id': deckX[i]});
            this.deck.push(carta[0]);
            //  key: _.findWhere(this.cartas, {'_id': deckX[i]})
          }
        });
      });

      $scope.me = this.me;
      this.newDeck = [];
      $scope.total = 8;

      $scope.hideVaciar = true;
      $scope.hideGuardar = true;

      $scope.status = {
        isopen: false,
        isopen2: false,
        isopen3: false
      };
    }

    addCarta(carta){
      var id = carta._id;
      if(!this.newDeck.id && this.newDeck.length!=8){
        this.newDeck.push(carta);
        this.cartas.splice(this.cartas.indexOf(carta),1);
        this.$scope.total--;
        this.$scope.hideVaciar = false;
        if(this.newDeck.length==8){
          this.$scope.actionFull = true;
          this.$scope.hideGuardar = false;
        }
      }
    }

    delCarta(carta){
      var id = carta._id;
      if(!this.cartas.id){
        this.cartas.push(carta);
        this.newDeck.splice(this.newDeck.indexOf(carta),1);
        this.$scope.total++;
        if(this.$scope.total==8){
          this.$scope.hideVaciar = true;
        }
        if(this.$scope.total>0){
          this.$scope.actionFull = false;
          this.$scope.hideGuardar = true;
        }
      }
    }

    vaciarNewDeck(){
      for(var i in this.newDeck){
        this.cartas.push(this.newDeck[i]);
      }
      this.newDeck = [];
      this.$scope.actionFull = false;
      this.$scope.hideVaciar = true;
      this.$scope.hideGuardar = true;
      this.$scope.total=8;
    }

    clonar(a,b){
      for(var i in a){
        b.push(a[i]);
      }
    }

    clonarDeck(){
      this.clonar(this.deck,this.newDeck);
      this.$scope.total = 0;
      for(var i in this.newDeck){
        this.cartas.splice(this.cartas.indexOf(this.newDeck[i]),1);
      }
      this.$scope.hideVaciar = false;
    }

    guardarNewDeck(){
      //Nueva Baraja
      this.deck = [];
      this.clonar(this.newDeck,this.deck);
      this.$http.put('/api/users/'+this.me._id+'/deck', this.deck)
      .then(response => {
        this.$log.info(response.data);
      });
      this.vaciarNewDeck();
    }

    setCalidad(calidad){
      if(calidad!='all'){
        this.$scope.allFiltro.calidad = calidad;
        this.$scope.calidadFiltroTexto = 'Calidad: '+calidad;
      }else{
        this.$scope.allFiltro.calidad = '';
        this.$scope.calidadFiltroTexto = 'Calidad: Todos';
      }
    }

    setCoste(coste){
      if(coste!='all'){
        this.$scope.allFiltro.coste = coste;
        this.$scope.costeFiltroTexto = 'Coste: '+coste;
      }else{
        this.$scope.allFiltro.coste = '';
        this.$scope.costeFiltroTexto = 'Coste: Todos';
      }
    }

    setTipo(tipo){
      if(tipo!='all'){
        this.$scope.allFiltro.tipo = tipo;
        this.$scope.tipoFiltroTexto = 'Tipo: '+tipo;
      }else{
        this.$scope.allFiltro.tipo = '';
        this.$scope.tipoFiltroTexto = 'Tipo: Todos';
      }
    }

    setArena(arena){
      if(arena!='all'){
        this.$scope.allFiltro.arena = arena;
        this.$scope.arenaFiltroTexto = 'Arena: '+arena;
      }else{
        this.$scope.allFiltro.arena = '';
        this.$scope.arenaFiltroTexto = 'Arena: Todos';
      }
    }

    setClearAll(){
      this.$scope.allFiltro.calidad = '';
      this.$scope.calidadFiltroTexto = 'Calidad: Todos';
      this.$scope.allFiltro.coste = '';
      this.$scope.costeFiltroTexto = 'Coste: Todos';
      this.$scope.allFiltro.tipo = '';
      this.$scope.tipoFiltroTexto = 'Tipo: Todos';
      this.$scope.allFiltro.arena = '';
      this.$scope.arenaFiltroTexto = 'Arena: Todos';
    }
  }

  angular.module('eecrApp')
    .controller('DeckController', DeckController);
})();