import React from 'react';
import Minesweeper from "./Minesweeper"

class App extends React.Component {
  constructor(props){
    super(props);
    // this.store = store;
    this.state = {
      width: 16,
      height: 16,
      mineCount: 20,
      // storeState: store.getState()
    };
  }

  render() {
    const { height, width, mineCount } = this.state;
    return (
      <div className="App">
        <Minesweeper height={height} width={width} mineCount={mineCount} />
      </div>
    );
  }
}

export default App;
