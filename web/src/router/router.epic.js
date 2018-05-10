import { combineEpics } from 'redux-observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { browserHistory } from 'react-router';

import * as methods from '../app.constants';
import * as actions from '../app.actions';

export const updateRouterLocation = action$ =>
    action$.ofType(methods.UPDATE_ROUTER_LOCATION)
        .map(({ newState }) => {
            browserHistory.push(`${newState}`);
            return actions.GotoSuccessAction();
        });

export const routerEpic = combineEpics(updateRouterLocation);
