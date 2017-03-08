 $scope.$watch('start_date', function(newValue, oldValue) {
        if (newValue && (newValue !== oldValue)){
            if (moment($scope.end_date).format(FORMAT)>=moment($scope.start_date).format(FORMAT)){
                $scope.loadData();
                utils.storeStartAndEndDates($scope.start_date, $scope.end_date);
            }
            else {
                $scope.end_date= moment($scope.start_date).toDate();
            }
        }
    },true);
    
    $scope.$watch('end_date', function(newValue, oldValue) {
        if (newValue && (newValue !== oldValue)){
            if (moment($scope.end_date).format(FORMAT)<moment($scope.start_date).format(FORMAT)){
                $scope.start_date= moment($scope.end_date).toDate();
            }
            else {
                $scope.loadData();
                utils.storeStartAndEndDates($scope.start_date, $scope.end_date);    
            }
        }
    },true);


