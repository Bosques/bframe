var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        NamedFactory.prototype.regist = function (item) {
            this.cache[item.name] = item;
        };
        NamedFactory.prototype.get = function (name) {
            return this.cache[name];
        };
        return NamedFactory;
    }());
    exports.NamedFactory = NamedFactory;
    var NamedObject = (function () {
        function NamedObject(name, ignoreCase) {
            this.ignoreCase = ignoreCase;
            this._name = ignoreCase ? name.toLowerCase() : name;
        }
        Object.defineProperty(NamedObject.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        return NamedObject;
    }());
    exports.NamedObject = NamedObject;
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
define("web/modules/noder", ["require", "exports", "common"], function (require, exports, core) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Noder = (function (_super) {
        __extends(Noder, _super);
        function Noder() {
            return _super.call(this) || this;
        }
        Noder.prototype.parse = function (entry) {
            var entries = this.getentries(entry);
            var self = this;
            var items = [];
            core.all(entries, function (it, i) {
                var factory = self.get(it.tagName);
                if (factory) {
                    core.add(items, new ModuleItem(factory, it));
                }
            });
        };
        Noder.prototype.getentries = function (entry) {
            var entryEls = entry;
            if (typeof (entry) == 'string') {
                entryEls = [];
                var list = document.querySelectorAll(entry);
                core.all(list, function (it, i) {
                    core.add(entryEls, it);
                });
            }
            else if (entry instanceof Array) {
                entryEls = [];
                core.all(entry, function (it, i) {
                    if (typeof (it) == 'string') {
                        var list = document.querySelectorAll(it);
                        core.all(list, function (item, idx) {
                            core.add(entryEls, item);
                        });
                    }
                    else if (it instanceof Array) {
                        core.all(it, function (item, idx) {
                            core.add(entryEls, item);
                        });
                    }
                    else {
                        core.add(entryEls, it);
                    }
                });
            }
            else {
                entryEls = [entry];
            }
            return entryEls;
        };
        return Noder;
    }(core.NamedFactory));
    exports.Noder = Noder;
    var ModuleFactory = (function (_super) {
        __extends(ModuleFactory, _super);
        function ModuleFactory(name) {
            return _super.call(this, name, true) || this;
        }
        return ModuleFactory;
    }(core.NamedObject));
    exports.ModuleFactory = ModuleFactory;
    var ModuleItem = (function () {
        function ModuleItem(factory, target) {
            this.factory = factory;
            this.target = target;
        }
        return ModuleItem;
    }());
    exports.ModuleItem = ModuleItem;
});
define("core", ["require", "exports", "info", "common", "web/modules/noder"], function (require, exports, info_1, common_2, noder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var noder = new noder_1.Noder();
    function init(callback) {
        if (callback) {
            callback(noder);
        }
        info_1.log("Core module loaded");
    }
    exports.init = init;
    var w = window;
    w.test = [];
    common_2.add(w.test, 'success');
});
