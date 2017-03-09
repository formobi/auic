
angular.module('app')
.factory("HolidayCal", function($http, $q, DataMgr){
    
    return {
        init: function(config){
            DataMgr.registerUrl("hc", "/api/core/hc/");
        },
        save: function(data, id){
            return DataMgr.save("hc", data, id);
        },
        findOne: function(params){
            return DataMgr.findOne("hc", params);
        }
    };
});