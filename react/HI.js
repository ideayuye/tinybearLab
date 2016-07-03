
var React = require('react');
import {connect} from "react-redux";

let HI = ({dispatch}) => {
    
    return (
        <div onClick={(e)=>{
            e.preventDefault();
            dispatch({type:'ADD_X'});
        }}>hello</div>
    );
}

HI = connect()(HI);

// var HI = React.createClass({
//     render:()=>{
//         return <div>hello</div>;
//     }
// });


module.exports = HI;