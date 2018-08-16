
let express = require('express');
let app = express();

let React = require('react'),
    ReactDOMServer = require('react-dom/server');

let App = React.createFactory(require('./App'));

app.get('/',function(req,res){
    // var html = ReactDOMServer.renderToStaticMarkup(
    var html = ReactDOMServer.renderToString(
        React.DOM.body(
            null,
            React.DOM.div({id:'root',
            dangerouslySetInnerHTML:{
                __html: ReactDOMServer.renderToString(App())
                // __html: ReactDOMServer.renderToStaticMarkup(App())
            }})
        )
    );

    res.end(html)
});

app.listen(3015, function() {
    console.log('running on port ' + 3015);
});

