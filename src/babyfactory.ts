///<reference path="../typing/core.d.ts" />
import {ModuleFactory, ModuleTemplate} from "ModuleFactories";

export class BabyFactory extends ModuleFactory{
    constructor(){
        super('b');
    }
    create(target:ModuleTemplate){
        return null;
    }
    process(target:ModuleTemplate){
        
    }
}