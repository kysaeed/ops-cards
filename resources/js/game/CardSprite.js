import Phaser from 'phaser'
import Const from '../Const.js'
import Number from './Number.js'
import DeckCutin from './CardCutin.js'

const Bevel = Const.Bevel
const HeightBase = 100
const WidthBase = -30

const DefaultCardSize = 0.5


export default class CardSprite /* extends Phaser.GameObjects.Container */ {
    constructor(scene, cardNumber, cardInfo, parent) {
        // super(scene, 0, 0, children);

        // this.duel = duel
        // let cardDirection = player.getPlayerId()

        // const scene = duel.getScene()
        // this.player = player

        /**
         * @tood テスト用なのでなおす
         */
        this.isSelected = false



        this.cardShadow = scene.add.sprite(0 + 2, 0 + 2, 'card_shadow')


        this.bufParams = {

        }

        // card main
        this.cardBg = scene.add.sprite(0, 0, 'card')
        this.cardChara = scene.add.sprite(0, 0, cardInfo.image)

        this.cardPow = scene.add.sprite(-52, -73, 'card_pow')
        this.power = new Number(scene, -53, -80)
        this.power.setNumber(cardInfo.power)
        // this.cardTextPoint = scene.add.text(-62, -95, `${cardInfo.power}`, { fontSize: '30px', fill: '#000' }).setPadding(0, 2, 0, 2);;

        this.cardType = scene.add.sprite(50, -67, 'card_type')
        this.cardTextType = scene.add.text(38, -74, '種別', { fontSize: '13px', fill: '#000' }).setPadding(0, 2, 0, 2);;
        this.cardTextTitle = scene.add.text(-28, -98, `${cardInfo.name}`, { fontSize: '20px', fill: '#000' }).setPadding(0, 4, 0, 4);

        const descPosition = {
            x: -68,
            y: 74,
        }
        this.abilityEffect = scene.add.sprite(0, descPosition.y + 20, 'desc_effect')
        this.abilityEffect.visible = false
        this.cardTextDesc = scene.add
            .text(
                descPosition.x, descPosition.y,
                'あいうえおかきくけこ\nあいうえおかきくけこ',
                { fontSize: '12px', fill: '#000' })
            .setPadding(0, 2, 0, 2);


        if (cardInfo.text) {
            this.cardTextDesc.text = cardInfo.text
        }

        // card tip
        // this.cardTip = new CardTip(duel, cardInfo, player, -30, -142)

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

        this.sprite = scene.add.container(0, 0, [
            this.cardBg,
            this.cardChara,
            this.cardPow,
            this.cardType,
            //this.cardTextPoint,
            this.power.getSprite(),
            this.cardTextType,
            this.cardTextTitle,
            this.cardTextDesc,
            // this.cardTip.getSprite(),
            this.abilityEffect,
            ///
            this.cardClickable,

        ])

        // const cardDirection = 0
        // this.sprite.angle = Bevel + (180 * cardDirection)
        this.sprite.angle = 0

        if (parent) {
            parent.add(this.cardShadow)
            parent.add(this.sprite)
        }

        this.shadowDistance = 2
        this.shadowScale = 1.0
        this.shadowAlpha = 1.0

        // duel.getObjectManager().append(this)

        this.cardInfo = cardInfo

        this.cardBg.on('pointerdown', (pointer) => {
            if (this.onClicked) {
                this.onClicked(this)
            }

            // const phase = this.duel.getCurrentPhase()
            // if (phase.onEvent) {

            //     // todo イベントハンドラを設定できるようにする
            //     phase.onEvent('click-hand', this, {})

            // }
        })

        // this.cardCutin = new DeckCutin(duel, cardInfo)

    }

    setClickable(isClickable) {
        if (isClickable) {
            this.cardBg.setInteractive()
        } else {
            this.cardBg.disableInteractive()
        }

    }
    setClickEventListener(callback) {
        this.onClicked = callback
    }

    onUpdate() {
        this.cardShadow.x = this.sprite.x + this.shadowDistance
        this.cardShadow.y = this.sprite.y + this.shadowDistance

        // todo
        this.cardShadow.angle = this.sprite.angle
        this.cardShadow.scale = this.sprite.scale * this.shadowScale
        this.cardShadow.alpha = this.sprite.alpha * this.shadowAlpha

    }

}
