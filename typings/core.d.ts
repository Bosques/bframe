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
    export class Factory<T> {
        protected list: T[];
        regist(item: T): void;
    }
    export class NamedFactory<T extends NamedObject> {
        protected caseSensitive: boolean;
        protected cache: any;
        constructor(caseSensitive?: boolean);
        regist(item: T): void;
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
    }> {
        root: T;
        readonly childunit: T;
        unit: T;
        parent: T;
        target: T;
        constructor();
        static check<T extends {
            cs: any;
        }>(target: T): void;
        setparent(pcs?: Cursor<T>): void;
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
declare module "web/modules/module" {
    import { OperationNode } from "web/modules/operationode";
    import { Cursor } from "cursor";
    export abstract class Module {
        readonly name: string;
        cs: Cursor<Module>;
        scope: any;
        $ref: any;
        $obj: any;
        alias: string;
        readonly $props: any;
        constructor(name: string);
        setparent(parent: Module): void;
        setalias(alias: string, group?: boolean): void;
        abstract create(): Module;
    }
    export abstract class NodeModule extends Module {
        constructor(name: string);
        render(parentEl: OperationNode): Node;
        abstract dorender(): string;
    }
}
declare module "web/modules/modulescope" {
    import { Module } from "web/modules/module";
    export class ModuleScope {
        protected readonly $parent: ModuleScope;
        static check(target: Module, parent?: Module): void;
        constructor($parent?: ModuleScope);
    }
}
declare module "web/modules/operationode" {
    import { Module } from "web/modules/module";
    import { Cursor } from "cursor";
    export abstract class OperationNode extends Element {
        static check(node: OperationNode, parent?: OperationNode): boolean;
        md: Module;
        protected _scope: OperationScope;
        cs: Cursor<OperationNode>;
        abstract scope(scope?: OperationScope): OperationScope;
        abstract setalias(alias: string, group?: boolean): void;
        abstract setparent(parent: OperationNode): void;
    }
    export class OperationScope {
        protected readonly $parent: OperationScope;
        static check(target: OperationNode, parent?: OperationNode): void;
        constructor($parent?: OperationScope);
    }
}
declare module "web/modules/modulefactory" {
    import * as core from "common";
    import { Module } from "web/modules/module";
    export abstract class ModuleFactory extends core.NamedFactory<Module> implements core.NamedObject {
        readonly name: string;
        constructor(name: string);
        create(target: ModuleTemplate): Module;
        abstract docreate(target: ModuleTemplate): Module;
        abstract process(target: ModuleTemplate): void;
    }
    export interface ModuleTemplate {
        readonly tag: string;
    }
}
declare module "web/modules/noder" {
    import * as core from "common";
    import { ModuleFactory } from "web/modules/modulefactory";
    import { OperationNode } from "web/modules/operationode";
    export class Noder extends core.NamedFactory<ModuleFactory> {
        static readonly instance: Noder;
        constructor();
        parse(entry: any): void;
        private getfactoryname(nodename);
        createmplate(target: OperationNode, name: string): {
            template: any;
            alias: any;
            group: boolean;
        };
        parseNode(target: OperationNode, parentNode?: OperationNode): void;
        protected getentries(entry: any): any;
    }
}
declare module "core" {
    export function init(callback?: Function): void;
}
