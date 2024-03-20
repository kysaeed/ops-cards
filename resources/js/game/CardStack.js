
export default class CardStack {
    constructor(duel) {
        this.duel = duel
        this.cards = []
    }

    addCard(card) {
        this.cards.push(card)
    }

    getTotalPower(enemyCard) {
        //
        let power = 0
        this.cards.forEach((c) => {
            power += c.getPower(enemyCard)
        })
        return power
    }

    getTopCard() {
        if (!this.cards.length) {
            return null
        }
        return this.cards[this.cards.length - 1]
    }

    getStackCount() {
        return this.cards.length
    }

    takeAll() {
        const cards = this.cards
        this.cards = []
        return cards
    }

    criticalDamaged(onEnd) {
        this.cards.forEach((c, i) => {
            let onEndFirst = null
            if (i < 1) {
                onEndFirst = onEnd
            }
            c.criticalDamaged(i, onEnd)
        })
    }
}