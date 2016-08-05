
var combineReducers = require('redux').combineReducers;
var process = require('./process');
var control = require('./mapControl');

var reducers = combineReducers({
    draw:process,
    control:control
});

module.exports = reducers;
