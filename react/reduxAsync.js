
const {createStore,applyMiddleware,combineReducers} = require('redux')
const thunk = require('redux-thunk').default
const {createAction,createActions,handleActions,combineActions} = require('redux-actions')

const reducer = function(state={},action){
    switch(action.type){
        case 't_1':
            console.log('t1');
            return state;
        case 't_2':
            console.log('t2'); 
            return state;
        case 't_3':
            console.log('t3');
            return state;
        default:
            return state;
   }
}

let ps = function(){
    return new Promise((resolve,reject)=>{
        setTimeout(function() {
            resolve();
        }, 1000);
    })
}

let delay = function(){
    return function(dispatch,getState){
        dispatch({type:'t_1',payload:1})
        ps().then(()=>{
            dispatch({type:'t_2',payload:2});
        },()=>{
            dispatch({type:'t_3',payload:2});
        })
    }
}


const {blue1,blue2,async} =  createActions({
    blue1:()=>{},
    blue2:()=>{},
    // async:()=>{
    //     return function(dispatch,getState){
    //         ps().then(()=>{
    //             blue1();
    //         },()=>{
    //             blue2();
    //         })
    //     }
    // }
});

let reducer1 = handleActions({
    [blue1]:(state={},{payload})=>{
        console.log('blue1');
        return state;
    },
    [blue2]:(state={},{payload})=>{
        console.log('blue2');
        return state;
    }
},{});

const store = createStore(
    combineReducers({reducer,reducer1}),
    {}
    ,applyMiddleware(thunk)
);

store.dispatch(delay());
store.dispatch(blue1());
