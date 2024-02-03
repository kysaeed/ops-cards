
export default class Bench {
    constructor(duelInfo, scene, playerId, x, y) {
        this.duelInfo = duelInfo
        this.playerId = playerId
        this.scene = scene
        this.cards = []
        this.x = x
        this.y = y
    }

    addCards(playerId, cardList) {

        playerId = this.playerId


        const currentPlayer = this.duelInfo.player[playerId]
        cardList.forEach((c, i) => {
            const benchIndex = this.cards.length

            // this.cards.push([c])
            this.addCardElement(playerId, c)
        })

    }

    addCardElement(playerId, card) {

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
                card.moveToBench(-200 + ((1 - playerId) * 400), getBenchY(i, playerId));

                return
            } else {
                if (list[0].cardInfo.name == card.cardInfo.name) {
                    const stackCount = list.length
                    list.push(card)
                    card.moveToBench(
                        -200 + ((1 - playerId) * 400) - (stackCount * 4),
                        getBenchY(i, playerId) - (stackCount * 4)
                    );
                    return
                }
            }
        }

        const benchIndex = this.cards.length
        this.cards.push([
            card
        ])
        card.moveToBench(-200 + ((1 - playerId) * 400), getBenchY(benchIndex, playerId));

    }
}
