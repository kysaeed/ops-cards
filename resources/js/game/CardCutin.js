
// import _ from 'lodash'
import Const from '../Const.js'


class DeckCutin {
    constructor(duel, cardInfo) {
        this.duel = duel

        const x = 400
        const y = 200


        const scene = this.duel.getScene()

        this.cardChara = scene.add.sprite(0, 0, cardInfo.image)
        this.cardChara.x = this.cardChara.width * 0.5
        this.cardChara.y = this.cardChara.height * 0.5

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
        this.cardChara.scale = 10.2
        this.cutinTweens = scene.tweens.chain({
            targets: this.cardChara,
            tweens: [
                {
                    scale: 1.5,
                    alpha: 0.8,
                    duration: 500,
                    ease: 'power1',
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
        this.sprite.visible = false
        if (onEnd) {
            onEnd()
        }
    }

}

export default DeckCutin