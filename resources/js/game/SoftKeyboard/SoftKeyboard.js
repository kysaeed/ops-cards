// import Phaser from 'phaser'

import  SoftKey from './SoftKey.js'

export default class SoftKeyboard {


    constructor(scene) {


        this.keyBind = this.createKeyBind()

        this.createKeySprites(scene, this.keyBind)


    }

    createKeyBind() {

        const aplpha = {
            a: {
                keys: [
                    [
                        'Q','W','E','R','T','Y','U','I','O','P',
                    ],
                    [
                        'A','S','D','F','G','H','J','K','L',
                    ],
                    [
                        'Z','X','C','V','B','N','M','*',
                    ],
                ],
                halfSlide: true,
            },
            b: {
                keys: [
                    [
                        'A','B','C','D','E','F','G','H','I',
                    ],
                    [
                        'J','K','L','M','N','O','P','Q','R',
                    ],
                    [
                        'S','T','U','V','W','X','Y','Z','*',
                    ],
                ],
                halfSlide: false,
            },
        };

        this.bindType = 'a'

        const keyBindTypes = Object.keys(aplpha)

        const keyBind = {}

        keyBindTypes.forEach((name) => {

            const keyList = aplpha[name]['keys']
            const isHalfSlide = aplpha[name]['halfSlide']
            let baseX = 0
            keyList.forEach((keyTextLine, y) => {
                keyTextLine.forEach((keyText, x) => {
                    if (!keyBind[keyText]) {
                        keyBind[keyText] = {
                            text: keyText,
                        }
                    }

                    keyBind[keyText][name] = {
                        x: baseX + x * 54,
                        y: y * 54,
                    }
                })
                if (isHalfSlide) {
                    baseX += 30
                }
            })
        })


        return keyBind
    }

    createKeySprites(scene, keyBind) {

        this.base = scene.add.container(100,100)

        const name = 'a'
        const keyList = Object.keys(keyBind)
        this.keys = [];
        keyList.forEach((k) => {
            const keyText = keyBind[k]['text']
            const keyPos = keyBind[k][name]
            if (keyPos) {
                const keyTop = new SoftKey(scene, this.base, keyText)
                keyTop.sprite.x = keyPos.x
                keyTop.sprite.y = keyPos.y
                this.keys.push(keyTop)

                keyTop.callback = (t) => {
                    this.onKey(t)
                }
            }
        })
    }

    changeKeyBind(bindType) {
        this.keys.forEach((keyTop) => {
            const keyInfo = this.keyBind[keyTop.text]
            if (keyInfo[bindType]) {
                keyTop.moveTo(
                    keyInfo[bindType].x,
                    keyInfo[bindType].y
                )
            } else {
                //
            }
        })

    }

    onKey(text) {
        // console.log('*** ' + text)

        if (text === '*') {
            if (this.bindType === 'a') {
                this.bindType = 'b'
            } else {
                this.bindType = 'a'
            }

            console.log('HEY !!! ' + this.bindType)
            this.changeKeyBind(this.bindType)
        }
    }

}
