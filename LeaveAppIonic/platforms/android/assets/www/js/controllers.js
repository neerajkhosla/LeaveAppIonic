angular.module('app.controllers', [])
.controller('dashboardCtrl', function ($scope, $http, $state, $timeout) {
    //debugger;
    $scope.$on('$ionicView.enter', function () {
        dashboard();
    });
   
    function dashboard(){ $http.get(SiteUrl +'/stats/' + userid, {headers: { "Content-Type": "application/json", "x-access-token": xtoken }}).success(function (response) {
        if (response.status == 'Success') {
            //debugger;
            //console.log(response);
            $scope.remaining = response.leaveStats.remainingLeaves;
            $scope.used = response.leaveStats.usedLeaves;
            $scope.pending = response.leaveStats.pendingLeaves;
            $scope.role = userrole;
          }
        else if (response.status == 'false')
        {
            //debugger;
            $state.go('login');
        }
        else
        {
            //debugger
            $state.go('login');
        }
        
    }, function (error) {       
        $state.go('login');
    });
    }
    $scope.editUser = function () {
        //debugger;
        $state.go('EditUser');

    }
    
})   
.controller('loginCtrl', function ($scope, $ionicPopup, $state, $http, $timeout, $ionicLoading) {
    

    $scope.data = {};

    $scope.login = function () {
       // debugger;
        $scope.loading = $ionicLoading.show({
            content: '<i class="icon ion-loading-c"></i>',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 50,
            showDelay: 1
        });
        $timeout(function () {
           
            $ionicLoading.hide();
        }, 4000);
        // Set a timeout to clear loader, however you would actually call the $scope.loading.hide(); method whenever everything is ready or loaded.
       

        if ($scope.data.username == "" || $scope.data.password == "") {
            var alertPopup = $ionicPopup.alert({
                title: 'Login Failed!',
                template: 'Please fill the credentials first'
            });
            
        }
        else {
            $http.post(SiteUrl+ '/login', { username: $scope.data.username, password: $scope.data.password }).success(function (result) {
                if (result.status == "Success") {
                   //debugger;
                     console.log(result);
                    //Intailize the global variable values
                    xtoken = result.user.token;
                    name = result.user.email;
                    userid = result.user._id;

                    //It contain all info about user
                    userdetails = result.user;


                    getjoiningdate = result.user.joiningdate;
                    getdepartment = result.user.department;
                    userrole = result.user.roles;
                    for (var i = 0; i < userrole.length; i++)
                    {
                        //var temp = userrole[i].Role;
                        if (angular.lowercase(userrole[i]) == 'admin' || angular.lowercase(userrole[i]) == 'approver')
                        {
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
                        if (result.status == "Success") {
                           
                            console.log(result);
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: result.message
                            });
                           
                             }
                        else {
                            debugger;
                            var alertPopup = $ionicPopup.alert({
                                title: 'Success',
                                template: result.message
                            });
                        }
                    }).error(function (data) {
                        debugger;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'not reached to register API'  //Just for test in mobile
                        });
                    });
                    if (isIOS == true)
                    {
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
                   
                }
            }).error(function (data) {
               // debugger;
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: ''
                });
                
            });
            
        }
    }
    $scope.forget = function () {
       // debugger;
        $state.go('forgetPassword');
    }
})   
.controller('leaveDetailsCtrl', function ($scope, $ionicPopup, $state, $http, $window, $ionicLoading, $timeout) {
   // alert('Hello');
    $scope.$on('$ionicView.enter', function () {
        LeaveDetails();
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
       
    });
    //debugger;
    function LeaveDetails() {
        $http.get(SiteUrl + '/leaves/' + UserLeaveId, { headers: { "Content-Type": "application/json", "x-access-token": xtoken } }).success(function (response) {
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
        });
        $scope.Dashboard = function () {
            //debugger;
            $state.transitionTo('dashboard', null, { reload: true });
            //$window.location.reload();
        }
        $scope.CancelLeave = function () {
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
        //$scope.data = {};
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
        if ($scope.data.Reason == "" || $scope.data.Reason == null) {
            //debugger;
            var alertPopup = $ionicPopup.alert({
                title: 'Error!',
                template: 'Please give the valid reason!'
            });
        }
        else {

            $http.defaults.headers.post["x-access-token"] = xtoken;
            $http.post(SiteUrl + '/updaterequest', {
                id: UserLeaveId, approverid: AprroverId, status: 'pending', reason: $scope.data.Reason,
                comments:
                    {
                        "commentby": employeename,
                        "commenton":new Date(),
                        "comment": $scope.data.Reason
                    }
            }).success(function (result) {
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
                   // alert('I am sending notification now ')
                    $http.defaults.headers.post["x-access-token"] = xtoken;
                    $http.post(SiteUrl + '/notifications', {
                        message: name + " is Re-apply the leave ",
                        GCMRegToken: [getdevice_token],
                        state: 'approver',
                        leaveid: LeaveId
                    }).success(function (result) {
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
                       // debugger;
                        var alertPopup = $ionicPopup.alert({
                            title: 'Error',
                            template: 'Not gone to server Error!!!'
                        });
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
            });
        }
    }
})
.controller('rejectlistCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    //debugger;
    $scope.$on('$ionicView.enter', function () {
        rejectList();
    });
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
    function rejectList() {
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/leaves', { employeeid: userid, status: 'rejected' }).success(function (result) {
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
    
    var fullname;
    $http.get(SiteUrl + '/users?role=approver', { headers: { "Content-Type": "application/json", "x-access-token": xtoken } }).success(function (response) {
        if (response.status == 'Success') {
            debugger;
            console.log(response);
            $scope.lists = response.user;
            fullname = response.user.firstname + ' ' + response.user.lastname;
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
        if ($scope.data.selectedleavetype == null
            && $scope.data.selectedLeaveDuration == null
            && $scope.data.FromDate == null
            && $scope.data.ToDate == null
            && $scope.data.PhoneNo == null
            && $scope.data.selectedPerson._id == null) {
            var alertPopup = $ionicPopup.alert({
                title: 'Required',
                template: 'Please fill the all fileds'
            });
        }
        else {
            $http.defaults.headers.post["x-access-token"] = xtoken;
            $http.post(SiteUrl + '/leave', {
                employeeid: userid,
                leavetypeid: $scope.data.selectedleavetype,
                duration: $scope.data.selectedLeaveDuration,
                joiningdate: getjoiningdate,
                leavefromdate: $scope.data.FromDate,
                leavetodate: $scope.data.ToDate,
                department: getdepartment,
                contactnumber: $scope.data.PhoneNo,
                approverid: $scope.data.selectedPerson._id,
                attachment: [],
                geolocatattachmention: "",
                status: "pending",
                reason: $scope.data.Reason,
                comments: ""
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
                    $http.defaults.headers.post["x-access-token"] = xtoken;
                    $http.post(SiteUrl + '/notifications', {
                        message: name + " is apply a leave " + $scope.data.FromDate + " to " + $scope.data.ToDate,
                        GCMRegToken: [$scope.data.selectedPerson.devicetoken],
                        state: 'approver',
                        leaveid: result.leaveid
                        }).success(function (result) {
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
                    });
                    //notification send done


                    debugger;
                    $state.go('dashboard');
                }
                else {
                    debugger;
                    $state.go('login');
                }
            }).error(function (data) {
                debugger;
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: data.error
                });
            });
        }
    }
})   
.controller('approverCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
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
    $http.get(SiteUrl + '/leaves/' + UserLeaveId, { headers: { "Content-Type": "application/json", "x-access-token": xtoken } }).success(function (response) {
        if (response.status == 'Success') {
            //debugger;
            console.log(response);
            $scope.Employeeid = response.leave.employeeid;
            $scope.Username = response.leave.employeename;  //      done wait for check
            $scope.Department = response.leave.department;
            $scope.Fromdate = response.leave.leavefromdate;
            $scope.Todate = response.leave.leavetodate;
            $scope.LeaveType = response.leave.leavetype;
            $scope.Duration = response.leave.duration;
            $scope.Reason = response.leave.reason;
            AprroverId = response.leave.approverid;
            LeaveId = response.leave._id;
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

        var alertPopup = $ionicPopup.alert({
            title: '',
            template: error.error
        });
    });
    $scope.aprrove = function () {
        //debugger;
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/updaterequest', { id: LeaveId, approverid: AprroverId, status: 'approved', reason: '', comments:'' }).success(function (result) {
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
                    message: name + " is approved your leave",
                    GCMRegToken: [getdevice_token],
                    state: 'leaveDetails',
                    leaveid: LeaveId
                }).success(function (result) {
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
.controller('requestShortLeaveCtrl', function ($scope, $ionicPopup, $state, $http) {
     //debugger;   
     $scope.data = {};
     $scope.shortleave = function () {
         
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
        // debugger;
         var d = new Date();
         var h = d.getHours();
         var get = $scope.data.selectedtime;
         if (get == "" || get == null) {
             var alertPopup = $ionicPopup.alert({
                 title: 'Error!',
                 template: 'Please select the time first'
             });
         }
         else {

             var result1 = get - h;
             if (result1 > 0 && result1 <= 2) {
                 var Duration = 3;
             }
             else if (result1 <= 4) {
                 var Duration = 2;
             }
             else {
                 var Duration = 1;
             }
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
                         {
                             commentby: "Neeraj Khosla",
                             commenton: new Date(),
                             comment: "approved"
                         }
                 }).success(function (result) {
                     debugger;
                     if (result.status == "Success") {
                         var alertPopup = $ionicPopup.alert({
                             title: 'Success!',
                             template: 'Your Leave is Approved.',

                         });
                         getdevice_token = result.userdevicetoken;
                         //alert(getdevice_token);
                         //Start Send notification
                         //alert('I am sending notification now')
                         $http.defaults.headers.post["x-access-token"] = xtoken;
                         $http.post(SiteUrl + '/notifications', {
                             message: name + " is apply a leave " + $scope.data.leavefromdate + " to " + $scope.data.leavetodate,
                             //need to change GCMRegToken with Super admin device token or get from the database
                             GCMRegToken: [getdevice_token],
                             leaveid: result.leaveid,
                             state: 'pendingLeave'
                         }).success(function (result) {
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
                         });

                         //End notification



                         $state.go('dashboard');
                     }
                     else if (result.status == "false") {
                         // debugger;
                         $state.go('login');
                     }
                     else {
                         //debugger;
                         $state.go('login');
                     }
                 }).error(function (data) {
                     //debugger;
                     var alertPopup = $ionicPopup.alert({
                         title: '',
                         template: data.error
                     });
                 });
         }
     }
})  
.controller('rejectCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    $scope.data = {};
    
    $scope.reject = function () {

        //debugger;
        if ($scope.data.reason == null) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Please give a reason first'
            });
            $state.go('reject')
        }
        else {
            $http.defaults.headers.post["x-access-token"] = xtoken;
            $http.post(SiteUrl + '/updaterequest',
                {
                    id: LeaveId, approverid: AprroverId,
                    status: 'rejected',
                    reason: $scope.data.reason,
                    comments:
                        {
                            commentby: rejectName,
                            commenton: new Date(),
                            comment: $scope.data.reason
                        }
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
                        message: name + " is reject your Leave",
                        GCMRegToken: [getdevice_token],
                        state: 'reApply',
                        leaveid: LeaveId
                    }).success(function (result) {
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
                    });
                    //notification send done




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
    }
})   
.controller('forwardCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    // debugger;
    //alert('Hello');
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
   // alert('Hello');
    $http.get(SiteUrl + '/users?role=approver' , { headers: { "Content-Type": "application/json", "x-access-token": xtoken } }).success(function (response) {
            if (response.status == 'Success') {
                 debugger;
                 console.log(response);
                 $scope.lists = response.user;
                 
                
            }
            else if (response.status == 'false') {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: response.message
                });
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: response.message
                });
            }

        }, function (error) {

            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: error
            });
        });

    $scope.data = {};
    $scope.forward = function () {
        debugger;
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
        //ApproverName = response.data.approvername;
        ApproveId=$scope.data.selectedPerson._id;
        ApproveName=$scope.data.selectedPerson.firstname+' '+$scope.data.selectedPerson.lastname;
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/forwardrequest', {
            id: LeaveId,
            status:"pending",
            approverid: ApproveId,
            name: ApproveName,
            comments: $scope.data.reason,
            reason: $scope.data.reason,
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
                    message: name + " is forward you a Leave",
                    GCMRegToken: [$scope.data.selectedPerson.devicetoken],
                    state: 'approver',
                    leaveid: LeaveId
                }).success(function (result) {
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
            }
        }).error(function (data) {

            var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: data.message
            });
        });
        //$window.location.reload();
    }
})   
.controller('historyCtrl', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $timeout) {
    // debugger;
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
    $http.defaults.headers.post["x-access-token"] = xtoken;
    $http.post(SiteUrl+'/leaves', { employeeid :userid}).success(function (result) {
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
    });
    function Detales() {
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/requests', { approverid: userid, status: 'pending' }).success(function (result) {
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
    });
    function Used() {
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/leaves', { employeeid: userid, status: 'approved' }).success(function (result) {
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
    });
    function Pending() {
        $http.defaults.headers.post["x-access-token"] = xtoken;
        $http.post(SiteUrl + '/leaves', { employeeid: userid, status: 'pending' }).success(function (result) {
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
        });
    }
    $scope.getApprove = function (Id) {
      //  debugger;
        UserLeaveId = Id;
        $state.go('leaveDetails');
    }
})

.controller('mainController', function ($scope, $ionicPopup, $state) {

window.onNotification = function (e) {
   // alert('notification');
    debugger;
    //alert(e);
    switch (e.event) {
        case 'registered':
            debugger;
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
            var detailes = JSON.parse(e.message);
            alert(e.payload.title);
            alert(detailes.message);
            //alert(detailes.state);
            //alert(detailes.leaveid);
            UserLeaveId = detailes.leaveid;
            //alert('Saved ' + UserLeaveId);
              
            $state.go(detailes.state);
          
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