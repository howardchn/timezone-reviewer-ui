export default {
    error: function(msg) {
        return {
            error: msg
        };
    },
    ok: function(msg) {
        return {
            result: msg
        };
    }
}