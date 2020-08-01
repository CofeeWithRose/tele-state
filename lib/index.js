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
import { TeleState } from './tele-state';
var stateId = 0;
var useTele = function (teleState) {
    var _a = useState(teleState.value), setState = _a[1];
    var idRef = useRef(useMemo(function () { return stateId++; }, []));
    teleState.setStateMap[idRef.current] = [teleState.value, setState];
    useEffect(function () { return function () {
        delete teleState.setStateMap[idRef.current];
    }; }, []);
    var result = [teleState.value, teleState.dispatch];
    return result;
};
export var createTeleReducers = function (reducers, initState) {
    var reducer = function (preState, action) {
        return reducers[action.type](preState, action.payLoad);
    };
    return createTeleReducer(reducer, initState);
};
var createTeleReducer = function (reducer, initState) {
    var teleState = new TeleState(initState, reducer);
    return {
        useTeleReducer: function () { return useTele(teleState); },
        reset: function () { return teleState.setState(initState); },
        apply: teleState.apply,
        dispatch: teleState.dispatch
    };
};
var stateReducer = function (preState, action) { return typeof action === 'function' ? action(preState) : action; };
var createTeleState = function (initialState) {
    var _a = createTeleReducer(stateReducer, stateReducer(null, initialState)), useTeleReducer = _a.useTeleReducer, rest = __rest(_a, ["useTeleReducer"]);
    return __assign({ useTeleState: useTeleReducer }, rest);
};
export { createTeleReducer, createTeleState };
