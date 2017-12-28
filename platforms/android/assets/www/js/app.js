/*
 * "Yksinkertainen" sovellus, jolla voin pitää kirjaa omista frisbeegolf kierroksien tuloksista eri radoilla. 
 * Sovelluksessa on kaikki CRUD-toiminnallisuudet rata-osiossa eli ratoja voi lisätä, muokata ja poistaa, sekä tietysti hakea kaikki radat.
 * Tulokset osiossa kaikki paitsi update, koska tämähän suorastaan houkuttelisi fiilunkiin, kun omia tuloksia voisi parannella jälkikäteen, joten siksi niitä voi vain poistaa ja lisätä...
 * Kaikki tiedot on tietokannassa ja haetaan webservicen avulla (PHP, json). radat ja omattulokset taulujen välillä on jopa relaatio:P
 * Ohjelmassa siis pidetään kirjaa kokonaisten kierrosten tuloksista eli siis tulos lisätään vasta kierroksen jälkeen ohjelmaan ja tuloksen "tasoitus" tilannetta on kierroksen aikana pidettävä mielessään. Ja ratojahan on niin maan perkuleesti niin niitä voi aina lisäillä sitä mukaan kun käy uusilla radoilla heittämässä.
 * Ohjelmaa olisi mahdollista viedä eteenpäin tekemällä "realiaikaisen" laskurin mihin kirjattaisiin väylä kohtaisesti tulokset, millä radalla ollaankaan silloin heittämässä niin silloin tasoitustilannettakaan ei tarvitsisi pitää mielessään ja jälkikäteen näkisi väylä kohtaisesti miten on heitot mennyt. Ja paljon muuta mitä voisi kehittää ja viedä eteenpäin (Lopputyöidea tälle kurssille?:))
 * Toivottavasti hieman selkeytti selittely jos ei ymmärrä frisbeegolfista tai golfista...(niin siis miksei tämä toimisi normi golfissakin)
 */
var frisbeegolfLaskuri = angular.module("frisbeegolfLaskuri", ["ionic", "ngRoute"]);

frisbeegolfLaskuri.config(function ($routeProvider) {
    
    $routeProvider
            .when("/aloitus", {
                templateUrl : "templates/aloitus.html"
            })
            .when("/radat", {
                templateUrl : "templates/radat.html"
            })
            .when("/omatTulokset", {
                templateUrl : "templates/omatTulokset.html"
            })
            .otherwise({
                templateUrl : "templates/aloitus.html"
            });
    
});//config

//-----------------------------Filtterit----------------------------------------
frisbeegolfLaskuri.filter("rataIdlla", function() {
  return function(radat, id) {
    var i=0, len=radat.length;
    for (; i<len; i++) {
      if (+radat[i].id == +id) {
        return radat[i];
      }
    }
    return null;
  };
});
//------------------------------------------------------------------------------

frisbeegolfLaskuri.controller("frisbeegolfLaskuriCtrl", function ($scope, $http, $filter, $ionicSideMenuDelegate, $ionicPopup) {
    
    $scope.tulokset = [];
    $scope.radat = [];
    haeRadat();
    haeTulokset();
    
    $scope.naytaMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };//naytaMenu()
    
    
//------------------------------Funktiot----------------------------------------
    
    function haeTulokset() {
        $http({
            method : "GET",
            url : "http://192.168.1.84/mobiili/harjoitustehtava7/ws/tulokset_ws.php"
          })
          .then(
            function (response) { //Onnistunut http-kutsu
              $scope.tulokset = response.data;
          }, 
            function (response) { //Tapahtui virhe...

              console.log(response);

              var virhekoodi = response.status;

              $ionicPopup.alert({
                                    title : "Yhteysvirhe",
                                    template : "Palvelimellle ei saatu yhteyttä. (" + virhekoodi + ")"
                                });

        });
    }//haeTulokset
    
    $scope.tuloksenPvm = function (pvm) {
        var kokoAika = new Date(parseInt(pvm*1000));
        var palautettavaPvm = kokoAika.getDate() + "." + (kokoAika.getMonth()+1) + "." + kokoAika.getFullYear();
        return palautettavaPvm;
    };//tuloksenPvm()
    
    $scope.lisaaTulos = function () {
        
        $scope.dialogiData = [];
        $scope.dialogiData.uusiTulosRata = $scope.radat[0];//oletuksena selectissä ensimmainen rata mikä kannasta haettu, jottei tulosta ilman rataa voi lisätä
        
        var dialogi = $ionicPopup.show({
                                        title : "Lisää tulos",
                                        scope : $scope,
                                        template : "<span>Valitse rata</span>\n\
                                                    <select ng-model='dialogiData.uusiTulosRata' ng-options='rata as rata.radan_nimi for rata in radat'></select><br/>\n\
                                                    <span>Tulos</span><input type='number' ng-model='dialogiData.uusiTulos'/>",
                                        buttons : [
                                                    {
                                                        text : "Tallenna",
                                                        type : "button-dark",
                                                        onTap : function () {
                                                            
                                                            $http({
                                                                    method : "POST",
                                                                    url : "http://192.168.1.84/mobiili/harjoitustehtava7/ws/tulokset_ws.php",
                                                                    data : {
                                                                            radan_id: $scope.dialogiData.uusiTulosRata.id,
                                                                            tulos: $scope.dialogiData.uusiTulos
                                                                           }//data
                                                                  })
                                                                  .then(
                                                                    function (response) { //Onnistunut http-kutsu
                                                                        haeTulokset();
                                                                  }, 
                                                                    function (response) { //Tapahtui virhe...

                                                                      console.log(response);

                                                                      var virhekoodi = response.status;

                                                                      $ionicPopup.alert({
                                                                                            title : "Yhteysvirhe",
                                                                                            template : "Palvelimellle ei saatu yhteyttä. (" + virhekoodi + ")"
                                                                                        });

                                                                  });//http
                                                        }//onTab
                                                    },//tallenna
                                                    {
                                                        text : "Peruuta",
                                                        onTap : function () {

                                                        }
                                                    }//peruuta
                                                  ]//buttons
                                        });//dialogi
    };//lisaaTulos()
    
    $scope.poistaTulos = function (id) {
        var dialogi = $ionicPopup.show({
                                        title : "Poista",
                                        scope : $scope,
                                        template : 'Haluatko varmasti poistaa valitun tuloksen?',
                                        buttons : [
                                                    {
                                                        text : "Kyllä",
                                                        type : "button-dark",
                                                        onTap : function () {
                                                            
                                                            $http({
                                                                    method : "DELETE",
                                                                    url : "http://192.168.1.84/mobiili/harjoitustehtava7/ws/tulokset_ws.php",
                                                                    data : {id: id}
                                                                  })
                                                                  .then(
                                                                    function (response) { //Onnistunut http-kutsu
                                                                        haeTulokset();
                                                                  }, 
                                                                    function (response) { //Tapahtui virhe...

                                                                      console.log(response);

                                                                      var virhekoodi = response.status;

                                                                      $ionicPopup.alert({
                                                                                            title : "Yhteysvirhe",
                                                                                            template : "Palvelimellle ei saatu yhteyttä. (" + virhekoodi + ")"
                                                                                        });

                                                                  });//http
                                                        }//onTab
                                                    },//kyllä
                                                    {
                                                        text : "Ei",
                                                        onTap : function () {

                                                        }
                                                    }//ei
                                                  ]//buttons
                                        });//dialogi
    };//poistaTulos()
    
    function haeRadat () {
        $http({
            method : "GET",
            url : "http://192.168.1.84/mobiili/harjoitustehtava7/ws/radat_ws.php"
          })
          .then(
            function (response) { //Onnistunut http-kutsu
              $scope.radat = response.data;
          }, 
            function (response) { //Tapahtui virhe...

              console.log(response);

              var virhekoodi = response.status;

              $ionicPopup.alert({
                                    title : "Yhteysvirhe",
                                    template : "Palvelimellle ei saatu yhteyttä. (" + virhekoodi + ")"
                                });

        });
    }//haeRadat()
    
    $scope.haeRataIdlla = function(rata_id){
         var haettuRata = $filter("rataIdlla")($scope.radat, rata_id);
         console.log(haettuRata);
         return haettuRata.radan_nimi;
     };//haeRataIdlla()
    
    $scope.lisaaRata = function (nimi, vaylat, par) {
        
        $scope.dialogiData = [];
        
        var dialogi = $ionicPopup.show({
                                        title : "Lisää rata",
                                        scope : $scope,
                                        template : "<span>Radan nimi</span><input type='text' ng-model='dialogiData.uusiNimi'/><br/>\n\
                                                    <span>Väylät</span><input type='number' ng-model='dialogiData.uusiVaylat'/>\n\
                                                    <span>Par tulos</span><input type='number' ng-model='dialogiData.uusiPar'/>",
                                        buttons : [
                                                    {
                                                        text : "Tallenna",
                                                        type : "button-dark",
                                                        onTap : function () {
                                                            
                                                            $http({
                                                                    method : "POST",
                                                                    url : "http://192.168.1.84/mobiili/harjoitustehtava7/ws/radat_ws.php",
                                                                    data : {
                                                                            radan_nimi: $scope.dialogiData.uusiNimi,
                                                                            vaylat: $scope.dialogiData.uusiVaylat,
                                                                            par: $scope.dialogiData.uusiPar
                                                                           }//data
                                                                  })
                                                                  .then(
                                                                    function (response) { //Onnistunut http-kutsu
                                                                        haeRadat();
                                                                  }, 
                                                                    function (response) { //Tapahtui virhe...

                                                                      console.log(response);

                                                                      var virhekoodi = response.status;

                                                                      $ionicPopup.alert({
                                                                                            title : "Yhteysvirhe",
                                                                                            template : "Palvelimellle ei saatu yhteyttä. (" + virhekoodi + ")"
                                                                                        });

                                                                  });//http
                                                        }//onTab
                                                    },//tallenna
                                                    {
                                                        text : "Peruuta",
                                                        onTap : function () {

                                                        }
                                                    }//peruuta
                                                  ]//buttons
                                        });//dialogi
        
    };//lisaaRata()
    
    $scope.muokkaaRataa = function (id, nimi, vaylat, par) {
        
        $scope.dialogiData = [];
        $scope.dialogiData.uusiNimi = nimi;
        $scope.dialogiData.uusiVaylat = parseInt(vaylat);
        $scope.dialogiData.uusiPar = parseInt(par);
        
        var dialogi = $ionicPopup.show({
                                        title : "Muokkaa rataa",
                                        scope : $scope,
                                        template : "<span>Radan nimi</span><input type='text' ng-model='dialogiData.uusiNimi'/><br/>\n\
                                                    <span>Väylät</span><input type='number' ng-model='dialogiData.uusiVaylat'/>\n\
                                                    <span>Par tulos</span><input type='number' ng-model='dialogiData.uusiPar'/>",
                                        buttons : [
                                                    {
                                                        text : "Tallenna",
                                                        type : "button-dark",
                                                        onTap : function () {
                                                            
                                                            $http({
                                                                    method : "PUT",
                                                                    url : "http://192.168.1.84/mobiili/harjoitustehtava7/ws/radat_ws.php",
                                                                    data : {id: id,
                                                                            radan_nimi: $scope.dialogiData.uusiNimi,
                                                                            vaylat: $scope.dialogiData.uusiVaylat,
                                                                            par: $scope.dialogiData.uusiPar
                                                                            }//data
                                                                  })
                                                                  .then(
                                                                    function (response) { //Onnistunut http-kutsu
                                                                        haeRadat();
                                                                  }, 
                                                                    function (response) { //Tapahtui virhe...

                                                                      console.log(response);

                                                                      var virhekoodi = response.status;

                                                                      $ionicPopup.alert({
                                                                                            title : "Yhteysvirhe",
                                                                                            template : "Palvelimellle ei saatu yhteyttä. (" + virhekoodi + ")"
                                                                                        });

                                                                  });//http
                                                        }//onTab
                                                    },//tallenna
                                                    {
                                                        text : "Peruuta",
                                                        onTap : function () {

                                                        }
                                                    }//peruuta
                                                  ]//buttons
                                        });//dialogi
    };//muokkaaRataa
    
    $scope.poistaRata = function (id) {
        
        var dialogi = $ionicPopup.show({
                                        title : "Poista",
                                        scope : $scope,
                                        template : 'Haluatko varmasti poistaa valitun radan?',
                                        buttons : [
                                                    {
                                                        text : "Kyllä",
                                                        type : "button-dark",
                                                        onTap : function () {
                                                            
                                                            $http({
                                                                    method : "DELETE",
                                                                    url : "http://192.168.1.84/mobiili/harjoitustehtava7/ws/radat_ws.php",
                                                                    data : {id: id}
                                                                  })
                                                                  .then(
                                                                    function (response) { //Onnistunut http-kutsu
                                                                        haeRadat();
                                                                  }, 
                                                                    function (response) { //Tapahtui virhe...

                                                                      console.log(response);

                                                                      var virhekoodi = response.status;

                                                                      $ionicPopup.alert({
                                                                                            title : "Yhteysvirhe",
                                                                                            template : "Palvelimellle ei saatu yhteyttä. (" + virhekoodi + ")"
                                                                                        });

                                                                  });//http
                                                        }//onTab
                                                    },//kyllä
                                                    {
                                                        text : "Ei",
                                                        onTap : function () {

                                                        }
                                                    }//ei
                                                  ]//buttons
                                        });//dialogi
    };//poistaRata()
//------------------------------------------------------------------------------
});//Ctrl