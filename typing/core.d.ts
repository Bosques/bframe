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
    export class NamedFactory<T> {
        protected cache: any;
        regist(name: string, item: T): void;
        get(name: string): any;
    }
}
declare module "info" {
    export function log(msg: string): void;
}
declare module "main" {
    export function init(): void;
}
