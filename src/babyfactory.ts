///<reference path="../typings/index.d.ts"/>
import {ModuleFactory, ModuleTemplate, Module, NodeModule} from "web/modules/modulefactory";
import {OperationNode} from "web/modules/operationode";

export class BabyFactory extends ModuleFactory{
    static readonly instance:ModuleFactory = new BabyFactory();
    constructor(){
        super('b');
    }
    create(target:ModuleTemplate):Module{
        console.log(`Babyfactory loading ${target.tag}`);
        let md = this.get(target.tag);
        return md.create();
    }
    process(target:ModuleTemplate){
        
    }
}

export class WorldModule extends NodeModule{
    protected engine: BABYLON.Engine;
    constructor(){
        super('world');
    }

    create(){
        return this;
    }
    onrendered(node:any){
        this.engine = new BABYLON.Engine(node, true);
    }
    dorender():string{
        let html = `<canvas alias="cvs" class="b-world"></canvas>`;
        return html;
    }
}