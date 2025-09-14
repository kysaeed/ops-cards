
import Hero from './Hero.js'
import CardStack from './CardStack.js'
import Deck from './Deck.js'
import Bench from './Bench.js'
import Abyss from './Abyss.js'

export default class Player {
    constructor(duel, id, direction, name) {
        this.duel = duel
        this.id = id
        this.direction = direction
        this.hand = null /////
        this.deck = new Deck(duel, this)
        this.name = name

        this.bench = new Bench(duel, duel.getScene(), id)

        this.cardStack = new CardStack(duel, this)

        this.hero = new Hero(this.duel, this)

        this.abyss = new Abyss(duel, this)


    }

    setName(name) {
        this.name = name
        this.hero.setName(this.name)
    }
    getName() {
        return this.name
    }

    setCardClickableState(isClickable) {
        this.getDeck().setClickableState(isClickable)
        if (this.hand) {
            this.hand.setClickableState(isClickable)
        }
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

    getAbyss() {
        return this.abyss
    }

    getCardStack() {
        return this.cardStack
    }

    getHero() {
        return this.hero
    }
}