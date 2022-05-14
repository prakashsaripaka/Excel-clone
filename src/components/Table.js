import React, { useState, useEffect } from "react";
import Row from "./Row";

export default function Table(props) {
  const [tableMeta, setTableMeta] = useState({ rows: 20, columns: 20 });
  const [data, setData] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const handleChangedCell = ({ x, y }, value) => {
    const modifiedData = Object.assign({}, data);
    if (!modifiedData[y]) modifiedData[y] = {};
    modifiedData[y][x] = value;
    setData(modifiedData);
  };

  const storeSelected = ({ x, y })=> {
    setSelectedCell({ x, y })
  }
  
  const handleTableActions = (e) => {
    const targetName = e.target.name;
    if (targetName.indexOf("insert-row") >= 0) {
      handleTableDataOnInsertRow(selectedCell, targetName)
      const currRows = tableMeta.rows;
      setTableMeta({ ...tableMeta, rows: currRows + 1 });
    }

    if (targetName.indexOf("insert-column") >= 0 ) {
      handleTableDataOnInsertColumn(selectedCell, targetName);
      const currColumns = tableMeta.columns;
      setTableMeta({ ...tableMeta, columns: currColumns + 1 });
    }

    if (targetName.indexOf("sort") >= 0 ) {
        handleTableDataSortbyColumn(selectedCell.x);
      }
  };

  const handleTableDataSortbyColumn = (column) => {
    const currCopy = Object.assign({}, data);
    const tempArray = []
    for(let ele in currCopy){
        tempArray.push(currCopy[ele]);
    }
    let sortedArr = tempArray.sort((a, b) => {
        if( isNaN(parseInt(a[column]))){
            if (a[column] < b[column]) {
                return -1;
            }
            if (a[column] > b[column]) {
                return 1;
            }
            return 0;
        }else{
            return a[column] - b[column];
        }
        
    });
    
    const sortedObj = {};
    for(let [index, ele] of sortedArr.entries()){
        sortedObj[index +1] = ele;
    }
    setData(sortedObj);
  }

  const handleTableDataOnInsertColumn = ({ x }, type) => {
    const currCopy = Object.assign({}, data);
    const insertIndex = x;
    if(type === "insert-column-after"){
        for(let key in currCopy){
            let innerObj = currCopy[key]
            const newObj = {};
            for(let innerkey in innerObj){
               
                if(parseInt(innerkey) > insertIndex){
                    let newKey = parseInt(innerkey) + 1 ;
                    newObj[newKey.toString()] = innerObj[innerkey];
                }else{
                    newObj[innerkey] = innerObj[innerkey];
                }
            }
          currCopy[key] = newObj;
        }
    }else{
        for(let key in currCopy){
            let innerObj = currCopy[key]
            const newObj = {};
            for(let innerkey in innerObj){
               
                if(parseInt(innerkey) >= insertIndex){
                    let newKey = parseInt(innerkey) + 1 ;
                    newObj[newKey.toString()] = innerObj[innerkey];
                }else{
                    newObj[innerkey] = innerObj[innerkey];
                }
            }
          currCopy[key] = newObj;
        }
    }
    setData(currCopy);
  }


  const handleTableDataOnInsertRow = ({ x, y }, type) => {
    const currCopy = Object.assign({}, data);
    const insertIndex = y;
    const newObj = {};
    if(type === "insert-row-after"){
        for(let key in currCopy){
            if(parseInt(key) > insertIndex ){
               
            let newKey =  parseInt(key) + 1 ;
            newObj[newKey.toString()] = currCopy[key];
            }
            else{
                newObj[key] = currCopy[key];
                
            }
        }
    }else{
        for(let key in currCopy){
            if(parseInt(key) >= insertIndex ){
                let newKey =  parseInt(key) + 1 ;
                newObj[newKey.toString()] = currCopy[key];
            }
            else{
                newObj[key] = currCopy[key];
            }
        }
    }
    setData(newObj);
  }
  
  const getRows = () => {
    const rows = [];
    for (let y = 0; y < tableMeta.rows + 1; y += 1) {
      const rowData = data[y] || {};
      rows.push(
        <Row
          handleChangedCell={handleChangedCell}
          key={y}
          y={y}
          x={tableMeta.columns + 1}
          rowData={rowData}
          storeSelected={storeSelected}
          tableData = {data}
        />
      );
    }
    return rows;
  };

  return (
    <>
    <header onClick={handleTableActions}>
            <button name="insert-row-before">INSERT ROW BEFORE</button>
            <button name="insert-row-after">INSERT ROW AFTER</button>
            <button name="insert-column-before">INSERT COLUMN BEFORE</button>
            <button name="insert-column-after">INSERT COLUMN AFTER</button>
            <button name="sort">SORT</button>
    </header>
    <section>
        {getRows()};
    </section>
    </>
  )
}
