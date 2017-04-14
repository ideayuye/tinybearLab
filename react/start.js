'use strict';
var createStore = require('redux').createStore;

var counter = (state, action) => {
	state = state || 0;
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		case 'DECREMENT':
			return state - 1;
		default:
			return false;
	}
}

var store = createStore(counter);

store.subscribe(() => {
	console.log(store.getState());
});


store.dispatch({
	type: 'INCREMENT'
});
store.dispatch({
	type: 'INCREMENT'
});
store.dispatch({
	type: 'DECREMENT'
});


var {
	createAction,
	handleActions
} = require('redux-actions');

var increment = createAction('TEST');
const reducer = handleActions({
	[increment]: (state, action) => {
		console.log(state);
		return {
			counter: state.counter + 1
		}
	}
}, {
	counter: 1
});

var store1 = createStore(reducer);
store1.dispatch(increment(11));
store1.dispatch(increment(11));
