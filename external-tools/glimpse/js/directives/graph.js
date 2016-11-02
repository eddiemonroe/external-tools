angular.module('glimpse')
    .directive('graph', function ($http) {
        
        var link = function (scope, element, attributes, $parent, $scope) {

   scope.init= function () {
           $http.post("http://localhost:5000/api/v1.1/scheme", {command: "(psi-get-number-values-for-vars \"arousal\")"}, {headers: {'Content-Type': 'application/json'} })
        .then(function (response,status) {
      
            var query_string = response.data.response;
            console.log("query_stringis"+query_string)
        

            scope.results = JSON.parse(query_string);
            console.log("scope.results"+ scope.results);
            console.log("results: ");
            for (varname in scope.results) {
              console.log("    " + varname + ": " + scope.results[varname])

                var key=varname;
                var value= scope.results[varname];

          }
                console.log(JSON.stringify(value));
                console.log(key);

                var arraysv = [];
                arraysv.push(value);
                console.log("arraysv" + arraysv);
                scope.chartSeries = [
                  {"name": key, "data": arraysv}
                 
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