export default class DamageMark {
    constructor(scene, x, y) {
        this.scene = scene
        this.damage = scene.add.sprite(0, 0, 'damage')

        this.sprite = scene.add.container(x, y, [
            this.damage,
        ])


        this.sprite.setBlendMode(Phaser.BlendModes.MULTIPLY);

        this.sprite.alpha = 0.8
        this.sprite.visible = false

        scene.anchor.add(this.sprite)

    }

    setDamage(damage) {
        this.sprite.scale = 0
        this.sprite.alpha = 1.0
        this.sprite.visible = true
        // this.sprite.alpha = 0.5

        const self = this;
        this.scene.tweens.chain({
            targets: this.sprite,
            tweens: [
                {
                    // x: x,
                    // y: y,
                    //angle: angle + 90 + Bevel,
                    ease: 'power1',
                    scale: 2.0,
                    duration: 100,
                },
                {
                    // x: x,
                    // y: y,
                    //angle: angle + Bevel,
                    ease: 'power1',
                    //alpha: 0,
                    duration: 150,
                },
                // {
                //     // x: x,
                //     // y: y,
                //     //angle: angle + Bevel,
                //     ease: 'power1',
                //     scale: 10.0,
                //     alpha: 0,
                //     duration: 200,
                // },
            ],
            onComplete: () => {
                console.log('dm: OK!')
                self.sprite.visible = false
            },
        })
        //
    }

}
