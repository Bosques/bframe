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
        if (this instanceof SpriteNode){
            return this.scope().get('activeScene');
        }else if (this instanceof MeshNode){
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
    protected setprop(attr:string, val:any){
        let f = this.tasks[attr]
        if (f){
            this.tasks[attr] = null;
        }
        this._props[attr] = val;
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
        //scope.canvas = cv;
        scope.set('canvas', cv);
    }
    oncreated(p:vnode){
        Scope.instance.materials = {};
    }
    onready(pn:vnode){
        this.animate();
        //this.debug();
    }
    private debug():void{
        let scope = this.scope();
        let scene = scope.get('activeScene');
        let cam = scope.get('activeCamera');
        let bf = new BFrame(this.scope().get('canvas'), this.Engine);
        bf.createScene(scene, cam);
        bf.animate();
    }
    protected animate() : void {
        let self = this;
        // run the render loop
        this.Engine.runRenderLoop(() => {
            //this._scene.render();
            self.scope().get('activeScene').render();
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
        ////////////////////////////////////
        // Collision not working with workerCollisions set to true
        // scene.workerCollisions = true;
        scene.collisionsEnabled = true;
        this.obj = scene;
        let scope = this.scope();
        scope.set('activeScene', scene);
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
            cam.checkCollisions = true;
            camera = cam;
            let target = this.bprop('target');
            let v3 = BABYLON.Vector3.FromArray(target);
            camera.setTarget(v3);
            if (this.bprop('active')){
                camera.attachControl(this.scope().get('canvas'), false);
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
                camera.attachControl(this.scope().get('canvas'), false);
            }
        }
        camera.inertia = 0.5;
        camera.minZ = 0.01;
        camera.maxZ = 100000;
        this.obj = camera;

        this.scope().set('activeCamera', camera);
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
        let lock = this.prop('lock');
        let cam = this.scope().get('activeCamera');
        let v = this.vprop('dir') || new BABYLON.Vector3(1,1,1);
        let type =  this.bprop('type');
        let light:any = null;
        if (type == 'SpotLight'){
            let pos = this.vprop('pos');
            let angle = this.bprop('angle') || 0.8;
            let exponent = this.bprop('exponent') || 2;
            light = bcreate(type
                ,[this.bprop('n'), pos, v, angle, exponent, scene.Scene]);
        }else{
            light = bcreate(type
                ,[this.bprop('n'), v, scene.Scene]);
        }
        this.obj = light;
        if (!lock && cam){
            console.log('light follow');
            light.position = cam.position;
            light.parent = cam;
        }
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
        let mname = this.bprop('material') || scope.get('material') || 'default';
        
        let mesh = <BABYLON.Mesh>bmesh(this.bprop('type'), [bname, options, scene]);
        mesh.checkCollisions = true;
        mesh.material = Scope.instance.materials[mname];
        this.obj = mesh;
    }
    onplace(parent:bnode){
        if (parent instanceof MeshNode){
            let p = <MeshNode>parent;
            this.Mesh.parent = p.Mesh;
        }
        let pos = this.bprop('pos');
        if (pos){
            let p3 = BABYLON.Vector3.FromArray(pos);
            //this.Mesh.setAbsolutePosition(p3);
            this.Mesh.position = p3;
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
    onready(parent:bnode){
        let scope = this.scope();
        let scene = parent.getscene();
        let silent = this.bprop('silent');
        let mesh = this.Mesh;
        if (!silent){
            if(!mesh.actionManager){
                mesh.actionManager = new BABYLON.ActionManager(scene);
            }
            var onpickAction = new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPickTrigger,
                function(evt:BABYLON.ActionEvent) {
                    if (evt.meshUnderPointer) {
                        var meshClicked = evt.meshUnderPointer;
                        let cam = <BABYLON.TargetCamera>scope.get('activeCamera');
                        cam.setTarget(<any>meshClicked);
                        console.log(`Picked:${meshClicked.name}`, meshClicked);
                    }else{
                        console.log(`Triggered:${evt}`);
                    }
                }
            );
            mesh.actionManager.registerAction(onpickAction);
        }
    }
}
export class SpriteNode extends MeshNode{
    constructor(el?:CoreNode){
        super(el, 'b.sprite');
    }
    protected _mgr:BABYLON.SpriteManager;
    protected _parent:bnode;
    get parent():bnode{
        return this._parent;
    }
    get manager():BABYLON.SpriteManager{
        return this._mgr;
    }
    oncreated(parent:bnode){
        let scene = parent.getscene();
        let bname = this.bprop('n');
        let mname = this.bprop('manager');
        let mgr = <BABYLON.SpriteManager>Scope.instance.get(mname);
        if (!mgr){
            mgr = new BABYLON.SpriteManager(mname, '', 2000, 800, scene);
            mgr.isPickable = false;
            Scope.instance.set(mname, mgr);
        }
        this._mgr = mgr;
        mgr.texture
        let sp = new BABYLON.Sprite(bname, mgr);
        sp.isPickable = false;
        this.obj = sp;
        this._parent = parent;
    }
    onplace(parent:bnode){
        if (parent instanceof MeshNode){
            let p = this.bprop('pos');
            if (!p){
                p = [0,0,0];
            }
            let a = parent.Mesh.getAbsolutePosition();
            
            let op = [a.x+p[0], a.y+p[1], a.z+p[2]];
            //console.log(parent.Mesh.name, [a.x,a.y,a.z], op);
            //this._props.pos = op;
            this.setprop('pos', op);
        }
        super.onplace(parent);
    }
}
export class TextNode extends bnode{
    constructor(el?:CoreNode){
        super(el, 'b.text');
    }
    oncreated(parent:SpriteNode){
        let scene = parent.getscene();
        let mgr = parent.manager;
        this.MakeTextSprite(mgr, scene);
    }
    // Just a text-wrapping function
    protected wrapText(context:CanvasRenderingContext2D, text:string, x:number, y:number, maxWidth:number, lineHeight:number) {
        var words = text.split(' ');
        var line = '';
        var numberOfLines = 0;

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
                numberOfLines++;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);

        return numberOfLines;
    }
    protected MakeTextSprite(mgr:BABYLON.SpriteManager, scene:BABYLON.Scene)
    {
        // Make a dynamic texture
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 512, scene, true);
        dynamicTexture.hasAlpha = true;

        var textureContext = dynamicTexture.getContext();
        textureContext.save();
        textureContext.textAlign = "center";
        textureContext.font = "58px Calibri";

        // Some magic numbers
        var lineHeight = 70;
        var lineWidth = 500;
        var fontHeight = 53;
        var offset = 10; // space between top/bottom borders and actual text
        var text = "BabylonJs hehe blabla"; // Text to display

        var numberOfLines = 2; // I usually calculate that but for this exmaple let's just say it's 1
        var textHeight = fontHeight + offset;
        var labelHeight = numberOfLines * lineHeight + (2 * offset);

        // Background
        textureContext.fillStyle = "white";
        textureContext.fillRect(0, 0, dynamicTexture.getSize().width, labelHeight);
        textureContext.fillStyle = "blue";
        textureContext.fillRect(0, labelHeight, dynamicTexture.getSize().width, dynamicTexture.getSize().height);

        // text
        textureContext.fillStyle = "black";
        this.wrapText(textureContext, text, dynamicTexture.getSize().width / 2, textHeight, lineWidth, lineHeight);
        textureContext.restore();

        dynamicTexture.update(false);

        // Create the sprite
        var spriteManager = mgr;
        spriteManager.texture = dynamicTexture;
        spriteManager.texture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
        spriteManager.texture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        //var sprite = new BABYLON.Sprite("textSprite", spriteManager);

        return labelHeight;
    };
}
export class MaterialNode extends bnode{
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
        
        let mesh = <BABYLON.Mesh>bmesh('Box', [bname, {size:0.001}, scene]);
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
    let f = w['BABYLON']['MeshBuilder'][`Create${type}`];
    if (!f){
        debugger;
    }
    let rlt = <BABYLON.Mesh>f.apply(null, args);
    return rlt;
}