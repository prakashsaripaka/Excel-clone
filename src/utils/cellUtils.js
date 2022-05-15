export const columnHeader = (index) => {
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

export const columnNumber = (str) => {
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

export const getDisplayValue = (value, tableData) => {
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
        let value1 = tableData[row1][column1];
        let value2 = tableData[row2][column2];
        if(operation.toLowerCase() === 'sum'){
          return parseInt(value1) + parseInt(value2);
        }else if(operation.toLowerCase() === 'mul'){
          return parseInt(value1) * parseInt(value2);
        }else if(operation.toLowerCase() === 'sub'){
          return parseInt(value1) - parseInt(value2);
        }
        else{
          return "INVALID"
        }
      }catch(err){
        return "INVALID"
      }
    }
    return value
  }

export const calculateCss = () => {
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