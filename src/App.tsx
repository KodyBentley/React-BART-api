import * as React from 'react';
import './App.css';
import Test  from './components/test';
import { Jumbotron } from 'react-bootstrap';

// import logo from './logo.svg';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Jumbotron className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1 className="App-title">Zilly BART Schedule!</h1>
        </Jumbotron>
        <Test />
      </div>
    );
  }
}

export default App;
