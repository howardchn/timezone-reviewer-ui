import tzdb from './tzdb';
import tzdbLM from './tzdb-lm';
import _ from 'lodash';

function checkJavaSupported(id) {
    if (_.isEmpty(id)) {
        return {
            error: 'empty id is not allowed.'
        };
    };
    let normalizedId = _.find(tzdb.ids, i => i.toUpperCase() === id.toUpperCase());

    if (_.isEmpty(normalizedId)) {
        return {
            error: `${id} is not an available time zone ID in JAVA.`
        };
    } else {
        return {
            result: normalizedId
        };
    }
}

function check3Letters(id) {
    if (id.length === 3) {
        return {
            error: '3 letters time zone id is obsoleted.'
        };
    } else {
        return {
            result: id
        };
    }
}

function checkLMSupport(id) {
    const existId = _.find(tzdbLM, i => i === id);
    if (_.isEmpty(existId)) {
        return {
            result: id
        };
    } else {
        return {
            error: `${id} is supported in LM.`
        };
    }
}

const checkSteps = [{
        name: 'Test time zone id is supported by JAVA',
        result: '',
        status: '',
        test: checkJavaSupported
    },
    {
        name: 'Check time zone id is obsoleted (3 letters)',
        result: '',
        status: '',
        test: check3Letters
    },
    {
        name: 'Check LM support',
        result: '',
        status: '',
        test: checkLMSupport
    }
];

export default checkSteps;