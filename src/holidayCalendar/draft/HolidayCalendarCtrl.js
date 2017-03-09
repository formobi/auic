
angular.module('app')
.controller('HolidayCalendarCtrl', function($scope, $location, utils, HolidayCal) {
  
    $scope.CURRENT_YEAR= moment().format("YYYY");
    $scope.init= function(){
        HolidayCal.init();
        $scope.edit_mode= false;
        $scope.input= {};
        $scope.cal= {};
        var year= $location.search().year|| $scope.CURRENT_YEAR;
        $scope.YEARS=[
            moment($scope.CURRENT_YEAR, "YYYY").subtract(1, "year").format("YYYY"),
            $scope.CURRENT_YEAR,
            moment($scope.CURRENT_YEAR, "YYYY").add(1, "year").format("YYYY"),
        ];
        $scope.selectYear(year);
    };

    $scope.selectYear= function(year){
        HolidayCal
        .findOne({year: year})
        .then(function(cal){
            $scope.cal= cal;
            $scope.selected_year= year;
            $location.search({year: year}).replace();
        });
    };
    
    $scope.edit= function(){
        $scope.edit_mode= true;
        $scope.input= angular.copy($scope.cal);
    };
    
    $scope.save= function(){
        var data= angular.copy($scope.input)
        HolidayCal
        .save(data, $scope.selected_year)
        .then(function(cal){
            $scope.cal= angular.copy(data);//cal;
            $scope.edit_mode= false;
        });
    };
    
    $scope.cancel= function(){
        $scope.edit_mode= false;  
    };
    
});
