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
        let trClass = 'd-flex ';
        switch (this.state.testInfo.status) {
            case 'Good':
                trClass += 'table-success';
                break;
            case 'Error':
                trClass += 'table-danger';
                break;
            case 'Ignored':
                trClass += 'table-active';
                break;
            default:
                break;
        }

        return (
            <tr className={trClass}>
                <td className="col col-sm-1">{this.props.id + 1}</td>
                <td className="col col-sm-4">{this.props.testInfo.name}</td>
                <td className="col col-sm-2">{this.state.testInfo.status || "--"}</td>
                <td className="col col-sm-5" dangerouslySetInnerHTML={{__html: this.state.testInfo.message}}></td>
            </tr>
        );
    }
}

const TopsPanel = () => {
    return (
    <article>
        <header><h4>Some extra info to help manually checks before adding to GCC</h4></header>
        <ul>
            <li>This tool is created based on <a href="https://confluence.logicmonitor.com/display/DEV/Extend+Time+Zone+List+Guide+and+Checklist" target="_blank">this checklist</a> on confluence.</li>
            <li>Common time zone supported by <a href="https://cloud.google.com/dataprep/docs/html/Supported-Time-Zone-Values_66194188" target="_blank">Google</a> or <a href="https://docs.microsoft.com/en-us/windows-hardware/manufacture/desktop/default-time-zones" target="_blank">Bing</a>.</li>
            <li>Time zone extending list only allows to add new time zones; removing time zone will have risky; please consider more.</li>
            <li>Create review GCC review is necessary.</li>
        </ul>
    </article>);
};

class ResultPanel extends React.Component {
    constructor(props) {
        super();
        this.state = { success: props.success, tzid: props.tzid };
    }

    render() {
        let className = 'invisible';
        let message = '';
        let hideTips = true;
        if(this.props.success === 'success') {
            className = 'alert alert-success';
            message = (<div>Basic tests passed. <a href={ 'http://www.timezoneconverter.com/cgi-bin/zoneinfo?tz=' + this.props.tzid } target="_blank">{ this.props.tzid }</a> is available to add. 
            But one more thing to check is that the time zone is popular.</div>)
            hideTips = false;
        } else if(this.props.success === 'failed') {
            className = 'alert alert-danger';
            message  = 'Failed. Check the reasons in the list.';
        } 

        return (
            <div>
                <div className={className}>{message}</div>
                { !hideTips && <TopsPanel /> }
            </div>
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
        let tzid = this.state.tzid;
        let ignored = false;
        for (let item of testCases) {
            item.reset();
            if (ignored) {
                item.ignore();
                continue;
            }

            let r = item.test(tzid);
            if (r.error) {
                item.error(r.error);
                ignored = true;
            } else {
                item.pass();
                tzid = r.result;
            }
        }

        let success = !!!ignored ? 'success' : 'failed';
        this.setState({ strategies: testCases, success, tzid });
    }

    render() {
        let tableRows = this.state.strategies.map((strategy, i) => {
            return (<Question key={i + 1} id={i} testInfo={strategy} />)
        });
        return (
            <div style={{"marginTop":"10px"}}>
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
                <ResultPanel success={this.state.success} tzid={this.state.tzid} />
            </div>
        );
    }
}

ReactDOM.render(<App tzid="Asia/Shanghai" />, document.querySelector('div'));



