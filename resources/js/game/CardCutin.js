
import Phaser from 'phaser'
// import _ from 'lodash'
import Const from '../Const.js'


class DeckCutin {
    constructor(duel, cardInfo) {
        this.duel = duel

        const x = Const.Screen.Width * 0.5
        const y = Const.Screen.Height * 0.5


        const scene = this.duel.getScene()

        this.cardChara = scene.add.sprite(0, 0, cardInfo.image)

        this.cardTextDesc = scene.add
            .text(
                0, 200,
                cardInfo.text,
                { fontSize: '22px', fill: '#fff' })
            .setPadding(0, 2, 0, 2)
            .setOrigin(0.5, 0.5)

        /**
         * @todo カットインの背景を追加
         */

        this.sprite = scene.add.container(x, y, [
            this.cardChara,
            this.cardTextDesc,
        ])
        this.sprite.visible = false
    }

    show(onEnd) {
        const scene = this.duel.getScene()

        this.sprite.visible = true

        this.cardChara.alpha = 0
        this.cardChara.scale = 0.0
        this.cutinTweens = scene.tweens.chain({
            targets: this.cardChara,
            tweens: [
                {
                    scale: 2.4,
                    alpha: 0.8,
                    duration: 200,
                    ease: Phaser.Math.Easing.Cubic.InOut,
                },
            ],
            onComplete: () => {
                if (onEnd) {
                    onEnd()
                }
            },
        })

    }

    hide(onEnd) {
        const scene = this.duel.getScene()

        this.cutinTweens = scene.tweens.chain({
            targets: this.cardChara,
            tweens: [
                {
                    scale: 10.0,
                    alpha: 0.0,
                    duration: 500,
                    ease: Phaser.Math.Easing.Cubic.InOut,
                },
            ],
            onComplete: () => {
                this.sprite.visible = false
                if (onEnd) {
                    onEnd()
                }
            },
        })

    }

}

export default DeckCutin