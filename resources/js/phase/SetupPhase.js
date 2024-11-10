
// constants
import Const from '../Const.js'
const Bevel = Const.Bevel
const HeightBase = 100
const WidthBase = -30


//
const SetupPhase = {
    enter(duel, fetchData, onEnd) {
        this.duel = duel

        window.axios.get('api/data/deck').then((res) => {
            //console.log('Initial draw : res api/data/deck', res.data)

            const data = res.data

            if (data.isPlayerTurn) {
                this.duel.turnPlayerId = 0
            } else {
                this.duel.turnPlayerId = 1
            }

            const turnPlayerId = duel.getTurnPlayerId()
            const defensePlayer = duel.getPlayer(1 - turnPlayerId)


            duel.playerList.forEach((player) => {
                const playerId = player.getPlayerId()
                // const deckData = data.players[playerId].deck

                player.getDeck().setInitilCardCount(data.players[playerId].cardCount)
            })

            //const initialBench = data.players[1].initialBench
            duel.getPlayer(0).getBench().initialize(data.players[0].initialBench)
            duel.getPlayer(1).getBench().initialize(data.players[1].initialBench)


            this.drawInitialHandCard(duel.getPlayer(1), data.players[1].handCardNumber, () => {
                this.drawInitialHandCard(duel.getPlayer(0), data.players[0].handCardNumber, () => {

                    if (!data.isResume) {

                        ////// デッキから初期防御側カードを出す
                        const initialCard = data.players[defensePlayer.getPlayerId()].initialStackCards[0]
                        defensePlayer.getDeck().enterDraw(duel, initialCard, 0, null, (diffenceCardInfo) => {

                            let enemyY = -HeightBase
                            if (turnPlayerId) {
                                enemyY = HeightBase
                            }
                            diffenceCardInfo.sprite.angle = Bevel + (180 * (1 - turnPlayerId)) // todo enterToにマージ

                            ///////
                            defensePlayer.cardStack.addCard(diffenceCardInfo)
                            diffenceCardInfo.enterTo(-WidthBase, enemyY, 1 - turnPlayerId)

                            if (onEnd) {
                                onEnd('DrawPhase',null);
                            }
                        })

                    } else {
                        console.log(
                            'stack ! ********',

                            data.players[0].initialStackCards,
                            data.players[1].initialStackCards,
                        )


                        duel.getPlayer(0).getCardStack().initialize(data.players[0].initialStackCards)
                        duel.getPlayer(1).getCardStack().initialize(data.players[1].initialStackCards)

                        if (onEnd) {
                            onEnd('DrawPhase',null);
                        }
                    }
                })
            })
        })
    },


    drawInitialHandCard(player, handCardNumber, onEnd) {
        if (!handCardNumber) {
            if (onEnd) {
                onEnd()
            }
            return
        }

        player.getDeck().enterDraw(this.duel, handCardNumber, 0, null, (currentDrawCard) => {
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
