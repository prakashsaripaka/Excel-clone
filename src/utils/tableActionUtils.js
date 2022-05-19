import { NotificationManager } from 'react-notifications';

export const handleTableDataOnInsertColumn = (selectedCell, type, tableData) => {
    const currCopy = Object.assign({}, tableData);
    if(!selectedCell){
        NotificationManager.info('Please select a cell');
    }
    const insertIndex = selectedCell.x;
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
    return currCopy;
}

export const handleTableDataOnInsertRow = (selectedCell, type, tableData) => {
    const currCopy = Object.assign({}, tableData);
    if(!selectedCell){
        NotificationManager.info('Please select a cell');
    }
    const insertIndex = selectedCell.y;
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
    return newObj;
}

export const handleTableDataOnSortbyColumn = (selectedCell, type, tableData) => {
    if(!selectedCell){
        NotificationManager.info('Please select a cell');
    }
    let column = selectedCell.x;
    const objKeys = Object.keys(tableData) //to maintain the same keys in sorted object
    const currCopy = Object.assign({}, tableData);
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
                return +1;
            }
            return 0;
        }else{
            return a[column] - b[column];
        }
        
    }); 
    const sortedObj = {};
    if(type !== "sortInc"){
        sortedArr.reverse()
    }
    for(let [index, ele] of sortedArr.entries()){
        sortedObj[objKeys[index]] = ele;
    }
    return sortedObj;
}