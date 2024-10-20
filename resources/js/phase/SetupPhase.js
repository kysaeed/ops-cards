
// constants
import Const from '../Const.js'
const Bevel = Const.Bevel
const HeightBase = 100
const WidthBase = -30


//
const SetupPhase = {
    enter(duel, onEnd) {
        this.duel = duel

        window.axios.get('api/data/deck').then((res) => {
            console.log('Initial draw : res api/data/deck', res.data)

            const data = res.data

            const turnPlayerId = duel.getTurnPlayerId()
            const player = duel.getPlayer(1 - turnPlayerId)

            duel.playerList.forEach((player) => {
                const playerId = player.getPlayerId()
                const deckData = data.players[playerId].deck

                player.getDeck().setInitilCardCount(data.players[playerId].cardCount)
            })


            this.drawInitialHandCard(duel.getPlayer(1), res.data.players[1].handCardNumber, () => {
                this.drawInitialHandCard(duel.getPlayer(0), res.data.players[0].handCardNumber, () => {

                    ////// デッキから初期防御側カードを出す
                    player.getDeck().draw(duel, 400, turnPlayerId, (diffenceCardInfo) => {

                        let enemyY = -HeightBase
                        if (turnPlayerId) {
                            enemyY = HeightBase
                        }
                        diffenceCardInfo.sprite.angle = Bevel + (180 * (1 - turnPlayerId)) // todo enterToにマージ


                        ///////
                        player.cardStack.addCard(diffenceCardInfo)
                        diffenceCardInfo.enterTo(-WidthBase, enemyY, 1 - turnPlayerId)

                        if (onEnd) {
                            onEnd('DrawPhase');
                        }
                    })
                })
            })

        })
    },


    drawInitialHandCard(player, handCardNumber, onEnd) {

        player.getDeck().draw2(this.duel, { cardNumber: handCardNumber, }, 0, (currentDrawCard) => {
            if (currentDrawCard) {
                currentDrawCard.showDetial(() => {
                    // ドローしたカードを手札にする
                    currentDrawCard.moveToHandPosition(() => {
                        currentDrawCard.setShadowParams(1.4, 0.2, 6) // todo moveToHandPosition内へ
                        player.setHandCard(currentDrawCard)

                        if (onEnd) {
                            onEnd()
                        }
                    })
                })
            } else {
                if (onEnd) {
                    onEnd()
                }
            }
        });

    },

}

export default SetupPhase;
