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
    function is(target, type) {
        return target instanceof type;
    }
    exports.is = is;
    function trigger(target, name, args) {
        var scope = target.scope;
        if (!scope) {
            scope = {};
        }
        var evthandler = scope["on" + name] || target["on" + name];
        if (evthandler) {
            return evthandler.apply(target, args);
        }
    }
    exports.trigger = trigger;
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
        function NamedFactory(caseSensitive) {
            this.caseSensitive = caseSensitive;
            this.cache = {};
        }
        NamedFactory.prototype.regist = function (item) {
            var name = item.name;
            if (!this.caseSensitive) {
                name = name.toLowerCase();
            }
            this.cache[name] = item;
        };
        NamedFactory.prototype.get = function (name) {
            var n = (!this.caseSensitive) ? name.toLowerCase() : name;
            return this.cache[n];
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
define("cursor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cursor = (function () {
        function Cursor() {
        }
        Object.defineProperty(Cursor.prototype, "childunit", {
            get: function () {
                var t = this.target;
                var at = t.getAttribute('alias');
                if (at) {
                    return this.target;
                }
                return this.unit || this.target;
            },
            enumerable: true,
            configurable: true
        });
        Cursor.check = function (target) {
            if (!target.cs) {
                var cs = new Cursor();
                cs.target = target;
                target.cs = cs;
            }
        };
        return Cursor;
    }());
    exports.Cursor = Cursor;
});
define("web/modules/operationode", ["require", "exports", "cursor"], function (require, exports, cursor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OperationNode = (function (_super) {
        __extends(OperationNode, _super);
        function OperationNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OperationNode.check = function (node, parent) {
            if (node.nodeName.indexOf('#') < 0) {
                cursor_1.Cursor.check(node);
                node.setalias = function (alias) {
                    var u = this.cs().unit;
                    u["$" + alias] = this;
                };
                node.cs = function () {
                    return this.cs;
                };
                node.scope = function () {
                    return this.md.scope;
                };
                return true;
            }
            return false;
        };
        return OperationNode;
    }(Element));
    exports.OperationNode = OperationNode;
});
define("web/elements", ["require", "exports", "common"], function (require, exports, common_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function addcss(target, name) {
        var classes = target.className.trim();
        if (classes.indexOf(name) != 0 && classes.indexOf(' ' + name) < 0) {
            var s = classes + " " + name;
            target.className = s;
        }
    }
    exports.addcss = addcss;
    function delcss(target, name) {
        var classes = target.className.trim();
        if (classes.indexOf(name) == 0 || classes.indexOf(' ' + name) >= 0) {
            var s = classes.replace(name, '');
            target.className = s;
        }
    }
    exports.delcss = delcss;
    function destroy(target) {
        var b = document.body;
        if (!b.$destroyer$) {
            b.$destroyer$ = document.createElement('div');
        }
        if (!target) {
            return;
        }
        common_2.all(target, function (item, i) {
            if (common_2.starts(i, ['$', '_'])) {
                item[i] = null;
            }
        });
        var d = b.$destroyer$;
        d.appendChild(target);
        d.innerHTML = '';
    }
    exports.destroy = destroy;
    function evtarget(event, callback) {
        var el = event.target || event.srcElement;
        if (callback) {
            return callback(el);
        }
        return el;
    }
    exports.evtarget = evtarget;
    function make(html) {
        var d = document;
        if (!d.$tmp$) {
            d.$tmp$ = document.createElement('div');
        }
        var t = d.$tmp$;
        t.className = 'child-wrap';
        t.innerHTML = html;
        if (t.childNodes.length > 1) {
            d.$tmp$ = null;
            return t;
        }
        return t.firstChild;
    }
    exports.make = make;
    function create(html, multiple) {
        var b = document.body;
        if (!b.$creator$) {
            b.$creator$ = document.createElement('div');
        }
        var div = b.$creator$;
        div.innerHTML = html;
        var rlt = [];
        common_2.all(div.childNodes, function (n, i) {
            common_2.add(rlt, n);
        });
        div.innerHTML = '';
        return multiple ? rlt : rlt[0];
    }
    exports.create = create;
    function astyle(styles, val) {
        var style = null;
        var props = (styles instanceof Array) ? styles : [styles];
        var el = this;
        var compStyle = window.getComputedStyle(el, null);
        for (var i = 0; i < props.length; i++) {
            style = compStyle.getPropertyValue(props[i]);
            if (style != null) {
                break;
            }
        }
        if (val !== undefined) {
            return style == val;
        }
        return style;
    }
    exports.astyle = astyle;
    ;
});
////<amd-module name="ModuleFactories"/>
define("web/modules/modulefactory", ["require", "exports", "common", "cursor", "web/elements"], function (require, exports, core, cursor_2, nodes) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleFactory = (function (_super) {
        __extends(ModuleFactory, _super);
        function ModuleFactory(name) {
            var _this = _super.call(this) || this;
            _this.name = name;
            name = name.toLowerCase();
            return _this;
        }
        return ModuleFactory;
    }(core.NamedFactory));
    exports.ModuleFactory = ModuleFactory;
    var ModuleScope = (function () {
        function ModuleScope($parent) {
            this.$parent = $parent;
        }
        ModuleScope.check = function (target, parent) {
            if (target) {
                if (!target.scope && parent.scope) {
                    target.scope = parent.scope;
                }
                else if (!target.scope && parent && !parent.scope) {
                    // Parent should always have a scope.
                    debugger;
                }
                else {
                    target.scope = new ModuleScope(target.scope);
                }
            }
        };
        return ModuleScope;
    }());
    exports.ModuleScope = ModuleScope;
    var Module = (function () {
        function Module(name) {
            this.name = name;
            name = name.toLowerCase();
            this.cs = new cursor_2.Cursor();
            this.scope = new ModuleScope();
        }
        Module.prototype.setparent = function (parent) {
            this.parent = parent;
            this.scope = parent.scope;
            //parent.setchild(this);
            core.trigger(parent, 'child', [this]);
        };
        Module.prototype.setalias = function (alias, group) {
            var u = this.cs.unit;
            u["$" + alias] = this;
            if (group) {
                this.scope = new ModuleScope(this.scope);
            }
        };
        return Module;
    }());
    exports.Module = Module;
    var NodeModule = (function (_super) {
        __extends(NodeModule, _super);
        function NodeModule(name) {
            return _super.call(this, name) || this;
        }
        NodeModule.prototype.render = function (parentEl) {
            var html = this.dorender();
            var node = nodes.make(html);
            parentEl.appendChild(node);
            return node;
        };
        return NodeModule;
    }(Module));
    exports.NodeModule = NodeModule;
});
define("web/modules/noder", ["require", "exports", "common", "web/modules/modulefactory", "web/modules/operationode"], function (require, exports, core, modulefactory_1, operationode_1) {
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
            core.all(entries, function (it, i) {
                self.parseNode(it);
            });
        };
        Noder.prototype.getfactoryname = function (nodename) {
            if (nodename && nodename.indexOf('.') > 0) {
                var list = nodename.split('.');
                return { f: list[0], m: list.length > 1 ? list[1] : '' };
            }
            return { f: nodename, m: nodename };
        };
        Noder.prototype.parseNode = function (target, parent) {
            operationode_1.OperationNode.check(target);
            var self = this;
            var r = self.getfactoryname(target.nodeName);
            var factory = self.get(r.f);
            if (factory) {
                var template_1 = { tag: r.m };
                var alias_1 = undefined;
                var group_1 = false;
                core.all(target.attributes, function (attr, i) {
                    if (attr.nodeName == 'alias') {
                        alias_1 = attr.nodeValue;
                    }
                    else if (attr.nodeName == 'group') {
                        alias_1 = attr.nodeValue;
                        group_1 = true;
                    }
                    else {
                        template_1[attr.nodeName] = attr.nodeValue;
                    }
                });
                var md_1 = factory.create(template_1);
                if (md_1) {
                    target.md = md_1;
                    md_1.$ref = target;
                    if (parent) {
                        //parentNode.setchild(target);
                        //parentNode.md.setchild(md);
                        md_1.setparent(parent);
                    }
                    if (alias_1) {
                        md_1.setalias(alias_1, group_1);
                        target.setalias(alias_1);
                    }
                    core.trigger(md_1, 'created');
                    if (core.is(md_1, modulefactory_1.NodeModule)) {
                        var ndmodule = md_1;
                        var node = ndmodule.render(target);
                        core.trigger(md_1, 'rendered', [node]);
                    }
                    core.all(target.childNodes, function (item, i) {
                        self.parseNode(item, md_1);
                        var el = item;
                        var alias = el.getAttribute('alias');
                        if (alias) {
                            el.setalias(alias);
                        }
                    });
                    core.trigger(md_1, 'ready');
                }
            }
            else {
                core.all(target.childNodes, function (item, i) {
                    if (item.nodeName.indexOf('#') < 0) {
                        self.parseNode(item);
                        var el = item;
                        var alias = el.getAttribute('alias');
                        if (alias) {
                            el.setalias(alias);
                        }
                    }
                });
            }
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
        Noder.instance = new Noder();
        return Noder;
    }(core.NamedFactory));
    exports.Noder = Noder;
});
define("core", ["require", "exports", "info", "common", "web/modules/noder"], function (require, exports, info_1, common_3, noder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function init(callback) {
        if (callback) {
            callback(noder_1.Noder.instance);
        }
        info_1.log("Core module loaded");
    }
    exports.init = init;
    var w = window;
    w.test = [];
    common_3.add(w.test, 'success');
});
