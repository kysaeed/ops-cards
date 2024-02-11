
import _ from 'lodash'

import Card from './Card.js'
import CardList from './CardList'


const Bevel = 8
const HeightBase = 100
const WidthBase = -30

class DeckSprite {
    constructor(duel, x, y, count) {
        this.scene = duel.getScene()
        this.duel = duel
        this.count = count

        const DefaultScale = 0.4
        const DefaultAngle = 60


        const spriteList = []

        this.deckShadow = this.scene.add.sprite(0, 1, 'deck_shadow')
        this.deckShadow.scale = DefaultScale * 1.02
        this.deckShadow.angle = DefaultAngle
        spriteList.push(this.deckShadow)

        this.under = []
        for (let i = 0; i < this.count; i++) {
            const d = this.scene.add.sprite(0, - (i * 4), 'card_back')
            d.scale = DefaultScale
            d.angle = DefaultAngle
            this.under.push(d)
            spriteList.push(d)
        }

        this.deckSprite = this.scene.add.sprite(0, -(this.count * 4), 'card_back')
        this.deckSprite.setInteractive()
        this.deckSprite.scale = DefaultScale
        this.deckSprite.angle = DefaultAngle
        this.deckSprite.on('pointerdown', (pointer) => {
            AttackPhase.enter(scene, self.cardBoard, flag, this.duel, () => {
                //
            })
        });
        spriteList.push(this.deckSprite)

        this.sprite = this.scene.add.container(x, y, spriteList)

    }

    setCount(count) {
        this.count = count
        if (this.count <= 0) {
            this.deckSprite.visible = false
        } else {
            this.deckSprite.visible = true
        }
        this.deckSprite.y = -(this.count * 4)

        this.under.forEach((u, i) => {
            u.y = -(i * 4)
            if (i < this.count) {
                u.visible = true
            } else {
                u.visible = false
            }
        })
    }
}


export default class Deck {
    constructor(duel, player) {
        this.cards = []
        this.player = player

        const x = 90
        const y = 500 - (player.getPlayerId() * 400)

        this.sprite = new DeckSprite(duel, x, y, 6)
    }

    setCardList(cardList) {
        this.cards = _.cloneDeep(cardList)
    }
    shuffle() {
        this.cards = _.shuffle(this.cards)
    }

    draw(duel, stackCount, turnPlayerId) {
        if (this.isEmpty()) {
            return null
        }

        const x = 400
        const y = -(HeightBase) + (HeightBase * 2 * (turnPlayerId))


        const cardId = this.cards.shift()
        const cardInfo = CardList[cardId - 1]

        const card = new Card(duel, cardInfo, this.player, stackCount * 8, y + stackCount * 8, turnPlayerId)

        this.sprite.setCount(this.cards.length)

        return card
    }

    isEmpty() {
        if (!this.cards.length) {
            return true
        }
        return false
    }

}
