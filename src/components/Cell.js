import React, { useState, useEffect } from "react";
export default function Cell(props) {
  //const initialValue = { editing: false, selected: false, value: "" };
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

  const columnHeader = (index) => {
    let ans = "";

    let n = index;

    while (n > 0) {
      let rem = n % 26;
      if (rem == 0) {
        ans = "Z" + ans;
        n = Math.floor(n / 26) - 1;
      } else {
        ans = String.fromCharCode(rem - 1 + 65) + ans;
        n = Math.floor(n / 26);
      }
    }

    return ans;
  };

  function columnNumber(str){
    const arr = str.split("");
    let count = 0;
    let total= 0
    while(arr.length){
      let curr = arr.splice(arr.length -1 , 1)[0];
      console.log("curr", curr)
      let value = (26 * count) + curr.charCodeAt() - 64
      if(count > 0){
        value -= 1;
      }
      total += value;
      count++;
    }
    
    return total;
  
  }

  const getDisplayValue = (value) => {
    if(value.toLowerCase().indexOf("=") >= 0){
      try{
        let statement = value.replaceAll(/\s/g, "").replace("=", "");
        let operation  = statement.split('(')[0];
        let operandArr = statement.match(/\(.*?\)/g)[0].replace(/[()]/g, "").split(',');
        let row1 = operandArr[0].match(/\d/g)[0];
        let column1Str = operandArr[0].toUpperCase().replace(row1, "");
        let column1 = columnNumber(column1Str);
        let row2 = operandArr[1].match(/\d+/g)[0];
        let column2Str = operandArr[1].toUpperCase().replace(row2, "");
        let column2 = columnNumber(column2Str);
        let value1 = props.tableData[row1][column1];
        let value2 = props.tableData[row2][column2];
        if(operation.toLowerCase() === 'sum'){
          return parseInt(value1) + parseInt(value2);
        }else if(operation.toLowerCase() === 'mul'){
          return parseInt(value1) * parseInt(value2);
        }else{
          return "INVALID"
        }
      }catch(err){
        return "INVALID"
      }
    }
    return value
  }

  const calculateCss = () => {
    return  {
      width: "80px",
      padding: "4px",
      margin: "0",
      height: "25px",
      boxSizing: "border-box",
      position: "relative",
      display: "inline-block",
      color: "black",
      border: "1px solid #cacaca",
      textAlign: "left",
      verticalAlign: "top",
      fontSize: "14px",
      lineHeight: "15px",
      overflow: "hidden"
    };
  };
  const css = calculateCss();
  if (cellState.selected) {
    css.outlineColor = "green";
    // css.outlineStyle = "dotted";
  }

  if (cellState.selected) {
    css.outlineColor = "green";
    css.border = "2px solid green";
  }


  if (props.x === 0) {
    return <span style={css}>{props.y}</span>;
  }

  if (props.y === 0) {
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
      {getDisplayValue(cellState.value)}
    </span>
  );
}
