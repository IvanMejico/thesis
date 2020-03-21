function checkBatteryLevel () {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "getBatteryLevel.php", true);
    xhr.onload = function() {
        level = this.responseText;
        priority1 = document.getElementById('charge-status-0');
        priority2 = document.getElementById('charge-status-1');
        priority3 = document.getElementById('charge-status-2');
        priority4 = document.getElementById('charge-status-3');
        txtLevel = document.getElementById('battery-level');
    
        if(level < 75) {
            priority4.style.backgroundColor = "#4e4c4c";
            priority4.style.color = "#a19f9c";
        } else {
            priority4.style.backgroundColor = "rgba(6, 233, 36, 0.842)";
            priority4.style.color = "#fff";
        }
    
        if(level < 50) {
            priority3.style.backgroundColor = "#4e4c4c";
            priority3.style.color = "#a19f9c";
        } else {
            priority3.style.backgroundColor = "rgba(6, 233, 36, 0.842)";
            priority3.style.color = "#fff";
        }
    
        if(level < 25) {
            priority2.style.backgroundColor = "#4e4c4c";
            priority2.style.color = "#a19f9c";
        } else {
            priority2.style.backgroundColor = "rgba(6, 233, 36, 0.842)";
            priority2.style.color = "#fff";
        }

        if(level <= 0) {
            priority1.style.backgroundColor = "#4e4c4c";
            priority1.style.color = "#a19f9c";
        } else {
            priority1.style.backgroundColor = "rgba(6, 233, 36, 0.842)";
            priority1.style.color = "#fff";
        }
    
        txtLevel.innerText = level + "%";
    }
    xhr.send();

}

function editLoadName() {
    // ADDING TEXTBOX TO THE TD ELEMENT
    var clickedRow = this.parentElement.parentElement;
    var clickedTd = clickedRow.children[2];
    var textVal = clickedTd.innerText;
    clickedTd.innerText = "";
    var textBox = document.createElement('input');
    textBox.classList.add('txt-edit-name');
    textBox.value = textVal;
    clickedTd.appendChild(textBox);

    // CHANGE CLASS from btn-edit-name TO btn-save-name
    this.classList.remove('btn-edit-name');
    this.classList.add('btn-save-name');

    // CHANGE ICON
    var icon = this.children[0];
    icon.classList.remove('flaticon-edit')
    icon.classList.add('flaticon-save');
    // REMOVE EVENT LISTENER FOR EDIT
    this.removeEventListener('click', editLoadName);
    // ADD EVENT LISTENER FOR SAVE
    this.addEventListener('click', saveLoadName);
    
    //DISABLE INCREASE AND DECREASE PRIO BUTTONS
    for(item of btnsIncreasePrio) {
        item.style.pointerEvents = 'none';
        item.style.opacity = '70%';
    }

    for(item of btnsDecreasePrio) {
        item.style.pointerEvents = 'none';
        item.style.opacity = '70%';
    }
}

function saveLoadName() {
    var clickedRow = this.parentElement.parentElement;
    var label = clickedRow.children[1].innerText;
    var clickedTd = clickedRow.children[2];
    var textBox = clickedTd.children[0];
    textBoxVal = textBox.value;
    clickedTd.innerHTML = textBoxVal;

    // CHANGE CLASS from btn-save-name TO btn-edit-name
    this.classList.remove('btn-save-name');
    this.classList.add('btn-edit-name');

    // CHANGE ICON
    var icon = this.children[0];
    icon.classList.remove('flaticon-save')
    icon.classList.add('flaticon-edit');
    // REMOVE EVENT LISTENER FOR SAVE
    this.removeEventListener('click', saveLoadName);
    // ADD EVENT LISTENER FOR EDIT
    this.addEventListener('click', editLoadName);

    //ENABLE INCREASE AND DECREASE PRIO BUTTONS
    n = document.getElementsByClassName('btn-save-name').length;
    if(!n) {
        for(item of btnsIncreasePrio) {
            item.style.pointerEvents = 'auto';
            item.style.opacity = '100%';
        }
        for(item of btnsDecreasePrio) {
            item.style.pointerEvents = 'auto';
            item.style.opacity = '100%';
        }
    }

    var loadname = textBoxVal;
    xhr = new XMLHttpRequest();
    xhr.open('GET', 'getLoadPrioritization.php?label='+label+'&loadname='+loadname);
    xhr.onload = function() {
        // console.log(this.responseText);
    }
    xhr.send();
}

function increasePrio() {
    // get  parent <tr> of clicked button
    clickedRow = this.parentElement.parentElement;
    // get innerHTML of the 2nd child of <tr>
    var clickedLabel = clickedRow.children[1].innerText;
    // get innerHTML of the 3rd child of <tr>
    var clickedName = clickedRow.children[2].innerText;

    // get previous sibing of selected <tr>
    var previousRow = clickedRow.previousElementSibling;
    if(previousRow) {
        // get innerHTML of the 2nd child of <tr>'s previous sibling
        var previousLabel = previousRow.children[1].innerText;
        // get innerHTML of the 3rd child of <tr>
        var previousName = previousRow.children[2].innerText;
        // save innertHTML of respective td of bot <tr>'s
        clickedRow.children[1].innerText = previousLabel;
        clickedRow.children[2].innerText = previousName;
        previousRow.children[1].innerText = clickedLabel;
        previousRow.children[2].innerText = clickedName;
    }

    xhr = new XMLHttpRequest();
    xhr.open('GET', 'getLoadPrioritization.php?label='+clickedLabel+'&increaseprio=true', false);
    xhr.onload = function () {
        // console.log(this.responseText);
    };
    xhr.send();
}

function decreasePrio() {
    // get  parent <tr> of clicked button
    clickedRow = this.parentElement.parentElement;
    // get innerHTML of the 2nd child of <tr>
    var clickedLabel = clickedRow.children[1].innerText;
    // get innerHTML of the 3rd child of <tr>
    var clickedName = clickedRow.children[2].innerText;

    // get next sibing of selected <tr>
    var nextRow = clickedRow.nextElementSibling;
    if(nextRow) {
        // get innerHTML of the 2nd child of <tr>'s next sibling
        var nextLabel = nextRow.children[1].innerText;
        // get innerHTML of the 3rd child of <tr>
        var nextName = nextRow.children[2].innerText;
        // save innertHTML of respective td of both <tr>'s
        clickedRow.children[1].innerText = nextLabel;
        clickedRow.children[2].innerText = nextName;
        nextRow.children[1].innerText = clickedLabel;
        nextRow.children[2].innerText = clickedName;
    }

    xhr = new XMLHttpRequest();
    xhr.open('GET', 'getLoadPrioritization.php?label='+clickedLabel+'&increaseprio=false', false);
    xhr.onload = function () {
        // console.log(this.responseText);
    };
    xhr.send();
}

function renderTable(tableData) {
    tbody = document.querySelector('#battery-loads tbody')
    
    // ROW
    row = document.createElement('tr');

    // CELL
    tdLevel = document.createElement('td');
    tdLabel = document.createElement('td');
    tdName = document.createElement('td');
    tdButtons = document.createElement('td');
    tdButtons.classList.add('arrange-control');
    tdLevel.innerText = 'Priority ' + tableData.priority_level; // Priority Level
    tdLabel.innerText = tableData.label;   // Label
    tdName.innerText = tableData.load_name; // Load Name
    // BUTTON TO INCREASE PRIORITY LEVEL
    btnIncreasePrio = document.createElement('a');
    btnIncreasePrio.classList.add('btn-increase-prio');
    increaseIcon = document.createElement('i');
    increaseIcon.classList.add('flaticon-up-arrow');
    btnIncreasePrio.appendChild(increaseIcon);
    // BUTTON TO DECREASE PRIORITY LEVEL
    btnDecreasePrio = document.createElement('a');
    btnDecreasePrio.classList.add('btn-decrease-prio');
    decreaseIcon = document.createElement('i');
    decreaseIcon.classList.add('flaticon-download');
    btnDecreasePrio.appendChild(decreaseIcon);
    // BUTTON TO INCREASE EDIT LOAD NAME
    btnEdit = document.createElement('a');
    btnEdit.classList.add('btn-edit-name')
    editIcon = document.createElement('i');
    editIcon.classList.add('flaticon-edit');

    btnEdit.appendChild(editIcon);

    tdButtons.appendChild(btnIncreasePrio);
    tdButtons.appendChild(btnDecreasePrio);
    tdButtons.appendChild(btnEdit);

    // APPEND CELLS TO ROW
    row.appendChild(tdLevel);
    row.appendChild(tdLabel);
    row.appendChild(tdName);
    row.appendChild(tdButtons);

    tbody.appendChild(row);
}


// Perform one-time AJAX REQUEST to get prioritization data
function getLoadPrioritization() {
    xhr = new XMLHttpRequest();
    xhr.open('GET','getLoadPrioritization.php', false);
    xhr.onload = function() {
        data = JSON.parse(this.responseText);
        for(item of data) {
            renderTable(item);
        }
    };
    xhr.send();   
}

getLoadPrioritization();
checkBatteryLevel();
setInterval(checkBatteryLevel,  5000);

btnsIncreasePrio = document.getElementsByClassName("btn-increase-prio");
btnsDecreasePrio = document.getElementsByClassName("btn-decrease-prio");
btnsEditName = document.getElementsByClassName("btn-edit-name");
for(item of btnsIncreasePrio) {
    item.addEventListener('click', increasePrio);
}

for(item of btnsDecreasePrio) {
    item.addEventListener('click', decreasePrio);
}

for(item of btnsEditName) {
    item.addEventListener('click', editLoadName);
}