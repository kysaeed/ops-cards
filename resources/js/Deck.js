
import _ from 'lodash'

import Card from './Card.js'
import CardList from './CardList'


const Bevel = 8
const HeightBase = 100
const WidthBase = -30

const DefaultScale = 0.4
const DefaultAngle = 60


class DeckSprite {
    constructor(duel, isPlayer, x, y, count) {
        this.duel = duel
        this.scene = duel.getScene()
        this.count = count


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
            const phase = this.duel.getCurrentPhase()

            if (phase.onEvent) {
                phase.onEvent('click', this, {})
            }
            // AttackPhase.enter(scene, self.cardBoard, flag, this.duel, () => {
            //     //
            // })
        });
        spriteList.push(this.deckSprite)


        //
        this.drawCard = this.scene.add.sprite(0, -(this.count * 4), 'card_back')
        this.drawCard.scale = DefaultScale
        this.drawCard.angle = DefaultAngle
        this.drawCard.alpha = 0
        spriteList.push(this.drawCard)

        //
        this.deckClickable = this.scene.add.sprite(0, -(this.count * 4), 'deck_clickable')
        this.deckClickable.angle = DefaultAngle
        this.deckClickable.scale = 0.6
        spriteList.push(this.deckClickable)

        this.clickableTewwns = this.scene.tweens.chain({
            targets: this.deckClickable,
            repeat: -1,
            yoyo: true,
            paused: true,
            tweens: [
                {
                    scale: 0.75,
                    duration: 1000,
                    ease: 'power1',
                },
                {
                    scale: 0.5,
                    duration: 1000,
                    ease: 'power1',
                },
            ],
        })
        this.deckClickable.visible = false

        this.sprite = this.scene.add.container(x, y, spriteList)

        const board = duel.getCardBoard()
        board.add(this.sprite)
    }

    setClickableState(isClickable) {
        if (isClickable) {
            this.deckClickable.y = -(this.count * 4)
            this.deckClickable.visible = true
            this.clickableTewwns.play()
        } else {
            this.deckClickable.visible = false
            this.clickableTewwns.pause()
        }
    }

    setCount(count) {
        this.count = count
        if (this.count <= 0) {
            this.deckSprite.visible = false
            this.deckShadow.visible = false
        } else {
            this.deckSprite.visible = true
            this.deckShadow.visible = true
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

    setDrawCardPosition(card, onEnd) {
        this.drawCard.visible = true
        this.drawCard.scale = DefaultScale
        this.drawCard.alpha = 1
        this.drawCard.x = 0
        this.drawCard.y = -(this.count * 4)

        card.card.alpha = 0
        card.card.x = this.sprite.x + this.drawCard.x - 10
        card.card.y = this.sprite.y + this.drawCard.y - 50
        card.card.angle = this.drawCard.angle
        card.card.scale = 0.5

        const x = card.card.x
        const y = card.card.y

        this.duel.getScene().tweens.chain({
            targets: card.card,
            tweens: [
                {
                    x: x,
                    y: y,
                    duration: 300,
                    alpha: 0.0,
                    ease: 'power1',
                },
                {
                    x: x,
                    y: y,
                    duration: 600,
                    alpha: 1.0,
                    scale: 0.5,
                    ease: 'power1',
                },
            ],
            onComplete: () => {
                card.card.x = this.sprite.x + this.deckSprite.x
                card.card.y = this.sprite.y + this.deckSprite.y
                card.card.angle = this.deckSprite.angle
                card.card.scale = this.deckSprite.scale

                this.drawCard.visible = false

                if (onEnd) {
                    onEnd()
                }
            },
        })

        this.duel.getScene().tweens.chain({
            targets: this.drawCard,
            tweens: [
                {
                    x: this.drawCard.x - 10,
                    y: this.drawCard.y - 50,
                    alpha: 1.0,
                    scale: 0.5,
                    duration: 300,
                    ease: 'power1',
                },
                {
                    // alpha: 0.0,
                    duration: 600,
                    ease: 'power1',
                },

                // *********
                // {
                //     alpha: 0.0,
                //     duration: 400,
                //     ease: 'power1',
                // },
            ],

        })
    }

}


export default class Deck {
    constructor(duel, player) {
        this.cards = []
        this.player = player

        const x = -320
        const y = 120 * player.getDirection()

        const isPlyaer = player.getPlayerId() === 0

        this.sprite = new DeckSprite(duel, isPlyaer, x, y, 6)
    }

    setClickableState(isClickable) {
        this.sprite.setClickableState(isClickable)
    }

    setCardList(cardList) {
        this.cards = _.cloneDeep(cardList)
    }
    shuffle() {
        this.cards = _.shuffle(this.cards)
    }

    draw(duel, stackCount, turnPlayerId, onEnd) {
        if (this.isEmpty()) {
            return null
        }

        const x = 400
        const y = -(HeightBase) + (HeightBase * 2 * (turnPlayerId))


        const cardId = this.cards.shift()
        const cardInfo = CardList[cardId - 1]

        const card = new Card(duel, cardInfo, this.player, stackCount * 8, y + stackCount * 8)

        this.sprite.setCount(this.cards.length)
        this.sprite.setDrawCardPosition(card, () => {
            if (onEnd) {
                onEnd(card)
            }
        })


        return card
    }

    isEmpty() {
        if (!this.cards.length) {
            return true
        }
        return false
    }

}
