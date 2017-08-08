///<reference path="../typings/index.d.ts"/>
import {ModuleFactory, ModuleTemplate} from "web/modules/modulefactory";
import {Module, NodeModule} from "web/modules/module";
import {OperationNode} from "web/modules/operationode";
import * as core from "common";
import {BFrame} from "./test";

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
        let bf = new BFrame(this.scope.canvas, this.$obj);
        scope.bf = bf;
    }
    dorender():string{
        let html = `<canvas alias="cvs" class="b-world"></canvas>`;
        return html;
    }
    onready(){
        //console.log(this.scope);
        this.animate();

        // let bf = this.scope.bf;
        // console.log(this.scope);
        // bf.createScene(
        //     this.scope.activeScene
        //     , this.scope.activeCamera
        // );
        // bf.animate();
    }
    protected animate() : void {
        let self = this;
        // run the render loop
        this.Engine.runRenderLoop(() => {
            //this._scene.render();
            self.scope.activeScene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.Engine.resize();
        });
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
        this.scope.activeScene = scene;
        //console.log(this.scope);
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
        //let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), scene.$obj);
        let camera = <BABYLON.TargetCamera>bcreate(this.$props.type, ['camera1', new BABYLON.Vector3(0, 5,-10), scene.$obj]);
        let target = eval(this.$props.target);
        let v3 = BABYLON.Vector3.FromArray(target);
        camera.setTarget(v3);
        if (this.$props.active){
            console.log(this.scope.canvas);
            camera.attachControl(this.scope.canvas);
        }
        this.$obj = camera;
        this.scope.activeCamera = camera;
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
        let light = bcreate(this.$props.type, [this.$props.name, new BABYLON.Vector3(0,1,0), scene.$obj]);
        this.$obj = light;
    }
}

export class MeshModule extends Module{
    constructor(){
        super('mesh');
    }

    create(){
        return new MeshModule();
    }

    onready(parent:Module){
        let scene = <SceneModule>parent;
        let options = eval(`(${this.$props.options})`);
        let mesh = bmesh(this.$props.type, [this.$props.name, options, scene.$obj]);
        
        this.$obj = mesh;
    }
}

function bcreate(type:string, args?:any[]){
    let w = <any>window;
    return applyToConstructor(w['BABYLON'][type], args);
    //console.log(w['BABYLON'][type]);
    //let rlt = new w['BABYLON'][type].apply(null, args);
    //return (rlt);
}

function applyToConstructor(constructor:any, argArray:any) {
    var args = [null].concat(argArray);
    var factoryFunction = constructor.bind.apply(constructor, args);
    return new factoryFunction();
}

function bmesh(type:string, args?:any[]){
    let w = <any>window;
    let rlt = <BABYLON.Mesh>w['BABYLON']['MeshBuilder'][`Create${type}`].apply(null, args);
    return rlt;
}
