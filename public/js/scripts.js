
//// ▶▶ Angular ◀◀ ////
var testapp = angular.module('testApp',['ui.bootstrap','ngCart','angular-md5','ngCookies']);
testapp.controller('flightController',function($scope,$http,ngCart,md5,$cookies){
    $scope.formData = {h2:"Please Take a Moment to Create an Account"};
    $scope.empty=true;
    $scope.cart=false;
    $scope.retEmpty=true;
    $scope.rowCollectionLeave=[];
    $scope.rowCollectionRet=[];
    $scope.login = function(){
        console.log("username:",this.formData.username," password:",md5.createHash(this.formData.password));
        if(this.formData.h2.indexOf("Create")!=-1){
            $http.post("/api/user/login",{user:this.formData.username,
                password:md5.createHash(this.formData.password)})
                .then(function(response){
                                     console.log("debug:",response.data);
                                     return response.data;
                                  });
        }else{
            $http.get("/api/user/login", {
                params:{user:this.formData.username,
                    password:md5.createHash(this.formData.password)}})
                .then(function(response){
                                      console.log("debug:",response.data);
                                     return response.data;
                                  });
            }
        }
    $scope.findAirports=function(val){
        return $http.get("/api/airport/findAll",{
            params:{search:val}
        }).then(function(response){
            return response.data;
        });
    }
    $scope.findFlights = function () {
        $scope.empty = true;
        $scope.rowCollectionLeave = [];
        $scope.rowCollectionRet = [];
        $http.get("/api/flightPath/findAll", {
            params: {from: this.fromName, to: this.toName, leave: this.leave}
        }).then(function (response) {
            if (response.data.length > 0) {
                $scope.empty = false;
            }
            for (var j = 0; j < response.data.length; j++) {
                $scope.rowCollectionLeave.push(response.data[j]);
            }
        });
        if (this.ret) {
            $http.get("/api/flightPath/findAll", {
                params: {from: this.toName, to: this.fromName, leave: this.ret}
            }).then(function (responseRet) {
                if (responseRet.data.length > 0) {
                    $scope.retEmpty = false;
                }
                for (var j = 0; j < responseRet.data.length; j++) {
                    $scope.rowCollectionRet.push(responseRet.data[j]);
                }
            });
        }
    }

    $scope.removeRow=function(row) {
        var index = $scope.rowCollectionLeave.indexOf(row);
        if (index !== -1) {
            $scope.rowCollectionLeave.splice(index, 1);
        }
    }

    $scope.selectRow=function(row){
        $scope.rowCollectionLeave=[];
        $scope.rowCollectionLeave.push(row);
        row.date=this.leave;
        ngCart.addItem(row.flight,row.name +"-"+row.flight,100,1,row);
        var tempRet=[];
        for (var k=0;k<$scope.rowCollectionRet.length;k++){
            if($scope.rowCollectionRet[k].name == row.name){
                tempRet.push($scope.rowCollectionRet[k]);
            }
        }
        $scope.rowCollectionRet=tempRet;
    }

    $scope.removeRowRet = function removeRowRet(row) {
        var index = $scope.rowCollectionRet.indexOf(row);
        if (index !== -1) {
            $scope.rowCollectionRet.splice(index, 1);
        }
    }

    $scope.selectRowRet=function(row){
        $scope.rowCollectionRet=[];
        $scope.rowCollectionRet.push(row);
        row.date=this.ret;
        ngCart.addItem(row.flight,row.name +"-"+row.flight,100,1,row);
        var tempLeave=[];
        for (var j=0;j<$scope.rowCollectionLeave.length;j++){
            if($scope.rowCollectionLeave[j].name == row.name){
                tempLeave.push($scope.rowCollectionLeave[j]);
            }
        }
        $scope.rowCollectionLeave=tempLeave;
    }

    //// ▶▶ Jquery inside Angular ◀◀ ////
    $('.input-daterange').datepicker({"todayHighlight": true, "autoclose":true,"startDate":"+0d"});

    $("input.switch").bootstrapSwitch({
                                          onText: '⇄',
                                          offText: '→',
                                          size: 'mini',
                                          state: true
                                      });
    $("input.switch").on('switchChange.bootstrapSwitch', function (event, state) {
        if(!state){
            $("#retDate").hide();
            $("#retSpan").hide();
            $("#retLabel").html("One Way");
            $scope.retEmpty=true;
            $scope.$apply();
        }else{
            $("#retDate").show();
            $("#retSpan").show();
            $("#retLabel").html("Round Trip");
            $scope.retEmpty=false;
            $scope.$apply();
        }
    });
});


