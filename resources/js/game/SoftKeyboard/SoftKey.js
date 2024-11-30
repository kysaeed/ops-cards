export default class SoftKey {


    constructor(scene, base, text) {
        this.scene = scene
        this.text = text

        this.bg = scene.add.image(
            0, 0,
            'key'
        )

        this.textSprite = scene.add.textSprite = scene.add.text(-10, -20, text, { fontSize: '32px', fill: '#000' })

        this.sprite = scene.add.container(0,0, [
            this.bg,
            this.textSprite,
        ])


        base.add(this.sprite)

        this.sprite.scale = 0.5

        this.bg.on('pointerdown', (pointer) => {
            this.down()
        })
        this.bg.setInteractive()
    }

    down(onEnd) {

        this.scene.tweens.chain({
            targets: this.bg,
            tweens: [
                {
                    //angle: 0,
                    //x: 0,
                    y: 20,
                    // scale: 2.0,
                    ease: 'power1',
                    duration: 300,
                },
                {
                    //angle: 0,
                    //x: 0,
                    y: 0,
                    // scale: 2.0,
                    ease: 'power1',
                    duration: 300,
                },
            ],

            onComplete() {
                // console.log('flag: OK!')
                if (onEnd) {
                    onEnd()
                }
            },
        })

    }


}
