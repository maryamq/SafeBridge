angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})


.factory('Feed', function() {

  var feeds = [{
    id: 0,
    name: '2436425645',
    lastText: 'You on your way?'
  }, {
    id: 1,
    name: '96743453',
    lastText: 'Hey, it\'s me'
  },{
    id: 2,
    name: '4575437567',
    lastText: 'Should I report this?'
  }, {
    id: 3,
    name: '08809362',
    lastText: 'Need help ASAP'
  }, {
    id: 4,
    name: '432795677984',
    lastText: 'I am scared!'
  }];

  return {
    all: function() {
      return feeds;
    },
    remove: function(feed) {
      feeds.splice(feeds.indexOf(feed), 1);
    },
    get: function(feedId) {
      for (var i = 0; i < feeds.length; i++) {
        if (feeds[i].id === parseInt(feedId)) {
          return feeds[i];
        }
      }
      return null;
    }
  };

})

.factory('Organization',['$http','PARSE_CREDENTIALS',function($http,PARSE_CREDENTIALS){
    return {
        getAll:function(){
            return $http.get('https://api.parse.com/1/classes/Todo',{
                headers:{
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                }
            });
        },
        get:function(id){
            return $http.get('https://api.parse.com/1/classes/Todo/'+id,{
                headers:{
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                }
            });
        },
        create:function(data){
            return $http.post('https://api.parse.com/1/classes/Todo',data,{
                headers:{
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                    'Content-Type':'application/json'
                }
            });
        },
        edit:function(id,data){
            return $http.put('https://api.parse.com/1/classes/Todo/'+id,data,{
                headers:{
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                    'Content-Type':'application/json'
                }
            });
        },
        delete:function(id){
            return $http.delete('https://api.parse.com/1/classes/Todo/'+id,{
                headers:{
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                    'Content-Type':'application/json'
                }
            });
        }
    }
}])


.factory('Login',['$http','PARSE_CREDENTIALS',function($http,PARSE_CREDENTIALS){
    return {
        
        get:function(username, password){
            return $http.get('https://api.parse.com/1/classes/advisor?where={"user_name":"'+username+'","password":"'+password+'"}', {
                headers:{
                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
                }
            });
        }
    }
}])

.factory('Conversations',['$http',function($http){
    return {
        
        get:function(){
            return $http.get('http://ec2-52-2-162-93.compute-1.amazonaws.com:3000/api/v1/getAllNewConversation', {
                
            });
        },
        claim:function(a,b){
            return $http.get('http://ec2-52-2-162-93.compute-1.amazonaws.com:3000/api/v1/claimConversation/'+a+'/'+b, {
                
            });
        },
        getForSession:function(session_id){
            return $http.get('http://ec2-52-2-162-93.compute-1.amazonaws.com:3000/api/v1/getConversation/'+session_id, {
                
            });
        },
        postMessage:function(data){
            return $http.post('http://ec2-52-2-162-93.compute-1.amazonaws.com:3000/api/v1/sendMessage', data, {
                
            });
        },
        unique:function(advisor){
            return $http.get('http://ec2-52-2-162-93.compute-1.amazonaws.com:3000/api/v1/getUniqueConversation/'+advisor, {
                
            });
        },
        remove:function(session){
            return $http.get('http://ec2-52-2-162-93.compute-1.amazonaws.com:3000/api/v1/endConversation/'+session, {
                
            });
        }
    }
}])

.factory('Advisor',['$http',function($http){
    return {
        
        get:function(a){
            return $http.get('http://ec2-52-2-162-93.compute-1.amazonaws.com:3000/api/v1/getAdvisor/'+a, {
                
            });
        },
        update:function(a,b){
            return $http.get('http://ec2-52-2-162-93.compute-1.amazonaws.com:3000/api/v1/updateAdvisorAvailability/'+a+'/'+b, {
                
            });
        }
      }
}])

.value('PARSE_CREDENTIALS',{
    APP_ID: 'EskNAzWggrRsCs2y0BFSEGUoHoNhzOASNFfqGVi9',
    REST_API_KEY:'LbFAPoN4fjk6EFTKyWrWslUXuivRNGxZpLj1pt5E'
});