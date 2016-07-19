angular.module('app.controllers', [])
.controller('dashboardCtrl', function ($scope, $http, $state, $timeout, $ionicLoading, $ionicPlatform, $ionicPopup) {
    debugger;
    backbuttoncheck = 'dashboard';
    $scope.$on('$ionicView.enter', function () {
        dashboard();
    });
    
   
    function dashboard() {
        $ionicLoading.show();
        $http.get(SiteUrl + '/stats/' + userid, { headers: { "Content-Type": "application/json", "x-access-token": xtoken } }).success(function (response) {
            $ionicLoading.hide();
            if (response.status == 'Success') {
            debugger;
            //console.log(response);
            $scope.remaining = response.leaveStats.remainingLeaves;
            $scope.used = response.leaveStats.usedLeaves;
            $scope.pending = response.leaveStats.pendingLeaves;
            $scope.role = userrole;
            $scope.rejectcount=response.leaveStats.rejectedLeaves;
            $scope.approvercount = response.leaveStats.approvalrequests;
          }
        else if (response.status == 'false')
        {
            debugger;
            $state.go('login');
        }
        else
        {
            debugger
            $state.go('login');
        }
        
    }, function (error) {       
        $state.go('login');
    });
        $ionicLoading.hide();
    }
    $scope.editUser = function () {
        //debugger;
        $state.go('EditUser');

    }
    $scope.logout = function () {
        debugger;
        //delete xtoken from database amd also remone from GCM
        //clear credantions
        localStorage.clear();

        pushNotification = window.plugins.pushNotification;
        pushNotification.unregister(onNotification, errorHandler, { 'ecb': 'onNotification', 'senderID': '161849433162', });

        window.onNotification = function (e) {
            // alert('notification');
            //debugger;
            //alert(e);
            switch (e.event) {
                case 'unregistered':
                    // debugger;
                    //alert('notification1');
                    if (e.regid.length > 0) {
                        //alert('notification2');
                        device_token = e.regid;
                       // alert(device_token);
                        //alert(e.regid);


                    }

                    break;
                case 'message':
                    debugger;
                    //alert('notification2');
                    //alert('Recived: ' + e.message);
                    debugger;
                    //var detailes = JSON.parse(e.message);

                    //alert(e.payload.title);
                    //alert(detailes.message);
                    //alert(detailes.state);
                    //alert(detailes.leaveid);
                    UserLeaveId = e.payload.leaveid;
                    AprroverId = e.payload.approverid;
                    $state.go(e.payload.state);

                    //alert('go');
                    break;
                case 'error':
                    debugger;
                    //alert('notification3');
                    alert('error occured');
                    break;
            }
        };
        window.errorHandler = function (error) {
            //alert('on-error');
            debugger;
            alert('an error occured');
        }

        $http.get(SiteUrl + '/user/' + userid, { headers: { "Content-Type": "application/json", "x-access-token": xtoken } }).success(function (response) {
            $ionicLoading.hide();
            if (response.status == 'Success') {
                debugger;
                console.log(response);
               
            }
            else if (response.status == 'false') {
                debugger;
               
            }
            else {
                debugger;
                
            }

        }, function (error) {
            debugger;
            $ionicLoading.hide();
            //$state.go('login');
        });

        $state.go('login');
    }
})   
.controller('loginCtrl', function ($scope, $ionicPopup, $state, $http, $timeout, $ionicLoading) {
    backbuttoncheck = '';
    //debugger;
    function chklogin(u, p) {
        $ionicLoading.show();

        // Set a timeout to clear loader, however you would actually call the $scope.loading.hide(); method whenever everything is ready or loaded.


        if (u == null || p == null) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login Failed!',
                template: 'Please fill the credentials first'
            });
            $ionicLoading.hide();
        }
        else {
            $http.post(SiteUrl + '/login', { username: u, password: p }).success(function (result) {
                if (result.status == "Success") {
                    window.localStorage.setItem("Username", u);
                    window.localStorage.setItem("Password", p);
                    //debugger;
                    console.log(result);
                    //Intailize the global variable values
                    xtoken = result.user.token;
                    name = result.user.email;
                    userid = result.user._id;
                    phone = result.user.contactnumber;
                    Loginname = result.user.firstname + ' ' + result.user.lastname;
                    //It contain all info about user
                    userdetails = result.user;


                    getjoiningdate = result.user.joiningdate;
                    getdepartment = result.user.department;
                    userrole = result.user.roles;
                    for (var i = 0; i < userrole.length; i++) {
                        //var temp = userrole[i].Role;
                        if (angular.lowercase(userrole[i]) == 'admin' || angular.lowercase(userrole[i]) == 'approver') {
                            userrole = angular.lowercase(userrole[i]);
                            rejectName = result.user.firstname + ' ' + result.user.lastname;
                        }
                    }
                    //To save the token into database for further use

                    //alert('I am going to save token')
                    $http.defaults.headers.post["x-access-token"] = xtoken;
                    $http.post(SiteUrl + '/register', {
                        id: userid,
                        device_token: device_token
                    }).success(function (result) {
                        $ionicLoading.hide();
                        if (result.status == "Success") {

                            console.log(result);
                            //var alertPopup = $ionicPopup.alert({
                            //    title: 'Success',
                            //    template: result.message
                            //});

                        }
                        else {
                            debugger;
                            //var alertPopup = $ionicPopup.alert({
                            //    title: 'Success',
                            //    template: result.message
                            //});
                        }
                    }).error(function (data) {
                        debugger;
                        //var alertPopup = $ionicPopup.alert({
                        //    title: 'Error',
                        //    template: 'not reached to register API'  //Just for test in mobile
                        //});
                    });
                    if (isIOS == true) {
                        $scope.isIOS = 1;
                    }
                    $scope.data.username = "";
                    $scope.data.password = "";

                    $state.go('dashboard');

                }
                else {
                    debugger;
                    console.log(result);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: result.message
                    });
                    $ionicLoading.hide();
                }
            }).error(function (data) {
                // debugger;
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: ''
                });
                $ionicLoading.hide();
            });
        }

    }
    debugger;
    var uname= window.localStorage.getItem("Username");
    var upass = window.localStorage.getItem("Password");
    if (uname != null && upass != null)
    {
       chklogin(uname, upass);
    }
    $scope.data = {};

    $scope.login = function () {
        chklogin($scope.data.username, $scope.data.password);
         debugger;
      
    }
    
    $scope.forget = function () {
       // debugger;
        $state.go('forgetPassword');
    }
})   
.controller('leaveDetailsCtrl', function ($scope, $ionicPopup, $state, $http, $window, $ionicLoading, $timeout) {
    backbuttoncheck = '';
    // alert('Hello');
    $scope.$on('$ionicView.enter', function () {
        LeaveDetails();
       
       
    });
    //debugger;
    function LeaveDetails() {
        $ionicLoading.show();
        $http.get(SiteUrl + '/leaves/' + UserLeaveId, { headers: { "Content-Type": "application/json", "x-access-token": xtoken } }).success(function (response) {
            $ionicLoading.hide();
            if (response.status == 'Success') {
               // debugger;
                console.log(response);
                $scope.applieddate = response.leave.requestdate;
                $scope.fromdate = response.leave.leavefromdate;
                $scope.todate = response.leave.leavetodate;
                $scope.statusofleave = response.leave.status;
                $scope.comments = response.leave.comments;
                $scope.LeaveType = response.leave.leavetype
                $scope.approvername = response.leave.approvername;
                AprroverId = response.leave.approverid;
                LeaveId = response.leave._id;
                //$scope.detail = response;
            }
            else if (response.status == 'false') {
                $state.go('login');
            }
            else {
                $state.go('login');
            }

        }, function (error) {

            var alertPopup = $ionicPopup.alert({
                title: '',
                template: error.error
            });
            $ionicLoading.hide();
        });
        $scope.Dashboard = function () {
            //debugger;
            $state.transitionTo('dashboard', null, { reload: true });
            //$window.location.reload();
        }
        $scope.CancelLeave = function () {
            $ionicLoading.show();
            debugger;
            $http.defaults.headers.post["x-access-token"] = xtoken;
            $http.post(SiteUrl + '/updaterequest', { id: LeaveId, approverid: AprroverId, status: 'cancelled', reason: '', comments: '' }).success(function (result) {
                if (result.status == "Success") {
                    debugger;
                    console.log(result);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success!',
                        template: result.message
                    });

                    //Start Send notification
                    getdevice_token = result.approverdevicetoken;
                   // alert(getdevice_token);
                    //alert('I am sending notification now')
                    $http.defaults.headers.post["x-access-token"] = xtoken;
                    $http.post(SiteUrl + '/notifications', {
                        message: name + " is cancel the leave",
                        GCMRegToken: [getdevice_token],
                        state: 'empty',
                        leaveid: 'empty'
                    }).success(function (result) {
                        $ionicLoading.hide();
                        if (result.status == "Success") {

                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: result.message
                            });
                        }
                        else {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: result.message
                            });

                        }
                    }).error(function (data) {
                        debugger;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'Not gone to server Error!!!'
                        });
                        $ionicLoading.hide();
                    });

                    //End notification

                    $state.go('dashboard');
                }
                else {
                    $ionicLoading.hide();
                    
                }
            }).error(function (data) {

                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: data.error
                });
                $ionicLoading.hide();
            });
        }
    }
})   
.controller('forgetPasswordCtrl', function ($scope, $ionicPopup, $state, $http, $window, $ionicLoading, $timeout) {
   // debugger;
    $scope.data = {}
    $scope.SendRequest = function () {
        //debugger;
        $scope.loading = $ionicLoading.show({
            content: '<i class="icon ion-loading-c"></i>',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 50,
            showDelay: 1
        });
        $timeout(function () {

            $ionicLoading.hide();
        }, 1000);
        if ($scope.data.Username == '' || $scope.data.Username == null) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error!',
                template: 'Please fill the Email first'
            });
        }
        else
        {
            $http.get(SiteUrl + '/forgot/' + $scope.data.Username).success(function (response) {
                if (response.status == 'Success') {
                    debugger;
                    console.log(response);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success!',
                        template: 'Please Check your Email.'
                    });
                    email = $scope.data.Username;
                    $state.go('resetpassword');
                }
               
                else {
                    debugger;
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error!',
                        template: response.message
                    });
                    
                }

            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error!',
                    template: error
                });
            });
        }
    }
})
.controller('resetpasswordCtrl', function ($scope, $ionicPopup, $state, $http, $window, $ionicLoading, $timeout) {
    //debugger;
    //$scope.email = email;
    $scope.data={};
    $scope.SendRequest = function () {
        //debugger;
        $scope.loading = $ionicLoading.show({
            content: '<i class="icon ion-loading-c"></i>',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 50,
            showDelay: 1
        });
        $timeout(function () {

            $ionicLoading.hide();
        }, 1000);
        if ($scope.data.newpassword == null || $scope.data.oldpassword == null || $scope.data.token == null)
        {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please fill the fields first!'
            });
        }
        else if ($scope.data.newpassword != $scope.data.oldpassword) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Password is not matched!'
            });
        }
        else {
            $http.post(SiteUrl + '/forgot',
                {
                    email: email,
                    password: $scope.data.newpassword,
                    token: $scope.data.token
                }).success(function (result) {
                if (result.status == "Success") {
                   // debugger;

                }
                else {
                  //  debugger;
                    console.log(result);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: result.message
                    });

                }
            }).error(function (data) {
               // debugger;
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: data.message
                });

            });
        }
    }
})
.controller('reApplyCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    //debugger;
    $scope.data = {};
    $scope.ReApply = function () {
        debugger;
        $ionicLoading.show();
        if ($scope.data.Reason == "" || $scope.data.Reason == null) {
            //debugger;
            var alertPopup = $ionicPopup.alert({
                title: 'Error!',
                template: 'Please give the valid reason!'
            });
            $ionicLoading.hide();
        }
        else {
            debugger;
            $http.defaults.headers.post["x-access-token"] = xtoken;
            $http.post(SiteUrl + '/updaterequest', {
                id: UserLeaveId, approverid: AprroverId, status: 'pending', 
                comments: $scope.data.Reason,
                name: Loginname
            }).success(function (result) {
                debugger;
                if (result.status == "Success") {
                    //debugger;
                    console.log(result);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success!',
                        template: result.message
                    });

                    //To send the notification
                    getdevice_token = result.approverdevicetoken;
                    //alert(getdevice_token);
                    debugger;
                   // alert('I am sending notification now ')
                    $http.defaults.headers.post["x-access-token"] = xtoken;
                    $http.post(SiteUrl + '/notifications', {
                        message: Loginname + " is Re-apply the leave ",
                        GCMRegToken: [getdevice_token],
                        state: 'approver',
                        leaveid: UserLeaveId
                    }).success(function (result) {
                        $ionicLoading.hide();
                        if (result.status == "Success") {

                            //var alertPopup = $ionicPopup.alert({
                            //    title: 'Success',
                            //    template: result.message
                            //});
                        }
                        else {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: result.message
                            });
                        }
                    }).error(function (data) {
                       // debugger;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'Not gone to server Error!!!'
                        });
                        $ionicLoading.hide();
                    });
                    //notification send done
                    $state.go('dashboard');
                }
                else {
                   // debugger;
                    $state.go('login');
                }
            }).error(function (data) {
               // debugger;
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: data.error
                });
                $ionicLoading.hide();
            });
        }
    }
})
.controller('rejectlistCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    //debugger;
    $scope.$on('$ionicView.enter', function () {
        rejectList();
    });
    
    function rejectList() {
        $ionicLoading.show();
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/leaves', { employeeid: userid, status: 'rejected' }).success(function (result) {
            $ionicLoading.hide();
            if (result.status == "Success") {
               // debugger;
                console.log(result);
                console.log(result.leaves);
                $scope.detailes = result.leaves;
                employeename = result.leaves.employeename;
            }
            else {
                $scope.go('login');
            }
        }).error(function (data) {

            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: data.error
            });
            $ionicLoading.hide();
        });
        $scope.ReApply = function (Id, approverId, Device_token) {
            // debugger;
             UserLeaveId = Id;
             AprroverId = approverId;
             getdevice_token = Device_token;
            $state.go('reApply');
        }
    }
})
.controller('EditUserCtrl', function ($scope, $http, $state, $timeout, $ionicLoading, $ionicPopup, $timeout) {
   // debugger;
   // $scope.data = {};
    
    $scope.UserName = userdetails.firstname + ' ' + userdetails.lastname;
    $scope.Dept = userdetails.department;
    $scope.Url = userdetails.imageurl;
    $scope.data = {};
    $scope.Update = function () {
      //  debugger;
        if ($scope.data.Phone == null && $scope.data.Address == null) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please fill details!'
            });
        }
        else {
            $http.defaults.headers.put["x-access-token"] = xtoken;
            $http.put(SiteUrl + '/users/' + userdetails._id,{
                contactnumber: $scope.data.Phone,
                address: $scope.data.Address
            }).success(function (response) {
                if (response.status == 'Success') {
                    //debugger;
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success',
                        template: 'Update Successfully!'
                    });
                    $state.go('dashboard');
                }
                else if (response.status == 'false') {
                    $state.go('login');
                }
                else {
                    $state.go('login');
                }

            }, function (error) {
                debugger;
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: error.error
                });
            });
        }
    }
})
.controller('applyLeaveCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    $scope.PhoneNumber = { 'phonenumber': phone };
    $http.get(SiteUrl + '/users?role=approver', { headers: { "Content-Type": "application/json", "x-access-token": xtoken } }).success(function (response) {
        if (response.status == 'Success') {
            debugger;
            console.log(response);
            $scope.lists = response.user;
     
          
        }
        else if (response.status == 'false') {
            $state.go('login');
        }
        else {
            $state.go('login');
        }

    }, function (error) {

        var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: error.error
        });
    });
    $scope.data = {};
   
    $scope.apply = function () {
        debugger;
        var enddate = $scope.data.EndDate;
        $ionicLoading.show();
        if (enddate == null) {
            enddate = $scope.data.FromDate;
        }
       
       debugger;
       if ($scope.data.selectedleavetype == 'undefined'
            || $scope.data.selectedLeaveDuration == 'undefined'
            || $scope.data.FromDate == 'undefined'
            || enddate == 'undefined'
            || $scope.PhoneNumber.phonenumber == 'undefined'
           || $scope.data.selectedPerson._id == 'undefined')
       {
            var alertPopup = $ionicPopup.alert({
                title: 'Required',
                template: 'Please fill the all fileds'
            });
        }
       else {
           var frmdate = $scope.data.FromDate;
           var tdate = enddate;
           var timeDiff = Math.abs(tdate.getTime() - frmdate.getTime());   
           var diffDays = Math.ceil(timeDiff / (1000*3600*24)); 
          // alert(diffDays);
          
          // var final = tdate.getDate() - frmdate.getDate();
            $http.defaults.headers.post["x-access-token"] = xtoken;
            $http.post(SiteUrl + '/leave', {
                employeeid: userid,
                leavetypeid: $scope.data.selectedleavetype,
                duration: $scope.data.selectedLeaveDuration,
                joiningdate: getjoiningdate,
                leavefromdate: $scope.data.FromDate,
                leavetodate: enddate,
                department: getdepartment,
                contactnumber: $scope.PhoneNumber.phonenumber,
                approverid: $scope.data.selectedPerson._id,
                attachment: [],
                leavefromtime:$scope.data.FromTime,
                leavetotime:$scope.data.ToTime,
                geolocatattachmention: "",
                status: "pending",
                reason: $scope.data.Reason,
                noofdays:diffDays,
                comments: []
            }).success(function (result) {
                if (result.status == "Success") {
                    debugger;
                    console.log(result);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success',
                        template: result.message
                    });
                    //To send the notification
                    //alert('I am sending notification now and my sender device token is: ' + $scope.data.selectedPerson.devicetoken)
                    var d = $scope.data.FromDate;
                    var f = enddate;
                    var cmessage = Loginname + " is apply a leave " + d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear() + " to " + f.getDate() + "-" + f.getMonth() + "-" + f.getFullYear();
                    $http.defaults.headers.post["x-access-token"] = xtoken;
                    $http.post(SiteUrl + '/notifications', {
                        message: cmessage,
                        GCMRegToken: [$scope.data.selectedPerson.devicetoken],
                        state: 'approver',
                        leaveid: result.leaveid
                    }).success(function (result) {
                        $ionicLoading.hide();
                        if (result.status == "Success") {
                            debugger;
                            //var alertPopup = $ionicPopup.alert({
                            //    title: 'Success',
                            //    template: result.message
                            //});
                        }
                        else {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: result.message
                            });
                          
                        }
                    }).error(function (data) {
                        debugger;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'Not gone to server Error!!!'
                        });
                    });
                    //notification send done


                    debugger;
                    $state.go('dashboard');
                }
                else {
                    debugger;
                    $state.go('login');
                    $ionicLoading.hide();
                }
            }).error(function (data) {
                debugger;
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: data.error
                });
                $ionicLoading.hide();
            });
        }
    }
})   
.controller('approverCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    //debugger;

    $scope.$on('$ionicView.enter', function () {
        approvdet();
    });
   
    debugger;
    function approvdet() {
        $ionicLoading.show();
        $http.get(SiteUrl + '/leaves/' + UserLeaveId, { headers: { "Content-Type": "application/json", "x-access-token": xtoken } }).success(function (response) {
            $ionicLoading.hide();
            if (response.status == 'Success') {
                $ionicLoading.hide();
                debugger;
                console.log(response);
                $scope.Employeeid = response.leave.empcode;
                $scope.Username = response.leave.employeename;  //      done wait for check
                $scope.Department = response.leave.department;
                $scope.Fromdate = response.leave.leavefromdate;
                $scope.Todate = response.leave.leavetodate;
                $scope.LeaveType = response.leave.leavetype;
                $scope.Duration = response.leave.duration;
                $scope.Reason = response.leave.reason;
                AprroverId = response.leave.approverid;
                LeaveId = response.leave._id;
                $scope.comments = response.leave.comments;

                //getdevice_token = response.leave;
                //$scope.detail = response;
            }
            else if (response.status == 'false') {
                $state.go('login');
            }
            else {
                $state.go('login');
            }

        }, function (error) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: '',
                template: error.error
            });
        });
    }
    $scope.aprrove = function () {
        //debugger;
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/updaterequest', {
            id: LeaveId,
            approverid: AprroverId,
            status: 'approved'
            
        }).success(function (result) {
            if (result.status == "Success") {
                //debugger;
                console.log(result);
                var alertPopup = $ionicPopup.alert({
                    title: 'Success!',
                    template: result.message
                });
                getdevice_token = result.userdevicetoken;
                //alert(getdevice_token);
                //Start Send notification
                //alert('I am sending notification now')
                $http.defaults.headers.post["x-access-token"] = xtoken;
                $http.post(SiteUrl + '/notifications', {
                    message: Loginname + " is approved your leave",
                    GCMRegToken: [getdevice_token],
                    state: 'leaveDetails',
                    leaveid: LeaveId
                }).success(function (result) {
                    if (result.status == "Success") {

                        //var alertPopup = $ionicPopup.alert({
                        //    title: 'Success',
                        //    template: result.message
                        //});
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: result.message
                        });

                    }
                }).error(function (data) {
                    debugger;
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Not gone to server Error!!!'
                    });
                });

                //End notification



                $state.go('dashboard');
            }
            else {
                $state.go('login');
            }
        }).error(function (data) {

            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: data.error
            });
        });
        //$window.location.reload();
    }
    $scope.rejectrequest = function () {
        
        $scope.go('reject')
    }
    $scope.forword = function () {
       
        $scope.go('forword')
    }

})   
.controller('requestShortLeaveCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading) {
     debugger;   
     $scope.data = {};
     $scope.shortleave = function () {
         
         $ionicLoading.show();
         debugger;
         var ddd = new Date();
         var h = ddd.getHours();
         var get = $scope.data.selectedtime;
         if (get == "" || get == null) {
             var alertPopup = $ionicPopup.alert({
                 title: 'Error!',
                 template: 'Please select the time first'
             });
             $ionicLoading.hide();
         }
         else {

             var result1 = get - h;
             var isapplied = false;
             if (result1 <= 0) {
                 alert('Incorrect Time');
                 isapplied = false;
             }
             else {
                 isapplied = true;
                 if (result1 > 0 && result1 <= 2) {
                     var Duration = 3;
                 }
                 else if (result1 <= 4) {
                     var Duration = 2;
                 }
                 else {
                     var Duration = 1;
                 }
             }
             debugger;
             if (isapplied == true) {
                 $http.defaults.headers.post["x-access-token"] = xtoken;
                 debugger;
                 $http.post(SiteUrl + '/leave',
                     {
                         employeeid: userid,
                         leavetypeid: "2",
                         duration: Duration,
                         joiningdate: getjoiningdate,
                         leavefromdate: new Date(),
                         leavetodate: new Date(),
                         department: getdepartment,
                         contactnumber: "",
                         //need to change the approverid of super admin or approver's list
                         approverid: "6774b643094afac490646d83",
                         attachment: [],
                         geolocatattachmention: "",
                         status: "approved",
                         reason: "Running Late",
                         comments:
                             [{
                                 commentby: "Neeraj Khosla",
                                 commenton: new Date(),
                                 comment: "approved"
                             }]
                     }).success(function (result) {
                         debugger;
                        
                         if (result.status == "Success") {
                             var alertPopup = $ionicPopup.alert({
                                 title: 'Success!',
                                 template: 'Your Leave is Approved.',

                             });
                             getdevice_token = result.approverdevicetoken;
                             //alert(getdevice_token);
                             //Start Send notification
                             //alert('I am sending notification now')
                             $http.defaults.headers.post["x-access-token"] = xtoken;
                             $http.post(SiteUrl + '/notifications', {
                                 message: Loginname + " is apply a leave ",
                                 //need to change GCMRegToken with Super admin device token or get from the database
                                 GCMRegToken: [getdevice_token],
                                 leaveid: result.leaveid,
                                 state: 'undefined'
                             }).success(function (result) {
                                 $ionicLoading.hide();
                                 if (result.status == "Success") {

                                     //var alertPopup = $ionicPopup.alert({
                                     //    title: 'Success',
                                     //    template: result.message
                                     //});
                                 }
                                 else {
                                     var alertPopup = $ionicPopup.alert({
                                         title: 'Error',
                                         template: result.message
                                     });

                                 }
                             }).error(function (data) {
                                 debugger;
                                 var alertPopup = $ionicPopup.alert({
                                     title: 'Error',
                                     template: 'Not gone to server Error!!!'
                                 });
                                 $ionicLoading.hide();
                             });

                             //End notification



                             $state.go('dashboard');
                         }
                         else if (result.status == "false") {
                             // debugger;
                             $state.go('login');
                             $ionicLoading.hide();
                         }
                         else {
                             //debugger;
                             $state.go('login');
                             $ionicLoading.hide();
                         }
                     }).error(function (data) {
                         //debugger;
                         var alertPopup = $ionicPopup.alert({
                             title: '',
                             template: data.error
                         });
                         $ionicLoading.hide();
                     });
             }
             $ionicLoading.hide();
         }
     }
})  
.controller('rejectCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    $scope.data = {};
    
    $scope.reject = function () {
        $ionicLoading.show();
        debugger;
        if ($scope.data.reason == null) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please give a reason first'
            });
            $state.go('reject')
        }
        else {
            debugger;
            $http.defaults.headers.post["x-access-token"] = xtoken;
            $http.post(SiteUrl + '/updaterequest',
                {
                    id: LeaveId, approverid: AprroverId,
                    status: 'rejected',
                    name: Loginname,
                    comments: $scope.data.reason
                }).success(function (result) {
                    if (result.status == "Success") {
                       
                   // debugger;
                    console.log(result);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success',
                        template: result.message
                    });
                    getdevice_token = result.userdevicetoken;
                    //alert(getdevice_token);
                    //To send the notification
                    //alert('I am forword notification now')
                    $http.defaults.headers.post["x-access-token"] = xtoken;
                    $http.post(SiteUrl + '/notifications', {
                        message: Loginname + " is reject your Leave",
                        GCMRegToken: [getdevice_token],
                        state: 'reApply',
                        leaveid: LeaveId
                    }).success(function (result) {
                        $ionicLoading.hide();
                        if (result.status == "Success") {

                            //var alertPopup = $ionicPopup.alert({
                            //    title: 'Success',
                            //    template: result.message
                            //});
                        }
                        else {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: result.message
                            });

                        }
                    }).error(function (data) {
                        debugger;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'Not gone to server Error!!!'
                        });
                    });
                    $ionicLoading.hide();
                    //notification send done




                    $state.go('dashboard');
                }
                    else {
                        debugger;
                        $ionicLoading.hide();
                    $state.go('login');
                }
            }).error(function (data) {
                debugger;
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: data.error
                });
            });
            //$window.location.reload();
        }
    }
})   
.controller('forwardCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    // debugger;
    //alert('Hello');
    $ionicLoading.show();
  
   // alert('Hello');
    $http.get(SiteUrl + '/users?role=approver' , { headers: { "Content-Type": "application/json", "x-access-token": xtoken } }).success(function (response) {
        if (response.status == 'Success') {
            $ionicLoading.hide();
                 debugger;
                 console.log(response);
                 $scope.lists = response.user;
                 
                
            }
            else if (response.status == 'false') {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: response.message
                });
                $ionicLoading.hide();
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: response.message
                });
                $ionicLoading.hide();
            }

        }, function (error) {

            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error
            });
            $ionicLoading.hide();
        });

    $scope.data = {};
    $scope.forward = function () {
        if ($scope.data.selectedPerson._id == null || $scope.data.reason == null) {
            alert('Fill all the Details.');
        }
        else {
            debugger;
            $ionicLoading.show();
            //ApproverName = response.data.approvername;
            ApproveId = $scope.data.selectedPerson._id;
            ApproveName = $scope.data.selectedPerson.firstname + ' ' + $scope.data.selectedPerson.lastname;
            $http.defaults.headers.post["x-access-token"] = xtoken;
            $http.post(SiteUrl + '/forwardrequest', {
                id: LeaveId,
                approverid: ApproveId,
                name: Loginname,
                comments: $scope.data.reason
               // reason: $scope.data.reason,
            }).success(function (result) {

                if (result.status == "Success") {
                    debugger;
                    console.log(result);
                    var alertPopup = $ionicPopup.alert({
                        title: 'Success',
                        template: result.message
                    });

                    //To send the notification
                    //alert('I am forword notification now')
                    $http.defaults.headers.post["x-access-token"] = xtoken;
                    $http.post(SiteUrl + '/notifications', {
                        message: Loginname + " is forward you a Leave",
                        GCMRegToken: [$scope.data.selectedPerson.devicetoken],
                        state: 'approver',
                        leaveid: LeaveId
                    }).success(function (result) {
                        if (result.status == "Success") {

                            //var alertPopup = $ionicPopup.alert({
                            //    title: 'Success',
                            //    template: result.message
                            //});
                            $scope.data.reason = "";
                            $ionicLoading.hide();
                        }
                        else {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Error',
                                template: result.message
                            });
                            $ionicLoading.hide();
                        }
                    }).error(function (data) {
                        debugger;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'Not gone to server Error!!!'
                        });
                        $ionicLoading.hide();
                    });
                    //notification send done





                    $state.go('dashboard');
                }
                else {
                    debugger;
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: result.message
                    });
                    $ionicLoading.hide();
                }
            }).error(function (data) {
                debugger;
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: data.message
                });
                $ionicLoading.hide();
            });
        }
        //$window.location.reload();
    }
})   
.controller('historyCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    backbuttoncheck = '';
    // debugger;
    $ionicLoading.show();
    $http.defaults.headers.post["x-access-token"] = xtoken;
    $http.post(SiteUrl + '/leaves', { employeeid: userid }).success(function (result) {
        $ionicLoading.hide();
        if (result.status == "Success") {
           // debugger;
            console.log(result);
            console.log(result.leaves);
            $scope.detailes = result.leaves;
        }
        else{
            $scope.go('login');
        }
    }).error(function (data) {

        var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: data.error
        });
        $ionicLoading.hide();
    });

    
    //$scope.getdetail = function (SelectedLeaveId) {
    //    //debugger;
        
    //        UserLeaveId = SelectedLeaveId;
    //    //$scope.go('leaveDetails');
    //        $state.go('leaveDetails', null, { reload: true });
    //    }
})   
.controller('approveDetailsCtrl', function ($scope, $http, $state, $ionicLoading, $timeout) {
    //Change the API and There parameters
    $scope.$on('$ionicView.enter', function () {
        Detales();
        
    });
    function Detales() {
        $ionicLoading.show();
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/requests', { approverid: userid, status: 'pending' }).success(function (result) {
            $ionicLoading.hide();
            if (result.status == "Success") {
                //debugger;
                console.log(result);
                console.log(result.leaves);
                $scope.detailes = result.leaves;
            }
            else {
                $scope.go('login');
            }
        }).error(function (data) {

            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: data.error
            });
            $ionicLoading.hide();
        });
        $scope.getApprove = function (Id) {
            // debugger;
            UserLeaveId = Id;
            $state.go('approver');
        }
    }
})
.controller('usedCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    $scope.$on('$ionicView.enter', function () {
        Used();
    });
    function Used() {
        $ionicLoading.show();
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/leaves', { employeeid: userid, status: 'approved' }).success(function (result) {
            $ionicLoading.hide();
            if (result.status == "Success") {
                //debugger;
                console.log(result);
                console.log(result.leaves);
                $scope.detailes = result.leaves;
            }
            else {
                $scope.go('login');
            }
        }).error(function (data) {

            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: data.error
            });
            $ionicLoading.hide();
        });
    }
    $scope.getdetail = function (SelectedLeaveId) {
       // debugger;

        UserLeaveId = SelectedLeaveId;
        //$scope.go('leaveDetails');
        $state.go('leaveDetails', null, { reload: true });
    }
})
.controller('pendingCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
   
    $scope.$on('$ionicView.enter', function () {
        Pending();
       
    });
    function Pending() {
        $ionicLoading.show();
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/leaves', { employeeid: userid, status: 'pending' }).success(function (result) {
            $ionicLoading.hide();
            if (result.status == "Success") {
                //  debugger;
                console.log(result);
                console.log(result.leaves);
                $scope.detailes = result.leaves;
            }
            else {
                $scope.go('login');
            }
        }).error(function (data) {

            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: data.error
            });
            $ionicLoading.hide();
        });
    }
    $scope.getApprove = function (Id) {
      //  debugger;
        UserLeaveId = Id;
        $state.go('leaveDetails');
    }
})

.controller('mainController', function ($scope, $ionicPopup, $state, $ionicLoading) {

window.onNotification = function (e) {
   // alert('notification');
    //debugger;
    //alert(e);
    switch (e.event) {
        case 'registered':
           // debugger;
            //alert('notification1');
            if (e.regid.length > 0) {
                //alert('notification2');
                device_token = e.regid;
                //alert(device_token);
                //alert(e.regid);
                    
               
            }

            break;
        case 'message':
            debugger;
            //alert('notification2');
            //alert('Recived: ' + e.message);
            debugger;
            //var detailes = JSON.parse(e.message);

            //alert(e.payload.title);
            //alert(detailes.message);
            //alert(detailes.state);
            //alert(detailes.leaveid);
            UserLeaveId = e.payload.leaveid;
            AprroverId = e.payload.approverid;
            $state.go(e.payload.state);
           
            //alert('go');
            break;
        case 'error':
            debugger;
            //alert('notification3');
            alert('error occured');
            break;
    }
};
window.errorHandler = function (error) {
    //alert('on-error');
    debugger;
    alert('an error occured');
}
});