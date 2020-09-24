(function(root, factory){
    'use strict';

    root.Priotable = factory();
})(window, function() {
    'use strict';

    var document = window.document,

    hasEventListeners = !!window.addEventListener,

    sto = window.setTimeout,
    
    addEvent = function(el, e, callback, capture) {
        if (hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    },

    removeEvent = function(el, e, callback, capture) {
        if (hasEventListeners) {
            el.removeEventListener(e, callback, !!capture);
        } else {
            el.detachEvent('on' + e, callback);
        }
    },

    fireEvent = function(el, eventName, data) {
        var ev;

        if (document.createEvent) {
            ev = document.createEvent('HTMLEvents');
            ev.initEvent(eventName, true, false);
            ev = extend(ev, data);
            el.dispatchEvent(ev);
        } else if (document.createEventObject) {
            ev = document.createEventObject();
            ev = extend(ev, data);
            el.fireEvent('on' + eventName, ev);
        }
    },

    trim = function(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    },

    hasClass = function(el, cn) {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    },

    addClass = function(el, cn) {
        if (!hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    },

    removeClass = function(el, cn) {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    },

    isArray = function(obj) {
        return (/Array/).test(Object.prototype.toString.call(obj));
    },

    renderInput = function(params) {
        var el = document.createElement('input');
        addProps(el, params);

        return el;
    },

    renderText = function(value) {
        return document.createTextNode(value);
    },

    renderTextSpan = function(value) {
        var el = document.createElement('span');
        el.className = "legend-text";
        el.innerText = value;

        return el;
    },

    renderSwitch = function(isChecked=false, isClickable=true) {
        var el = document.createElement('label'),
            checkbox = renderInput({
                type: 'checkbox',
                checked: isChecked,
                disabled: !isClickable,
                dataset: {valuetype: 'relay_status'}
            });
        var span = document.createElement('span');
        span.className = 'slider round';
        el.className = 'switch';
        el.append(checkbox);
        el.append(span);

        return el;
    },

    addProps = function(el, params) {
        if(!el || !params) return;
        for (const [key, value] of Object.entries(params)) {
            if(key === 'classList') {
                el.classList.add(...value);
            } else if(key === 'dataset') {
                for (const [k, v] of Object.entries(params[key]))
                    el.dataset[k] = v;
            } else {
                el[key] = value;
            }
        }
    },

    rowToJSON = function(el) {
        var row = el,
            data = {},
            inputs = row.querySelectorAll('input');
            data.id = row.id;
        inputs.forEach(function(i) {
            if(i.type == 'checkbox')
                data[i.dataset.valuetype] = i.checked ? 'TR' : 'FL';
            else
                data[i.dataset.valuetype] = i.value;
        });

        return data;
    },

    renderCell = function(arr=[], params={}) {
        var cell = document.createElement('td');
        arr.map(function(el) {
            cell.append(el);
        });
        addProps(cell, params);
        
        return cell;
    },

    renderControlButtons = function(isEdit=false) {
        var btnClassList1 = [],
            btnClassList2 = [];
        if(isEdit) {
            btnClassList1.push('btn-table-save');
            btnClassList1.push('flaticon-save');
            btnClassList2.push('btn-table-cancel');
            btnClassList2.push('flaticon-close');
        } else {
            btnClassList1.push('btn-table-edit');
            btnClassList1.push('flaticon-edit');
            btnClassList2.push('btn-table-delete');
            btnClassList2.push('flaticon-delete');                
        }
        var el = document.createElement('div'),
            html =  '<div class="split-container">' +
                '<a class="splitbutton ' + btnClassList1.join(' ') + '"></a><a class="splitbutton ' + btnClassList2.join(' ') + '"></a>' +
                '</div>' +
                '<div class="split-container">' +
                '<a class="splitbutton btn-table-up flaticon-up-arrow"></a><a class="splitbutton btn-table-down flaticon-download"></a>' +
            '</div>';
        el.className = 'display-flex';
        el.innerHTML = html;
        
        return el;
    },

    // Row contents are assumed for now
    renderRow = function(data) {
        var row = document.createElement('tr');
        row.append(renderCell([
            renderInput({
                type:'hidden', 
                value: data.priority_level,
                dataset: {valuetype: 'priority_level'}
            }),
            renderTextSpan(ordinal_suffix_of(data.priority_level) + ' priority')
        ], {className:"legend"}));
        row.append(renderCell([
            renderSwitch(data.relay_status=="TR")
        ]));
        row.append(renderCell([
            renderInput({
                type: 'text',
                value: data.relay_id,
                classList: ['textbox-invisible'],
                dataset: {valuetype: 'relay_id'}
            })
        ]));
        row.append(renderCell([
            renderInput({
                type: 'text',
                value: data.load_name,
                classList: ['textbox-invisible'],
                dataset: {valuetype: 'load_name'}
            }),
        ]));
        row.append(renderCell([
            renderControlButtons()
        ]));

        row.id = data.id;
        addEvent(row, 'rowDeleted', updateRowsOnDelete);
        addEvent(row, 'rowIndexChanged', updateRowOnIndexChange);
        
        return row;
    },

    renderTableHead = function() {
        // column header values are assumed. For now.
        var tableHead = document.createElement('thead');
        tableHead.innerHTML = '<th></th><th></th>' +
            '<th>relay id</th>' +
            '<th>load name</th>' + 
            '<th><div style="margin-right: 10px"><a class="btn-green btn-table-add">add</a></div></th>';

        return tableHead;
    },

    renderTableBody = function(data) {
        var tableBody = document.createElement('tbody');
        data.map((value) => {
           tableBody.appendChild(renderRow(value)); 
        });

        return tableBody;
    },

    isRow = function(el) {
        return el.toString() === '[object HTMLTableRowElement]';
    },

    getParentRow = function(obj) {
        let el = obj;
        while(!isRow(el = el.parentNode));

        return el;
    },

    extend = function(to, from, overwrite) {
        var prop, hasProp;
        for (prop in from) {
            hasProp = to[prop] !== undefined;
            if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
                if (isDate(from[prop])) {
                    if (overwrite) {
                        to[prop] = new Date(from[prop].getTime());
                    }
                }
                else if (isArray(from[prop])) {
                    if (overwrite) {
                        to[prop] = from[prop].slice(0);
                    }
                } else {
                    to[prop] = extend({}, from[prop], overwrite);
                }
            } else if (overwrite || !hasProp) {
                to[prop] = from[prop];
            }
        }
        return to;
    },

    ordinal_suffix_of = function(i) {
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }

        return i + "th";
    },

    randString = function(length=2) {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
    },

    makeid = function (length=2) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
     },

    saveRecord = function(data) {
        sendRequest(data, 'POST');
    },

    deleteRecord = function(data) {
        sendRequest(data, 'DELETE');
    },

    // TODO: Apparently, GET requests can't have parameters which means
    //  this function needs to be changed later
    sendRequest = function(payload, method="GET") {
        fetch(url, {
            method: method,
            mode: 'same-origin',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(function(response) {
            return response.text();
        }).then(function(data) {
            console.log('priotable request:', data);
        });
    },

    updateRowsOnDelete = function(e) {
        var el = e.target;
        if(hasClass(el, 'temp')) return;
        do {
            let input = el.querySelector('input[type="hidden"'),
                span = el.querySelector('span');
            input.value = el.rowIndex;
            span.innerText = ordinal_suffix_of(el.rowIndex)+' priority';
            saveRecord(rowToJSON(el));
            el = el.nextElementSibling;
        } while(el);
    },

    updateRowOnIndexChange = function(e) {
        var el = e.target,
            legendCell = el.querySelector('.legend'),
            input = legendCell.querySelector('input'),
            span = legendCell.querySelector('span');
        input.value = el.rowIndex;
        span.innerText = ordinal_suffix_of(el.rowIndex)+' priority';
        saveRecord(rowToJSON(el));
    },

    ev_delete = new Event('rowDeleted'),

    ev_index_changed = new Event('rowIndexChanged'),

    defaults = {},

    url = "http://localhost/iotdashboard/requests/Loads.php",

    Priotable = function(options) {
        var self = this,
            opts = self.config(options);

        self._onClick = function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;

            if(hasClass(target, 'btn-table-add')) {
                self.addRow();
            }
            if(hasClass(target, 'btn-table-edit')) {
                self.activateRow(getParentRow(target));
            }
            if(hasClass(target, 'btn-table-save')) {
                let row = getParentRow(target),
                    textboxes = row.querySelectorAll('input[type="text"]'),
                    hasError=false;
                textboxes.forEach(function(textbox) {
                    if(textbox.value == "") {
                        addClass(textbox, 'has-error');
                        hasError = true;
                    }
                });
                if(!hasError) {
                    self.deactivateRow(row);
                    saveRecord(rowToJSON(row));
                }
            }
            if(hasClass(target, 'btn-table-delete')) {
                // This will do for now. Probably add modal for confirmation 
                // or a little popup box or something.
                if(confirm("Are you sure you want to delete this load?"))
                    self.deleteRow(getParentRow(target));
            }
            if(hasClass(target, 'btn-table-cancel')) {
                let row = getParentRow(target);
                if(hasClass(row, 'temp'))
                    self.deleteRow(row);
                else
                    self.deactivateRow(row);
            }
            if(hasClass(target, 'btn-table-up')) {
                self.moveRowUp(getParentRow(target));
            }
            if(hasClass(target, 'btn-table-down')) {
                self.moveRowDown(getParentRow(target));
            }
        };

        self._onChange = function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (target.type && target.type === 'checkbox') {
                var row = getParentRow(target);
                saveRecord(rowToJSON(row));
            }
        };

        self.addRow = function() {
            var row = document.createElement('tr'),
                numrows = self.getNumberOfRows();
            row.append(renderCell([
                renderInput({
                    type:'hidden', 
                    value: numrows + 1,
                    dataset: {valuetype: 'priority_level'}
                }),
                renderTextSpan(ordinal_suffix_of(numrows + 1) + ' priority')
            ], {className:"legend"}));
            row.append(renderCell([
                renderSwitch(false)
            ]));
            row.append(renderCell([
                renderInput({
                    type: 'text',
                    classList: ['textbox-default'],
                    dataset: {valuetype: 'relay_id'}
                })
            ]));
            row.append(renderCell([
                renderInput({
                    type: 'text',
                    classList: ['textbox-default'],
                    dataset: {valuetype: 'load_name'}
                }),
            ]));
            row.append(renderCell([
                renderControlButtons(true)
            ]));
            var tbody = self._t.querySelector('tbody');
            row.className = "active-row temp";
            row.id = makeid(6);
            addEvent(row, 'rowDeleted', updateRowsOnDelete);
            addEvent(row, 'rowIndexChanged', updateRowOnIndexChange);
            tbody.append(row);
        };

        self.updateRow = function(data) {
            var row = self._t.querySelector('tr#'+data.id),
                inputs = row.querySelectorAll('input');
            inputs.forEach(function(el) {
                if(el.dataset.valuetype === 'priority_level') return; // Skip changes on priority level. For now.
                if(el.type === 'checkbox')
                    el.checked = data[el.dataset.valuetype] === 'TR';
                else
                    el.value = data[el.dataset.valuetype];
            });
        };

        self.deleteRow = function(el) {
            var tableBody = self._t.querySelector('tbody'),
                next = el.nextElementSibling;
            tableBody.removeChild(el);
            if(hasClass(el, 'temp')) return;
            deleteRecord(rowToJSON(el));
            if(next) next.dispatchEvent(ev_delete);
        };

        self.deactivateRow = function(obj) {
            let row = obj,
                textboxes = row.querySelectorAll('input.textbox-default'),
                controlCell = row.querySelector('td:last-child');
            textboxes.forEach(function(textbox) {
                removeClass(textbox, 'textbox-default');
                removeClass(textbox, 'has-error');
                addClass(textbox, "textbox-invisible");
            });
            row.removeChild(controlCell);
            row.append(renderCell([renderControlButtons(false)]));
            row.removeAttribute('class');
        };

        self.activateRow = function(obj) {
            var row = obj,
                textboxes = row.querySelectorAll('input.textbox-invisible'),
                controlCell = row.querySelector('td:last-child');
            textboxes.forEach(function(textbox) {
                removeClass(textbox, 'textbox-invisible');
                addClass(textbox, 'textbox-default');
            });
            row.removeChild(controlCell);
            row.append(renderCell([renderControlButtons(true)]));
            addClass(row, 'active-row');
        };

        self.getNumberOfRows = function() {
            return self._t.querySelectorAll("tbody tr").length;
        };

        self.moveRowUp = function(obj) {
            var row = obj,
                prev = row.previousElementSibling,
                parent = row.parentNode;
            if(!prev) {
                let row_length = parent.children.length;
                prev = parent.children[row_length-1];
                parent.insertBefore(row, prev);
                parent.insertBefore(prev,row);
                for(var i=0;i < parent.children.length;i++)
                    parent.children[i].dispatchEvent(ev_index_changed);
                return;
            }
            parent.insertBefore(row, prev);
            row.dispatchEvent(ev_index_changed);
            prev.dispatchEvent(ev_index_changed);
        };

        self.moveRowDown = function(obj) {
            var row = obj,
                next = row.nextElementSibling,
                parent = row.parentNode;
            if(!next) {
                next = parent.children[0];
                parent.insertBefore(row, next);
                for(var i = 0; i < parent.children.length;i++)
                    parent.children[i].dispatchEvent(ev_index_changed);
                return;
            }
            parent.insertBefore(row, next.nextElementSibling);
            row.dispatchEvent(ev_index_changed);
            next.dispatchEvent(ev_index_changed);
        };

        self.drawTable();
        addEvent(self._t, 'click', self._onClick, true);
        addEvent(self._t, 'change', self._onChange, true);

        var socket = io.connect('http://localhost:3000');
        socket.on('loadlist_update', self.updateRow);
        // TODO: Probably listen to loadlist_delete.
        //      Check if the row still exists then delete it from the nodelist.
    };

    Priotable.prototype = {
        config: function(options)  {
            if(!this._o) {
                this._o = extend({}, defaults, true);
            }
            var opts = extend(this._o, options, true);
            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;
            opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;
            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

            return opts;
        },
        
        drawTable: function() {
            var table = document.createElement('table');
                table.className = "priotable";
            table.append(renderTableHead());
            fetch(url).then((res) => res.json())
                .then((data) => {
                    // console.log('priotable request(drawTable method):',data);
                    table.append(renderTableBody(data));
                })
                .catch((error) => console.log(error));

            this._o.container.append(table);
            this._t = table;
        }
    };

    return Priotable;
});
