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
        var scope = target.on;
        if (!scope) {
            scope = {};
        }
        var evthandler = target["on" + name];
        var scopehandler = scope[name];
        var rlt = null;
        if (evthandler) {
            rlt = evthandler.apply(target, args);
        }
        if (scopehandler) {
            add(args, rlt);
            rlt = scopehandler.apply(target, args);
        }
        return rlt;
    }
    exports.trigger = trigger;
    function create(constructor, argArray, nocreate) {
        var args = [null].concat(argArray);
        var factoryFunction = constructor.bind.apply(constructor, args);
        return nocreate ? factoryFunction : new factoryFunction();
    }
    exports.create = create;
    var Factory = (function () {
        function Factory() {
            this.list = [];
        }
        Factory.prototype.regist = function (item) {
            add(this.list, item);
        };
        Factory.prototype.registAll = function (items) {
            var _this = this;
            all(items, function (it, i) {
                add(_this.list, it);
            });
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
        NamedFactory.prototype.registAll = function (items) {
            var _this = this;
            all(items, function (it, i) {
                var n = i;
                if (!_this.caseSensitive) {
                    n = n.toLowerCase();
                }
                _this.cache[n] = it;
            });
        };
        NamedFactory.prototype.get = function (name) {
            var n = (!this.caseSensitive) ? name.toLowerCase() : name;
            return this.cache[n];
        };
        return NamedFactory;
    }());
    exports.NamedFactory = NamedFactory;
    var NamedCreator = (function () {
        function NamedCreator(caseSensitive) {
            this.caseSensitive = caseSensitive;
            this.cache = {};
        }
        NamedCreator.prototype.regist = function (item, factoryName) {
            var c = item.constructor;
            var name = factoryName || item.name;
            if (!this.caseSensitive) {
                name = name.toLowerCase();
            }
            this.cache[name] = c;
        };
        NamedCreator.prototype.create = function (name, args) {
            var n = (!this.caseSensitive) ? name.toLowerCase() : name;
            var c = this.cache[n];
            if (c) {
                return create(c, args);
            }
            return null;
        };
        NamedCreator.prototype.get = function (name) {
            var n = (!this.caseSensitive) ? name.toLowerCase() : name;
            return this.cache[n];
        };
        return NamedCreator;
    }());
    exports.NamedCreator = NamedCreator;
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
                var at = t['alias'] || t['group'] || (t.getAttribute && (t.getAttribute('alias') || t.getAttribute('group')));
                if (at) {
                    return this.target;
                }
                return this._unit || this.target;
            },
            enumerable: true,
            configurable: true
        });
        Cursor.prototype.unit = function (name) {
            var u = this._unit;
            var has = u.has || function (name) {
                return this.name == name;
            };
            if (name) {
                while (true) {
                    if (!u || has.apply(u, name)) {
                        break;
                    }
                    u = u.cs._unit;
                }
                return (u && has.apply(u, name)) ? u : undefined;
            }
            else {
                return u;
            }
        };
        Cursor.check = function (target) {
            if (!target.cs) {
                var cs = new Cursor();
                cs.target = target;
                target.cs = cs;
            }
        };
        Cursor.prototype.setparent = function (pcs) {
            if (pcs) {
                this.parent = pcs.target;
                this.root = pcs.root || pcs.target;
                this._unit = pcs.childunit;
            }
        };
        Cursor.prototype.dispose = function () {
            this.root = null;
            this._unit = null;
            this.parent = null;
            this.target = null;
        };
        return Cursor;
    }());
    exports.Cursor = Cursor;
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
define("web/modules/scope", ["require", "exports", "common"], function (require, exports, core) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Scope = (function () {
        function Scope() {
            this.bag = {};
            this.children = {};
        }
        Scope.prototype.get = function (name) {
            var p = this;
            while (p) {
                if (p.bag[name]) {
                    return p.bag[name];
                }
                p = p.parent;
            }
            return null;
        };
        Scope.prototype.set = function (name, val) {
            this.bag[name] = val;
        };
        Scope.prototype.child = function (name) {
            var n = name || core.uid('scope');
            var c = new Scope();
            this.children[n] = c;
            c.parent = this;
            return c;
        };
        Scope.instance = new Scope();
        return Scope;
    }());
    exports.Scope = Scope;
});
define("web/modules/vnode", ["require", "exports", "common", "cursor", "web/elements", "web/modules/scope"], function (require, exports, core, cursor_1, nodes, scope_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NodeFactory = (function () {
        function NodeFactory(name) {
            this.name = name;
        }
        NodeFactory.parse = function (entry, scope) {
            var rlt = parseElement(entry, scope);
            return rlt;
        };
        NodeFactory.instance = new core.NamedCreator();
        return NodeFactory;
    }());
    exports.NodeFactory = NodeFactory;
    function parseElement(node, scope, parent) {
        var tag = null;
        if (core.is(node, Element)) {
            var el = node;
            tag = el.tagName.toLowerCase();
        }
        else {
            tag = node.nodeName.toLowerCase();
        }
        //let vn = new vnode(node, scope || (parent?parent.vn.scope():undefined), md?md.create():undefined);
        var vn = NodeFactory.instance.create(tag, [node]);
        if (!vn) {
            vn = new vnode(node, 'vnode');
        }
        vn.setscope(scope || (parent ? parent.vn.scope() : undefined));
        node.vn = vn;
        if (parent) {
            vn.setparent(parent.vn);
        }
        var attrs = node.attributes;
        core.all(attrs, function (at, i) {
            var aname = at.nodeName.toLowerCase();
            var aval = at.nodeValue;
            if (aname == 'alias') {
                vn.setalias(aval);
            }
            else if (aname == 'group') {
                if (!vn.alias && aval && aval.length > 0) {
                    vn.setalias(aval);
                }
                scope = vn.setgroup();
            }
            else if (core.starts(aname, 'if')) {
                var f = vn.scope().bag[aval];
                if (f) {
                    var n = aname.substr(2, aname.length - 2);
                    vn.on[n] = f;
                }
            }
            else {
                vn.addprop(at.nodeName, at.nodeValue);
            }
        });
        var html = core.trigger(vn, 'render', [parent ? parent.vn : null]);
        if (html) {
            var n = nodes.create(html);
            parent.appendChild(n);
            core.trigger(vn, 'rendered', [n]);
        }
        core.trigger(vn, 'created', [parent ? parent.vn : null]);
        core.trigger(vn, 'place', [parent ? parent.vn : null]);
        var children = node.childNodes;
        core.all(children, function (ch, i) {
            parseElement(ch, scope, node);
        });
        core.trigger(vn, 'setup', [parent ? parent.vn : null]);
        core.all(children, function (ch, i) {
            var v = ch.vn;
            if (v) {
                core.trigger(v, 'ready', [node.vn]);
            }
        });
    }
    exports.parseElement = parseElement;
    var vnode = (function () {
        function vnode(el, name) {
            this.children = [];
            this._props = {};
            this.ref = el;
            cursor_1.Cursor.check(this);
            this.name = name;
            this.on = {};
        }
        vnode.prototype.has = function (name) {
            return this.name == name || this.alias == name;
        };
        vnode.prototype.prop = function (name) {
            return this._props[name];
        };
        vnode.prototype.scope = function () {
            return this._scope;
        };
        vnode.prototype.addprop = function (name, val) {
            var self = this;
            this._props[name] = val;
        };
        vnode.prototype.setscope = function (scope) {
            this._scope = scope || new scope_1.Scope();
        };
        vnode.prototype.setparent = function (parent) {
            this.cs.setparent(parent.cs);
            parent.addchild(this);
        };
        vnode.prototype.addchild = function (child) {
            core.add(this.children, child);
        };
        vnode.prototype.setgroup = function () {
            var u = this.cs.unit();
            if (this.alias) {
                var preset = this._scope.children["" + this.alias];
                if (preset) {
                    this._scope = preset;
                }
                else {
                    this._scope = this._scope.child(this.alias);
                }
            }
            else {
                this._scope = this._scope.child();
            }
            return this._scope;
        };
        vnode.prototype.setalias = function (alias) {
            this.alias = alias;
            var u = this.cs.unit();
            if (u) {
                u["$" + alias] = this;
            }
        };
        vnode.prototype.dispose = function () {
            this._props = null;
            this.ref = null;
            this.cs.dispose();
        };
        return vnode;
    }());
    exports.vnode = vnode;
    var CoreNode = (function (_super) {
        __extends(CoreNode, _super);
        function CoreNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CoreNode;
    }(Node));
    exports.CoreNode = CoreNode;
});
define("core", ["require", "exports", "info", "common", "web/modules/vnode"], function (require, exports, info_1, common_3, nodes) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function init(callback) {
        if (callback) {
            callback(nodes.NodeFactory.instance);
        }
        info_1.log("Core module loaded");
    }
    exports.init = init;
    var w = window;
    w.test = [];
    common_3.add(w.test, 'success');
});
