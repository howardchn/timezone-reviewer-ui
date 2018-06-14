import tzdb from './tzdb';
import tzdbLM from './tzdb-lm';
import tzdbDups from './tzdb-dups';
import _ from 'lodash';
import TestCase from './testcase';
import Utils from './utils';
import moment from 'moment-timezone';

function highlight(id) {
    return `<b>${id}</b>`;
}

function checkJavaSupported(id) {
    if (_.isEmpty(id)) {
        return Utils.error('Empty id is not allowed.');
    };

    let normalizedId = _.find(tzdb.ids, i => i.toUpperCase() === id.toUpperCase());
    if (_.isEmpty(normalizedId)) {
        return Utils.error(`${id} is not an available time zone ID in JAVA.`);
    } else {
        return Utils.ok(normalizedId);
    }
}

function check3Letters(id) {
    if (id.length === 3) {
        return Utils.error('3 letters time zone id is obsoleted.');
    } else {
        return Utils.ok(id);
    }
}

function checkLMSupport(id) {
    const existId = _.find(tzdbLM, i => i === id);
    if (_.isEmpty(existId)) {
        return Utils.ok(id);
    } else {
        return Utils.error(`${highlight(id)} is supported in LM.`);
    }
}

function checkUISupported(id) {
    try {
        let newId = moment.tz.zone(id).name;
        if(_.isEqual(id, newId)) {
            return Utils.ok(id);
        } else {
            return Utils.error(`${id} is not supported by UI.`);
        }
    } catch(e) {
        return Utils.error(`${id} is not supported by UI.`);
    }
}

function checkTZDups(id) {
    let equavantIds = _.find(tzdbDups, ids => _.includes(ids, id));
    let hasDup = _.some(equavantIds, id => _.includes(equavantIds, id));
    if(hasDup) {
        return Utils.error(`Some time zones have the same rule to ${id}. Check ${equavantIds.filter(i => i !== id).join(', ')}.`);
    } else {
        return Utils.ok(id);
    }
}

const testCases = [];
testCases.push(new TestCase('Check time zone id is supported by JAVA', checkJavaSupported));
testCases.push(new TestCase('Check time zone id is supported by UI', checkUISupported));
testCases.push(new TestCase('Check time zone id is obsoleted (3 letters)', check3Letters));
testCases.push(new TestCase('Check LM has already supported', checkLMSupport));
testCases.push(new TestCase('Check time zone is duplicated by same rules', checkTZDups));

export default testCases;