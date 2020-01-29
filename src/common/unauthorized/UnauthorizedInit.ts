import { UnauthorizedStateName } from './UnauthorizedErrorPage';

function initUnauthorizedErrorPage(
    $rootScope: ng.IRootScopeService,
    $state: ng.ui.IStateService,
    pipAuthState: pip.rest.IAuthStateService,
    pipSession: pip.services.ISessionService
) {
    "ngInject";

    $rootScope.$on(pip.rest.AccessDenyRedirect, unauthorizedRedirect);

    function unauthorizedRedirect() {
        if (!pipSession.isOpened()) {
            $state.go(pipAuthState.signinState());

            return;
        }
        $state.go(UnauthorizedStateName);
    }
}


angular
    .module('pipErrors.Unauthorized')
    .run(initUnauthorizedErrorPage);