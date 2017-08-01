define("common", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function starts(target, prefix) {
        if (target === undefined || target === null || prefix === undefined) {
            return false;
        }
        if (!(prefix instanceof Array)) {
            prefix = [prefix];
        }
        var rlt = false;
        all(prefix, function (item, i) {
            if (target.indexOf(item) == 0) {
                rlt = true;
                return true;
            }
        });
        return rlt;
    }
    exports.starts = starts;
    function between(target, start, end) {
        return target && target.indexOf(start) == 0 && target.lastIndexOf(end) == target.length - end.length;
    }
    exports.between = between;
    function inbetween(target, start, end) {
        var sl = start ? start.length : 1;
        var el = end ? end.length : 1;
        if (target) {
            return target.substr(sl, target.length - sl - el);
        }
        return target;
    }
    exports.inbetween = inbetween;
    function extend(s, d, ig) {
        if (d) {
            for (var i in d) {
                if (!ig || !ig[i]) {
                    s[i] = d[i];
                }
            }
        }
    }
    exports.extend = extend;
    function find(target, field, val) {
        if (!target || !field) {
            return;
        }
        return all(target, function (item, i) {
            if (item[field] == val) {
                return true;
            }
        });
    }
    exports.find = find;
    function all(target, callback, prepare, last) {
        var rlt = null;
        if (callback) {
            if (target === undefined || target === null) {
                if (prepare) {
                    prepare();
                }
                return rlt;
            }
            if (target instanceof Array || target.length !== undefined) {
                if (prepare) {
                    prepare(true);
                }
                for (var i = 0; i < target.length; i++) {
                    if (callback(target[i], i, target)) {
                        rlt = target[i];
                        break;
                    }
                }
                if (!rlt && last) {
                    rlt = target[target.length - 1];
                }
            }
            else {
                if (prepare) {
                    prepare(false);
                }
                for (var i in target) {
                    if (callback(target[i], i, target)) {
                        rlt = target[i];
                        break;
                    }
                    else if (last) {
                        rlt = target[i];
                    }
                }
            }
        }
        return rlt;
    }
    exports.all = all;
    function uid(prefix) {
        if (!prefix) {
            prefix = '$u$';
        }
        var d = new Date();
        var s = prefix + "-" + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds() + Math.floor(Math.random() * 100) + "-" + d.getFullYear() + d.getMonth() + d.getDate();
        return s;
    }
    exports.uid = uid;
    function clone(target, id) {
        var KEY = "$cloneid$";
        id = id || uid('$cl$');
        if (target === undefined || target === null || typeof (target) != 'object') {
            return target;
        }
        var rlt = target;
        if (target[KEY] && target[KEY] == id) {
            return target;
        }
        all(target, function (item, i) {
            rlt[i] = clone(item, id);
        }, function (array) {
            if (array) {
                rlt = [];
            }
            else {
                rlt = {};
            }
            target[KEY] = id;
        });
        return rlt;
    }
    exports.clone = clone;
    function join(target, field) {
        var rlt = '';
        all(target, function (item, i) {
            rlt += field ? item[field] : item;
        });
        return rlt;
    }
    exports.join = join;
    function clear(target) {
        if (target) {
            while (target.length > 0) {
                target.pop();
            }
        }
        return target;
    }
    exports.clear = clear;
    function unique(target, item, comp) {
        if (!comp) {
            comp = function (a, b) {
                return a == b;
            };
        }
        var rlt = true;
        all(target, function (it, i) {
            if (comp(it, item)) {
                rlt = false;
                return true;
            }
        });
        return rlt;
    }
    exports.unique = unique;
    function add(target, item, isunique) {
        if (!isunique) {
            isunique = function (a, b) {
                return true;
            };
        }
        else if (isunique === true) {
            isunique = unique;
        }
        if (!target) {
            return [item];
        }
        if (target.length === undefined && isunique(target, item)) {
            return [target, item];
        }
        if (isunique(target, item)) {
            target[target.length] = item;
        }
        return target;
    }
    exports.add = add;
    function addrange(target, items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            add(target, item);
        }
    }
    exports.addrange = addrange;
    function diff(a, b, mode) {
        var modes = [1, 1000, 60, 60, 24]; // ms, second, minute, hour, day
        if (!mode) {
            mode = 0;
        }
        var d = a - b;
        var m = 1;
        for (var i = 0; i < mode; i++) {
            m *= modes[i];
        }
        return Math.floor(d / m);
    }
    exports.diff = diff;
    var Factory = (function () {
        function Factory() {
            this.list = [];
        }
        Factory.prototype.regist = function (item) {
            add(this.list, item);
        };
        return Factory;
    }());
    exports.Factory = Factory;
    var NamedFactory = (function () {
        function NamedFactory() {
            this.cache = {};
        }
        NamedFactory.prototype.regist = function (name, item) {
            this.cache[name] = item;
        };
        NamedFactory.prototype.get = function (name) {
            return this.cache[name];
        };
        return NamedFactory;
    }());
    exports.NamedFactory = NamedFactory;
});
define("info", ["require", "exports", "common"], function (require, exports, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function log(msg) {
        var list = [];
        common_1.add(list, "testDeclaration");
        console.log("[" + list.length + "]" + msg);
    }
    exports.log = log;
});
define("main", ["require", "exports", "info", "common"], function (require, exports, info_1, common_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function init() {
        info_1.log("Main module loaded");
    }
    exports.init = init;
    var w = window;
    w.test = [];
    common_2.add(w.test, 'success');
});