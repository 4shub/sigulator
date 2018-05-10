import * as methods from '../app.constants';

export const InitializeWebGLAction = () => ({ type: methods.INITIALIZE_WEBGL });
export const InitializeWebGLSuccessAction = newState => ({ type: methods.INITIALIZE_WEBGL_SUCCESS, newState });
export const UpdateCodeAction = newState => ({ type: methods.UPDATE_CODE, newState });
export const CompileCodeAction = () => ({ type: methods.COMPILE_CODE });
export const CompileCodeSuccessAction = newState => ({ type: methods.COMPILE_CODE_SUCCESS, newState });
export const CompileCodeFailedAction = newState => ({ type: methods.COMPILE_CODE_FAIL, newState });
