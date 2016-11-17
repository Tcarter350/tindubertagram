"use strict";function Router(e,t){e.state("register",{url:"/register",controller:"RegisterController as register"}).state("login",{url:"/login",templateUrl:"/templates/login.html",controller:"LoginController as login"}).state("usersIndex",{url:"/",templateUrl:"/templates/home.html"}),t.otherwise("/")}function Auth(e){e.loginUrl="/login",e.signupUrl="/register",e.tokenPrefix=""}function RegisterController(e,t,o){function n(){e.signup(r.user).then(function(e){o.localStorage.setItem("token",e.data.token),t.go("usersIndex")})}var r=this;r.user={},r.submit=n}function LoginController(e,t){function o(){e.login(r.credentials).then(function(){console.log("We would go to the feed now!"),t.go("usersIndex")})}function n(t){e.authenticate(t).then(function(e){console.log(e)})}var r=this;r.credentials={},r.isActive=!1,r.submit=o,r.authenticate=n}function MainController(e,t,o){function n(){e.logout().then(function(){console.log("main controller logout")})}function r(o,n){l.message=null,!e.isAuthenticated&&i.includes(n.name)&&(o.preventDefault(),t.go("login"),l.message="You must be logged in to go there!")}var l=this;l.isLoggedIn=e.isAuthenticated,l.message=null;var i=["usersEdit","usersNew"];o.$on("$stateChangeStart",r),l.logout=n}function toggle(){return{restrict:"E",replace:!0,templateUrl:"templates/toggle.html",scope:{isActive:"="},link:function(e,t){t.on("click",function(){e.isActive=!e.isActive,e.$apply()})}}}function User(e){return new e("/users/:id",{id:"@_id"},{update:{method:"PUT"}})}angular.module("travelApp",["ngResource","ui.router","satellizer"]).config(Router).config(Auth),Router.$inject=["$stateProvider","$urlRouterProvider"],Auth.$inject=["$authProvider"],angular.module("travelApp").controller("RegisterController",RegisterController).controller("LoginController",LoginController),RegisterController.$inject=["$auth","$state","$window"],LoginController.$inject=["$auth","$state"],angular.module("travelApp").controller("MainController",MainController),MainController.$inject=["$auth","$state","$rootScope"],angular.module("travelApp").directive("toggle",toggle),angular.module("travelApp").factory("User",User);
//# sourceMappingURL=app.js.map
