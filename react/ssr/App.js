
let React = require('react'),
    DOM = React.DOM,div = DOM.div,button = DOM.button,ul = DOM.ul,li = DOM.li;

    module.exports = React.createClass({
        getInitialState(){
            return {
                isSayBye:false
            }
        },
        handleClick(){
            this.setState({
                isSayBye:!this.state.isSayBye
            })
        },
        render(){
            let content = this.state.isSayBye?'Bye':'Hello World';
            return div(null,
                div(null, content),
                button({onClick: this.handleClick}, 'switch')
            );
        }
    })