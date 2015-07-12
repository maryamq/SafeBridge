angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Feed, $rootScope) {

  console.log($rootScope.org_id);
  $scope.feeds = Feed.all();
  $scope.remove = function(feed) {
    Feed.remove(feed);
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
       $rootScope.advisor_id = data.results[0].objectId;
       $rootScope.org_id = data.results[0].org_id;
       window.location = "#/tab/dash";
    });
    
  }

})

.controller('AddCtrl', function($scope) {

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
