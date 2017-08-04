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
declare module "web/modules/noder" {
    import * as core from "common";
    export class Noder extends core.NamedFactory<ModuleFactory> {
        constructor();
        parse(entry: any): void;
        parseNode(target: OperationNode): void;
        protected getentries(entry: any): any;
    }
    export abstract class ModuleFactory extends core.NamedObject {
        constructor(name: string);
        abstract prepare(target: OperationNode): void;
        abstract process(target: OperationNode): void;
    }
    export class ModuleItem {
        factory: ModuleFactory;
        target: OperationNode;
        constructor(factory: ModuleFactory, target: OperationNode);
        prepare(): void;
        process(): void;
    }
    export interface OperationNode extends Node {
    }
}
declare module "core" {
    export function init(callback?: Function): void;
}
