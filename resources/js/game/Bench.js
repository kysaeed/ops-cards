import _ from 'lodash'
import Const from "../Const"
import Card from './Card.js'

const BenchMax = 7

const HeroX = -55
const HeroY = 232


const BenchXBase = 94
const BenchYBase = 240
const BenchXStride = 42
const BenchYStride = 58

export default class Bench {
    constructor(duel, scene, playerId /*, x, y*/) {
        this.duel = duel
        this.playerId = playerId
        this.scene = scene
        this.cards = []
        // this.x = x
        // this.y = y
    }

    initialize(cardList) {
        if (!cardList) {
            return
        }

        const getBenchX = (benchIndex, playerId) => {
            if (playerId == 0) {
                return BenchXBase + (benchIndex * BenchXStride)
            }
            return -BenchXBase - (benchIndex * BenchXStride)
        }

        const getBenchY = (benchIndex, playerId) => {
            if (playerId == 0) {
                return BenchYBase - (benchIndex * BenchYStride)
            }
            return (-BenchYBase + (benchIndex * BenchYStride));
        }


        const player = this.duel.getPlayer(this.playerId)

        this.cards = []
        cardList.forEach((benchElement, i) => {
            benchElement.forEach((benchCardInfo) => {
                if (benchCardInfo) {
                    const element = []
                    const cardInfo = this.duel.getCardInfo(benchCardInfo.cardNumber)
                    if (cardInfo) {
                        const card = new Card(this.duel, cardInfo, player, getBenchX(i, this.playerId), getBenchY(i, this.playerId))
                        element.push(card)
                        //card.moveToBench(getBenchX(i, this.playerId), getBenchY(i, this.playerId))
                        card.setToBench(getBenchX(i, this.playerId), getBenchY(i, this.playerId))
                    }
                    this.cards.push(element)
                }
            })
        })
    }

    takeLatestCard() {
        if (!this.cards.length) {
            return
        }

        const elements = this.cards[0]
        if (!elements.length) {
            return
        }

        return elements.pop()

    }

    addCards(cardList, onEnd) {

        let addCardCount = 0
        cardList.forEach((c, i) => {
            this.addCardElement(this.playerId, c, () => {
                addCardCount++
                if (addCardCount >= cardList.length) {
                    if (onEnd) {
                        onEnd()
                    }
                }
            })
        })
    }

    breakCards(cardList, onEnd) {
        const getBenchX = (benchIndex, playerId) => {
            if (playerId == 0) {
                return BenchXBase + (benchIndex * BenchXStride)
            }
            return -BenchXBase - (benchIndex * BenchXStride)
        }

        const getBenchY = (benchIndex, playerId) => {
            if (playerId == 0) {
                return BenchYBase - (benchIndex * BenchYStride)
            }
            return (-BenchYBase + (benchIndex * BenchYStride));
        }

        const playerId = this.playerId
        const player = this.duel.getPlayer(playerId)
        let addCardCount = 0
        cardList.forEach((c) => {
            c.moveToBench(getBenchX(3.5, playerId), getBenchY(3.5, playerId), () => {
                addCardCount++
                if (addCardCount >= cardList.length) {
                    let breakCardCount = this.getCardCount() + cardList.length
console.log(`all card count ${breakCardCount}`)
                    const cards = _.clone(this.cards)
                    cards.push(cardList)

                    cards.forEach((element, i) => {
                        element.forEach((c) => {
                            const x = (HeroX) + (i * 10)
                            const y = (HeroY * player.getDirection()) + (i * 30)

                            c.moveToBenchBreak(x, y, () => {
                                breakCardCount--
                                if (!breakCardCount) {
                                    if (onEnd) {
                                        onEnd()
                                    }
                                }
                            })
                        })

                    })
                }
            });
        })

    }

    addCardElement(playerId, card, onEnd) {

        const getBenchX = (benchIndex, playerId) => {
            if (playerId == 0) {
                return BenchXBase + (benchIndex * BenchXStride)
            }
            return -BenchXBase - (benchIndex * BenchXStride)
        }

        const getBenchY = (benchIndex, playerId) => {
            if (playerId == 0) {
                return BenchYBase - (benchIndex * BenchYStride)
            }
            return (-BenchYBase + (benchIndex * BenchYStride));
        }

        for (let i = 0; i < this.cards.length; i++) {
            const list = this.cards[i]
            if (list.length < 1) {
                list.push(card)
                card.moveToBench(getBenchX(i, playerId), getBenchY(i, playerId), onEnd);

                return
            } else {
                if (list[0].cardInfo.id == card.cardInfo.id) {
                    const stackCount = list.length
                    list.push(card)
                    card.moveToBench(
                        getBenchX(i, playerId) - (stackCount * 4),
                        getBenchY(i, playerId) - (stackCount * 4),
                        onEnd
                    )
                    return
                }
            }
        }

        const benchIndex = this.cards.length
        this.cards.push([
            card
        ])
        card.moveToBench(getBenchX(benchIndex, playerId), getBenchY(benchIndex, playerId), onEnd);

    }

    getCount() {
        let count = 0
        this.cards.forEach((elements) => {
            if (elements.length) {
                count++
            }
        })
        return count
    }

    getCardCount() {
        let count = 0
        this.cards.forEach((elements) => {
            if (elements.length) {
                count += elements.length
            }
        })
        return count
    }
}
