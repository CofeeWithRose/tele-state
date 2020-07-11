var SharedState = /** @class */ (function () {
    function SharedState(value, reducer) {
        this.value = value;
        this.reducer = reducer;
        this.setStateMap = {};
        this.updatePlugins = [];
    }
    SharedState.prototype.dispatch = function (action) {
        var preValue = this.value;
        this.value = this.reducer(this.value, action);
        this.handleUpdate(preValue, this.value);
    };
    SharedState.prototype.setState = function (value) {
        var preValue = this.value;
        this.value = value;
        this.handleUpdate(preValue, this.value);
    };
    SharedState.prototype.apply = function (plugin) {
        this.updatePlugins.push(plugin);
    };
    SharedState.prototype.handleUpdate = function (pre, newS) {
        this.handlePlugin(pre, newS);
        Object.values(this.setStateMap).forEach(function (setState) { return setState(newS); });
    };
    SharedState.prototype.handlePlugin = function (pre, newS) {
        for (var i = 0; i < this.updatePlugins.length; i++) {
            try {
                this.updatePlugins[i](newS, pre);
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    return SharedState;
}());
export { SharedState };
