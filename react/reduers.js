
var todo = (state,action)=>{
    switch (action.type) {
        case "ADD_X":
            // return {
            //     text:action.text    
            // }
            return status+"x";
        default:
            return state;
    }
}

module.exports = todo;

