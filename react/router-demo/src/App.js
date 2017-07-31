import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'


const Home = ()=>(<div>Hello,Home.</div>);
const Content = ()=>(<div>Hello,Conent.</div>);
const Children = ()=>(<div>children</div>);

class App extends Component {
  render() {
    return (
      <Router>
      <div className="App">
          <div>
            <Link to="/home">Home</Link>
            <Link to="/content">Content</Link>
            <Link to="/children">Children</Link>
          </div>
          <div>
            <Route path="/home" component={Home}></Route>
            <Route path="/content" component={Content}></Route>
            <Route path="/children1" children={Children}></Route>
          </div>
      </div>
      </Router>
    );
  }
}

export default App;
