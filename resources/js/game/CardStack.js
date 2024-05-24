
export default class CardStack {
    constructor(duel) {
        this.duel = duel
        this.cards = []
    }

    addCard(card) {
        const depth = this.cards.length + 1
        //card.bringToTop()
        this.cards.push(card)
    }

    each(callback) {
        this.cards.forEach(callback)
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
        let onEndFirst = onEnd
        this.cards.forEach((c, i) => {
            c.criticalDamaged(i, onEndFirst)
            onEndFirst = null
        })
    }

    fold(onEnd) {
        let onEndFirst = onEnd
        this.cards.forEach((c, i) => {
            c.fold(i, onEndFirst)
            onEndFirst = null
        })
    }
}