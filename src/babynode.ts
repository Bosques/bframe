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
        // let bf = new BFrame(scope.canvas, this.obj);
        // scope.bf = bf;
    }

    onready(pn:vnode){
        //this.animate();
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

