///<reference path="../typings/index.d.ts"/>
import {ModuleFactory, ModuleTemplate} from "web/modules/modulefactory";
import {Module, NodeModule} from "web/modules/module";
import {OperationNode} from "web/modules/operationode";
import * as core from "common";

export class BabyFactory extends ModuleFactory{
    static readonly instance:ModuleFactory = new BabyFactory();
    constructor(){
        super('b');
    }
    docreate(target:ModuleTemplate):Module{
        console.log(`Babyfactory loading ${target.tag}`);
        let md = this.get(target.tag);
        return md.create();
    }
    process(target:ModuleTemplate){
        
    }
}

export class WorldModule extends NodeModule{
    get Engine():BABYLON.Engine{
        return this.$obj;
    }
    constructor(){
        super('world');
    }

    create(){
        return this;
    }
    onrendered(node:any){
        this.$obj = new BABYLON.Engine(node, true);
        let scope = <any>this.scope;
        scope.canvas = node;
    }
    dorender():string{
        let html = `<canvas alias="cvs" class="b-world"></canvas>`;
        return html;
    }
}

export class SceneModule extends Module{
    constructor(){
        super('scene');
    }

    create(){
        return new SceneModule();
    }

    oncreated(parent:Module){
        let world = <WorldModule>parent;
        let engine = <BABYLON.Engine>world.$obj;
        let scene = new BABYLON.Scene(engine);
        this.$obj = scene;
    }
}

export class CameraModule extends Module{
    constructor(){
        super('camera');
    }

    create(){
        return new CameraModule();
    }

    onready(parent:Module){
        let scene = <SceneModule>parent;
        let camera = <BABYLON.TargetCamera>bcreate(this.$props.type, ['camera1', new BABYLON.Vector3(0, 5,-10), scene.$obj]);
        let target = eval(this.$props.target);
        let v3 = BABYLON.Vector3.FromArray(target);
        camera.setTarget(v3);
        if (this.$props.active){
            camera.attachControl(this.scope.canvas);
        }
        this.$obj = camera;
    }
}

export class LightModule extends Module{
    constructor(){
        super('light');
    }

    create(){
        return new LightModule();
    }

    onready(parent:Module){
        let scene = <SceneModule>parent;
        let light = bcreate(this.$props.type, ['light1', new BABYLON.Vector3(0,1,0), scene.$obj]);
        this.$obj = light;
    }
}

function bcreate(type:string, args?:any[]){
    let w = <any>window;
    let rlt = new (Function.prototype.bind.apply(w['BABYLON'][type], args));
    return rlt;
}