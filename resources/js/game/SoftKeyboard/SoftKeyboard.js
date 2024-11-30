// import Phaser from 'phaser'

import  SoftKey from './SoftKey.js'

export default class SoftKeyboard {


    constructor(scene) {

        this.base = scene.add.container(100,100)


        const aplpha = [
            [
                'Q','W','E','R','T','Y','U','I','O','P',
            ],
            [
                'A','S','D','F','G','H','J','K','L',
            ],
            [
                'Z','X','C','V','B','N','M',
            ],

        ];

        this.keys = [];

        aplpha.forEach((keyTextLine, y) => {
            keyTextLine.forEach((keyText, x) => {
                const k = new SoftKey(scene, this.base, keyText)
                k.sprite.x = x * 54 + (y * 30)
                k.sprite.y = y * 54
                this.keys.push(k)
            })
        })


    }


}
