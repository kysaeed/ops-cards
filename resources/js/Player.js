
import CardStack from './CardStack.js'
import Deck from './Deck.js'

export default
class Player {
    constructor(scene, id, direction) {
        this.id = id
        this.direction = direction
        this.deck = new Deck(this)
        this.cardStack = new CardStack(scene)
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