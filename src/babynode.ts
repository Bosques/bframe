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
    get Engine():BABYLON.Engine{
        return this.obj;
    }

    onrender(pn:vnode){
        let html = `<canvas alias="cvs" class="b-world"></canvas>`;
        return html;
    }

    onrendered(cv:Element){
        this.obj = new BABYLON.Engine(<HTMLCanvasElement>cv, true);
        let scope = this.scope();
        scope.canvas = cv;
    }

    onready(pn:vnode){
        console.log(this.scope());
        this.animate();
    }
    protected animate() : void {
        let self = this;
        // run the render loop
        this.Engine.runRenderLoop(() => {
            //this._scene.render();
            self.scope().activeScene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.Engine.resize();
        });
    }
}

export class SceneNode extends vnode{
    constructor(el?:CoreNode){
        super(el, 'b.scene');
    }

    oncreated(world:WorldNode){
        let engine = world.Engine;
        let scene = new BABYLON.Scene(engine);
        this.obj = scene;
        this.scope().activeScene = scene;
    }
}

export class CameraNode extends vnode{
    constructor(el?:CoreNode){
        super(el, 'b.camera');
    }

    onready(scene:SceneNode){
        let p3 = BABYLON.Vector3.FromArray(eval(this.prop('pos')));

        let camera = <BABYLON.TargetCamera>bcreate(this.prop('type')
            , ['camera1', p3, scene.obj]);
        let target = eval(this.prop('target'));
        let v3 = BABYLON.Vector3.FromArray(target);
        camera.setTarget(v3);
        if (this.prop('active')){
            console.log(this.scope().canvas);
            camera.attachControl(this.scope().canvas);
        }
        this.obj = camera;
        this.scope().activeCamera = camera;
    }
}

export class LightNode extends vnode{
    constructor(el?:CoreNode){
        super(el, 'b.light');
    }

    onready(scene:SceneNode){
        let light = bcreate(this.prop('type')
            ,[this.prop('name'), new BABYLON.Vector3(0,1,0), scene.obj]);
        this.obj = light;
    }
}

export class MeshNode extends vnode{
    constructor(el?:CoreNode){
        super(el, 'b.mesh');
    }

    onready(scene:SceneNode){
        let options = eval(`(${this.prop('options')})`);
        let mesh = bmesh(this.prop('type'), [this.prop('name'), options, scene.obj]);
        this.obj = mesh;
    }
}

function bcreate(type:string, args?:any[]){
    let w = <any>window;
    //return applyToConstructor(w['BABYLON'][type], args);
    return core.create(w['BABYLON'][type], args);
}

function bmesh(type:string, args?:any[]){
    let w = <any>window;
    let rlt = <BABYLON.Mesh>w['BABYLON']['MeshBuilder'][`Create${type}`].apply(null, args);
    return rlt;
}