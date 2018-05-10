import { combineEpics } from 'redux-observable';
import 'rxjs';
import * as methods from '../app.constants';
import * as actions from '../app.actions';
import { translateCode } from '../app.helpers';
import { WebGL } from '../services/webgl.service';

export const initializeWebGL = action$ =>
    action$.ofType(methods.INITIALIZE_WEBGL)
        .map(() => {
            const webgl = new WebGL();
            webgl.render();
            return webgl;
        })
        .map(webgl => actions.InitializeWebGLSuccessAction(webgl));


export const parseCode = (action$, { getState }) =>
    action$.ofType(methods.COMPILE_CODE)
        .map(() => getState().home.code)
        .map(code => translateCode(code))
        .map((parsedCode) => {
            try {
                document.getElementById('console-entry').innerText = '';
                getState().home.webgl.apply(parsedCode);
                getState().home.webgl.render();
            } catch (error) {
                console.log(parsedCode, error);
                return actions.CompileCodeFailedAction(error.toString());
            }

            return actions.CompileCodeSuccessAction(parsedCode);
        });

export const homeEpic = combineEpics(
    parseCode,
    initializeWebGL,
);
