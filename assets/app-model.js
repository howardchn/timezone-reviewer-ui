import tzdb from './tzdb';
import tzdbLM from './tzdb-lm';
import _ from 'lodash';
import TestCase from './testcase';
import Utils from './utils';

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

    // return _.isEmpty(normalizedId) ? Utils.error(`${id} is not an available time zone ID in JAVA.`) : Utils.ok(normalizedId);
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
        return Utils.error(`${id} is supported in LM.`);
    }
}

const testCases = [];
testCases.push(new TestCase('Check time zone id is supported by JAVA', checkJavaSupported));
testCases.push(new TestCase('Check time zone id is obsoleted (3 letters)', check3Letters));
testCases.push(new TestCase('Check LM has already supported', checkLMSupport));

export default testCases;