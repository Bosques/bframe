///<reference path="../typings/index.d.ts"/>
import {ModuleFactory, ModuleTemplate} from "web/modules/modulefactory";
import {Module, NodeModule} from "web/modules/module";
import {OperationNode} from "web/modules/operationode";
import * as core from "common";
import {BFrame} from "./test";
import { vnode, CoreNode } from "web/modules/vnode";

export class WorldNode extends vnode{
    constructor(el?:CoreNode){
        super(el, 'b.world');
    }
}

