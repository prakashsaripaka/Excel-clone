import React, { useState } from "react";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Row from "./Row";
import 'react-notifications/lib/notifications.css';

import {handleTableDataOnSortbyColumn , handleTableDataOnInsertColumn, handleTableDataOnInsertRow} from '../utils/tableActionUtils';

export default function Table() {

  const [tableMeta, setTableMeta] = useState({ rows: 20, columns: 20 });
  const [data, setData] = useState(()=>{
      if(window.localStorage.getItem('tableData')){
          return JSON.parse(window.localStorage.getItem('tableData'));
      }
      return {};
  });
  const [selectedCell, setSelectedCell] = useState(null);
  
  /* update cell data */
  const handleChangedCell = ({ x, y }, value) => {
    const modifiedData = Object.assign({}, data);
    if (!modifiedData[y]) modifiedData[y] = {};
    modifiedData[y][x] = value;
    setTableData(modifiedData);
  };

  const setTableData = (data) => {
    window.localStorage.setItem('tableData', JSON.stringify(data))
    setData(data);
  }
  
  const handleTableActions = (e) => {
    const targetName = e.target.name;
    if (targetName.indexOf("insert-row") >= 0) {
        const updatedTableData = handleTableDataOnInsertRow(selectedCell, targetName, data)
        setTableData(updatedTableData);
        setTableMeta({ ...tableMeta, rows: tableMeta.rows + 1 });
    }

    if (targetName.indexOf("insert-column") >= 0 ) {
        const updatedTableData = handleTableDataOnInsertColumn(selectedCell, targetName, data);
        setTableData(updatedTableData);
        setTableMeta({ ...tableMeta, columns: tableMeta.columns + 1 });
    }

    if (targetName.indexOf("sort") >= 0 ) {
        const updatedTableData = handleTableDataOnSortbyColumn(selectedCell, targetName, data);
        setTableData(updatedTableData);
      }
  };
  
  const copy = (text) => {
    navigator.clipboard.writeText(text)
    NotificationManager.info('Copied!!');
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
          storeSelected= {({ x, y })=> {
            setSelectedCell({ x, y })
          }}
          tableData = {data}
        />
      );
    }
    return rows;
  };

  return (
    <>
    <NotificationContainer/>
    <header className="excel-header" onClick={handleTableActions}>
            <div className="dropdown">
                <button className="drop-btn">Insert</button>
                <div className="dropdown-content">
                    <button name="insert-row-before">INSERT ROW BEFORE</button>
                    <button name="insert-row-after">INSERT ROW AFTER</button>
                    <button name="insert-column-before">INSERT COLUMN BEFORE</button>
                    <button name="insert-column-after">INSERT COLUMN AFTER</button>
                </div>
            </div>
            <div className="dropdown">
                <button className="drop-btn">Sort</button>
                <div className="dropdown-content sort">
                    <button name="sortInc">A - Z</button>
                    <button name="sortDec">Z - A</button>
                </div>
            </div>
            <div className="dropdown">
                <button className="drop-btn">Formula Templates (copy to clipboard)</button>
                <div className="dropdown-content" onClick={(e) => copy(e.target.innerText)}>
                    <button >
                        =sum(A1, A2)
                    </button>
                    <button >
                        =sub(A1, A2)
                    </button>
                    <button >
                        =mul(A1, A2)
                    </button>
                    
                </div>
            </div>
            
    </header>
    <section className="sheet-wrapper">
        {getRows()}
    </section>
    </>
  )
}
