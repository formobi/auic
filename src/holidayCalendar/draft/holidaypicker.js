'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:holidayPicker
 * @description
 * # holidayPicker
 */
angular.module('app')
.directive('holidayPicker',function() {
    return {
        templateUrl : '/static/templates/holidaypicker.html',
        restrict    : 'EA',
        replace     : true,
        scope       : {
            'year'      : '=',
            'draft'     : '=',
            'value'     : '=',
            'editMode'  : '='
        },
        
        controller: function ($scope) {
            
            $scope.BASE_MONTHS= [];
            for (var mi=0; mi<12; mi++) {
                var weeks= [];
                for (var wi=0; wi<6; wi++) {
                    weeks[wi]= [];
                    for (var di=0; di<7; di++){
                        weeks[wi].push({
                           id       : undefined,
                           holiday  : false
                        });
                    }
                }
                $scope.BASE_MONTHS.push({
                    name    : "",
                    num_days: 0,
                    weeks   : weeks
                });
            }
            
            $scope.populateData= function(){
                
                var year= $scope.year,
                    start= moment(year, "YYYY").startOf("year"),
                    end  = moment($scope.start).endOf("year");
                
                $scope.sundays_holiday= true;
                $scope.saturdays_holiday= true;
                $scope.num_days= end.isLeapYear()? 366: 365;
                $scope.num_holidays= 0;
                $scope.num_working= $scope.num_days- $scope.num_holidays;
                $scope.months= angular.copy($scope.BASE_MONTHS);
                for (var mi=0; mi<12; mi++) {
                    var month= $scope.months[mi],
                        weeks= month.weeks;
                    month.num_days  = start.daysInMonth();
                    month.name      = start.format("MMM");
                    for (var di=0, wi=0; di< month.num_days; di++) {
                        var dw = start.day(),
                            id = start.format("YYYY-MM-DD");
                        weeks[wi][dw].id= id;
                        weeks[wi][dw].dt= start.date();
                        if ($scope.value[id]
                            && $scope.value[id].status === "holiday") {
                            weeks[wi][dw].holiday= true;
                            $scope.updateCount(weeks[wi][dw]);
                        }
                        if (dw === 0 && !weeks[wi][dw].holiday){
                            $scope.sundays_holiday= false;
                        }
                        else if (dw === 6) {
                            if (!weeks[wi][dw].holiday) {
                                $scope.saturdays_holiday= false;
                            }
                            wi++;
                        }
                        start= start.add(1, "days");
                    }
                    month.weeks= weeks;
                    $scope.months[mi]= month;
                }
            };
            
            $scope.unwatchYear= $scope.$watch('year', function(newValue, oldValue) {
                if ($scope.year === undefined) {
                    return ;
                }
                if ($scope.editMode) {
                    $scope.draft= angular.copy($scope.value);
                }
                $scope.populateData();
                
            },true);
            
            $scope.unwatchEditMode= $scope.$watch('editMode', function(newValue, oldValue) {
                if (!$scope.editMode === undefined) {
                    return ;
                }
                if ($scope.editMode) {
                    $scope.draft= angular.copy($scope.value);
                }
                $scope.populateData();
            },true);
            
            $scope.markNthDay= function(day, is_holiday){
                for(var mi=0, nm=$scope.months.length; mi<nm; mi++){
                    for (var wi=0, nw= $scope.months[mi].weeks.length; wi<nw; wi++) {
                        if ($scope.months[mi].weeks[wi][day].id){
                            if ($scope.months[mi].weeks[wi][day].holiday !== is_holiday){
                                $scope.months[mi].weeks[wi][day].holiday= is_holiday;
                                $scope.updateDraft($scope.months[mi].weeks[wi][day]);
                            }
                        }
                    }
                }
            };
            
            $scope.markSundays= function(){
                $scope.markNthDay(0, $scope.sundays_holiday);
            };
            
            $scope.markSaturdays= function(){
                $scope.markNthDay(6, $scope.saturdays_holiday);
            };
            
            $scope.markDay= function(day){
                if (!$scope.editMode) {
                    return;
                }
                if (!day.id) {
                    return ;
                }
                day.holiday= !day.holiday;
                $scope.updateDraft(day);
            };
            
            $scope.updateDraft= function(day){
                if (!$scope.draft[day.id]) {
                    $scope.draft[day.id]= {};
                }
                $scope.draft[day.id].status= day.holiday? "holiday": "working";
                $scope.draft[day.id].inherited= false;
                $scope.updateCount(day);
            };
            
            $scope.updateCount= function(day){
                if (day.holiday) {
                    $scope.num_holidays++;
                }
                else {
                    $scope.num_holidays--;
                }
                $scope.num_working= $scope.num_days - $scope.num_holidays;
            };
        },
        link: function (scope, elm, attr, $scope) {
            //unwatch any watchers
            elm.on('$destroy', function() {
                if (scope.unwatchEditMode) {
                    scope.unwatchEditMode()
                }
                if (scope.unwatchYear) {
                    scope.unwatchYear();
                }
            });
        }  		
  	}
});