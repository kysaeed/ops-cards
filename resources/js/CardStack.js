export default class CardStack {
    constructor(scene) {
        this.scene = scene
        this.cards = []
    }

    addCard(card) {
        this.cards.push(card)
    }

    getTotalPower() {
        //
        let power = 0
        this.cards.forEach((c) => {
            power += c.cardInfo.p
        })
        return power
    }

    getTopCard() {
        if (!this.cards.length) {
            return null
        }
        return this.cards[this.cards.length - 1]
    }

    takeAll() {
        const cards = this.cards
        this.cards = []
        return cards
    }
}