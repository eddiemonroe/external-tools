angular.module('glimpse')
    .factory('AtomsFactory', function ($http, $resource) {

        var atomsFactory = {};

        // Data members
        atomsFactory.atoms = [];
        atomsFactory.atomsCount = 0;
        atomsFactory.server = "";
        atomsFactory.nodeTypes = [];
        atomsFactory.types = [];

            //Todo: These should be read from config or set through the app
        atomsFactory.psiVariables = ["arousal", "positive-valence", "negative-valence", "power","voice width"];
	
       // Member functions
        atomsFactory.updateAtoms = function (successCB, failureCB) {
           $http({
                method: 'GET',
                url: atomsFactory.server + "api/v1.1/atoms",
                cache: false
            }).then(
                function (response) {
                    atomsFactory.atoms = response.data.result.atoms;
                    atomsFactory.atomsCount = response.data.result.total;
                    console.log("[AF] updated atoms...")
                    if (typeof successCB === "function") successCB();
		     },
                function (error) {
                    if (typeof failureCB === "function") failureCB();
                }
            );
        };

        atomsFactory.setServer = function (s) {
            atomsFactory.server = s; 
        };

        atomsFactory.createAtom = function (atom, callback) {
            $http({
                method: 'POST',
                url: atomsFactory.server + 'api/v1.1/atoms',
                data: atom
            }).then(function (response) {
                if (typeof callback === "function") callback();
            });
        };

        atomsFactory.deleteAtom = function (handle, callback) {
            $http({
                method: 'DELETE',
                url: atomsFactory.server + 'api/v1.1/atoms/12'
            }).then(function (response) {
                //if (typeof callback === "function") callback();
            });
        };

        atomsFactory.updateAtomTypes = function () {
            $http({
                method: 'GET',
                url: atomsFactory.server + 'api/v1.1/types'
            }).then(function (response) {
                console.log("[AF] updated atom types...")
                atomsFactory.types = response.data.types;
                atomsFactory.nodeTypes = response.data.types.filter(function (atom) {
                    return atom.indexOf("Node") > -1;
                });
		
            });
        };
        
        atomsFactory.sampleAtomsInAF = function (successCB, failureCB) {
          var sampleSize = 100;
          var randIndex = function(sampleSize, sampleSpaceSize){ 
            var arr = []
            while(arr.length < sampleSize){
              var randomnumber=Math.ceil(Math.random()* sampleSpaceSize)
              var found=false;
              for(var i=0;i<arr.length;i++){
                if(arr[i]==randomnumber){found=true;break;}
              }
              if(!found)arr[arr.length]=randomnumber;
            }
            return arr;
          }
          $http({
            method: 'GET',
            url: atomsFactory.server + 'api/v1.1/atoms?filterby=attentionalfocus&includeOutgoing=true&includeIncoming=true'
          }).then(
            function (response){
              var responseAtoms = response.data.result.atoms;
              console.log("ResponseAtomSize: "+responseAtoms.length);
              /*if (responseAtoms.length > sampleSize){
                var randomAtoms = []
                for(i in randIndex(sampleSize,responseAtoms.length)){
                  var atom = responseAtoms[randIndex[i]];
                  randomAtoms.push(atom);
                }
                console.log("RandAtomSize: "+randomAtoms.length);
                atomsFactory.atoms = randomAtoms;
              }
              else{*/

                console.log("ResponseAtomSize: "+responseAtoms.length);
                atomsFactory.atoms = responseAtoms;
              //}

              atomsFactory.atomsCount = atomsFactory.atoms.length;
              if (typeof successCB === "function") successCB();
            },
            function (error) {
              if (typeof failureCB === "function") failureCB();
            }
          );
        };

        atomsFactory.updateAttentionValues = function (successCB, failureCB) {
           if (atomsFactory.server == "") {
            //we are not connected.
            if (typeof failureCB === "function") failureCB({"message": "not connected"});
            return
           }

           var vars = ""
           for (i in atomsFactory.psiVariables) {
               vars += "\"" + atomsFactory.psiVariables[i] + "\"";
           }
           //var scm = "(psi-get-number-values-for-vars \"arousal\" \"positive-valence\" \"negative-valence\")";
           var scm = "(psi-get-number-values-for-vars" + vars + ")";
           //console.log("scm command: " + scm);

           $http({
                method: 'POST',
                url: atomsFactory.server + "api/v1.1/scheme", //TODO: this is a placeholder and will just work for test data, should fetch POST w. correct scm command.
                cache: false,
                headers: {
                  'Content-Type': 'application/json'
                },
                data: {command: scm}
            }).then(
                function (response) {
                    var responseString = response.data.response;
                    var results = JSON.parse(responseString);

                    atomsFactory.attention = results;
                    console.log("[AF] updated attention...")
                    if (typeof successCB === "function") successCB();
                },
                function (error) {
                    if (typeof failureCB === "function") failureCB();
                }
            );
        };

        return atomsFactory;
    })
  ;
