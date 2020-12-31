import React, { Component } from 'react';
import Display from './Components/Display';
import Navigation from './Components/Navigation'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      response: {}
    };

    this.fetch_data = this.fetch_data.bind(this);
  }

  fetch_data(response) {
    this.setState({
      response
    });
  }

  render() {
    return (
      <div className="App">
        <Navigation get_data={this.fetch_data} />
        <Display response={this.state.response} />
      </div>
    );
  }
}

export default App;
