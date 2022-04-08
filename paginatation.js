//Create an XHR Object
var request = new XMLHttpRequest();
//request a connection(which data you need to receive)
request.open("GET","https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json");
//sending a connection request
request.send();
//once the data successfully received from the server(200 status)
request.onload=function() {
    var tableData = JSON.parse(request.response);
    // define the global data set
    var state = {
        'querySet': tableData,
        'page': 1,
        'rows': 5,
        'window': 5,
        'pages' : '',
        'trimmedDataset' : '',
    } 
    buildTable(state);
}

function buildTable(state) {
    // call the function pagination to get the trimmed data and total pages
    var UpdatedState = pagination(state);
    data = UpdatedState.trimmedDataset;
    // create the div and table element
    var TableContainer = crtel("div","tablecontainer","id","tablecontainer");
    var table = crtel("table","table","id","table");
    // Extract the table header
    var col = [];
    for(var key in data[0]){
        col.push(key);
    }
    
    // Create the table header row using the extracted header above.
    var tr= table.insertRow(-1);    //insert new row at end of the table
    for (var i=0; i<col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i];
        tr.append(th); //append
    }

    // add JSON data to the table as rows
    for (var i=0; i<data.length; i++){
        tr = table.insertRow(-1);
        for (j=0; j<col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = data[i][col[j]]; 
        }
    }
    table.append(tr);
    TableContainer.append(table);
    document.body.append(TableContainer);
    pageButtons(UpdatedState)

}

function pagination(state) {
    
    let trimStart = (state.page -1) * state.rows;
    let trimEnd = trimStart + state.rows;
    // slice the data set and find the total no of pages.
    let trimmedData = state.querySet.slice(trimStart, trimEnd);
    let pages = Math.round(state.querySet.length / state.rows);

    // Update the state object and return it 
    state.trimmedDataset = trimmedData;
    state.pages = pages;

    return state;
}

function pageButtons(UpdatedState) {
    let NavContainer = crtel("div","navcontainer","id","navcontainer");
    let NavWrapper = crtel("div","navwrapper","id","navwrapper");
    NavWrapper.innerHTML = "";

    let maxLeft = (UpdatedState.page - Math.floor(UpdatedState.window / 2));
    let maxRight = (UpdatedState.page + Math.floor(UpdatedState.window / 2));

    if(maxLeft<1) {
        maxLeft = 1;
        maxRight = UpdatedState.window;
    }

    if(maxRight > UpdatedState.pages) {
        maxLeft = UpdatedState.pages - (UpdatedState.window - 1);
        if (maxLeft < 1) {
            maxLeft = 1;
        }
        maxRight = UpdatedState.pages;
    }

    if(UpdatedState.page !=1) {
        NavWrapper.innerHTML = `<button value=${1} class="page btn btn-sm btn-info">&#171; First</button>` + NavWrapper.innerHTML
    }
    for (var page = maxLeft; page <= maxRight; page++) {
        NavWrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-info">${page}</button>`
    }
    if (UpdatedState.page != UpdatedState.pages) {
        NavWrapper.innerHTML += `<button value=${UpdatedState.pages} class="page btn btn-sm btn-info">Last &#187;</button>`
    }

   
    NavContainer.append(NavWrapper);
    document.body.append(NavContainer);

    var ele = document.getElementsByClassName("page");
    for(var j = 0; j<ele.length;j++) {
        ele[j].addEventListener("click",function(){
            var element = document.getElementById("tablecontainer");
            element.remove();
            var element = document.getElementById("navcontainer");
            element.remove();
            UpdatedState.page = this.value;
            buildTable(UpdatedState);
        })
    }

}

function crtel(elementname,attrname,attr1,attr2){
    let ele = document.createElement(elementname);
    ele.className = attrname;
    ele.setAttribute(attr1,attr2);
    return ele;
}