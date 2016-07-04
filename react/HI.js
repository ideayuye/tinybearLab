
var React = require('react');
import {connect} from "react-redux";
var Display = require('./display');

let HI = ({dispatch,state}) => {
    return (
        <div onClick={(e)=>{
            e.preventDefault();
            dispatch({type:'ADD_X',text:'1plus'});
        }}>hello:</div>

    );
}

HI = connect()(HI);

// var HI = React.createClass({
//     render:()=>{
//         return <div>hello</div>;
//     }
// });


module.exports = HI;
