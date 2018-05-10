import { combineEpics } from 'redux-observable';
import { homeEpic } from './home/home.epic';
import { routerEpic } from './router/router.epic';

const epic = combineEpics(
    homeEpic,
    routerEpic,
);

export default epic;
