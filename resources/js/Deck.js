
import _ from 'lodash'

import Card from './Card.js'
import CardList from './CardList'


const Bevel = 8
const HeightBase = 100
const WidthBase = -30


export default class Deck {
    constructor(player) {
        this.cards = []
        this.player = player
    }

    setCardList(cardList) {
        this.cards = _.cloneDeep(cardList)
    }
    shuffle() {
        this.cards = _.shuffle(this.cards)
    }

    draw(duel, /* scene, cardBoard, objectManager,*/ stackCount, turnPlayerId) {
        if (this.isEmpty()) {
            return null
        }

        const x = 400
        const y = -(HeightBase) + (HeightBase * 2 * (turnPlayerId))


        const cardId = this.cards.shift()
        const cardInfo = CardList[cardId - 1]

        const card = new Card(duel,/* scene, cardBoard, objectManager,*/ cardInfo, this.player, stackCount * 8, y + stackCount * 8, turnPlayerId)

        return card
    }

    isEmpty() {
        if (!this.cards.length) {
            return true
        }
        return false
    }

}
