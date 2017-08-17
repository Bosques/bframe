export class BFrame {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.TargetCamera;
    private _light: BABYLON.Light;

    constructor(canvas : any, engine:any) {
        // Create canvas and engine
        // let entryEl:Element = entry;
        // if (typeof(entry) == 'string'){
        //     entryEl = document.querySelector(entry);
        // }
        // this._canvas = <HTMLCanvasElement>document.getElementById(entry);
        this._canvas = canvas;
        this._engine = engine;
        //this._engine = new BABYLON.Engine(this._canvas, true);
    }

    createScene(scene:any, camera:any) : void {
        // create a basic BJS Scene object
        //this._scene = new BABYLON.Scene(this._engine);
        this._scene = scene;

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        //this._camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), this._scene);
        //this._camera = new BABYLON.ArcRotateCamera('camera1', 1/4*Math.PI, 1/4*Math.PI, 1/4*Math.PI, new BABYLON.Vector3(0, 0,0), scene.Scene);
        this._camera = camera;

        // target the camera to scene origin
        //this._camera.setTarget(BABYLON.Vector3.Zero());
        let v3 = BABYLON.Vector3.FromArray([0,0,0]);
        this._camera.setTarget(v3);

        // attach the camera to the canvas
        this._camera.attachControl(this._canvas, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        this._light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), this._scene);

        // create a built-in "sphere" shape; with 16 segments and diameter of 2
        let sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', {segments: 16, diameter: 2}, this._scene);
        sphere.actionManager = new BABYLON.ActionManager(scene);
        sphere.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger
            , function(evt:any){
                console.log(evt);
            }));

        // move the sphere upward 1/2 of its height
        sphere.position.y = 1;

        // create a built-in "ground" shape
        let ground = BABYLON.MeshBuilder.CreateGround('ground1',
                                    {width: 6, height: 6, subdivisions: 2}, this._scene);
    }

    animate() : void {
        // run the render loop
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });

        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}

