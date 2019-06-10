(function () {
    angular
        .module('indicadoresoeeapp')
        .service('ModalService', ModalService);

    ModalService.$inject = ['$mdDialog', '$rootScope'];

    function ModalService($mdDialog, $rootScope) {

        return {
            hideWait: hideWait,
            showWait: showWait
        };

        function hideWait() {
            setTimeout(function () {
                $rootScope.$emit("hide_wait");
            }, 5);
        }

        function showWait() {
            $mdDialog.show({
                controller: 'waitCtrl',
                template:
                    '<md-dialog id="plz_wait" style="background-color:transparent;box-shadow:none; overflow: hidden">' +
                        '<div layout="row" layout-sm="column" layout-align="center center" aria-label="wait">' +
                            '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
                        '</div>' +
                    '</md-dialog>',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                fullscreen: false
            });
        }

    }

    angular
        .module('indicadoresoeeapp')
        .controller('waitCtrl', waitCtrl);
    waitCtrl.$inject = ['$mdDialog', '$rootScope'];

    function waitCtrl($mdDialog, $rootScope) {
        var vm = this;
        
        $rootScope.$on("hide_wait", function (event, args) {
            $mdDialog.cancel();
        });
    }
})();