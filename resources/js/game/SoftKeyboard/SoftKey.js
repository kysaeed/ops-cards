import Phaser from 'phaser'


export default class SoftKey {

    constructor(scene, base, text) {
        this.scene = scene
        this.text = text

        this.bg = scene.add.image(
            0, 0,
            'key'
        )

        this.textSprite = scene.add.textSprite = scene.add.text(-10, -20, text, { fontSize: '32px', fill: '#000' })

        this.keyTop = scene.add.container(0, 0, [
            this.bg,
            this.textSprite,
        ])
        this.sprite = scene.add.container(0,0, [
            this.keyTop,
        ])

        base.add(this.sprite)

        this.sprite.scale = 0.8

        this.bg.on('pointerdown', (pointer) => {
            this.down()
            if (this.callback) {
                this.callback(this.text)
            }
        })
        this.bg.setInteractive()
    }

    moveTo(x, y, onEnd) {

        this.scene.tweens.chain({
            targets: this.sprite,
            tweens: [
                {
                    x: x,
                    y: y,
                    ease: Phaser.Math.Easing.Back.InOut,
                    duration: 500,
                },
            ],

            onComplete() {
                if (onEnd) {
                    onEnd()
                }
            },
        })

    }

    down(onEnd) {

        this.scene.tweens.chain({
            targets: this.keyTop,
            tweens: [
                {
                    //angle: 0,
                    //x: 0,
                    y: 20,
                    // scale: 2.0,
                    ease: 'Back',
                    duration: 100,
                },
                {
                    //angle: 0,
                    //x: 0,
                    y: 0,
                    // scale: 2.0,
                    ease: 'power1',
                    duration: 100,
                },
            ],

            onComplete() {
                if (onEnd) {
                    onEnd()
                }
            },
        })

    }


}
