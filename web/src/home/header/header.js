import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../home.actions';
import * as styles from './header.css';

export class HeaderComponent extends Component {
    compileCode() {
        return this.props.dispatch(actions.CompileCodeAction());
    }

    render() {
        return (
            <header className={styles.container}>
                <div className={styles.title}>sigulator.app</div>
                <div className={styles.options}>
                    <button
                        onClick={this.compileCode.bind(this)}
                        className={styles.button}
                        id="compile"
                    >
                        <div><i className="far fa-play" /></div>
                        <div>Compile</div>
                    </button>
                </div>
            </header>
        );
    }
}


// Wrap the component to inject dispatch and state into it
export const Header = connect(({ home }) => ({ ...home }))(HeaderComponent);
