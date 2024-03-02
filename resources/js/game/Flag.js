export default class Flag {
    constructor(scene, x, y) {
        this.scene = scene
        this.sprite = scene.add.sprite(x, y, 'flag')

    }

    moveTo(x, y, onEnd) {
        const basePosition = {
            x: this.sprite.x,
            y: this.sprite.y,
        }
        this.scene.tweens.chain({
            targets: this.sprite,
            tweens: [
                {
                    // x: x,
                    // y: y,
                    angle: 0,
                    scale: 1.0,
                    duration: 300,
                },
                {
                    angle: 0,
                    // x: x,
                    // y: y,
                    scale: 2.0,
                    ease: 'power1',
                    duration: 300,
                },
                {
                    x: x,
                    y: y,
                    angle: 0,
                    scale: 1.0,
                    duration: 200,
                },
            ],
            onComplete() {
                console.log('flag: OK!')
                if (onEnd) {
                    onEnd()
                }
            },
        });
    }
}
