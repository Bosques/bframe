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
    function trigger(target, name, args, scope) {
        if (!scope) {
            scope = {};
        }
        var evthandler = target["on" + name];
        var scopehandler = scope["on" + name];
        if (evthandler) {
            evthandler.apply(target, args);
        }
        if (scopehandler) {
            scopehandler.apply(target, args);
        }
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
                var at = t['alias'] || (t.getAttribute && t.getAttribute('alias'));
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
        Cursor.prototype.setparent = function (pcs) {
            if (pcs) {
                this.parent = pcs.target;
                this.root = pcs.root || pcs.target;
                this.unit = pcs.childunit;
            }
        };
        Cursor.prototype.dispose = function () {
            this.root = null;
            this.unit = null;
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
define("web/modules/module", ["require", "exports", "common", "cursor", "web/elements", "web/modules/modulescope"], function (require, exports, core, cursor_1, nodes, modulescope_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Module = (function () {
        function Module(name) {
            this.name = name;
            this.$props = {};
            name = name.toLowerCase();
            //this.cs = new Cursor<Module>();
            cursor_1.Cursor.check(this);
            this.scope = new modulescope_1.ModuleScope();
        }
        Module.prototype.setparent = function (parent) {
            var cs = this.cs;
            if (parent) {
                var pcs = parent.cs;
                cs.setparent(pcs);
                this.scope = parent.scope;
                //parent.setchild(this);
                core.trigger(parent, 'child', [this]);
            }
        };
        Module.prototype.setalias = function (alias, group) {
            this.alias = alias;
            var u = this.cs.unit;
            if (u) {
                u["$" + alias] = this;
            }
            if (group) {
                this.scope = new modulescope_1.ModuleScope(this.scope);
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
define("web/modules/modulescope", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
});
define("web/modules/vnode", ["require", "exports", "common", "cursor"], function (require, exports, core, cursor_2) {
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
        var attrs = node.attributes;
        core.all(attrs, function (at, i) {
            var aname = at.nodeName.toLowerCase();
            if (aname == 'alias' || aname == 'group') {
                scope = vn.setalias(aname, aname == 'group');
            }
            else {
                vn.addprop(at.nodeName, at.nodeValue);
            }
        });
        if (parent) {
            vn.setparent(parent.vn);
        }
        core.trigger(vn, 'created', [parent ? parent.vn : null], vn.scope());
        var children = node.childNodes;
        core.all(children, function (ch, i) {
            parseElement(ch, scope, node);
        });
        core.trigger(vn, 'ready', [parent ? parent.vn : null], vn.scope());
    }
    exports.parseElement = parseElement;
    var vnode = (function () {
        function vnode(el, name) {
            this.children = [];
            this._props = {};
            this.ref = el;
            cursor_2.Cursor.check(this);
            this.name = name;
        }
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
            this._scope = scope || {};
        };
        vnode.prototype.setparent = function (parent) {
            this.cs.setparent(parent.cs);
            parent.addchild(this);
        };
        vnode.prototype.addchild = function (child) {
            core.add(this.children, child);
        };
        vnode.prototype.setalias = function (alias, group) {
            this.alias = alias;
            var u = this.cs.unit;
            if (u) {
                u["$" + alias] = this;
                if (group) {
                    this._scope = this._scope["$" + alias] || {};
                    this._scope.$parent = u.scope();
                }
            }
            return this._scope;
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
define("web/modules/operationode", ["require", "exports", "cursor"], function (require, exports, cursor_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OperationNode = (function (_super) {
        __extends(OperationNode, _super);
        function OperationNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OperationNode.check = function (node, parent) {
            if (node.nodeName.indexOf('#') < 0) {
                cursor_3.Cursor.check(node);
                node.setalias = function (alias, group) {
                    var cs = this.cs;
                    var u = cs.unit;
                    if (u) {
                        u["$" + alias] = this;
                    }
                    if (group) {
                        var self_1 = this;
                        self_1._scope = new OperationScope(self_1._scope);
                    }
                };
                node.setparent = function (parent) {
                    var self = this;
                    var cs = self.cs;
                    if (parent) {
                        var pcs = parent.cs;
                        cs.setparent(pcs);
                        self._scope = parent.scope;
                    }
                };
                node.scope = function (scope) {
                    var self = this;
                    if (scope) {
                        self._scope = scope;
                    }
                    return self._scope;
                };
                if (parent) {
                    node.setparent(parent);
                }
                return true;
            }
            return false;
        };
        return OperationNode;
    }(Element));
    exports.OperationNode = OperationNode;
    var OperationScope = (function () {
        function OperationScope($parent) {
            this.$parent = $parent;
        }
        OperationScope.check = function (target, parent) {
            if (target) {
                if (!target.scope()) {
                    if (!parent) {
                        target.scope(new OperationScope());
                    }
                    else if (parent.scope()) {
                        target.scope(parent.scope());
                    }
                    else {
                        console.log('Parent should always has scope');
                        debugger;
                    }
                }
            }
        };
        return OperationScope;
    }());
    exports.OperationScope = OperationScope;
});
////<amd-module name="ModuleFactories"/>
define("web/modules/modulefactory", ["require", "exports", "common"], function (require, exports, core) {
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
        ModuleFactory.prototype.create = function (target) {
            var rlt = this.docreate(target);
            core.extend(rlt.$props, target, { tag: true });
            return rlt;
        };
        return ModuleFactory;
    }(core.NamedFactory));
    exports.ModuleFactory = ModuleFactory;
});
define("web/modules/noder", ["require", "exports", "common", "web/modules/operationode", "web/modules/module"], function (require, exports, core, operationode_1, module_1) {
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
        Noder.prototype.createmplate = function (target, name) {
            var template = { tag: name };
            var alias = undefined;
            var group = false;
            core.all(target.attributes, function (attr, i) {
                if (attr.nodeName == 'alias') {
                    alias = attr.nodeValue;
                }
                else if (attr.nodeName == 'group') {
                    alias = attr.nodeValue;
                    group = true;
                }
                else {
                    template[attr.nodeName] = attr.nodeValue;
                }
            });
            return { template: template, alias: alias, group: group };
        };
        Noder.prototype.parseNode = function (target, parentNode) {
            operationode_1.OperationNode.check(target, parentNode);
            var self = this;
            var r = self.getfactoryname(target.nodeName);
            var temp = this.createmplate(target, r.m);
            if (temp.alias && parentNode) {
                target.setalias(temp.alias, temp.group);
            }
            var factory = self.get(r.f);
            if (factory) {
                var md = factory.create(temp.template);
                if (md) {
                    target.md = md;
                    md.$ref = target;
                    if (parent) {
                        md.setparent(parentNode.md);
                    }
                    if (temp.alias) {
                        md.setalias(temp.alias, temp.group);
                    }
                    if (core.is(md, module_1.NodeModule)) {
                        var ndmodule = md;
                        var node = ndmodule.render(target);
                        core.trigger(md, 'rendered', [node]);
                    }
                    core.trigger(md, 'created', [parentNode ? parentNode.md : null]);
                    core.all(target.childNodes, function (item, i) {
                        self.parseNode(item, target);
                    });
                    core.trigger(md, 'ready', [parentNode ? parentNode.md : null]);
                }
            }
            else {
                core.all(target.childNodes, function (item, i) {
                    if (item.nodeName.indexOf('#') < 0) {
                        self.parseNode(item, target);
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
