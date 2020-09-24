/****************************
 * Valid date formats
 * 2020/04/23
 * 04/23/2020
 * 04/23/20
 * 2020-04-23
 * 2017, Jan 23
 * Jan 23, 2017
 ****************************/
class DateStringFormatter {
    constructor() {}

    _isDate(obj) {
        return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
    }

    _isString(str) {
        return typeof str === 'string';
    }

    _getMonthName(dateObj) {
        if (!this._isDate(dateObj)) {
            return;
        }
        return dateObj.toLocaleString('default', {
            month: 'long'
        });
    }

    // TODO: Leaving week string validation to this for now. Will improve the code once I learned more about regex date string validation.
    //       This is not a perfect/reliable method and I think regex would make it greatly better.
    /**
     * Week string is assumed to be in short format:
     *      03/01/2020_03/08/2020
     *      03/01/20_03/08/20
     *      2020/03/01_2020/03/08
     *      2020-03-01 - 2020-03-01
     * 
     * May probably validate other formats in the future.
     * I don't actually know if it's necessary to write vanilla code for date validation. 
     * I think momentjs would probably be enough. But I guess it's for learning purposes.
     */
    _isValidWeekString(weekString, separator) {
        if (!this._isString(weekString)) return false;
        var arr = weekString.split(separator);
        if (arr.length > 2) return false;
        if (this._hasMoment) return moment(arr[0]).isValid() && moment(arr[1]).isValid();
        return this._isDate(new Date(arr[0])) && this._isDate(new Date(arr[1]));
    }

    getCurrentDateString(formatString) {
        return moment().format(formatString);
    }

    getDateString(date, formatString) {
        if (!date) throw new Error('date parameter is required');
        return moment(date).format(formatString);
    }


    // Sunday, Monday, Tuesday, Wednesday, Thursday, Friday
    // 0, 1, 2, 3, 4, 5, 6

    getWeekString(date, formatString, separator = ' - ') {
        var day = date.getDay(),
            d1 = 0 - day, // offset from sunday
            sundayDate = new Date(date.getTime() + (d1 * 24 * 60 * 60 * 1000)),
            d2 = 6 - day, // offset from saturday
            saturdayDate = new Date(date.getTime() + (d2 * 24 * 60 * 60 * 1000)),
            dateArr = [];
        dateArr.push(this.getDateString(sundayDate, formatString));
        dateArr.push(this.getDateString(saturdayDate, formatString));

        return dateArr.join(separator);
    }

    getLocaleWeekString(date, separator = ' - ') {
        var sundayDate = date.getDate() - date.getDay(),
            sunday = new Date(date.setDate(sundayDate)),
            saturday = new Date(date.setDate(sundayDate + 6));
        return sunday.toLocaleDateString() + separator + saturday.toLocaleDateString();
    }

    replaceDateSeparator(dateString, replacement) {
        if (typeof dateString === 'string' && typeof replacement === 'string')
            return dateString.split(/[/-]/).join(replacement);
    }

    toLongWeekString(weekString, separator) {
        if (!this._isValidWeekString(weekString, separator)) return;
        if (typeof weekString === 'string' && typeof separator === 'string')
            return weekString.split(separator).map(this.toLongDateString, this).join(separator);
    }

    toLongDateString(dateObj) {
        if (dateObj && typeof dateObj === 'string' && !this._isDate(new Date(dateObj))) {
            return;
        }
        if (this._hasMoment) {
            return moment(dateObj).format('MMMM DD, YYYY'); // TODO: this assumes that moment already exists.
        } else {
            var d = new Date(dateObj),
                arr = [];
            arr.push(this._getMonthName(d));
            arr.push(d.getDate() + ',');
            arr.push(d.getFullYear());

            return arr.join(' ');
        }
    }
}
