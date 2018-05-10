import React, { Component } from 'react';
import thunk from 'redux-thunk';
import * as ReactRouter from 'react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { Provider } from 'react-redux';

import { Home } from '../home/home/home';
import reducer from '../app.reducer';
import epic from '../app.epic';
import * as actions from '../app.actions';

const { Router: RouterContainer, Route, browserHistory } = ReactRouter;
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */
const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(createEpicMiddleware(epic), thunk)),
);

export class Router extends Component {
    componentWillMount() {
        store.dispatch(actions.InitializeAppAction());
    }

    render() {
        return (
            <Provider store={store}>
                <RouterContainer history={browserHistory}>
                    <Route path="/" component={Home} />
                </RouterContainer>
            </Provider>
        );
    }
}
