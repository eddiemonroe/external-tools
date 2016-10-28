angular.module('glimpse')
    .directive('graph', function ($http) {
        
        var link = function (scope, element, attributes, $parent, $scope) {

   scope.init= function () {
           $http.post("http://localhost:5000/api/v1.1/scheme", {command: "(psi-get-number-values-for-vars \"arousal\")"}, {headers: {'Content-Type': 'application/json'} })
        .then(function (response,status) {
      
            var query_string = response.data.response;
            console.log("query_stringis"+query_string)
            scope.arrString1 = new Array();
            scope.arrString1 = query_string.split(",");
            scope.chartSeries = [];
            console.log("array length is" + scope.arrString1.length);
            scope.AllEmoVariablesName = [];
            scope.AllEmoVariablesValue = [];
               for(var i =0 ; i < scope.arrString1.length; i++){
                   
                    scope.arrString2 = new Array();
                    var arrtoString = scope.arrString1[i].toString();
                    scope.arrString2 = arrtoString.split(":");
                    scope.StringPairName = scope.arrString2[0];
                    scope.StringPairValue = scope.arrString2[1];
                  var inputarrry = [];
                  inputarrry = [0.5];
                    for(var j = 1; j< scope.arrString2.length; j++){
                        scope.AllEmoVariablesName.push(scope.StringPairName);
                        console.log("NAME ARRAY" + scope.AllEmoVariablesName );
                        scope.AllEmoVariablesValue.push(scope.StringPairValue);
                        console.log("VALUE ARRAY" + scope.AllEmoVariablesValue );
                        console.log("scope.arrString2[0]" + scope.arrString2[0] );
                        console.log("scope.arrString2[1]" + scope.arrString2[1] );
                        
                         //   scope.chartSeries.push({"name": scope.arrString2[0]}, 


                      // {"data": scope.arrString2[1]});

                          // console.log("scope.chartSeries" + scope.chartSeries );
                          //  console.log("scope.chartSeries[0].name" + scope.chartSeries[0].name );
                          //  console.log("scope.chartSeries[0].data" + scope.chartSeries[1].data );


                    }
               }

               scope.chartSeries = [
                  {"name": scope.AllEmoVariablesName, "data": scope.AllEmoVariablesValue},
                  {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true}

                ];

                scope.chartConfig = {
                      options: {
                        chart: {
                          type: 'areaspline'
                        },
                        plotOptions: {
                          series: {
                            stacking: ''
                          }
                        }
                      },
                      series: scope.chartSeries,
                      title: {
                        text: 'Openpsi-variables'
                      },
                      credits: {
                        enabled: true
                      },
                      loading: false,
                      size: {}
                    }
                                      //scope.poll = function() {
                                //               $timeout(function(){
                                //                  
                                //                   scope.chartConfig.series[0].data.shift();
                                //                   scope.chartConfig.series[0].data.push(scope.AllEmoVariablesName);
                                //                   // scope.chartConfig.series[1].data.shift();
                                //                   // scope.chartConfig.series[1].data.push(Math.floor(Math.random() * 20) + 1);
                                //                   scope.poll();
                                //               }, 2000);
                                //           }

                                // this.$onInit = function() {
                                //     console.log("SUCCESSFULLY UPDATED SERIES");
                                //     scope.poll();
                                // }
        }, function errorCallback(err) {
              console.log(err.message)
              
            });
                
      };
                
       
      scope.init();

 scope.chartTypes = [
    {"id": "line", "title": "Line"},
    {"id": "spline", "title": "Smooth line"},
    {"id": "area", "title": "Area"},
    {"id": "areaspline", "title": "Smooth area"},
    {"id": "column", "title": "Column"},
    {"id": "bar", "title": "Bar"},
    {"id": "pie", "title": "Pie"},
    {"id": "scatter", "title": "Scatter"}
  ];

 

  // scope.reflow = function () {
  //   scope.$broadcast('highchartsng.reflow');
  // };

                
        };


        return {
            link: link,
            restrict: 'E',
            scope: {atoms: '='},
            templateUrl: 'js/templates/graph.html'
        }
    });