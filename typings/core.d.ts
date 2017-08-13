declare module "common" {
    export function starts(target: string, prefix: any): boolean;
    export function between(target: string, start: string, end: string): boolean;
    export function inbetween(target: string, start?: string, end?: string): string;
    export function extend(s: any, d: any, ig?: any): void;
    export function find(target: any[], field: string, val: any): any;
    export function all(target: any, callback: Function, prepare?: Function, last?: boolean): any;
    export function uid(prefix?: string): string;
    export function clone(target: any, id?: string): any;
    export function join(target: any, field?: string): string;
    export function clear(target: {
        pop: Function;
        length: number;
    }): {
        pop: Function;
        length: number;
    };
    export function unique(target: any, item: any, comp?: Function): boolean;
    export function add(target: any, item: any, isunique?: any): any;
    export function addrange(target: any[], items: any[]): void;
    export function diff(a: Date, b: Date, mode?: number): number;
    export function is(target: any, type: any): boolean;
    export function trigger(target: any, name: string, args?: any[]): any;
    export function create(constructor: any, argArray: any[], nocreate?: boolean): any;
    export class Factory<T> {
        protected list: T[];
        regist(item: T): void;
        registAll(items: T[]): void;
    }
    export class NamedFactory<T extends NamedObject> {
        protected caseSensitive: boolean;
        protected cache: any;
        constructor(caseSensitive?: boolean);
        regist(item: T): void;
        registAll(items: T[]): void;
        get(name: string): any;
    }
    export class NamedCreator<T extends NamedObject> {
        protected caseSensitive: boolean;
        protected cache: any;
        constructor(caseSensitive?: boolean);
        regist(item: T, factoryName?: string): void;
        create(name: string, args?: any[]): any;
        get(name: string): any;
    }
    export interface NamedObject {
        name: string;
    }
}
declare module "info" {
    export function log(msg: string): void;
}
declare module "cursor" {
    export class Cursor<T extends {
        cs: any;
        name: string;
    }> {
        root: T;
        readonly childunit: T;
        unit(name?: string): T;
        protected _unit: T;
        parent: T;
        target: T;
        constructor();
        static check<T extends {
            cs: any;
            name: string;
        }>(target: T): void;
        setparent(pcs?: Cursor<T>): void;
        dispose(): void;
    }
}
declare module "web/elements" {
    export function addcss(target: any, name: string): void;
    export function delcss(target: any, name: string): void;
    export function destroy(target: Node): void;
    export function evtarget(event: Event, callback?: Function): any;
    export function make(html: string): Node;
    export function create(html: string, multiple?: boolean): Node;
    export function astyle(styles: any, val?: any): any;
}
declare module "web/modules/vnode" {
    import * as core from "common";
    import { Cursor } from "cursor";
    export class NodeFactory implements core.NamedObject {
        readonly name: string;
        constructor(name: string);
        static instance: core.NamedCreator<vnode>;
        static parse(entry: any, scope?: any): void;
    }
    export function parseElement(node: CoreNode, scope?: any, parent?: CoreNode): void;
    export class vnode {
        readonly name: string;
        readonly cs: Cursor<vnode>;
        alias: string;
        ref: any;
        on: any;
        readonly children: vnode[];
        protected _props: any;
        protected _scope: any;
        constructor(el: CoreNode, name?: string);
        prop(name: string): any;
        scope(): any;
        addprop(name: string, val: any): void;
        setscope(scope?: any): void;
        setparent(parent: vnode): void;
        addchild(child: vnode): void;
        setalias(alias: string, group: boolean): any;
        dispose(): void;
    }
    export class CoreNode extends Node {
        vn: vnode;
    }
}
declare module "core" {
    export function init(callback?: Function): void;
}
