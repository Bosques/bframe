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
    export class NamedObject {
        protected caseSensitive: boolean;
        protected _name: string;
        readonly name: string;
        constructor(name: string, caseSensitive?: boolean);
    }
}
declare module "info" {
    export function log(msg: string): void;
}
declare module "web/modules/operationode" {
    import { Module } from "ModuleFactories";
    export class OperationNode extends Node {
        static check(node: OperationNode, parent?: OperationNode): boolean;
        md: Module;
        cs: Cursor;
        scope: OperationScope;
        setalias(alias: string, group?: boolean): void;
        setchild(node: OperationNode): void;
    }
    export class OperationScope {
        protected readonly $parent: OperationScope;
        static check(target: OperationNode, parent?: OperationNode): void;
        constructor($parent?: OperationScope);
    }
    export class Cursor {
        root: OperationNode;
        readonly childunit: OperationNode;
        unit: OperationNode;
        parent: OperationNode;
        target: OperationNode;
        constructor();
        static check(target: OperationNode): void;
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
declare module "ModuleFactories" {
    import * as core from "common";
    import { OperationNode } from "web/modules/operationode";
    export abstract class ModuleFactory extends core.NamedObject {
        constructor(name: string);
        abstract create(target: ModuleTemplate): Module;
        abstract process(target: ModuleTemplate): void;
    }
    export interface ModuleTemplate {
        readonly tag: string;
    }
    export abstract class Module {
        protected parent: Module;
        constructor();
        abstract setup(): void;
        setparent(parent: Module): void;
        abstract setchild(child: Module): void;
    }
    export abstract class NodeModule extends Module {
        constructor();
        render(parentEl: OperationNode): void;
        abstract dorender(): string;
    }
}
declare module "web/modules/noder" {
    import * as core from "common";
    import { ModuleFactory } from "ModuleFactories";
    import { OperationNode } from "web/modules/operationode";
    export class Noder extends core.NamedFactory<ModuleFactory> {
        static readonly instance: Noder;
        constructor();
        parse(entry: any): void;
        private getfactoryname(nodename);
        parseNode(target: OperationNode, parentNode?: OperationNode): void;
        protected getentries(entry: any): any;
    }
}
declare module "core" {
    export function init(callback?: Function): void;
}
