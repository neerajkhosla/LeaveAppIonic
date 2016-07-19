angular.module('app', ['ionic','ionic.service.core', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        xtoken: 'anonymous'
        name: 'anonymous'
        userid: 'anonymous'
        userrole: 'anonymous'
        isIPad: 'anonymous'
        isAndroid: 'anonymous'
        isIOS: 'anonymous'
        isWindowsPhone: 'anonymous'
        SiteUrl: 'anonymous'
        UserLeaveId: 'anonymous'
        AprroverId: 'anonymous'
        LeaveId: 'anonymous'
        getjoiningdate: 'anonymous'
        getdepartment: 'anonymous'
        userdetails: 'anonymous'
        device_token: 'anonymous'
        rejectName: 'anonymous'
        employeename: 'anonymous'
        email: 'anonymous'
        device_token: 'anonymous'

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    debugger;
    alert('start1');
    pushNotification = window.plugins.pushNotification;
    alert('start2');
    pushNotification.register(onNotification, errorHandler, { 'ecb': 'onNotification', 'senderID': '214485254187', });
    alert('start3');
    });
    window.onNotification = function (e) {
        alert('notification');
        debugger;
        alert(e);
        switch (e.event) {
            case 'registered':
                debugger;
                alert('notification1');
                if (e.regid.length > 0) {
                    alert('notification2');
                    device_token = e.regid;
                    alert(device_token);
                    alert(e.regid);
                    RequestsService.register(device_token).then(function (response) {
                        alert('registered!');
                    });
                    alert(response);
                }

                break;
            case 'message':
                debugger;
                alert('notification2');
                alert('msg received: ' + e.message);
                /*
                  {
                      "message": "Hello this is a push notification",
                      "payload": {
                          "message": "Hello this is a push notification",
                          "sound": "notification",
                          "title": "New Message",
                          "from": "813xxxxxxx",
                          "collapse_key": "do_not_collapse",
                          "foreground": true,
                          "event": "message"
                      }
                  }
                */
                break;
            case 'error':
                debugger;
                alert('notification3');
                alert('error occured');
                break;
        }
    };
    window.errorHandler = function (error) {
        alert('on-error');
        debugger;
        alert('an error occured');
    }
    var deviceInformation = ionic.Platform.device();

    var isWebView = ionic.Platform.isWebView();
    isIPad = ionic.Platform.isIPad();
    isIOS = ionic.Platform.isIOS();
    isAndroid = ionic.Platform.isAndroid();
    isWindowsPhone = ionic.Platform.isWindowsPhone();
    SiteUrl = 'https://e-leave.herokuapp.com/api/v1';
    var currentPlatform = ionic.Platform.platform();
    var currentPlatformVersion = ionic.Platform.version();
      
  
})