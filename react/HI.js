
var React = require('react');
import {connect} from "react-redux";
var Display = require('./display');

let HI = ({state,dispatch}) => {
    return (
        <div>
        <div onClick={(e)=>{
            e.preventDefault();
            dispatch({type:'ADD_X',text:'1plus'});
        }}>hello:</div>
        <Display {...state}/>
        </div>
    );
}

// const mapStateToProps = (state) =>{
//     return {
//         text: state.text
//     }
// }

HI = connect()(HI);

// var HI = React.createClass({
//     render:()=>{
//         return <div>hello</div>;
//     }
// });

module.exports = HI;

