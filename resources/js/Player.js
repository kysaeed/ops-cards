
import CardStack from './CardStack.js'
import Deck from './Deck.js'

export default
class Player {
    constructor(duel, id, direction) {
        this.duel = duel
        this.id = id
        this.direction = direction
        this.deck = new Deck(this)
        this.cardStack = new CardStack(duel.getScene())
    }

    getPlayerId() {
        return this.id
    }

    getBaseY() {
        return 100 * this.direction
    }

    getDeck() {
        return this.deck
    }
}