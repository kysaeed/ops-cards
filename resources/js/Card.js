const Bevel = 8
const HeightBase = 100
const WidthBase = -30

// const direction  = 1

export default class Card {
    constructor(scene, parent, objectManager, cardInfo, player, x, y, cardDirection) {
        this.scene = scene
        this.player = player

        this.cardShadow = scene.add.sprite(0 + 2, 0 + 2, 'card_shadow')

        this.cardBg = scene.add.sprite(0, 0, 'card')
        this.cardChara = scene.add.sprite(0, 22, cardInfo.image)
        this.cardTextPoint = scene.add.text(-20, -55, cardInfo.p, { fontSize: '24px', fill: '#000' });
        this.cardTextTitle = scene.add.text(-40, -28, cardInfo.name, { fontSize: '12px', fill: '#000' });
        this.card = scene.add.container(x, y, [
            this.cardBg,
            this.cardChara,
            this.cardTextPoint,
            this.cardTextTitle,
        ])
        this.card.angle = Bevel + (180 * cardDirection)

        parent.add(this.cardShadow)
        parent.add(this.card)

        objectManager.append(this)

        this.cardInfo = cardInfo
    }

    enterTo(x, y, turnPlayer) {

        const angle = turnPlayer * 180
        this.scene.tweens.chain({
            targets: this.card,
            tweens: [
                {
                    x: x,
                    y: y,
                    angle: angle + 90 + Bevel,
                    scale: 0.3,
                    duration: 300,
                },
                {
                    angle: angle + Bevel,
                    x: x,
                    y: y,
                    ease: 'power1',
                    duration: 300,
                },
                {
                    x: x,
                    y: y,
                    angle: angle + Bevel,
                    scale: 1.0,
                    duration: 200,
                },
            ],
            onComplete() {
                console.log('diffence-card: OK!')
            },
        })

    }

    attack(stackCount, onEnd) {
        // console.log('attack..')
        const y = this.player.getBaseY();
        const x = WidthBase * this.player.direction
        this.scene.tweens.chain({
            targets: this.card,
            tweens: [
                {
                    delay: stackCount * 40,
                    // angle: '-=8',
                    // angle: 180 * (turnPlayer) + 9,
                    x: 0 - stackCount * 8,
                    y: 0, //enemyY,
                    scale: 1.0,
                    duration: 100,
                    ease: 'power1',
                },
                {
                    // angle: 180 * (turnPlayer) + 9,
                    x: x - stackCount * 8,
                    scale: 1.2,
                    y: this.card.y,
                    ease: 'power1',
                    duration: 300,
                },
                {
                    x: x - stackCount * 8,
                    y: y - stackCount * 8,
                    // angle: '+=8',
                    scale: 1.0,
                    duration: 200,
                    ease: 'power1',
                },
            ],
            onComplete() {
                console.log('OK!')
                if (onEnd) {
                    onEnd()
                }
            },
        })

    }

    damaged(onEnd) {
        const x = this.card.x
        const y = this.card.y
        const direction = this.player.direction

        this.scene.tweens.chain({
            targets: this.card,
            tweens: [
                {
                    x: x,
                    y: y,
                    //angle: 270,
                    scale: 1.3,
                    duration: 100,
                },
                {
                    //angle: 180,
                    x: x,
                    y: y - (40 * direction),
                    ease: 'power1',
                    duration: 100,
                },
                {
                    x: x,
                    y: y,
                    //angle: 180,
                    scale: 1.0,
                    duration: 200,
                },
            ],
            onComplete() {
                if (onEnd) {
                    onEnd();
                }
            },
        })
    }

    moveToBench(x, y, onEnd) {
        const max = 6
        const angle = Math.floor((90 + 12) + (Math.random() * max) - (max / 2))

        this.scene.tweens.chain({
            targets: this.card,
            tweens: [
                {
                    x: x,
                    y: y,
                    angle: angle,
                    scale: 0.5,
                    duration: 400,
                    ease: 'power1',
                },
            ],
            onComplete() {
                if (onEnd) {
                    onEnd();
                }
            },
        })

    }

    onUpdate() {
        this.cardShadow.x = this.card.x + 2
        this.cardShadow.y = this.card.y + 2
        this.cardShadow.scale = this.card.scale
        this.cardShadow.angle = this.card.angle
    }

}
