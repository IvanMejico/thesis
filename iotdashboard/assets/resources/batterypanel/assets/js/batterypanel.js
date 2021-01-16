(function(root, factory) {
    'use strict';

    root.BatteryPanel = factory();
})(window, function() {
    'use strict';

    var document = window.document,

    sto = window.setTimeout,

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

    renderCell = function(data, isOn=false) {
        var el = document.createElement('div');
        var clist = [];
        clist.push('charge-cell');
        if(isOn)
            clist.push('charged');
        else
            clist.push('discharged');
        el.classList.add(...clist);
        el.dataset.priority_level = data.priority_level;
        el.dataset.load_name = data.load_name;
        el.innerText = 'Priority ' + data.priority_level;

        return el;
    },

    defaults = {},

    url = {
        loads: "http://192.168.254.10/iotdashboard/requests/relay.php?type=client",
        soc: "http://192.168.254.10/iotdashboard/requests/socstatus.php",
    },

    BatteryPanel = function(options) {
        var self = this,
            opts =  self.config(options);

        self._renderBattery = function(data) {
            var parent = document.createElement('div'),
                tip = document.createElement('div'),
                body = document.createElement('div'),
                level = document.createElement('div');
            parent.className = 'battery';
            body.className = 'battery-body';
            tip.className = 'battery-tip';
            level.className = 'level-text';
            fetch(url.soc, {
                method: 'GET',
                mode: 'same-origin',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((socdata) => {
                var arr = data.reverse(),
                    soc = self.soc = socdata.level,
                    cpc = 100/arr.length;
                let nodes = arr.map(function(value, index) {
                                let c = 100-(cpc*(index+1));
                                return renderCell(value, soc > c);
                            });
                level.innerText = soc + '%';
                body.append(...nodes);
            });
            parent.append(body);
            parent.append(tip);
            parent.append(level);
    
            return parent;
        };

        self.refreshCells = function() {
            fetch(url.loads)
            .then((res) => res.json())
            .then((data) => {
                let cells = opts.container.querySelectorAll('.battery .battery-body div.charge-cell');
                cells.forEach(function(cell, index) {
                    var priolevel = parseInt(cell.dataset.priority_level),
                        n = data.length,
                        arr = data.reverse(),
                        cpc = 100/n,
                        leftCharge = 100-(cpc*(index+1));
                    cell.dataset.load_name = arr[index].load_name;
                    if(self.soc > leftCharge)  {
                        removeClass(cell, 'discharged');
                        addClass(cell, 'charged');
                    } else {
                        removeClass(cell, 'charged');
                        addClass(cell, 'discharged');
                    }
                });
            })
            .catch((error) => console.log("Battery Panel(refreshCells) Error:", error));
        };

        self.addCell = function(data) {
            var el = opts.container.querySelector('.battery .battery-body');
            el.insertBefore(renderCell(data), el.children[0]);
            self.refreshCells();
        };

        self.deleteCell = function() {
            var el = opts.container.querySelector('.battery .battery-body');
            el.removeChild(el.children[0]);
            self.refreshCells();
        };

        self.updateSOC = function(data) {
            var el = opts.container.querySelector('.battery .level-text');
            el.innerText = data.level + '%';
            self.soc = data.level;
            self.refreshCells();
        };

        self.updateCellData = function(data) {
            self.refreshCells();
        };

        var socket = io.connect('http://192.168.254.10:3000');
        socket.on('loadlist_insert', self.addCell);
        socket.on('loadlist_update', self.updateCellData);
        socket.on('loadlist_delete', self.deleteCell);
        socket.on('battery_update', self.updateSOC);

        self.draw();
    };

    BatteryPanel.prototype = {
        config: function(options)  {
            if(!this._o)
                this._o = extend({}, defaults, true);
            var opts = extend(this._o, options, true);

            return opts;
        },

        draw: function() {
            fetch(url.loads)
            .then((res) => res.json())
            .then((data) => {
                // console.log('batterypanel request(draw method)', data);
                let el = this._renderBattery(data);
                this._o.container.append(el);
                this._panel = el;
            })
            .catch((error) => console.log("Battery Panel (draw) Error:", error)); 
        }
    };

    return BatteryPanel;
});
