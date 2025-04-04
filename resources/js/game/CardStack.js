import { initial } from "lodash"
import Card from './Card.js'

export default class CardStack {
    constructor(duel, player) {
        this.duel = duel
        this.player = player
        this.cards = []
    }

    initialize(cardList) {
        let isAttackTurn = true
        if (this.player.getPlayerId() != this.duel.getTurnPlayerId()) {
            isAttackTurn = false
        }

        cardList.reverse().forEach((cardInfo) => {
            if (cardInfo) {
                const stackCardInfo = this.duel.getCardInfo(cardInfo.cardNumber)
                const card = new Card(this.duel, stackCardInfo, this.player, 0, 0)
                if (isAttackTurn) {
                    if (cardInfo.addPower) {
                        //
                        card.setBufParams({power: cardInfo.addPower })
                    }
                    card.setAttackPosition()
                } else {
                    card.setDefensePosition()
                }
                this.addCard(card)
            }
        })

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

    take(count) {
        return this.cards.splice(-count, count)
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