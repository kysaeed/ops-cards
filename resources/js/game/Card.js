import Const from '../Const.js'

const Bevel = Const.Bevel
const HeightBase = 100
const WidthBase = -30

const DefaultCardSize = 0.5

// const direction  = 1

class CardTip {
    constructor(duel, cardInfo, player, x, y) {
        this.duel = duel
        const scene = duel.getScene()

        this.cardTip = scene.add.sprite(-30, 0, 'card_tip')
        this.cardTipText = scene.add.text(-40, -20, '', { fontSize: '32px', fill: '#000' });

        this.cardTipText.text = ''

        this.sprite = scene.add.container(x, y, [
            this.cardTip,
            this.cardTipText,
        ])
        this.sprite.visible = false

    }

    setText(text) {
        this.cardTipText.text = text
    }

    getSprite() {
        return this.sprite
    }

    showStatusTip(onEnd) {

        // @todo
        this.sprite.visible = true
        this.sprite.alpha = 0

        this.duel.getScene().tweens.chain({
            targets: this.sprite,
            tweens: [
                {
                    duration: 200,
                    alpha: 1.0,
                },
            ],
            onComplete: () => {
                if (onEnd) {
                    onEnd()
                }
            }
        })

    }

    hideStatusTip() {
        this.sprite.visible = false

    }


}

export default class Card {
    constructor(duel, cardInfo, player, x, y) {
        this.duel = duel

        let cardDirection = player.getPlayerId()

        const scene = duel.getScene()
        this.player = player

        this.cardShadow = scene.add.sprite(0 + 2, 0 + 2, 'card_shadow')

        // card main
        this.cardBg = scene.add.sprite(0, 0, 'card')
        this.cardChara = scene.add.sprite(0, 0, cardInfo.image)
        this.cardPow = scene.add.sprite(-52, -73, 'card_pow')
        this.cardType = scene.add.sprite(50, -67, 'card_type')
        this.cardTextPoint = scene.add.text(-62, -95, `${cardInfo.power}`, { fontSize: '30px', fill: '#000' }).setPadding(0, 2, 0, 2);;
        this.cardTextType = scene.add.text(38, -74, '種別', { fontSize: '13px', fill: '#000' }).setPadding(0, 2, 0, 2);;
        this.cardTextTitle = scene.add.text(-26, -98, `${cardInfo.name}`, { fontSize: '15px', fill: '#000' }).setPadding(0, 4, 0, 4);
        this.cardTextDesc = scene.add
            .text(-68, 74, 'あいうえおかきくけこ\nあいうえおかきくけこ', { fontSize: '12px', fill: '#000' })
            .setPadding(0, 2, 0, 2);

        if (cardInfo.text) {
            this.cardTextDesc.text = cardInfo.text
        }

        // card tip
        this.cardTip = new CardTip(duel, cardInfo, player, -30, -142)

        //this.cardTipTextPoint.visible = false
        //this.cardTip.visible = false

        // clickable ----
        this.cardClickable = scene.add.sprite(0, 0, 'deck_clickable')
        this.clickableTewwns = scene.tweens.chain({
            targets: this.cardClickable,
            repeat: -1,
            yoyo: true,
            paused: true,
            tweens: [
                {
                    scale: 1.3,
                    duration: 1000,
                    ease: 'power1',
                },
                {
                    scale: 1.1,
                    duration: 1000,
                    ease: 'power1',
                },
            ],
        })
        this.clickableTewwns.play()

        this.cardClickable.visible = false

        this.sprite = scene.add.container(x, y, [
            this.cardBg,
            this.cardChara,
            this.cardPow,
            this.cardType,
            this.cardTextPoint,
            this.cardTextType,
            this.cardTextTitle,
            this.cardTextDesc,
            this.cardTip.getSprite(),
            ///
            this.cardClickable,
        ])

        this.sprite.angle = Bevel + (180 * cardDirection)

        const parent = duel.getCardBoard()
        parent.add(this.cardShadow)
        parent.add(this.sprite)

        duel.getObjectManager().append(this)

        this.cardInfo = cardInfo

        const sprite = this.cardBg
        sprite.on('pointerdown', (pointer) => {

            const phase = this.duel.getCurrentPhase()

            if (phase.onEvent) {

                // todo イベントハンドラを設定できるようにする
                phase.onEvent('click-hand', this, {})

            }
        })
    }

    bringToTop() {
        const parent = this.duel.getCardBoard()

        parent.bringToTop(this.cardShadow)
        parent.bringToTop(this.sprite)
    }

    setClickableState(isClickable) {
        const sprite = this.cardBg
        if (isClickable) {
            this.cardClickable.visible = true
            this.clickableTewwns.play()
            sprite.setInteractive()

        } else {
            this.cardClickable.visible = false
            this.clickableTewwns.pause()
            sprite.disableInteractive()
        }

    }

    showStatusTip(onEnd) {
        this.cardTip.showStatusTip(onEnd)
    }

    hideStatusTip() {
        this.cardTip.hideStatusTip()
    }

    getPower() {
        let add = 0

        const ability = this.cardInfo.ability
        if (ability) {
            const isTurnPlayerCard = this.duel.isTurnPlayer(this.player)
            if (isTurnPlayerCard) {
                if (ability.attack) {
                    if (ability.attack.power) {
                        add += ability.attack.power
                    }
                }
            }
        }

        if (add) {
            this.cardTip.setText(`+${add}`)
        }

        return (this.cardInfo.power + add)
    }

    enterTo(x, y, turnPlayer) {

        const angle = turnPlayer * 180
        this.duel.getScene().tweens.chain({
            targets: this.sprite,
            tweens: [
                // {
                //     x: x,
                //     y: y,
                //     angle: angle + 90 + Bevel,
                //     scale: 0.3 * 0.6,
                //     duration: 300,
                // },
                // {
                //     angle: angle + Bevel,
                //     x: x,
                //     y: y,
                //     ease: 'power1',
                //     duration: 300,
                // },
                {
                    x: x,
                    y: y,
                    angle: angle + Bevel,
                    scale: DefaultCardSize,
                    duration: 200,
                },
            ],
            onComplete: () => {
                console.log('diffence-card: OK!')
            },
        })

    }

    attack(stackCount, onEnd) {
        // console.log('attack..')
        const direction = this.player.getDirection()
        // const y = this.player.getBaseY();
        // const x = WidthBase + (1 * this.player.direction)

        const x = (WidthBase * direction) - (stackCount * 32 * -direction)
        const y = (-HeightBase) + (HeightBase * 2 * (1 - this.player.getPlayerId()))


        const startY = this.sprite.y;

        const tweens = this.duel.getScene().tweens

        tweens.chain({
            targets: this.sprite,
            tweens: [
                {
                    delay: stackCount * 40,
                    // angle: '-=8',
                    // angle: 180 * (turnPlayer) + 9,
                    x: 0 - (stackCount * 8 * -direction),
                    y: 0,
                    scale: DefaultCardSize,
                    duration: 100,
                    ease: 'power1',
                },
            ],
            onComplete: () => {
                console.log('OK!')
                if (onEnd) {
                    onEnd()
                }

                tweens.chain({
                    targets: this.sprite,
                    tweens: [
                        {
                            x: x,
                            y: y,
                            scale: 1.2 * 0.6,
                            ease: 'power1',
                            duration: 300,
                        },
                        {
                            x: x,
                            y: y,
                            // angle: '+=8',
                            scale: DefaultCardSize,
                            duration: 200,
                            ease: 'power1',
                        },
                        {
                            delay: 800,
                        }
                    ],
                    onComplete: () => {},
                })
            },
        })

    }

    damaged(onEnd) {
        const x = this.sprite.x
        const y = this.sprite.y

        const direction = this.player.getDirection()
        this.duel.getScene().tweens.chain({
            targets: this.sprite,
            tweens: [
                // {
                //     x: x,
                //     y: y,
                //     //angle: 270,
                //     // scale: /*1.3 * */ 0.6,
                //     duration: 100,
                // },
                {
                    //angle: 180,
                    x: x,
                    y: y - (10 * direction),
                    ease: 'power1',
                    duration: 50,
                },
                {
                    x: x,
                    y: y,
                    //angle: 180,
                    // scale: 0.6,
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

    criticalDamaged(index, onEnd) {
        const x = this.sprite.x
        const y = this.sprite.y
        const direction = this.player.direction
        const xAdd = (index * 80)
        const yMlt = 1.0 + (index * 0.05)

        this.duel.getScene().tweens.chain({
            targets: this.sprite,
            tweens: [
                // {
                //     x: x,
                //     y: y,
                //     //angle: 270,
                //     scale: 1.3 * 0.6,
                //     duration: 100,
                // },
                {
                    //angle: 180,
                    x: x + xAdd,
                    y: y + ((80 * direction) * yMlt),
                    ease: 'power1',
                    duration: 100,
                },
                {
                    x: x + xAdd,
                    y: y + ((80 * direction) * yMlt),
                    //angle: 180,
                    scale: 0.6,
                    duration: 300,
                },
            ],
            onComplete() {
                if (onEnd) {
                    onEnd();
                }
            },
        })
    }

    fold(index, onEnd) {
        const stackCount = index
        const direction = this.player.direction
        const x = (WidthBase * direction) - (stackCount * 4 /* * direction */)
        const y = HeightBase * direction - (stackCount * 4 /* * direction */)
        const xAdd = 0 //(index * 8)

        this.duel.getScene().tweens.chain({
            targets: this.sprite,
            tweens: [
                // {
                //     //angle: 180,
                //     x: x + xAdd,
                //     y: y,
                //     ease: 'power1',
                //     duration: 100,
                // },
                {
                    x: x + xAdd,
                    y: y,
                    //angle: 180,
                    //scale: 0.6,
                    duration: 50,
                },
            ],
            onComplete() {
                if (onEnd) {
                    onEnd();
                }
            },
        })
    }

    showDetial(onEnd) {
        const scene = this.duel.getScene()

        const x = this.sprite.x
        const y = this.sprite.y

        scene.tweens.chain({
            targets: this.sprite,
            tweens: [
/*
                {
                    x: x - 10,
                    y: y - 25,
                    // angle: ,
                    scale: DefaultCardSize,
                    duration: 400,
                    ease: 'power1',
                },
                {
                    // angle: ,
                    scale: DefaultCardSize,
                    duration: 400,
                    ease: 'power1',
                },
*/

                {
                    x: -100,
                    y: -10,
                    scale: 1.5,
                    duration: 100,
                    angle: 0,
                },
                {
                    duration: 1000,
                    angle: 0,
                },
            ],
            onComplete() {
                if (onEnd) {
                    onEnd()
                }
            }
        })
    }

    moveToHandPosition(onEnd) {
        //
        const scene = this.duel.getScene()

        let direction = 1
        if (this.player.getPlayerId()) {
            direction = -1
        }

        const stackCount = 0 //this.player.getCardStack().getStackCount()
        const x = -(WidthBase * 2 /* * direction */ )
        const y = (HeightBase) * 2.5 /* + (HeightBase * 2 * (1 - this.player.getPlayerId())) */

        scene.tweens.chain({
            targets: this.sprite,
            tweens: [
                {
                    delay: 1000,
                    scale: 0.65,
                    x: x,
                    y: y,
                    ease: 'power1',
                    duration: 200,
                    angle: 0, //Bevel + (180 * this.player.getPlayerId()),
                },
                {
                    x: x,
                    y: y,
                    scale: 0.65,
                    duration: 100,
                },
            ],
            onComplete() {
                if (onEnd) {
                    onEnd()
                }
            }
        })


    }

    moveToAttackPosition(onEnd) {
        //
        const scene = this.duel.getScene()

        let direction = 1
        if (this.player.getPlayerId()) {
            direction = -1
        }

        const stackCount = this.player.getCardStack().getStackCount()
        const x = (WidthBase * direction) - (stackCount * 32 * -direction)
        const y = (-HeightBase) + (HeightBase * 2 * (1 - this.player.getPlayerId()))

        scene.tweens.chain({
            targets: this.sprite,
            tweens: [
                {
                    delay: 100,
                    scale: DefaultCardSize,
                    x: x,
                    y: y - (stackCount * 8),
                    ease: 'power1',
                    duration: 200,
                    angle: Bevel + (180 * this.player.getPlayerId()),
                },
                {
                    x: x,
                    y: y - (stackCount * 8),
                    scale: DefaultCardSize,
                    duration: 100,
                },
            ],
            onComplete() {
                if (onEnd) {
                    onEnd()
                }
            }
        })


    }

    moveToBench(x, y, onEnd) {
        const max = 6
        const angle = Math.floor((90 + 12) + (Math.random() * max) - (max / 2))

        this.duel.getScene().tweens.chain({
            targets: this.sprite,
            tweens: [
                {
                    x: x,
                    y: y,
                    angle: angle,
                    scale: DefaultCardSize * 0.6,
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
        this.cardShadow.x = this.sprite.x + 2
        this.cardShadow.y = this.sprite.y + 2
        this.cardShadow.scale = this.sprite.scale
        this.cardShadow.angle = this.sprite.angle
        this.cardShadow.alpha = this.sprite.alpha
    }

}
