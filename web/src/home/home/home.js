import React, { Component } from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';

import 'brace/mode/c_cpp';
import 'brace/theme/monokai';

import * as styles from './home.css';
import * as actions from '../home.actions';

import { Header } from '../header/header';

// const sampleCode = `
// SnMyNode* c = new SnMyNode;
// c->init.set(1, 1, 0);
// c->width = 25;
// c->height = 25;
// c->color(GsColor::random());
// rootg()->add(c);
// `;

export class HomeComponent extends Component {
    componentDidMount() {
        const { offsetHeight, offsetWidth } = document.getElementById('canvas_container');
        document.getElementById('canvas').width = offsetWidth;
        document.getElementById('canvas').height = offsetHeight;
        this.props.dispatch(actions.InitializeWebGLAction());
        // const web = new WebGL();
        // const code = `
        //     this.drawTriangle(
        //         { x: 0, y: 0, z: 0 },
        //         { x: 1, y: 0, z: 0 },
        //         { x: 1, y: 1, z: 1 },
        //     );
        // `;
        //
        // web.apply(code);
        // web.render();
    }

    updateCode(code) {
        this.props.dispatch(actions.UpdateCodeAction(code));
    }

    render() {
        const { code, console } = this.props;

        return (
            <div className={styles.container}>
                <Header />
                <article className={styles.content}>
                    <div className={styles.code_container}>
                        <div className={styles.console_header}>C++ (sig)</div>
                        <AceEditor
                            mode="c_cpp"
                            theme="monokai"
                            onChange={this.updateCode.bind(this)}
                            value={code}
                            name="console"
                            width={window.innerWidth / 2}
                            height={window.innerHeight - 50}
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: false,
                                showLineNumbers: true,
                                tabSize: 4,
                            }}
                        />,
                    </div>
                    <div className={styles.simulator}>
                        <div id="canvas_container" className={styles.webgl}>
                            <canvas id="canvas" className={styles.canvas} />
                        </div>
                        <div className={styles.console}>
                            <div className={styles.console_header}>Console</div>
                            <div className={styles.console_entry} id="console-entry">
                                {console}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );
    }
}


// Wrap the component to inject dispatch and state into it
export const Home = connect(({ home }) => ({ ...home }))(HomeComponent);
