var controllers = angular.module("controllers", []);

controllers.controller("rootController", ['$state', '$window', function ($state, $window) {
    if ($window.localStorage.cb_token) {
        $state.go('home');
    } else {
        $state.go('login');
    }
}]);

controllers.controller("mainController", ['$scope', '$log', '$timeout', '$window', 'socket', '$state', '$http', function ($scope, $log, $timeout, $window, socket, $state, $http) {
    socket.socket.removeAllListeners();

    // user information
    var userInfo = {};
    userInfo.token = $window.localStorage.cb_token;
    socket.connect(function () {
        socket.emit('userAdd', userInfo);
    });

    var toggle = 0;
    $scope.users = [];
    $("#menuBtn").on("click", function () {
        if (!toggle) {
            $("#menu").animate({
                left: '10px'
            });
            toggle = 1;
        } else {
            $("#menu").animate({
                left: '-400px'
            });
            toggle = 0;
        }
    });

    var pause_btn = 0;
    $("#yo").on("click", function () {
        if (!pause_btn) {
            $("#yo span").attr("class", "glyphicon glyphicon-play");
            socket.pause();
            pause_btn = 1;
            $("#m").attr('disabled', 'true');
        } else {
            $("#yo span").attr("class", "glyphicon glyphicon-pause");
            socket.resume();
            pause_btn = 0;
            $("#m").removeAttr('disabled');
        }
    });

    $scope.connectedUsers = [];
    /*$scope.getConnectedUsers = function () {
        $http.get('/api/v1/users/view').success(function (result) {
            if (result.success) {
                $scope.connectedUsers = result.data;
            }
        }).error(function (err) {
            console.log(err);
        });
    }
    $scope.getConnectedUsers();*/

    socket.on('connected users', function(data){
        $scope.connectedUsers = data;
        /*data.forEach(function(entry){
            if(entry != 'sujan') $scope.connectedUsers.push(entry);
        });*/
        //console.log($scope.connectedUsers);
    });

    $scope.logout = function () {
        socket.disconnect();
        delete $window.localStorage.cb_token;
        $window.location.replace('/#/login');
        // $state.go('login', null, {reload: true, inherit: false, notify: true});
    }

}]);

controllers.controller("chatController", ['$scope', '$log', '$window', 'socket', '$http', function ($scope, $log, $window, socket, $http) {
    socket.socket.removeAllListeners();
    $('form').submit(function () {
        if ($('#m').val() != '') {
            var data = {};
            data.msg = $('#m').val();
            data.token = $window.localStorage.cb_token;
            if (data.msg.charAt(0) == '@' && data.msg.search(' ') > -1) {
                var position = 1;
                var msg_to = '';
                while (data.msg.charAt(position) != ' ') {
                    msg_to += data.msg.charAt(position);
                    position++;
                }
                var options = {
                    username: msg_to
                }
                $http.post('/api/v1/users/view', options).success(function (result) {
                    if (result.success) {
                        var private_msg = '';
                        position++;
                        while (position < data.msg.length) {
                            private_msg += data.msg.charAt(position);
                            position++;
                        }
                        data.msg = private_msg;
                        data.msg_to = msg_to;
                        $('<li><b>Me</b>: ' + '<u>@' + msg_to + '</u>' + ' <em>' + private_msg + '</em></li>').addClass('my-msg pull-right').appendTo('#messages');
                        $('.displayBox').scrollTop($('.displayBox')[0].scrollHeight);
                        socket.emit('private message', data);
                        $('#m').val('');
                        return false;
                    } else {
                        $('<li><b>Me</b>: ' + $('#m').val() + '</li>').addClass('my-msg pull-right').appendTo('#messages');
                        $('.displayBox').scrollTop($('.displayBox')[0].scrollHeight);
                        socket.emit('chat message', data);
                        $('#m').val('');
                        return false;
                    }
                }).error(function (err) {
                    console.log(err);
                });
            } else {
                $('<li><b>Me</b>: ' + $('#m').val() + '</li>').addClass('my-msg pull-right').appendTo('#messages');
                $('.displayBox').scrollTop($('.displayBox')[0].scrollHeight);
                socket.emit('chat message', data);
                $('#m').val('');
                return false;
            }
        }
    });
    socket.on('chat message', function (data) {
        $('<li><b>' + data.userInfo.username + '</b>: ' + data.msg + '</li>').addClass('others-msg pull-left').appendTo('#messages');
        $('.displayBox').scrollTop($('.displayBox')[0].scrollHeight);
    });
    socket.on('private message', function (data) {
        $('<li><b><u>' + data.userInfo.username + '</u></b>: ' + '<em>' + data.msg + '</em></li>').addClass('others-msg pull-left').appendTo('#messages');
        $('.displayBox').scrollTop($('.displayBox')[0].scrollHeight);
    });
    /*$scope.disconnect = function(){
     socket.emit('disconnect');
     }*/

}]);

controllers.controller("privateChatController", ['$scope','$log','$http','$state','$window','socket','$stateParams', function($scope, $log, $http, $state, $window, socket, $stateParams){
    socket.socket.removeAllListeners();
    // error_handling
    /*var paramUsername = $stateParams.username;
    var tempResult = false;
    $scope.connectedUsers.forEach(function(entry){
        if(entry.username == paramUsername){
            tempResult = true;
        }
    });
    if(!tempResult) $state.go('404');*/
    $('form').submit(function(){
        var tempValue = $('#m').val();
        if(tempValue != ''){
            var data = {};
            data.msg = tempValue;
            data.token = $window.localStorage.cb_token;
            data.msg_to = $stateParams.username;
            $('<li><b>Me</b>: ' + tempValue + '</li>').addClass('my-msg pull-right').appendTo('#messages');
            $('.displayBox').scrollTop($('.displayBox')[0].scrollHeight);
            socket.emit('private message', data);
            $('#m').val('');
        }
    });

    socket.on('private message', function(data){
        $('<li><b>' + data.userInfo.username + '</b>: ' + data.msg + '</li>').addClass('others-msg pull-left').appendTo('#messages');
        $('.displayBox').scrollTop($('.displayBox')[0].scrollHeight);
    });
}]);

controllers.controller("loginController", ['$scope', '$log', '$http', '$state', '$window', 'socket', function ($scope, $log, $http, $state, $window, socket) {
    $scope.loginInfo = {};
    $scope.signupInfo = {};

    $scope.signup = function (isValid) {
        if (isValid) {
            $http.post('/api/v1/signup', $scope.signupInfo).success(function (data) {
                alert("User registered successfully");
                $state.go('login');
            }).error(function (err) {
                alert(err);
                $state.go('signup');
            });
        }
    }

    $scope.login = function (isValid) {
        if (isValid) {
            $http.post('/api/v1/login', $scope.loginInfo).success(function (data) {
                if (data.success) {
                    $window.localStorage.cb_token = data.token;
                    $state.go('home');
                } else {
                    alert("username/password incorrect");
                }
            }).error(function (err) {
                console.log(err);
            });
        }
    }
}]);

controllers.controller("404", ['$scope', function ($scope) {
    // jQuery that does some cool stuff
}]);