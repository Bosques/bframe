import * as core from 'common';
import * as info from 'info';
import {Noder} from 'web/modules/noder';
import * as BF from './babyfactory';

export function init(){
    BF.BabyFactory.instance.regist(new BF.WorldModule());
    BF.BabyFactory.instance.regist(new BF.SceneModule());
    BF.BabyFactory.instance.regist(new BF.LightModule());
    BF.BabyFactory.instance.regist(new BF.CameraModule());
    BF.BabyFactory.instance.regist(new BF.MeshModule());
    Noder.instance.regist(BF.BabyFactory.instance);
    Noder.instance.parse(document.body);
    //let bframe = new BFrame(document.body);

    // Create the scene
    //bframe.createScene();

    // start animation
    //bframe.animate();
    info.log("Bframe module loaded");
}

