export class Extender {
    static extend() {
        /**
         * send GET request with JSON response
         * @param {String} url
         * @param {Object} params - request parameters in JSON format
         * @param {function} callback - function to be called on success
         * @returns {undefined}
         */

        $.getJSONData = function (url, params, callback) {
            $.ajax({
                type: "GET",
                url: url + '?json=' + encodeURIComponent(JSON.stringify(params)),
                data: {},
                contentType: 'application/json',
                dataType: 'json',
                success: function (data) {
                    if (callback) {
                        callback(data);
                    }
                }
            });
        };

        /**
         * send POST request with JSON response
         * @param {String} url
         * @param {Object} params - request parameters in JSON format
         * @param {function} callback - function to be called on success
         * @param {Object} customParams - additional parameters
         * @returns {undefined}
         */
        $.postJSON = function (url, params, callback, customParams) {
            var ajaxParams = {
                type: "POST",
                url: url,
                data: JSON.stringify(params),
                contentType: 'application/json',
                dataType: 'json'
            };
            if (customParams) {
                ajaxParams.customParams = customParams;
            }
            ajaxParams.success = function (data) {
                if (data && this.customParams) {
                    data.customParams = this.customParams;
                }
                if (callback) {
                    callback(data);
                }
            };
            $.ajax(ajaxParams);
        };

        /**
         * Remove item from array
         */
        Array.prototype.removeOneItem = function (item) {
            if (item !== undefined) {
                var i = this.indexOf(item);
                if (i !== -1) {
                    this.splice(i, 1);
                }
            }
        };

        Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });

        Handlebars.registerHelper('amp', function (href) {
            return OYO.utils.addDeviceTypeToURL(href);
        });
    }
}
