'use strict';

var passwordPolicyMinLength = 5;

angular.module('stormpathIdpApp')
  .directive('passwordPolicyValidation', function (Stormpath) {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        scope.errors = {
          minLength: false,
          maxLength: false,
          requireLowerCase: false,
          requireUpperCase: false,
          requireNumeric: false,
          requireDiacritical: false
        };
        scope.errorCount = function(){
          return Object.keys(scope.errors).filter(function(k){
            return scope.errors[k];
          }).length;
        };
        scope.validate = function(element){
          scope.clearErrors();
          var v = element.val();

          var tests =  [
            ['minLength' , function(){return v.length < passwordPolicyMinLength;}],
            ['maxLength' , function(){ return v.length > Stormpath.idSiteModel.passwordPolicy.maxLength;}],
            ['requireLowerCase' , function(){ return Stormpath.idSiteModel.passwordPolicy.requireLowerCase && !(/[a-z]/).test(v);}],
            ['requireUpperCase' , function(){ return Stormpath.idSiteModel.passwordPolicy.requireUpperCase && !(/[A-Z]/).test(v);}],
            ['requireNumeric' , function(){ return Stormpath.idSiteModel.passwordPolicy.requireNumeric && !(/[0-9]/).test(v);}],
            ['requireDiversity' , function(){ 
            	var matchCount = 0;
            	if ((/[A-Z]/).test(v)) {
            		matchCount++;
            	}
            	if ((/[0-9]/).test(v)) {
            		matchCount++;
            	}
            	if ((/[^a-zA-Z0-9 ]/).test(v)) {
            		matchCount++;
            	}
            	return matchCount<2;
            	}],
            ['wordPassword' , function(){ return v.toLowerCase().indexOf("password") > -1;}],
            ['wordEquilar' , function(){ return v.toLowerCase().indexOf("equilar") > -1;}],
            ['requireDiacritical' , function(){ return Stormpath.idSiteModel.passwordPolicy.requireDiacritical && !(/[\u00C0-\u017F]/).test(v);}]
          ];

          for(var i=0;i<tests.length;i++){
            scope.errors[tests[i][0]] = tests[i][1](v);
            if(scope.errorCount()>0){
              break;
            }
          }

          scope.validationError = scope.errorCount() > 0 ;
          return scope.validationError;
        };
      }
    };
  });
