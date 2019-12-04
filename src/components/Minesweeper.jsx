import React from 'react';
import T from 'prop-types';
import { fork } from 'cluster';

class Minesweeper extends React.Component {
  state = {
    boardData: this.initBoardData(this.props.height, this.props.width, this.props.mineCount),
    gameStatus: 'Game in progress',
    mineCount: this.props.mineCount
  };

  //get Mines
  getMines(data) {
    let mineArray = [];
    data.map(dataRow => {
        dataRow.map((dataItem) => {
            if (dataItem.isMine) {
                mineArray.push(dataItem);
            }
        });
    });
    return mineArray;
  }

  // get Flags
  getFlags(data) {
      let mineArray = [];
      data.map(dataRow => {
          dataRow.map((dataItem) => {
              if (dataItem.isFlagged) {
                  mineArray.push(dataItem);
              }
          });
      });
      return mineArray;
  }

  // get Hidden cells
  getHidden(data) {
      let mineArray = [];
      data.map(dataRow => {
          dataRow.map((dataItem) => {
              if (!dataItem.isRevealed) {
                  mineArray.push(dataItem);
              }
          });
      });
      return mineArray;
  }

  initBoardData(height, width, mines) {
    let data = this.createEmptyArray(height, width);
    data = this.plantMines(data, height, width, mines);
    data = this.checkIfNeighborsAreMines(data, height, width);
    return data;
  }

  createEmptyArray(height, width) {
    let data = [];

    for(let i=0; i<height; i++){
      data.push([]);
      for(let j=0; j<width; j++) {
        data[i][j] = {
          x: i,
          y: j,
          isMine: false,
          neighbor: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false,
        };
      }
    }
    return data;
  }

  plantMines(data, height, width, mines) {
    let random_x, random_y, minesPlanted = 0;
    while(minesPlanted < mines) {
      random_x = Math.floor((Math.random() * 1000) + 1) % width;
      random_y = Math.floor((Math.random() * 1000) + 1) % height;
      if (!(data[random_x][random_y].isMine)) {
        data[random_x][random_y].isMine = true;
        minesPlanted++;
      }
    }
    return data;
  }

  checkIfNeighborsAreMines(data, height, width) {
    let updatedData = data
    let index = 0;
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (!data[i][j].isMine) {
          let mine = 0;
          const area = this.getNeighbors(data[i][j].x, data[i][j].y, data);
          area.map(value => {
            if (value.isMine) {
              mine++;
            }
          });
          if (mine === 0) {
            updatedData[i][j].isEmpty = true;
          }
          updatedData[i][j].neighbor = mine;
        }
      }
    }
    return updatedData;
  }

  getNeighbors(x, y, data) {
    const neighbors = [];
      //up
      if (x > 0) neighbors.push(data[x - 1][y]);
      //down
      if (x < this.props.height - 1) neighbors.push(data[x + 1][y]);
      //left
      if (y > 0) neighbors.push(data[x][y - 1]);
      //right
      if (y < this.props.width - 1) neighbors.push(data[x][y + 1]);
      // top left
      if (x > 0 && y > 0) neighbors.push(data[x - 1][y - 1]);
      // top right
      if (x > 0 && y < this.props.width - 1) neighbors.push(data[x - 1][y + 1]);
      // bottom right
      if (x < this.props.height - 1 && y < this.props.width - 1) neighbors.push(data[x + 1][y + 1]);
      // bottom left
      if (x < this.props.height - 1 && y > 0) neighbors.push(data[x + 1][y - 1]);
      return neighbors;
  }

  revealBoard() {
    let updatedData = this.state.boardData;
    updatedData.map((dataRow) => {
      dataRow.map((dataItem) => {
        dataItem.isRevealed = true;
      });
    });
    this.setState({
      boardData: updatedData
    });
  }

  showEmptyCells(x, y, data) {
    let area = this.getNeighbors(x, y, data);
    area.map(value => {
      if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)) {
        data[value.x][value.y].isRevealed = true;
        if (value.isEmpty) {
          this.showEmptyCells(value.x, value.y, data);
        }
      }
    });
    return data;
  }

  handleCellClick(x, y) {
    //check if revealed, don't return if null
    if (this.state.boardData[x][y].isRevealed || this.state.boardData[x][y].isFlagged) return null;

    //check if mine, game over if true
    if (this.state.boardData[x][y].isMine) {
      this.setState({gameStatus: 'You Lost.'});
      this.revealBoard();
      alert('Game Over');
    }

    let updatedData = this.state.boardData;
    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    if (updatedData[x][y].isEmpty) {
      updatedData = this.showEmptyCells(x, y, updatedData);
    }

    if (this.getHidden(updatedData).length === this.props.mineCount) {
      this.setState({mineCount: 0, gameStatus: 'You win!'});
      this.revealBoard();
      alert(this.state.gameStatus);
    }

    this.setState({
      boardData: updatedData,
      mineCount: this.props.mineCount - this.getFlags(updatedData).length
    });
  }

  render() {
    return (
      <div className="board">
        <div className="game-info">
          <span className="info">
            mines: {this.state.mineCount}
          </span>
          <br/>
          <span className="info">
            {this.state.gameStatus}
          </span>
        </div>
        {this.renderBoard(this.state.boardData)}
      </div>
    );
  }
}

Minesweeper.propTypes = {
  height: T.number,
  width: T.number,
  mines: T.number,
};

export default Minesweeper;