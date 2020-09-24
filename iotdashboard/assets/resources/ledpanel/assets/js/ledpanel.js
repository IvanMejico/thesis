(function(root, factory) {
    'use strict';

    root.LedPanel = factory();
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

    renderIndicator = function(id, color="red", text="", status=false) {
        var el = document.createElement('div');
        el.className = 'ledcell';
        el.id = id;
        el.append(renderTextSpan(text));
        el.append(renderCheckbox(status));
        el.append(renderLed(color));

        return el;
    },

    renderLed = function(color) {
        var el = document.createElement('div');
        el.className = "led led-"+color;
        
        return el;
    },
    
    renderTextSpan = function(text) {
        var el = document.createElement('span');
        el.innerText = text;

        return el;
    },

    renderCheckbox = function(isChecked=false) {
        var el = document.createElement('input');
        el.type = 'checkbox';
        el.checked = isChecked;

        return el;
    },

    updateTextSpan = function(el, text) {
        if(el.toString() !== '[object HTMLSpanElement]') return;
        el.innerText = text;
    },

    updateCheckbox = function(el, isChecked) {
        if(isChecked === undefined) return;
        if(el.toString() !== '[object HTMLInputElement]' && el.type !== 'checkbox') return;
        el.checked = isChecked;
    },

    colorset = [
        'red', 
        'yellowgreen', 
        'orange', 
        'yellow', 
        'violet',
        'blue', 
        'purple',
        'pink',
        'tiel',
        'skyblue',
        'magenta'
    ],

    defaults = {},

    url = "http://localhost/iotdashboard/requests/Loads.php",

    LedPanel = function(options) {
        var self = this,
            opts = self.config(options);
        
        self.updateIndicator = function(data) {
            var checkbox = self._panel.querySelector('#indicator-'+data.id+' input'),
                span = self._panel.querySelector('#indicator-'+data.id+' span');
            updateCheckbox(
                checkbox, 
                data.relay_status === 'TR'
            );
            updateTextSpan(
                span,
                data.load_name
            );
        };

        self.addIndicator = function(data) {
            self._panel.append(renderIndicator(
                'indicator-'+data.id,
                colorset[data.priority_level],
                data.load_name,
                data.relay_status === 'TR'
            ));
        };

        self.deleteIndicator = function(data) {
            var el = self._panel.querySelector('#indicator-'+data.id);
            self._panel.removeChild(el);
        };

        var socket = io.connect('http://localhost:3000');
        socket.on('loadlist_insert', self.addIndicator);
        socket.on('loadlist_delete', self.deleteIndicator);
        socket.on('loadlist_update', self.updateIndicator);
        
        self.drawPanel();
    };

    LedPanel.prototype = {
        config: function(options)  {
            if(!this._o)
                this._o = extend({}, defaults, true);
            var opts = extend(this._o, options, true);

            return opts;
        },

        drawPanel: function() {
            var el = document.createElement('div');
            el.className = 'led-container';
            fetch(url, {
                method: 'GET',
                mode: 'same-origin',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((data) => {
                // console.log('ledpanel request(drawPanel method):',data);
                data.map(function(val, i) {
                    el.append(renderIndicator(
                        'indicator-'+val.id,
                        colorset[i],
                        val.load_name,
                        val.relay_status === 'TR'
                    ));
                });
            });
            this._o.container.append(el);
            this._panel = el;
        }
    };

    return LedPanel;
});