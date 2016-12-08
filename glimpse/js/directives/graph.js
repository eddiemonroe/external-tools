angular.module('glimpse').directive('graph', function ($rootScope, $http, AtomsFactory) {

    var historyTimeLength = 10; //length of plot line in number of seconds
    var refreshRate = 100;   // rate in ms that values are updated from server

    // Set number of plot line points to show data for specified time period
    var numPlotLinePts = Math.round(1000/refreshRate)*historyTimeLength;

    var controller = function($scope, $rootScope) {
    //var link = function (scope, rootScope, element, attributes, $parent, $scope) {
        $scope.chartTypes = [
            {"id": "line", "title": "Line"},
            {"id": "spline", "title": "Smooth line"},
            {"id": "area", "title": "Area"},
            {"id": "areaspline", "title": "Smooth area"},
            {"id": "column", "title": "Column"},
            {"id": "bar", "title": "Bar"},
            {"id": "pie", "title": "Pie"},
            {"id": "scatter", "title": "Scatter"}
        ];

        $scope.init = function () {
            $scope.chartSeries = [];

            $scope.chartConfig = {
                options: {
                    chart: {
                        type: 'spline'
                    },
                    plotOptions: {
                        series: {
                            stacking: ''
                        }
                    }
                },
                series: $scope.chartSeries,
                title: {
                    text: 'OpenPSI Variables'
                },
                xAxis: {
                    labels: {
                        enabled: false
                    }
                },
                yAxis: {
                    min: 0,
                    max: 1
                },
                credits: {
                    enabled: false
                },
                loading: false,
                size: {},
            };

            window.setInterval(function() {
                //periodically update data
                $scope.update();
            }, refreshRate);

        };

        $scope.update = function() {

           AtomsFactory.updateAttentionValues(function(){

                results = AtomsFactory.attention

                //iterate over each psi variable and feed into chartseries object
                for (varName in results) {
                    var value = results[varName];
                    // If var has no value set, set it to 0
                    if (value==null) {
                        value = 0;
                    }

                    //figure out if data point is already in chartSeries
                    var variableExists = false;

                    for (i in $scope.chartSeries) {
                        chartSeriesObject = $scope.chartSeries[i];
                        if (chartSeriesObject.name == varName) {
                            //it already exists, update array
                            //remove the first element and add current value to the end
                            chartSeriesObject.data.shift();
                            chartSeriesObject.data.push(value);
                            variableExists = true;
                        }
                    }

                    if (!variableExists) {
                        //The variable doesn't exist in chartSeries yet, create new entry
                        console.log("Found new variable: " + varName)
                        // plot the full line at the current value for initiating
                        var values = Array(numPlotLinePts).fill(value);
                        $scope.chartSeries.push({name: varName, data: values,
                            marker: {enabled: false},
                            connectNulls: true});
                    }
                }

            }, function errorCallback(err) {
                console.log(err.message)
            });

        }  // update()

        // This is being triggered from main.js when panel comes up.
        // Until there is better detection in dock-spawn for when panels
        // Open and close, this is a dirty hack.
        $rootScope.initGraphView = $scope.init


    }; // link function

    return {
        controller: controller,
        restrict: 'E',
        templateUrl: 'js/templates/graph.html'
    }
});