///<reference path="../typings/index.d.ts"/>
import * as core from "common";
import {BFrame} from "./test";
import { vnode, CoreNode } from "web/modules/vnode";

export class bnode extends vnode{
    constructor(el?:CoreNode, name?:string){
        super(el, name);
    }
    protected obj:any;
    getscene(){
        if (this instanceof MeshNode){
            let m = <MeshNode>this;
            return m.Mesh.getScene();
        }else if (this instanceof SceneNode){
            let s = <SceneNode>this;
            return s.Scene;
        }
    }
    protected tasks:any = {};
    protected bprop(attr:string){
        let s = this.prop(attr);
        let f = this.tasks[attr]
        if (f){
            return f.apply(this, this.cs.unit(), this.scope(), this.ref);
        }
        if (core.between(s, '[', ']')){
            f = new Function('self', 'unit', 'scope', 'ref', `return ${s};`);
            this.tasks[attr] = f;
        }else if (core.between(s, '{', '}')){
            f = new Function('self', 'unit', 'scope', 'ref', `return (${s});`);
            this.tasks[attr] = f;
        }else if (core.starts(s, ':')){
            let n = s.substr(1);
            f = new Function('self', 'unit', 'scope', 'ref', `return ${n};`);
            this.tasks[attr] = f;
        }else{
            return s;
        }
        return f.apply(this, this.cs.unit(), this.scope(), this.ref);
    }
}
export class WorldNode extends bnode{
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

    onsetup(pn:vnode){
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

export class SceneNode extends bnode{
    constructor(el?:CoreNode){
        super(el, 'b.scene');
    }
    get Scene():BABYLON.Scene{
        return this.obj;
    }
    oncreated(world:WorldNode){
        let engine = world.Engine;
        let scene = new BABYLON.Scene(engine);
        this.obj = scene;
        this.scope().activeScene = scene;
    }
}

export class CameraNode extends bnode{
    constructor(el?:CoreNode){
        super(el, 'b.camera');
    }
    get Camera():BABYLON.TargetCamera{
        return this.obj;
    }
    onsetup(scene:SceneNode){
        let type = this.bprop('type');
        let camera:BABYLON.TargetCamera = null;
        if (type == 'FreeCamera'){
            let p3 = BABYLON.Vector3.FromArray(this.bprop('pos'));

            camera = <BABYLON.TargetCamera>bcreate(type
                , ['camera1', p3, scene.Scene]);
            let target = this.bprop('target');
            let v3 = BABYLON.Vector3.FromArray(target);
            camera.setTarget(v3);
            if (this.bprop('active')){
                camera.attachControl(this.scope().canvas);
            }
        }else{
            let p3 = this.bprop('abr');
            p3[0] *= Math.PI/180;
            p3[1] *= Math.PI/180;
            let target = this.bprop('target');
            let v3 = BABYLON.Vector3.FromArray(target);
            camera = <BABYLON.TargetCamera>bcreate(type
                , ['camera1', p3[0], p3[1], p3[2], v3, scene.Scene]);
            if (this.bprop('active')){
                camera.attachControl(this.scope().canvas);
            }
        }

        this.obj = camera;
        this.scope().activeCamera = camera;
    }
}

export class LightNode extends bnode{
    constructor(el?:CoreNode){
        super(el, 'b.light');
    }
    get Light():BABYLON.Light{
        return this.obj;
    }
    onsetup(scene:SceneNode){
        let light = bcreate(this.bprop('type')
            ,[this.bprop('n'), new BABYLON.Vector3(0,1,0), scene.Scene]);
        this.obj = light;
    }
}

export class MeshNode extends bnode{
    constructor(el?:CoreNode){
        super(el, 'b.mesh');
    }

    get Mesh():BABYLON.Mesh{
        return this.obj;
    }

    oncreated(parent:bnode){
        let scene = parent.getscene();
        let options = this.bprop('options');
        let mesh = bmesh(this.bprop('type'), [this.bprop('n'), options, scene]);
        this.obj = mesh;
    }

    onready(parent:bnode){
        if (parent instanceof MeshNode){
            let p = <MeshNode>parent;
            //this.Mesh.parent = p.Mesh;
        }
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