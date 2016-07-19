angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    

  $stateProvider
  

      .state('dashboard', {
    url: '/page1',
    templateUrl: 'templates/dashboard.html',
    reload: true,
    controller: 'dashboardCtrl'
  })

  .state('login', {
    url: '/page3',
    templateUrl: 'templates/login.html',
    reload: true,
    controller: 'loginCtrl'
  })

  .state('leaveDetails', {
    url: '/page4',
    templateUrl: 'templates/leaveDetails.html',
    reload: true,
    controller: 'leaveDetailsCtrl'
  })

  .state('forgetPassword', {
      
    url: '/page6',
    templateUrl: 'templates/forgetPassword.html',
    reload: true,
    controller: 'forgetPasswordCtrl'
  })
 
  .state('applyLeave', {
      
    url: '/page7',
    templateUrl: 'templates/applyLeave.html',
    reload: true,
    controller: 'applyLeaveCtrl'
  })

  .state('approver', {
    url: '/page8',
    templateUrl: 'templates/approver.html',
    reload: true,
    controller: 'approverCtrl'
  })

  .state('requestShortLeave', {
    url: '/page9',
    templateUrl: 'templates/requestShortLeave.html',
    reload: true,
    controller: 'requestShortLeaveCtrl'
  })

  .state('reject', {
    url: '/page10',
    templateUrl: 'templates/reject.html',
    controller: 'rejectCtrl'
  })

  .state('forward', {
    url: '/page11',
    templateUrl: 'templates/forward.html',
    reload: true,
    controller: 'forwardCtrl'
  })

  .state('history', {
    url: '/page12',
    templateUrl: 'templates/history.html',
    reload: true,
    controller: 'historyCtrl'
  })
     

  .state('EditUser', {
    url: '/page13',
    templateUrl: 'templates/EditUser.html',
    reload: true,
    controller: 'EditUserCtrl'
  })

  .state('approveDetails', {
    url: '/page14',
    templateUrl: 'templates/approveDetails.html',
    //reload: true,
    controller: 'approveDetailsCtrl'
  })
 .state('used', {
         url: '/page15',
         templateUrl: 'templates/used.html',
         reload: true,
         controller: 'usedCtrl'
     })

 //.state('pending', {
 //         url: '/page16',
 //         templateUrl: 'templates/pending.html',
 //         controller: 'pendingCtrl'
 //     })

      .state('pendingLeave', {
          url: '/page17',
          templateUrl: 'templates/pendingLeave.html',
          reload: true,
          controller: 'pendingCtrl'
      })
     .state('rejectlist', {
         url: '/page18',
         templateUrl: 'templates/rejectlist.html',
         reload: true,
         controller: 'rejectlistCtrl'
     })
     .state('reApply', {
         url: '/page20',
         templateUrl: 'templates/reApply.html',
         reload: true,
         controller: 'reApplyCtrl'
     })
    .state('resetpassword', {
        url: '/page21',
        templateUrl: 'templates/resetpassword.html',
        reload: true,
        controller: 'resetpasswordCtrl'
    })

$urlRouterProvider.otherwise('/page3')
});