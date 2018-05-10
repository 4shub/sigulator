import * as methods from '../app.constants';

const initialState = {
    code: `

SnMyNode* c = new SnMyNode;
c->init.set(0, 0, 0);
c->width = 1;
c->height = 1;
c->color(GsColor::random());
rootg()->add(c);
    
render();
    `,
    parsedCode: '',
    console: '',
};

export function homeReducer(state = initialState, action) {
    switch (action.type) {
    case methods.INITIALIZE_WEBGL_SUCCESS:
        return {
            ...state,
            webgl: action.newState,
        };

    case methods.UPDATE_CODE:
        return {
            ...state,
            code: action.newState,
        };

    case methods.COMPILE_CODE_SUCCESS:
        return {
            ...state,
            console: '',
            parsedCode: action.newState,
        };

    case methods.COMPILE_CODE_FAIL:
        return {
            ...state,
            console: action.newState,
        };

    default:
        return state;
    }
}
