(function () {
    'use strict';

    angular
        .module('indicadoresoeeapp')
        .constant('SERVERS', { DEVELOPMENT: "http://localhost:8080/app", PRODUCTION: "http://myDomain.com/app" });
})();