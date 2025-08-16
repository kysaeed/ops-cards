
import _ from 'lodash'

import Const from '../Const.js'
import Card from './Card.js'
//import CardList from './CardList'


const Bevel = Const.Bevel
const HeightBase = 100
const WidthBase = 0

const DefaultScale = 0.4
const DefaultAngle = 60

const MaxDeckCard = 20


class DeckSprite {
    constructor(duel, x, y, count) {
        this.duel = duel
        this.scene = duel.getScene()
        this.count = 0
        this.isClickable = false


        const spriteList = []

        this.deckShadow = this.scene.add.sprite(0, 1, 'deck_shadow')
        this.deckShadow.scale = DefaultScale * 1.02
        this.deckShadow.angle = DefaultAngle
        this.deckShadow.visible = false
        spriteList.push(this.deckShadow)

        this.under = []
        for (let i = 0; i < MaxDeckCard; i++) {
            const d = this.scene.add.sprite(0, - (i * 4), 'card_back')
            d.scale = DefaultScale
            d.angle = DefaultAngle
            d.visible = false
            this.under.push(d)
            spriteList.push(d)
        }

        this.deckSprite = this.scene.add.sprite(0, -((this.count) * 4), 'card_back')
        this.deckSprite.setInteractive()
        this.deckSprite.scale = DefaultScale
        this.deckSprite.angle = DefaultAngle
        this.deckSprite.visible = false
        this.deckSprite.on('pointerdown', (pointer) => {
            if (!this.isClickable) {
                return
            }
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
        this.drawCard = this.scene.add.sprite(0, -((this.count) * 4), 'card_back')
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
            this.isClickable = true
            this.deckClickable.y = -(this.count * 4)
            this.deckClickable.visible = true
            this.clickableTewwns.play()
        } else {
            this.isClickable = false
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
        this.deckSprite.y = -((this.count - 1) * 4)

        this.under.forEach((u, i) => {
            u.y = -(i * 4)
            if (i < (this.count - 1)) {
                u.visible = true
            } else {
                u.visible = false
            }
        })
    }

    setDrawCardPosition(card, onEnd) {
        this.deckSprite.visible = false

        this.drawCard.visible = true
        this.drawCard.scale = DefaultScale
        this.drawCard.x = 0
        this.drawCard.y = -((this.count) * 4)
        this.drawCard.scale = 0.5
        this.drawCard.alpha = 1

        card.sprite.alpha = 0
        card.sprite.scale = 0.5
        card.sprite.x = this.sprite.x + this.drawCard.x - 10
        card.sprite.y = this.sprite.y + this.drawCard.y - 50
        card.sprite.angle = this.drawCard.angle

        const x = card.sprite.x
        const y = card.sprite.y

        card.sprite.alpha = 0

        this.duel.getScene().tweens.chain({
            targets: card.sprite,
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
                card.sprite.x = this.sprite.x + this.deckSprite.x
                card.sprite.y = this.sprite.y + this.deckSprite.y
                card.sprite.angle = this.deckSprite.angle
                card.sprite.scale = this.deckSprite.scale

                this.drawCard.visible = false

                if (onEnd) {
                    onEnd()
                }
            },
        })

        this.drawCard.alpha = 0
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
                    alpha: 0.0,
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
            onComplete: () => {
                this.drawCard.visible = false
            },

        })
    }

}


export default class Deck {
    constructor(duel, player) {
        this.player = player
        this.initialCardCount = 0
        this.deckIndex = 0

        const x = 380 * player.getDirection() //+ 30
        const y = (180 * player.getDirection()) //+ 30

        // const isPlyaer = (player.getPlayerId() === 0)

        this.sprite = new DeckSprite(duel, x, y, 20) // @todo 初期枚数

    }

    setClickableState(isClickable) {

        if (this.isEmpty()) {
            this.sprite.setClickableState(false)
            return
        }

        this.sprite.setClickableState(isClickable)
    }

    setInitilCardCount(cardCount) {
        this.initialCardCount = cardCount // this.cards.length
        this.sprite.setCount(cardCount)
    }

    createDrawCard(duel, idDrawCard) {

        //
        const cardInfo = duel.getCardInfo(idDrawCard)

        if (!cardInfo) {
            return null
        }

        const card = new Card(duel, cardInfo, this.player, 0, 0)

        return card

    }


    enterDraw(duel, idDrawCard, deckRemainCount, stackCount, onEnter, onEnd) {
        const turnPlayerId = this.player.getPlayerId()

        /*
        if (this.isEmpty()) {
            if (onEnter) {
                onEnter(null)
            }
            if (onEnd) {
                onEnd(null)
            }
            return
        }
        */

        const x = 400
        const y = -(HeightBase) + (HeightBase * 2 * (turnPlayerId))

        // console.log(idDrawCard)
        //let cardId = this.cards.shift()
        let cardId = idDrawCard

        this.deckIndex++

        const cardInfo = duel.getCardInfo(cardId)

        const card = new Card(duel, cardInfo, this.player, stackCount * 8, y + stackCount * 8)
        if (onEnter) {
            onEnter(card)
        }

        this.sprite.setDrawCardPosition(card, () => {
            //let deckRemainCount = this.initialCardCount - this.deckIndex
            if (deckRemainCount < 0) {
                deckRemainCount = 0
            }
            this.sprite.setCount(deckRemainCount)
            if (onEnd) {
                onEnd(card)
            }
        })

    }

    isEmpty() {
        if (this.initialCardCount <= this.deckIndex) {
            return true
        }
        return false
    }

}
