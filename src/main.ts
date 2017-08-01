import {log} from './info';
import * as core from 'common';

export function init(){
    log("Bframe module loaded");
}

let w = <any>window;
w.test = [];
core.add(w.test, 'success');