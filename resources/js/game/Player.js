
import CardStack from './CardStack.js'
import Deck from './Deck.js'
import Bench from './Bench.js'

export default class Player {
    constructor(duel, id, direction) {
        this.duel = duel
        this.id = id
        this.direction = direction
        this.hand = null /////
        this.deck = new Deck(duel, this)

        this.bench = new Bench(duel, duel.getScene(), id)

        this.cardStack = new CardStack(duel)

    }

    getDirection() {
        return this.direction
    }

    getPlayerId() {
        return this.id
    }

    getEnemyPlayerId() {
        return (1 - this.id)
    }

    getBaseY() {
        return 100 * this.direction
    }

    takeHandCard() {
        const handCard = this.hand
        this.hand = null
        return handCard
    }

    getHandCard() {
        return this.hand
    }

    setHandCard(card) {
        this.hand = card
    }

    getDeck() {
        return this.deck
    }

    getBench() {
        return this.bench
    }

    getCardStack() {
        return this.cardStack
    }

}