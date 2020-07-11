var TeleState = /** @class */ (function () {
    function TeleState(value, reducer) {
        var _this = this;
        this.value = value;
        this.reducer = reducer;
        this.setStateMap = {};
        this.updatePlugins = [];
        this.dispatch = function (action) {
            var preValue = _this.value;
            _this.value = _this.reducer(_this.value, action);
            _this.handleUpdate(preValue, _this.value);
        };
        this.setState = function (value) {
            var preValue = _this.value;
            _this.value = value;
            _this.handleUpdate(preValue, _this.value);
        };
        this.apply = function (plugin) {
            _this.updatePlugins.push(plugin);
        };
    }
    TeleState.prototype.handleUpdate = function (pre, newS) {
        this.handlePlugin(pre, newS);
        Object.values(this.setStateMap).forEach(function (setState) { return setState(newS); });
    };
    TeleState.prototype.handlePlugin = function (pre, newS) {
        for (var i = 0; i < this.updatePlugins.length; i++) {
            try {
                this.updatePlugins[i](newS, pre);
            }
            catch (e) {
                console.error(e);
            }
        }
    };
    return TeleState;
}());
export { TeleState };
