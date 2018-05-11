import * as React from 'react';
import './static/styles/App.css';
import Station  from './components/station';
import { Jumbotron } from 'react-bootstrap';
class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Jumbotron className="App-header">
          <h1 className="App-title">Zilly BART Schedule!</h1>
        </Jumbotron>
        <Station />
      </div>
    );
  }
}

export default App;
