
const HeightBase = 100
const WidthBase = -30


export default class Bench {
    constructor(duelInfo, scene, playerId /*, x, y*/) {
        this.duelInfo = duelInfo
        this.playerId = playerId
        this.scene = scene
        this.cards = []
        // this.x = x
        // this.y = y
    }

    getCount() {
        return this.cards.length
    }

    addCards(playerId, cardList, onEnd) {

        playerId = this.playerId

        // const currentPlayer = this.duelInfo.playerList[playerId]
        cardList.forEach((c, i) => {
            // const benchIndex = this.cards.length

            this.addCardElement(playerId, c, onEnd)
            onEnd = null
        })

    }

    addCardElement(playerId, card, onEnd) {

        const getBenchX = (benchIndex, playerId) => {
            if (playerId == 0) {
                return 200 + (benchIndex * 20)
            }
            return -200 - (benchIndex * 20)
        }

        const getBenchY = (benchIndex, playerId) => {
            if (playerId == 0) {
                return 200 - (benchIndex * 70)
            }
            return (-200 + (benchIndex * 70));
        }

        for (let i = 0; i < this.cards.length; i++) {
            const list = this.cards[i]
            if (list.length < 1) {
                list.push(card)
                card.moveToBench(getBenchX(i, playerId), getBenchY(i, playerId), onEnd);

                return
            } else {
                if (list[0].cardInfo.name == card.cardInfo.name) {
                    const stackCount = list.length
                    list.push(card)
                    card.moveToBench(
                        getBenchX(i, playerId) - (stackCount * 4),
                        getBenchY(i, playerId) - (stackCount * 4),
                        onEnd
                    );
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
}
