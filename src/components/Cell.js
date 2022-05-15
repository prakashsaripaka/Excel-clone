import React, { useState, useEffect } from "react";
import {columnHeader, getDisplayValue, calculateCss } from '../utils/cellUtils'


export default function Cell(props) {
  const [cellState, setCellState] = useState({
    editing: false,
    selected: false,
    value: props.value
  });

  useEffect(() => {
    window.document.addEventListener("unselectAll", handleUnselectAll);
    return () =>
      window.document.removeEventListener("unselectAll", handleUnselectAll);
  }, [cellState]);

  useEffect(()=>{
    setCellState({ ...cellState, value: props.value });
  },  [props.value])

  const clicked = () => {
    emitUnselectAllEvent();
    setCellState({ ...cellState, selected: true });
    props.storeSelected({x: props.x, y: props.y})
  };

  const doubleClicked = () => {
    setCellState({ ...cellState, selected: true, editing: true });
    props.storeSelected({x: props.x, y: props.y})
  };

  const onChange = (e) => {
    setCellState({ ...cellState, value: e.target.value });
  };

  
  const onKeyPressOnInput = (e) => {
    if (e.key === 'Enter') {
      hasNewValue(e.target.value)
    }
  };

  
  const onKeyPressOnSpan = () => {
    if (!cellState.editing) {
      setCellState({ ...cellState, editing: true });
    }
  };

 
  const onBlur = (e) => {
    hasNewValue(e.target.value)
    setCellState({ ...cellState, selected: false, editing: false });
  };

  const handleUnselectAll = () => {
    if (cellState.selected || cellState.editing) {
      setCellState({ ...cellState, selected: false, editing: false });
    }
  };

  const hasNewValue = (value) => {
    props.onChangedValue(
      {
        x: props.x,
        y: props.y,
      },
      value,
    )
    setCellState({ ...cellState, editing: false });
  }

  const emitUnselectAllEvent = () => {
    const unselectAllEvent = new Event("unselectAll");
    window.document.dispatchEvent(unselectAllEvent);
  };


  const css = calculateCss();
  if (cellState.selected) {
    css.outlineColor = "green";
    css.border = "2px solid green";
  }

  if (props.x === 0) {
    css.backgroundColor = "#e8e5e5";
    return <span style={css}>{props.y}</span>;
  }

  if (props.y === 0) {
    css.backgroundColor = "#e8e5e5";
    const header = columnHeader(props.x);
    return (
      <span onKeyPress={onKeyPressOnSpan} style={css} role="presentation">
        {header}
      </span>
    );
  }

  if (cellState.editing) {
    return (
      <input
        style={css}
        type="text"
        onBlur={onBlur}
        onKeyPress={onKeyPressOnInput}
        value={cellState.value}
        onChange={onChange}
        autoFocus
        tabIndex={1}
      />
    );
  }
  return (
    <span
      onClick={(e) => clicked(e)}
      onDoubleClick={(e) => doubleClicked(e)}
      onKeyPress={(e) => e.which === 13 ? doubleClicked(e) : clicked(e)}
      style={css}
      role="presentation"
      tabIndex={1}
    >
      {getDisplayValue(cellState.value, props.tableData)}
    </span>
  );
}
