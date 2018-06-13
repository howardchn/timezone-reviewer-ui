export default class TestCase {
    constructor(name, testHandler) {
        this.name = name;
        this.testHandler = testHandler;
    }

    test(id) {
        return this.testHandler(id);
    }

    pass() {
        this.reset();
        this.status = 'Good';
    }

    ignore() {
        this.reset();
        this.status = 'Ignored';
    }

    error(err) {
        this.reset();
        this.status = 'Error';
        this.message = err;
    }

    reset() {
        this.message = '';
        this.status = '';
    }
}