angular.module('glimpse')
    .directive('addgraphseries', function ($http) {
        
        var link = function (scope, element, attributes ) {

        }

    return {
            link: link,
            restrict: 'E',
            scope: {atoms: '='},
            templateUrl: 'js/templates/add-graphseries.html'
        }
    });