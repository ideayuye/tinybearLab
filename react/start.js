
var createStore = require('redux').createStore;
// 'use strict';

// import { createStore } from 'redux';

var counter = (state ,action)=>{
	state = state||0;
	switch(action.type){
		case 'INCREMENT':
			return state +1;
		case 'DECREMENT':
			return state -1;
		default:
			return false;
	}
}

var store = createStore(counter);

store.subscribe(()=>{
	console.log(store.getState());
});


store.dispatch({type:'INCREMENT'});
store.dispatch({type:'INCREMENT'});
store.dispatch({type:'DECREMENT'});
