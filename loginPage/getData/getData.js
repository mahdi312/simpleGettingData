let ids = [];
let license_SCOPE = [];
let license_SCOPE_ENGLISH = [];
let expire_DATE = [];
let map_LICENSE_TYPE = [];
let map_LICENSE_ID = [];
let map_ACTIVITY_TYPE = [];
let map_ISIC = [];
let comment = [];



//reading a file with given path:
//file path must be from the current path
//if you have a text file in \getData folder with name identificationCodes.txt
//you should give the name identificationCodes.txt to the filePath as parameter.
function readTextFile(filePath) {
    console.log(filePath.value);
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", filePath.value, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                ids = allText.split(",");
            }
        }
    }
    rawFile.send(null);
}

//reading a file from storage selected:
document.addEventListener("change", function openFile(e) {
    var input = e.target;
    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        var node = document.getElementById('output');
        node.innerText = text;
        ids = text.split(",");
    };
    reader.readAsText(input.files[0]);
})

let i = 0;
let interval;
//
// function logData() {
//     interval = setInterval(function () {
//         if (i < ids.length) {
//             console.log(ids[i]);
//             i++;
//         }
//     }, 2000)
// }

function pauseLogging() {
    clearInterval(interval);
}

function stopLogging() {
    i = 0;
    clearInterval(interval);
}


function createTable() {
    var myTableDiv = document.getElementById("myDynamicTable");
    var table = document.createElement('TABLE');
    table.setAttribute('id', 'myTable');
    table.setAttribute("class", "fl-table");

    table.border = '20';
    const fieldnames = ["nationalCode", "licenseScope", "licenseScopeEnglish", "expireDate", "licenseType", "licenseId", "activityType", "ISIC", "comment"];

    var thead = document.createElement('THEAD');
    table.appendChild(thead);
    var tr = document.createElement('TR');
    thead.appendChild(tr);
    for (var i = 0; i < fieldnames.length; i++) {
        var th = document.createElement('TH');
        th.appendChild(document.createTextNode(fieldnames[i]));
        tr.appendChild(th);
    }

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
    for (var i = 0; i < ids.length; i++) {
        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        for (var j = 0; j < fieldnames.length; j++) {
            var td = document.createElement('TD');
            td.width = '10';
            if (j === 0) {
                td.appendChild(document.createTextNode(ids[i]));
            } else if (j === 1) {
                td.appendChild(document.createTextNode(license_SCOPE[i]));
            } else if (j === 2) {
                td.appendChild(document.createTextNode(license_SCOPE_ENGLISH[i]));
            } else if (j === 3) {
                td.appendChild(document.createTextNode(expire_DATE[i]));
            } else if (j === 4) {
                td.appendChild(document.createTextNode(map_LICENSE_TYPE[i]));
            } else if (j === 5) {
                td.appendChild(document.createTextNode(map_LICENSE_ID[i]));
            } else if (j === 6) {
                td.appendChild(document.createTextNode(map_ACTIVITY_TYPE[i]));
            } else if (j === 7) {
                td.appendChild(document.createTextNode(map_ISIC[i]));
            } else if (j === 8) {
                td.appendChild(document.createTextNode(comment[i]));
            } else {
                td.appendChild(document.createTextNode("Cell " + i + "," + j));
            }
            tr.appendChild(td);
        }
    }
    myTableDiv.appendChild(table);
}

function getInformation(url, time) {
    let username = localStorage.getItem("username");
    let password = localStorage.getItem("password");
    const authorizationBasic = window.btoa(username + ':' + password);
    interval = setInterval(function () {
        if (i < ids.length) {
            console.log(ids[i]);
            let methodUrl = "http://localhost:8081/get-info/" + ids[i];
            let client = new function () {
                this.get = function (aUrl, aCallback) {
                    let anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
                            aCallback(anHttpRequest.responseText);
                        }
                    }
                    anHttpRequest.open("POST", aUrl, true);
                    // anHttpRequest.setRequestHeader('Content-Type', 'application/json');
                    anHttpRequest.setRequestHeader('Content-Type', 'application/java-archive');
                    // anHttpRequest.setRequestHeader('Authorization', 'Bearer ' + authorizationBasic);
                    anHttpRequest.send(authorizationBasic);
                }
            };
            client.get(methodUrl, function (response) {
                console.log(response);
                let data = JSON.parse(response);
                license_SCOPE.push(data[0].license_SCOPE);
                license_SCOPE_ENGLISH.push(data[0].license_SCOPE_ENGLISH);
                expire_DATE.push(data[0].expire_DATE);
                map_LICENSE_TYPE.push(data[0].map_LICENSE_TYPE);
                map_LICENSE_ID.push(data[0].map_LICENSE_ID);
                map_ACTIVITY_TYPE.push(data[0].map_ACTIVITY_TYPE);
                map_ISIC.push(data[0].map_ISIC);
                comment.push(data[0].comment);
            });
            i++;
        }
    }, time.value);
}

// anHttpRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
// anHttpRequest.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
// anHttpRequest.setRequestHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");


function fnExcelReport() {
    let tab_text = "<table border='50px'><tr bgcolor='#ca13f1'>";
    let textRange;
    let j = 0;
    let tab = document.getElementById('myTable'); // id of table
    for (j = 0; j < tab.rows.length; j++) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
    }

    tab_text = tab_text + "</table>";
    tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
    tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html", "replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus();
        sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
    } else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));

    return (sa);
}
