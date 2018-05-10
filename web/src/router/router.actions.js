import * as methods from '../app.constants';

export function InitializeAppAction() {
    return { type: methods.INITIALIZE_APP };
}

export function GotoAction(newState) {
    return { type: methods.UPDATE_ROUTER_LOCATION, newState };
}

export function GotoSuccessAction(newState) {
    return { type: methods.UPDATE_ROUTER_LOCATION_SUCCESS, newState };
}

export function RedirectUserSuccessAction(newState) {
    return { type: methods.REDIRECT_USER_SUCCESS, newState };
}
