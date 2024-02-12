
import CardStack from './CardStack.js'
import Deck from './Deck.js'
import Bench from './Bench.js'

export default class Player {
    constructor(duel, id, direction) {
        this.duel = duel
        this.id = id
        this.direction = direction
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

    getDeck() {
        return this.deck
    }

    getCardStack() {
        return this.cardStack
    }

}