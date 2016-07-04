
var todo = (state = {text:""},action)=>{
    switch (action.type) {
        case "ADD_X":
            return {
                text: state.text += action.text
            }
        default:
            return state;
    }
}

module.exports = todo;

