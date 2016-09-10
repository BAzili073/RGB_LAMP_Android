var NOW_TEMP = 0;
var VOL = 0;
angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope,$cordovaToast,$timeout,$interval) {
  $scope.mesurs = [{temp:"Температура",time:"Время"}];

   $scope.data = { 'RED' : 0 ,
   'GREEN' : 0 ,
   'BLUE' : 0,
   'freq_random' : 10,
   'time_off': 5
 };
   $scope.dataStr = [];
    var timeoutId = null;

    $scope.$watch('data.RED', function() {
        if(timeoutId !== null) {
            return;
        }
        timeoutId = $timeout( function() {
            // VOL = $scope.data.volume;
            $scope.dataStr[0] = 0xA9;
            $scope.dataStr[1] = 0x52;
            $scope.dataStr[2] = $scope.data.RED;
            console.log($scope.dataStr);
            bluetoothSerial.write($scope.dataStr, $scope.sendSucc, $scope.sendFail);
            // console.log((94).toString(16),  ($scope.data.RED).toString(16));
            $timeout.cancel(timeoutId);
            timeoutId = null;
        }, 200);
    });
    $scope.$watch('data.GREEN', function() {
        if(timeoutId !== null) {
            return;
        }
        timeoutId = $timeout( function() {
          $scope.dataStr[0] = 0xA9;
          $scope.dataStr[1] = 0x47;
          $scope.dataStr[2] = $scope.data.GREEN;
          // console.log($scope.dataStr);
            bluetoothSerial.write($scope.dataStr, $scope.sendSucc, $scope.sendFail);
            // console.log("G"+$scope.data.GREEN.toString(16));
            $timeout.cancel(timeoutId);
            timeoutId = null;
        }, 200);
    });


    $scope.$watch('data.BLUE', function() {
        if(timeoutId !== null) {
            return;
        }
        timeoutId = $timeout( function() {
          $scope.dataStr[0] = 0xA9;
          $scope.dataStr[1] = 0x42;
          $scope.dataStr[2] = $scope.data.BLUE;
          // console.log($scope.dataStr);
            bluetoothSerial.write($scope.dataStr, $scope.sendSucc, $scope.sendFail);
            // console.log($scope.dataStr);
            $timeout.cancel(timeoutId);
            timeoutId = null;
        }, 200);
    });

    $scope.$watch('data.speedChange', function() {
        if(timeoutId !== null) {
            return;
        }
        timeoutId = $timeout( function() {
            // $scope.dataStr[0] = "s" + $scope.data.speedChange
            $scope.dataStr[0] = 0xA9;
            $scope.dataStr[1] = 0x73;
            $scope.dataStr[2] = $scope.data.speedChange;

            bluetoothSerial.write($scope.dataStr, $scope.sendSucc, $scope.sendFail);
            // console.log($scope.dataStr);
            $timeout.cancel(timeoutId);
            timeoutId = null;
        }, 200);
    });

    $scope.send_freq_random = function(){
      if ($scope.data.freq_random < 5) $scope.data.freq_random = 5;
      $scope.dataStr[0] = 0xA9;
      $scope.dataStr[1] = 0x66;
      $scope.dataStr[2] = $scope.data.freq_random ;
      bluetoothSerial.write($scope.dataStr, $scope.sendSucc, $scope.sendFail);
      console.log($scope.dataStr);
    }
    $scope.send_time_off = function(){
      $scope.dataStr[0] = 0xA9;
      $scope.dataStr[1] = 0x6F;
      $scope.dataStr[2] = $scope.data.time_off;
      bluetoothSerial.write($scope.dataStr, $scope.sendSucc, $scope.sendFail);
    }

    $scope.send_save_settings = function(){
      $scope.dataStr[0] = 0xA9;
      $scope.dataStr[1] = 0x6A;
      $scope.dataStr[2] = 0x6A;
      bluetoothSerial.write($scope.dataStr, $scope.sendSucc, $scope.sendFail);
    }

    $scope.modeRandom = function() {
      $scope.dataStr[0] = 0xA9;
      $scope.dataStr[1] = 0x6D;
      $scope.dataStr[2] = 0x0A;
       bluetoothSerial.write($scope.dataStr, $scope.sendSucc, $scope.sendFail);
    }
    $scope.modeUser= function() {
      $scope.dataStr[0] = 0xA9;
      $scope.dataStr[1] = 0x6D;
      $scope.dataStr[2] = 0x00;
       bluetoothSerial.write($scope.dataStr, $scope.sendSucc, $scope.sendFail);
    }



  $scope.ondevicelist = function(device){
      $scope.BTdevices = device;
      $cordovaToast.showLongBottom("Поиск выполнен");
      if (!$scope.BTdevices){
           $scope.BTdevices = [
            {"id":"0","name":"Нет устройств","address":"98:D3:31:B1:4B:8B"}
          ];
      }
    }

    $scope.listFail = function(device){
        $cordovaToast.showLongBottom("Ошибка поиска");
    }



    $scope.search  = function(){
      bluetoothSerial.list($scope.ondevicelist, $scope.listFail);
      // bluetoothSerial.discoverUnpaired($scope.ondevicelist, $scope.listFail);
      cordovaToast.showLongBottom("Поиск начался...");
    }

    if (!$scope.BTdevices){
         $scope.BTdevices = [
          {"id":"0","name":"Нет устройств","address":"98:D3:31:B1:4B:8B"}
        ];
    }
    $scope.selected = $scope.BTdevices[0];

    $scope.resetForm = function() {
      //  $scope.BTdevices[0];
    }

    $scope.connectSuccess = function() {
      bluetoothSerial.subscribe('\n', function(data){
        NOW_TEMP = data;
      }, $scope.sendFail);
      $cordovaToast.showLongBottom("Установленно соединение с " + $scope.selected.name);
    }
    $scope.add = function(){
      console.log("add");
      var data = 5;
      $scope.mesurs.push({temp:"111",time:"fff"});
    }

    $scope.connectFailure = function() {
      $cordovaToast.showLongBottom("Ошибка соединения с " + $scope.selected.name);
    }

    $scope.deviceIsReady = function(){
      bluetoothSerial.enable(
          function() {
          $scope.selected.address("98:D3:31:B1:4B:8B");
          Alert("The user enable Bluetooth");
          $scope.connect ();
        },
        function() {
            Alert("The user did *not* enable Bluetooth");
        }
    );
    }
    document.addEventListener("deviceready", $scope.deviceIsReady, false);

    $scope.connect = function() {
      var deviceId = $scope.selected.address;
      $cordovaToast.showLongBottom("Соединение с " + deviceId);
       bluetoothSerial.connect(deviceId, $scope.connectSuccess, $scope.connectFailure);
    }

    $scope.connectNot = function() {
      var deviceId = $scope.selected.address;
      $cordovaToast.showLongBottom("Соединение с " + deviceId);
       bluetoothSerial.connectInsecure(deviceId, $scope.connectSuccess, $scope.connectFailure);
    }


    $scope.disconnect = function() {
       bluetoothSerial.disconnect();
    }

  $scope.watch = false;

 $scope.whatWatch = function(){
   return $scope.watch;
 }


 $scope.startWatch =function(){
   console.log("startWatch");
   $scope.watch = true;
   timer = $interval (function(){
        $scope.NowTemp = NOW_TEMP;
        $scope.mesurs.push({temp:NOW_TEMP,time:$scope.timeConverter(Date.now()/1000)});
        console.log("timeout");
     },1000);
 }
 $scope.stopWatch =function(){
   $scope.watch = false;
   console.log("stop");
    $interval.cancel(timer);
 }
 $scope.clearMesurs = function(){
   $scope.mesurs = [{temp:"Температура",time:"Время"}];
 }
 $scope.timeConverter = function (UNIX_timestamp){
     var a = new Date(UNIX_timestamp*1000);
     var months = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентября','Октября','Ноября','Декабря'];
     var year = a.getFullYear();
     var month = months[a.getMonth()];
     var date = function(){if(a.getDate() < 10) return "0" + a.getDate(); else return a.getDate();}
     var hour = function(){if(a.getHours() < 10) return "0" + a.getHours(); else return a.getHours();}
     var min = function(){if(a.getMinutes() < 10) return "0" + a.getMinutes(); else return a.getMinutes();}
     var sec = function(){if(a.getSeconds() < 10) return "0" + a.getSeconds(); else return a.getSeconds();}
     var time = date() + ',' + month + ' ' + year + ' ' + hour() + ':' + min() + ':' + sec() ;
     return time;
   }

  $scope.getNowTemp = function(){
      return NOW_TEMP;
  }
  $scope.plus = function(){
      NOW_TEMP = NOW_TEMP + 1;
      console.log("plus");
  }
  $scope.refresh = function() {
     $scope.NowTemp = NOW_TEMP;
     $scope.mesurs.push({temp:NOW_TEMP,time:$scope.timeConverter(Date.now()/1000)});
     $scope.$broadcast('scroll.refreshComplete');
 };

  $scope.sendSucc = function() {
    // $cordovaToast.showShortBottom("Отправлено");
  }

  $scope.sendFail = function() {
    // $cordovaToast.showShortBottom("Ошибка");
  }

  $scope.openPort = function(){
    bluetoothSerial.subscribe('\n', $scope.sendSucc, $scope.sendFail);
  }

  $scope.send1 = function() {

    bluetoothSerial.write("1", $scope.sendSucc, $scope.sendFail);
    alert('send 1 ' );
  }
  $scope.send2 = function() {
     bluetoothSerial.write("Hello!", $scope.sendSucc, $scope.sendFail);
     alert('send 2');
  }
})


.controller('ChatDetailCtrl', function($scope, $stateParams, $state) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.watchSuccess = function(acceleration) {
    $scope.dataAcc = acceleration;
    var x = acceleration.x * 100;
    var y = acceleration.y * 100;
    var z = acceleration.z * 100;
    x = x.toFixed(0);
    y = y.toFixed(0);
    z = z.toFixed(0);
    $scope.dataStr = x + ";" + y + ";" + z + ";" + "#";
      bluetoothSerial.write($scope.dataStr, $scope.sendSucc, $scope.sendFail);
      // alert('Acceleration X: ' + acceleration.x + '\n' +
      //       'Acceleration Y: ' + acceleration.y + '\n' +
      //       'Acceleration Z: ' + acceleration.z + '\n' +
      //       'Timestamp: '      + acceleration.timestamp + '\n');
  };

  $scope.watchError = function() {
      alert('onError!');
  };
  $scope.startControl = function() {
    var options = {frequency: 200 };  // Update every 3 seconds
    var watchID = navigator.accelerometer.watchAcceleration($scope.watchSuccess, $scope.watchError, options);
  }
  $scope.stopControl = function() {
    navigator.accelerometer.clearWatch(watchID);
  }



});
