
/**
 * Phaser3
 *  https://newdocs.phaser.io/docs/3.70.0/gameobjects
 */
import Phaser from 'phaser'
import Axios from 'axios'

import Const from './Const.js'

import TitleScene from './TitleScene.js'
import DuelScene from './DuelScene.js'

const BaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080'


const axios = Axios.create({
    baseURL: BaseUrl,
    headers: {
        'Content-Type': 'application/json',
      },
      //timeout: 2000,
})
window.axios = axios //@

const config = {
    parent: 'app',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    type: Phaser.AUTO, ////Phaser.WEBGL, ///
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'app',
        width: Const.Screen.Width,
        height: Const.Screen.Height
    },
    scene: [
        TitleScene,
        DuelScene,
    ],
};

window.game = new Phaser.Game(config);
