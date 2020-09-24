(function (root, factory) {
    'use strict';

    if (typeof exports === 'object') {
        // CommonJS module
        // Load moment.js as an optional dependency
        try { moment = require('moment'); } catch (e) {}
        module.exports = factory(moment);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function (req) {
            // Load moment.js as an optional dependency
            var id = 'moment';
            try { moment = req(id); } catch (e) {}
            return factory(moment);
        });
    } else {
        root.Pikamonth = factory(root.moment);
    }

    root.Pikamonth = factory(root.moment);
}(this, function(moment) {
    'use strict';

    var hasMoment = typeof moment === 'function',

    hasEventListeners = !!window.addEventListener,

    document = window.document,

    sto = window.setTimeout,

    addEvent = function(el, e, callback, capture) {
        if(hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    },

    trim = function(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    },

    removeEvent = function(el, e, callback, capture) {
        if(hasEventListeners) {
            el.removeEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
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

    isDate = function(obj)
    {
        return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
    },

    isValidMYObj = function(obj) {
        if(obj) {
            return typeof parseInt(obj.month) === 'number' && 
                typeof parseInt(obj.year) === 'number' && 
                (obj.month >=0 && obj.month <= 11);
        }
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

    getCurrentMonth = function() {
        return hasMoment ? parseInt(moment().format('M'))-1 : new Date().getMonth();
    },

    getCurrentYear = function() {
        return hasMoment ? parseInt(moment().format('YYYY')) : new Date().getFullYear();
    },

    getCurrentMY = function() {
        return {
            month: getCurrentMonth(),
            year:getCurrentYear()
        };
    },

    compareMonths = function(a,b) {
        if(typeof a === 'number' && defaults.months[a] !== undefined) {
            a = defaults.months[a];
        }
        if (typeof a === 'string' && !defaults.months.includes(a)) {
            return;
        }
        if(typeof b === 'number' && defaults.months[b] !== undefined) {
            b = defaults.months[b];
        }
        if (typeof b === 'string' & !defaults.months.includes(b)) {
            return;
        }
        return a === b;
    },

    defaults = {
        field: null,
        trigger: null,
        bound: undefined,
        defaultMY: null,
        minYear: 0,
        maxYear: 9999,
        container: undefined,
        position: 'bottom-left',
        reposition: true,
        months: ['January','February','March','April','May','June','July','August','September','October','November','December'],

        // callback functions
        onSelect: null,
        onOpen: null,
        onClose: null,
        onDraw: null
    },
    


    /**
     * Templating functions to abstract HTML rendering
     */

    renderTitle = function(year) {
        // TODO: perhaps some validation would be necessary
        var y = year ? year : getCurrentYear();
        var html = '';
        html += `<div class="picka-title">
                    <button type="button" class="picka-prev" value="prev">◄</button>
                    <button type="button" class="mp-year" value="${y}">${y}</button>
                    <button type="button" class="picka-next" value="next">◄</button>
                </div>`;
        return html;
    },

    renderMonth = function(opts) {
        var arr = [];
        if(opts.isCurrentMonth) {
            arr.push('is-current-month');
        }
        if(opts.isSelected) {
            arr.push ('is-selected');
        }

        return`<span class="picka-button ${arr.join(' ')}" data-month="${opts.monthNumber}" data-year="${opts.yearNumber}">${defaults.months[opts.monthNumber]}</span>`;
    },

    Pikamonth = function(options) {
        var self = this,
            opts = self.config(options);

        self.parseFieldValue = function() {
            var arr =  trim(opts.field.value).split(" ");            
            if(typeof parseInt(arr[0]) === 'number' && defaults.months.includes(arr[0])) {
                if(typeof parseInt(arr[1]) === 'number') {
                    return { 
                        month: arr[0],
                        year: arr[1]
                    };
                }
            }
        };

        self._onMouseDown = function(e) {
            if(!self._v) {
                return;
            }

            e = e || window.event;
            var target = e.target || e.srcElement;
            if(!target) {
                return;
            }

            if(!hasClass(target, 'is-disabled')) {
                if(hasClass(target, 'picka-button')) {
                    self.setMY({
                        month: parseInt(target.getAttribute('data-month')),
                        year: parseInt(target.getAttribute('data-year'))
                    });
                    if(opts.bound) {
                        sto(function() {
                            self.hide();
                            if(opts.blurFieldOnSelect && opts.field) {
                                opts.field.blur();
                            }
                        }, 100);
                    }
                } else if (hasClass(target, 'picka-prev')) {
                    self.prevYear();
                } else if (hasClass(target, 'picka-next')) {
                    self.nextYear();
                }
            }

            if (!hasClass(target, 'picka-change')) {
                // TODO Changes picker year. Year grid gets drawn and user will be able to pick from one of them.
                // TODO next and prev will navigate through hears (redraws year grid)
            }

            // if this is touch event prevent mouse events emulation
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
                return false;
            }
        };

        self._onInputChange = function(e) {
            var monthAndYear;

            if (e.firedBy === self) {
                return;
            }
            monthAndYear = self._parseFiedValue();
            if (isMonthAndYear()) {
                self.setMY(month, year);
            }
            if (!self._v) {
                self.show();
            }
        };

        self._onKeyChange = function(e) {
            e = e || window.event;

            if (self.isVisible()) {

                switch(e.keyCode){
                    case 13:
                    case 27:
                        if (opts.field) {
                            opts.field.blur();
                        }
                        break;
                    case 37:
                        self.adjustMonth('subtract', 1);
                        break;
                    case 38:
                        self.adjustMonth('subtract', 3);
                        break;
                    case 39:
                        self.adjustMonth('add', 1);
                        break;
                    case 40:
                        self.adjustMonth('add', 3);
                        break;
                    case 8:
                    case 46:
                        self.setDate(null);
                        break;
                }
            }
        };

        self._onInputClick = function() {
            self.show();
        };

        self._onInputBlur = function() {
            var pEl = document.activeElement;
            do {
                if (hasClass(pEl, 'picka-single')) {
                    return;
                }
            } while ((pEl = pEl.parentNode));

            if (!self._c)      {
                self._b = sto(function() {
                    self.hide();
                }, 50);
            }
            self._c = false;
        };

        self._onInputFocus = function() {
            self.show();
        };

        self._onClick = function(e) {
            e = e || window.event;
            var target = e.target || e.srcElement,
                pEl = target;
            if (!target) {
                return;
            }
            if (!hasEventListeners && hasClass(target, 'mp-year')) {
                if (!target.onchange) {
                    target.setAttribute('onchange', 'return;');
                    addEvent(target, 'change', self._onChange); // TODO: could be changed to accomodate a button control rather than a select box
                }
            }
            do {
                if (hasClass(pEl, 'picka-single') || pEl === opts.trigger) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));
            if (self._v && target !== opts.trigger && pEl !== opts.trigger) {
                self.hide();
            }
        };

        self.el = document.createElement('div');
        self.el.className = 'picka-single';

        addEvent(self.el, 'mousedown', self._onMouseDown, true);
        addEvent(self.el, 'touchend', self._onMouseDown, true);
        addEvent(self.el, 'change', self._onChange);

        // if(opts.keyboardInput) { // TODO Implement this later
        //     addEvent(document, 'keydown', self._onkeyChange);
        // }

        if (opts.field) {
            if (opts.container) {
                opts.container.appendChild(self.el);
            } else if (opts.bound) {
                document.body.appendChild(self.el);
            } else {
                opts.field.parentNode.insertBefore(self.el, opts.field, nextSibling);
            }
            addEvent(opts.field, 'change', self._onInputChange); // TODO _onInputChange

            if (!opts.defaultMY) {
                opts.defaultMY = self.parseFieldValue();
                opts.setDefaultMY = true;
            }

            var defMY = opts.defaultMY;

            if (isValidMYObj(defMY)) {
                if (opts.setDefaultMY) {
                    self.setMY(defMY, true);
                } else {
                    self.gotoMY(defMY);
                }
            } else {
                self.gotoMY(getCurrentMY());
            }
        }

        if(opts.bound) {
            self.hide();
            self.el.className += ' is-bound';
            addEvent(opts.trigger, 'click', self._onInputClick);
            addEvent(opts.trigger, 'focus', self._onInputFocus);
            addEvent(opts.trigger, 'blur', self._onInputBlur);
        } else {
            self.show();
        }
    };
    
    Pikamonth.prototype = {
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

        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function() {
            // TODO: if it doesn't validate return an empty string
            if(!isValidMYObj(this._MY)) {
                return '';
            }
            return defaults.months[this._MY.month] + ' ' + this._MY.year;
        },

        setMY: function(obj, preventOnSelect) {
            if(!obj) {
                this._MY = null;

                if (this._o.field) {
                    this._o.field.value = '';
                    fireEvent(this._o.field, 'change', { firedBy: this });
                }
                return this.draw();
            }

            if(!isValidMYObj(obj)) {
                return;
            }

            // TODO: min and max year value assignment

            var minYear = this._o.minYear,
                maxYear = this._o.maxyear;

            if(typeof minYear === 'number' && obj.year < minYear) {
                obj.year = minYear;
            } else if (typeof maxYear === 'number' && obj.year > maxYear) {
                obj.year = maxYear;
            }

            this._MY = obj;
            this.gotoMY(this._MY);

            if (this._o.field) {
                this._o.field.value = this.toString();
                fireEvent(this._o.field, 'change', { firedBy: this});
            }

            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
                this._o.onSelect.call(this, this._MY);
            }
        },

        gotoMY: function (obj) {
            var newPicker = true;

            if (!isValidMYObj) {
                return;
            }

            if (this.pickers) {
                newPicker = obj.year !== this._MY.year;
            }

            if (newPicker) {
                this.picker = {
                    month: obj.month,
                    year: obj.year
                };
            }

            this.adjustPickers(); 
        },

        nextYear: function() {
            this.picker.year++;
            this.adjustPickers();
        },

        prevYear: function() {
            this.picker.year--;
            this.adjustPickers();
        },

        adjustPickers: function() {
            // TODO
            this.draw();
        },

        isVisible: function() {
            return this._v;
        },

        show: function() {
            // If not visible, show it
            if(!this.isVisible()) {
                this._v = true;
                this.draw();
                removeClass(this.el, 'is-hidden');
                if (this._o.bound) {
                    addEvent(document, 'click', this._onClick);
                    this.adjustPosition();
                }
                if (typeof this._o.onOpen === 'function') {
                    this._o.onOpen.call(this);
                }
            }
        },

        hide: function() {
            // If visible, hide it
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    removeEvent(document, 'click', this._onClick);
                }
                this.el.style.position = 'static'; // reset
                this.el.style.left = 'auto';
                this.el.style.top = 'auto';
                addClass(this.el, 'is-hidden');
                this._v = false;
                if(v !== undefined && typeof this._o.onClose === 'function') {
                    this._o.onClose.call(this);
                }
            }
        },

        adjustPosition: function() {
            var field, pEl, width, height, viewportWidth, viewportHeight, scrollTop, left, top, clientRect, leftAligned, bottomAligned;

            if (this._o.container) return;

            this.el.style.position = 'absolute';

            field = this._o.trigger;
            pEl = field;
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
            viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
            leftAligned = true;
            bottomAligned = true;

            if (typeof field.getBoundingClientRect === 'function') {
                clientRect = field.getBoundingClientRect();
                left = clientRect.left + window.pageXOffset;
                top = clientRect.bottom + window.pageYOffset;
            } else {
                left = pEl.offsetLeft;
                top  = pEl.offsetTop + pEl.offsetHeight;
                while((pEl = pEl.offsetParent)) {
                    left += pEl.offsetLeft;
                    top  += pEl.offsetTop;
                }
            }

            // default position is bottom & left
            if ((this._o.reposition && left + width > viewportWidth) ||
                (
                    this._o.position.indexOf('right') > -1 &&
                    left - width + field.offsetWidth > 0
                )
            ) {
                left = left - width + field.offsetWidth;
                leftAligned = false;
            }
            if ((this._o.reposition && top + height > viewportHeight + scrollTop) ||
                (
                    this._o.position.indexOf('top') > -1 &&
                    top - height - field.offsetHeight > 0
                )
            ) {
                top = top - height - field.offsetHeight;
                bottomAligned = false;
            }

            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';

            addClass(this.el, leftAligned ? 'left-aligned' : 'right-aligned');
            addClass(this.el, bottomAligned ? 'bottom-aligned' : 'top-aligned');
            removeClass(this.el, !leftAligned ? 'left-aligned' : 'right-aligned');
            removeClass(this.el, !bottomAligned ? 'bottom-aligned' : 'top-aligned');
        },

        render: function(year) {
            var months = [];
            var html = '<div class="month-grid">';
            for(var month=0; month<12; month++) {
                var isCurrentMonth = compareMonths(month, getCurrentMonth()),
                    isSelected = this._MY ? compareMonths(this._MY.month, month) : false; // TODO: may need more validation
                var monthConfig = {
                    isCurrentMonth: isCurrentMonth,
                    isSelected: isSelected,
                    monthNumber: month,
                    yearNumber: year
                };
                months.push(renderMonth(monthConfig));
            }
            html += months.join('');
            return html + '</div>';
        },

        draw: function(force) {
            if(!this._v && !force) {
                return;
            }

            var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                html = '';

            // TODO I've no use of this code yet ====
            // if (this._MY.year <= minYear) {
            //     this._MY.year = minYear;
            // }

            // if (this._MY.year >= maxYear) {
            //     this._MY.year = maxYear;
            // }
            // =======================================

            html = renderTitle(this.picker.year) + this.render(this.picker.year);
            this.el.innerHTML = html;
            
            if (opts.bound) {
                if(opts.field.type !== 'hidden') {
                    sto(function() {
                        opts.trigger.focus();
                    }, 1);
                }
            }

            if (typeof this._o.onDraw === 'function') {
                this._o.onDraw(this);
            }

            if (opts.bound) {
                // let the screen reader user know to use arrow keys
                opts.field.setAttribute('aria-label', opts.ariaLabel);
            }
        },

        /**
         * GAME OVER
         */
        destroy: function() {} // TODO
    };

    return Pikamonth;
}));