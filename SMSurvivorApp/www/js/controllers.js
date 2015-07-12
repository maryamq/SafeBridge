angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Conversations, $rootScope, Advisor) {

  /*console.log($rootScope.org_id);
  $scope.feeds = Feed.all();
  $scope.remove = function(feed) {
    Feed.remove(feed);
  }*/
  $scope.haveData = false;
  $scope.advisor_id = $rootScope.advisor_id;
  $scope.populate = function(){
    Conversations.get().success(function(data){
      if (data.length > 0) {
        $scope.haveData = true;
        $scope.conversations = data; 
      }else{
        $scope.haveData = false;
      }
      
      //console.log($scope.conversations);
    });  
  }

  setInterval(function () {
    $scope.pageRefresh();
  }, 1000);

  $scope.pageRefresh = function(){
    //$scope.conversations = [];
    Advisor.get($rootScope.advisor_id).success(function(data){
      $scope.settings = data[0];
      console.log($scope.settings.available);
      if ($scope.settings.available) {
        $scope.populate();    
      }else{
        $scope.conversations = [];
      }
    });  
  }
  
  

  $scope.claim = function(session_id){
    //console.log(session_id+"    "+$scope.advisor_id);
    Conversations.claim(session_id,$scope.advisor_id).success(function(data){
      console.log(data);
      //$scope.populate();
      //$rootScope.session_id = session_id;
      window.location = "#/tab/chats/"+session_id;

    });
  }

})

.controller('CreateCtrl', function($scope) {

})

.controller('LoginCtrl', function($scope, Login, $rootScope) {

  $scope.login = function(){
    console.log($scope.$$childHead.username);
    Login.get($scope.$$childHead.username,$scope.$$childHead.password).success(function(data){
       // $scope.items=data.results;
       console.log(data.results[0]);
       $rootScope.advisor_id = data.results[0].user_name;
       $rootScope.org_id = data.results[0].org_id;
       window.location = "#/tab/dash";
    });
    
  }

})

.controller('AddCtrl', function($scope) {

})

.controller('ChatsCtrl', function($scope, Chats, Conversations, $rootScope) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  /*$scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }*/
  Conversations.unique($rootScope.advisor_id).success(function (data) {
    console.log(data);
    $scope.chats = data;
  });
})

.controller('ChatDetailCtrl', function($scope, $stateParams, $rootScope, Conversations) {
  //$scope.chat = Chats.get($stateParams.chatId);
  console.log($stateParams.chatId);
  $scope.clientState = true;
  $scope.pageRefresh = function(){
    Conversations.getForSession($stateParams.chatId).success(function(data){
      console.log(data);
      $scope.chats = data;
    });  
  }
  $scope.pageRefresh();

  setInterval(function () {
    $scope.pageRefresh();
  }, 2000);

  $scope.sendMessage = function(){
    //console.log($scope.data.message);
    Conversations.postMessage({message:$scope.data.message, session_id:$stateParams.chatId, advisor_id: $rootScope.advisor_id}).success(function(data){
      console.log(data);
      $scope.pageRefresh();
    });
  }
})

.controller('AccountCtrl', function($scope, Advisor, $rootScope) {
  console.log("in AccountCtrl");
  Advisor.get($rootScope.advisor_id).success(function(data){
    $scope.settings = data[0];
    console.log($scope.settings);
  });

  $scope.statusChange = function () {
    console.log($scope.settings.available);
    Advisor.update($rootScope.advisor_id,$scope.settings.available).success(function(data){
      console.log(data);
    });
  }
  /*$scope.settings = {
    enableFriends: true
  };*/
});
