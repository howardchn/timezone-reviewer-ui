import tzdb from './tzdb';
import tzdbLM from './tzdb-lm';
import tzdbDups from './tzdb-dups';
import _ from 'lodash';

function test(id) {
    checkJavaSupported(id)
        .then(check3Letters)
        .then(checkLMSupport)
        .then(finalCheck);
}

function checkJavaSupported(id) {
    console.log('java check', id);
    return new Promise((res, rej) => {
        if(_.isEmpty(id)) rej('empty id is not allowed.');
        let normalizedId = _.find(tzdb.ids, i => i.toUpperCase() === id.toUpperCase());

        if(_.isEmpty(normalizedId)) {
            rej(`${id} is not an available time zone ID in JAVA.`);
        }
        else {
            res(normalizedId);
        }
    });
}

function check3Letters(id) {
    console.log('3 letters check', id);
    return new Promise((res, rej) => {
        if(id.length === 3) rej('3 letters time zone id is obsoleted.') 
        else res(id);
    });
}

function checkLMSupport(id) {
    console.log('LM support check', id);
    return new Promise((res, rej) => {
        const existId = _.find(tzdbLM, i => i === id);
        if(_.isEmpty(existId)) {
            res(id);
        }
        else {
            rej(`${id} is supported in LM.`);
        }
    })
}

function finalCheck(id) {
    console.log(id);
}

test('America/Buenos_Aires');




