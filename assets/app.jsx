import _ from 'lodash';
import testStrategies from './models';
import React from 'react';
import ReactDOM from 'react-dom';

class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = _.extend({}, props);
    }
    render() {
        return (
            <tr>
                <td>{this.props.id + 1}</td>
                <td>{this.props.testInfo.name}</td>
                <td>{this.state.testInfo.status || "NOT STARTED"}</td>
                <td>{this.props.testInfo.message}</td>
            </tr>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { strategies: testStrategies, tzid: props.tzid };
        this.changeState = this.changeState.bind(this);
        this.timeZoneIdChanged = this.timeZoneIdChanged.bind(this);
    }

    timeZoneIdChanged(e) {
        this.state.tzid = e.target.value;
    }

    changeState() {
        let timeZoneId = this.state.tzid;
        let ignored = false;
        for(let item of this.state.strategies) {
            if(ignored) {
                item.status = 'IGNORED';
                continue;
            }

            let r = item.test(timeZoneId);
            if(r.error) {
                item.status = 'Error';
                item.message = r.error;
                ignored = true;
                continue;
            } else {
                item.status = 'GOOD';
                timeZoneId = r.result;
            }
        }

        this.setState({ strategies: this.state.strategies });
    }

    render() {
        let tableRows = testStrategies.map((strategy, i) => {
            return (<Question key={i + 1} id={i} testInfo={strategy} />)
        });
        return (
            <div>
            <input defaultValue={this.state.tzid} onChange={this.timeZoneIdChanged} />
            <table>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
            <button onClick={this.changeState}>Test</button>
            </div>
        );
    }
}

ReactDOM.render(<App tzid="Asia/Shanghai" />, document.querySelector('div'));



