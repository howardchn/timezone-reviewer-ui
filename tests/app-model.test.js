import testCases from '../assets/app-model';

function expectError(r) {
    expect(r).not.toBeNull();
    expect(r.error).not.toBeNull();
    expect(r.error.length).not.toBe(0);
}

function expectId(r, id) {
    expect(r.result).toBe(id);
}

function evalTest(i, parameter) {
    let test = testCases[i];
    return test.test(parameter);
}

describe('Check time zone id is supported by JAVA', () => {
    test('Null param test', () => {
        let r = evalTest(0);
        expectError(r);
    });
    test('Java not support test', () => {
        let r = evalTest(0, 'dddd');
        expectError(r);
    });
    test('Java support test 1', () => {
        let r = evalTest(0, 'Asia/Shanghai');
        expectId(r, 'Asia/Shanghai');
    });
    test('Java support test 2', () => {
        let r = evalTest(0, 'ameriCa/LOS_angeles');
        expectId(r, 'America/Los_Angeles');
    });
    test('Java support test 3', () => {
        let r = evalTest(0, 'asia/shanghai');
        expectId(r, 'Asia/Shanghai');
    });
});

describe('UI must support', () => {
    test('UI does support test', () => {
        let r = evalTest(1, 'Asia/Shanghai');
        expectId(r, 'Asia/Shanghai');
    });
    test('UI does not support test 1', () => {
        let r = evalTest(1, 'PNT');
        expectError(r);
    });
    test('UI does not support test 2', () => {
        let r = evalTest(1, 'ABC');
        expectError(r);
    });
});

describe('Three letters time zone id is obsoleted', () => {
    test('PNT is obsolted', () => {
        let r = evalTest(2, 'PNT');
        expectError(r);
    });
    test('Check not obsoleted', () => {
        let r = evalTest(2, 'Asia/Shanghai');
        expectId(r, 'Asia/Shanghai');
    });
});

describe('Not be LM supported', () => {
    test('LM supported should be failed', () => {
        let r = evalTest(3, 'Asia/Shanghai');
        expectError(r);
    });
    test('LM not supported should be fine', () => {
        let id = 'America/Atikokan';
        let r = evalTest(3, id);
        expectId(r, id);
    });
});

describe('Not be LM supported as the same rule', () => {
    test('Not duplicated test', () => {
        let id = 'America/Atikokan';
        let r = evalTest(4, id);
        expectId(r, id);
    });
    test('Duplicated test', () => {
        let r = evalTest(4, 'Asia/Shanghai');
        expectError(r);
    });
    test('Duplicated rule test', () => {
        let r = evalTest(4, 'Asia/Chongqing');
        expectError(r);
    });
});
