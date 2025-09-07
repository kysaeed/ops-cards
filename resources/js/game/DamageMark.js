export default class DamageMark {
    constructor(scene, x, y) {
        this.scene = scene
        this.damage = scene.add.sprite(0, 0, 'damage')

        this.x = x
        this.y = y

        this.sprite = scene.add.container(x, y, [
            this.damage,
        ])


        this.sprite.setBlendMode(Phaser.BlendModes.MULTIPLY);

        this.sprite.alpha = 0.8
        this.sprite.visible = false

        scene.anchor.add(this.sprite)

    }

    setDamage(attackCard, defenseCard, isTurnChange) {

        const scene = this.scene
        const x = attackCard.getSprite().x + ((defenseCard.getSprite().x -attackCard.getSprite().x) * 0.5)
        const y = attackCard.getSprite().y + ((defenseCard.getSprite().y -attackCard.getSprite().y) * 0.5)

        const mainEmitter = scene.add.particles(this.x, this.y, 'damage', {
            x: x,
            y: y,
            speed: { min: 500, max: 900 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.0, end: 0.0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 300,
            quantity: 10,
            frequency: 30,
            gravityY: 0,
            blendMode: 'ADD',
            emitZone: {
              source: new Phaser.Geom.Circle(0, 0, 10),
              type: 'edge',
              quantity: 30
            }
          }).setDepth(1000);
        // 1秒後に放出を停止
        scene.time.delayedCall(100, () => {
            mainEmitter.stop();
        });

        // 4秒後にエミッターを破棄
        scene.time.delayedCall(2000, () => {
            mainEmitter.destroy();
        });

        if (isTurnChange) {
            const emitter = scene.add.particles(this.x, this.y, 'damage', {
                x: x,
                y: y,
                speed: { min: 200, max: 400 },
                angle: { min: 0, max: 360 },
                scale: { start: 2.0, end: 0.0 },
                alpha: { start: 1, end: 0 },
                lifespan: 800,
                quantity: 30,
                frequency: 50,
                gravityY: 0,
                blendMode: 'ADD',
                emitZone: {
                    source: new Phaser.Geom.Circle(0, 0, 10),
                    type: 'edge',
                    quantity: 30
                }
            }).setDepth(1000);

            // 1秒後に放出を停止
            scene.time.delayedCall(100, () => {
                emitter.stop();
            });

            // 4秒後にエミッターを破棄
            scene.time.delayedCall(2000, () => {
                emitter.destroy();
            });
        }

    }

    setDamage2(damage) {
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
