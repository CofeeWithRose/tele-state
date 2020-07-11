var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useState, useMemo, useRef, useEffect } from 'react';
import { SharedState } from './shared.state';
var stateId = 0;
var useShared = function (sharedState) {
    var _a = useState(sharedState.value), _ = _a[0], setState = _a[1];
    var idRef = useRef(useMemo(function () { return stateId++; }, []));
    sharedState.setStateMap[idRef.current] = setState;
    useEffect(function () { return function () { delete sharedState.setStateMap[idRef.current]; }; }, []);
    var result = [sharedState.value, sharedState.dispatch];
    return result;
};
var createSharedReducer = function (reducer, initState) {
    var sharedState = new SharedState(initState, reducer);
    return {
        useSharedReducer: function () { return useShared(sharedState); },
        reset: function () { return sharedState.setState(initState); },
        apply: function (plugin) { return sharedState.apply(plugin); }
    };
};
var stateReducer = function (preState, action) {
    if (typeof action === 'function') {
        return action(preState);
    }
    else {
        return action;
    }
};
var createSharedState = function (initialState) {
    var _a = createSharedReducer(stateReducer, stateReducer(null, initialState)), useSharedReducer = _a.useSharedReducer, rest = __rest(_a, ["useSharedReducer"]);
    return __assign({ useSharedState: useSharedReducer }, rest);
};
export { createSharedReducer, createSharedState };
