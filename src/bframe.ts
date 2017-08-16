import * as core from 'common';
import * as info from 'info';
import {NodeFactory} from 'web/modules/vnode';
import * as BN from './babynode';

export function init(){
    NodeFactory.instance.regist(new BN.WorldNode());
    NodeFactory.instance.regist(new BN.SceneNode());
    NodeFactory.instance.regist(new BN.CameraNode());
    NodeFactory.instance.regist(new BN.LightNode());
    NodeFactory.instance.regist(new BN.MeshNode());
    NodeFactory.instance.regist(new BN.GroupNode());
    NodeFactory.instance.regist(new BN.MaterialNode());
    NodeFactory.instance.regist(new BN.SpriteNode());
    NodeFactory.parse(document.body);

    info.log("Bframe module loaded");
}

