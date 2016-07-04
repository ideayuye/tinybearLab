

var React = require('react')
var reactDom = require("react-dom");
var HI = require('./HI');
import {Provider} from 'react-redux';
import {createStore} from 'redux';
var reducers = require('./reduers');

let store = createStore(reducers);

store.subscribe(()=>{
	console.log(store.getState());
});

reactDom.render(
	<Provider store={store} >
		<HI />
	</Provider>,
	document.getElementById('container'));

