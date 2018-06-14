import _ from 'lodash';
import testCases from './app-model';
import React from 'react';
import ReactDOM from 'react-dom';
import {} from 'bootstrap/dist/css/bootstrap.min.css';

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
                <td>{this.state.testInfo.status || "--"}</td>
                <td>{this.props.testInfo.message}</td>
            </tr>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { strategies: testCases, tzid: props.tzid };
        this.testTimeZones = this.testTimeZones.bind(this);
        this.timeZoneChanged = this.timeZoneChanged.bind(this);
    }

    timeZoneChanged(e) {
        this.state.tzid = e.target.value;
    }

    testTimeZones() {
        let timeZoneId = this.state.tzid;
        let ignored = false;
        for (let item of testCases) {
            item.reset();
            if (ignored) {
                item.ignore();
                continue;
            }

            let r = item.test(timeZoneId);
            if (r.error) {
                item.error(r.error);
                ignored = true;
            } else {
                item.pass();
                timeZoneId = r.result;
            }
        }

        this.setState({ strategies: testCases });
    }

    render() {
        let tableRows = this.state.strategies.map((strategy, i) => {
            return (<Question key={i + 1} id={i} testInfo={strategy} />)
        });
        return (
            <div>
                <input defaultValue={this.state.tzid} onChange={this.timeZoneChanged} />
                <table>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
                <button onClick={this.testTimeZones}>Test</button>
            </div>
        );
    }
}

ReactDOM.render(<App tzid="Asia/Shanghai" />, document.querySelector('div'));



