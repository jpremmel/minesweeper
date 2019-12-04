import React from 'react';
import T from 'prop-types';

function Cell(props) {
  function getValue(){
    if(!props.isRevealed){
      return props.isFlagged ? "X" : null;
    }
    if(props.isMine){
      return "*";
    }
    if(props.neighbor === 0) {
      return null;
    }
    return props.neighbor;
  }

  const {isRevealed, isMine, isFlagged, onClick, menu} = props;

  return (
    <div
      onClick={props.onClick}
      onContextMenu={props.menu}>
      {getValue()}
    </div>
  );
};

Cell.propTypes = {
  isRevealed = T.bool,
  isMine = T.bool,
  isFlagged = T.bool,
  onClick = T.func,
  menu = T.func
};

export default Cell;