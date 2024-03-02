

export default class CardDetailPresenter {

    constructor(duel) {
        this.duel = duel
    }

    showCard(card, onEnd) {

        this.duel.getScene().tweens.chain({
            targets: card.card,
            tweens: [
                {
                    delay: 1000,
                    scale: 0.6,
                    x: x,
                    y: y - (stackCount * 8),
                    ease: 'power1',
                    duration: 200,
                    angle: Bevel + (180 * turnPlayer),
                },
                {
                    x: x,
                    y: y - (stackCount * 8),
                    scale: 0.6,
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