btnsIncreasePrio = document.getElementsByClassName("btn-increase-prio");
btnsDecreasePrio = document.getElementsByClassName("btn-decrease-prio");
btnsEditName = document.getElementsByClassName("btn-edit-name");

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
    var clickedTd = clickedRow.children[2];
    var textBox = clickedTd.children[0];
    textBoxVal = textBox.value;
    clickedTd.innerHTML = textBoxVal;

    // CHANGE ICON
    var icon = this.children[0];
    icon.classList.remove('flaticon-save')
    icon.classList.add('flaticon-edit');
    // REMOVE EVENT LISTENER FOR SAVE
    this.removeEventListener('click', saveLoadName);
    // ADD EVENT LISTENER FOR EDIT
    this.addEventListener('click', editLoadName);

    //ENABLE INCREASE AND DECREASE PRIO BUTTONS
    for(item of btnsIncreasePrio) {
        item.style.pointerEvents = 'auto';
        item.style.opacity = '100%';
    }
    for(item of btnsDecreasePrio) {
        item.style.pointerEvents = 'auto';
        item.style.opacity = '100%';
    }
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
        // save innertHTML of respective td of bot <tr>'s
        clickedRow.children[1].innerText = nextLabel;
        clickedRow.children[2].innerText = nextName;
        nextRow.children[1].innerText = clickedLabel;
        nextRow.children[2].innerText = clickedName;
    }
    // console.log("increase prio");
    console.log("decrease prio");
}

for(item of btnsIncreasePrio) {
    item.addEventListener('click', increasePrio);
}

for(item of btnsDecreasePrio) {
    item.addEventListener('click', decreasePrio);
}

for(item of btnsEditName) {
    item.addEventListener('click', editLoadName);
}