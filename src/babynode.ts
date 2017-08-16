///<reference path="../typings/index.d.ts"/>
import * as core from "common";
import {BFrame} from "./test";
import {vnode, CoreNode} from "web/modules/vnode";
import {Scope} from "web/modules/scope";

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
    protected vprop(attr:string){
        let r = this.bprop(attr);
        if (r){
            return BABYLON.Vector3.FromArray(r);
        }
        return null;
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
    oncreated(p:vnode){
        Scope.instance.materials = {};
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
        //scene.workerCollisions = true;
        scene.collisionsEnabled = true;
        this.obj = scene;
        let scope = this.scope();
        scope.activeScene = scene;
        if (!scope.color){
            scope.color = {};
        }
        let color = this.bprop('color');
        if (color){
            core.all(color, (c:any, i:string)=>{
                scope.color[`${i}Color`] = BABYLON.Color3.FromArray(c);
            });
        }
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
            let cam = <BABYLON.FreeCamera>bcreate(type, ['camera1', p3, scene.Scene]);

            camera = cam;
            let target = this.bprop('target');
            let v3 = BABYLON.Vector3.FromArray(target);
            camera.setTarget(v3);
            if (this.bprop('active')){
                camera.attachControl(this.scope().canvas);
            }
        }else{
            let a3 = this.bprop('abr');
            a3[0] *= Math.PI/180;
            a3[1] *= Math.PI/180;
            let target = this.bprop('target');
            let v3 = BABYLON.Vector3.FromArray(target);
            let cam = <BABYLON.ArcRotateCamera>bcreate(type, ['camera1', a3[0], a3[1], a3[2], v3, scene.Scene]);
            cam.checkCollisions = true;
            cam.collisionRadius = new BABYLON.Vector3(1, 1, 1);
            
            camera = cam;
            if (this.bprop('active')){
                camera.attachControl(this.scope().canvas);
            }
        }
        camera.inertia = 0.5;
        camera.minZ = 0.001;
        camera.maxZ = 1000000;
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

//http://www.babylonjs-playground.com/#RAUTNC
export class MeshNode extends bnode{
    constructor(el?:CoreNode, name?:string){
        super(el, name || 'b.mesh');
    }

    get Mesh():BABYLON.Mesh{
        return this.obj;
    }

    oncreated(parent:bnode){
        let scene = parent.getscene();
        let options = this.bprop('options');
        let bname = this.bprop('n');
        let scope = this.scope();
        let mname = this.bprop('material') || scope.material || 'default';
        
        let mesh = <BABYLON.Mesh>bmesh(this.bprop('type'), [bname, options, scene]);
        mesh.checkCollisions = true;
        
        //let material = new BABYLON.StandardMaterial("texture1", scene);
        mesh.material = Scope.instance.materials[mname];
        this.obj = mesh;
    }

    onready(parent:bnode){
        if (parent instanceof MeshNode){
            let p = <MeshNode>parent;
            this.Mesh.parent = p.Mesh;
        }
        let pos = this.bprop('pos');
        if (pos){
            let p3 = BABYLON.Vector3.FromArray(pos);
            this.Mesh.setAbsolutePosition(p3);
        }
        let rot = this.bprop('rot');
        if (rot){
            let center = this.vprop('center');
            
            if (center){
                this.Mesh.rotateAround(center, BABYLON.Vector3.FromArray([1, 0, 0]), rot[0] * Math.PI/180);
                this.Mesh.rotateAround(center, BABYLON.Vector3.FromArray([0, 1, 0]), rot[1] * Math.PI/180);
                this.Mesh.rotateAround(center, BABYLON.Vector3.FromArray([1, 0, 1]), rot[2] * Math.PI/180);
            }else{
                this.Mesh.rotate(BABYLON.Vector3.FromArray([1, 0, 0]), rot[0] * Math.PI/180);
                this.Mesh.rotate(BABYLON.Vector3.FromArray([0, 1, 0]), rot[1] * Math.PI/180);
                this.Mesh.rotate(BABYLON.Vector3.FromArray([1, 0, 1]), rot[2] * Math.PI/180);
            }
        }
    }
}

export class MaterialNode extends MeshNode{
    constructor(el?:CoreNode){
        super(el, 'b.material');
    }

    oncreated(parent:bnode){
        let scene = parent.getscene();
        let bname = this.bprop('n');
        let material = new BABYLON.StandardMaterial(bname, scene);

        Scope.instance.materials[bname] = material;
        this.obj = material;

        let color = this.bprop('color');
        if (color){
            core.all(color, (c:any, i:string)=>{
                (<any>material)[`${i}Color`] = BABYLON.Color3.FromArray(c);
            });
        }
    }
}

export class GroupNode extends MeshNode{
    constructor(el?:CoreNode){
        super(el, 'b.group');
    }

    oncreated(parent:bnode){
        let scene = parent.getscene();
        let bname = this.bprop('n');
        
        let mesh = <BABYLON.Mesh>bmesh('Box', [bname, {size:0}, scene]);
        mesh.isVisible = false;
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