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
        let trClass = '';
        switch (this.state.testInfo.status) {
            case 'Good':
                trClass = 'table-success';
                break;
            case 'Error':
                trClass = 'table-danger';
                break;
            case 'Ignored':
                trClass = 'table-active';
                break;
            default:
                break;
        }

        return (
            <tr className={trClass}>
                <td>{this.props.id + 1}</td>
                <td>{this.props.testInfo.name}</td>
                <td>{this.state.testInfo.status || "--"}</td>
                <td dangerouslySetInnerHTML={{__html: this.state.testInfo.message}}></td>
            </tr>
        );
    }
}

class ResultPanel extends React.Component {
    constructor(props) {
        super();
        this.state = { success: props.success };
    }

    render() {
        let className = 'invisible';
        let message = '';
        if(this.props.success === 'success') {
            className = 'alert alert-success';
            message = `Basic tests passed. ${this.props.tzid} is available to add. 
            But one more thing to check is that the time zone is popular.`
        } else if(this.props.success === 'failed') {
            className = 'alert alert-danger';
            message  = 'Failed. Check the reasons in the list.';
        } 


        return (
            <div className={className}>{message}</div>
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

        let success = !!!ignored ? 'success' : 'failed';
        this.setState({ strategies: testCases, success });
    }

    render() {
        let tableRows = this.state.strategies.map((strategy, i) => {
            return (<Question key={i + 1} id={i} testInfo={strategy} />)
        });
        return (
            <div style={{"margin-top":"10px"}}>
                <h1>Should We Support This TIME ZONE?</h1>
                <p>
                    New time zones should be strictly reviewed. We must make sure the time zones are supported by backend and front end, and no duplicated id or maybe duplicate rules.
                </p>
                <div className = "form-inline">
                    <div className="form-group">
                        <input className="form-control" placeholder="Input Time Zone ID" defaultValue={this.state.tzid} onChange={this.timeZoneChanged} />
                    </div>
                    <button style={{"marginLeft":"5px"}} className="btn btn-success" onClick={this.testTimeZones}>Test</button>
                </div>
                <table className="table" style={{"marginTop": "5px"}}>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
                <ResultPanel success={this.state.success} tzid={this.props.tzid} />
            </div>
        );
    }
}

ReactDOM.render(<App tzid="Asia/Shanghai" />, document.querySelector('div'));



