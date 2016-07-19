
/// <reference path="../templates/leaveDetails.html" />
angular.module('app', ['ionic', 'ionic.service.core', 'ui.router', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])
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
        getdevice_token: 'anonymous'
        //Username: 'anonymous'
        //Password: 'anonymous'
        phone: 'anonymous'
        Loginname: 'anonymous'
        backbuttoncheck = 'anonymous'

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
   // alert('call1');
   
   // alert('start1');
    pushNotification = window.plugins.pushNotification;
    //alert('start2');
    pushNotification.register(onNotification, errorHandler, { 'ecb': 'onNotification', 'senderID': '161849433162', });
    //alert('start3');
    var scope = angular.element(document.getElementById('yourcontainer')).scope();
    //scope.mainController();
   
    });
    //$ionicPlatform.registerBackButtonAction(function (event) {
    //    debugger;
    //    //alert($scope.current);
    //    if (backbuttoncheck == 'dashboard') { // your check here
    //        $ionicPopup.confirm({
    //            title: 'System warning',
    //            template: 'are you sure you want to exit?'
    //        }).then(function (res) {
    //            if (res) {
    //                ionic.Platform.exitApp();
    //            }
    //        })
    //    }
    //}, 100);
   
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