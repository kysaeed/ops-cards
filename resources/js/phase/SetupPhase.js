
// constants
import Const from '../Const.js'
const Bevel = Const.Bevel
const HeightBase = 100
const WidthBase = -30


//
const SetupPhase = {
    enter(duel, fetchData, onEnd) {
        this.duel = duel

        window.axios.get('sanctum/csrf-cookie').then(() => {
            window.axios.post('api/data/deck').then((res) => {

                const data = res.data

                if (data.isPlayerTurn) {
                    this.duel.turnPlayerId = 0
                } else {
                    this.duel.turnPlayerId = 1
                }

                //console.log('Initial draw : res api/data/deck', res.data)

                //const playerId =  player.getPlayerId()

                if (!data.isResume) {
                    duel.playerList.forEach((player) => {
                        const playerId =  player.getPlayerId()
                        let initialCardCount = data.players[playerId].cardCount + 1
                        if (this.duel.getTurnPlayerId() === playerId) {
                            initialCardCount++
                        }

                        player.getDeck().setInitilCardCount(initialCardCount)
                    })
                } else {
                    duel.playerList.forEach((player) => {
                        const playerId =  player.getPlayerId()
                        let initialCardCount = data.players[playerId].cardCount
                        if (initialCardCount) {
                            initialCardCount++
                        }
                        player.getDeck().setInitilCardCount(initialCardCount)
                    })
                }

                if (!data.isResume) {
                    this.duel.show(() => {
                        this.start(data, () => {
                            onEnd('DrawPhase',null);
                        })
                    })
                } else {
                    this.resume(data, () => {
                        this.duel.show(() => {
                            onEnd('DrawPhase',null);
                        })
                    })
                }
            })
        })
    },


    start(data, onEnd) {
        const duel = this.duel

        const turnPlayerId = duel.getTurnPlayerId()
        const defensePlayer = duel.getPlayer(1 - turnPlayerId)

        //const initialBench = data.players[1].initialBench
        duel.getPlayer(0).getBench().initialize(data.players[0].initialBench)
        duel.getPlayer(1).getBench().initialize(data.players[1].initialBench)


        this.drawInitialHandCard(duel.getPlayer(1), data.players[1].handCardNumber, data.players[1].cardCount, () => {
            this.drawInitialHandCard(duel.getPlayer(0), data.players[0].handCardNumber, data.players[0].cardCount, () => {

                ////// デッキから初期防御側カードを出す
                const initialCardInfo = data.players[defensePlayer.getPlayerId()].initialStackCards[0]
                const initialCardCount = data.players[defensePlayer.getPlayerId()].cardCount
                defensePlayer.getDeck().enterDraw(duel, initialCardInfo.cardNumber, initialCardCount, 0, null, (diffenceCardInfo) => {

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

            })
        })

    },

    resume(data, onEnd) {
        const duel = this.duel

        const turnPlayerId = duel.getTurnPlayerId()
        const defensePlayer = duel.getPlayer(1 - turnPlayerId)


        //const initialBench = data.players[1].initialBench
        duel.getPlayer(0).getBench().initialize(data.players[0].initialBench)
        duel.getPlayer(1).getBench().initialize(data.players[1].initialBench)


        if (data.isResume) {

            duel.getPlayer(0).getCardStack().initialize(data.players[0].initialStackCards)
            duel.getPlayer(1).getCardStack().initialize(data.players[1].initialStackCards)

            for (let i = 0; i < 2; i++) {
                const player = duel.getPlayer(i)
                let currentDrawCard = player.getDeck().createDrawCard(duel, data.players[i].handCardNumber)
                if (currentDrawCard) {
                    currentDrawCard.setToHandPosition()
                    player.setHandCard(currentDrawCard)
                }
            }
            onEnd('DrawPhase',null)


        } else {
            this.drawInitialHandCard(duel.getPlayer(1), data.players[1].handCardNumber, data.players[1].cardCount, () => {
                this.drawInitialHandCard(duel.getPlayer(0), data.players[0].handCardNumber, data.players[0].cardCount, () => {

                    if (!data.isResume) {

                        ////// デッキから初期防御側カードを出す
                        const initialCardInfo = data.players[defensePlayer.getPlayerId()].initialStackCards[0]
                        const initialCardCount = data.players[defensePlayer.getPlayerId()].cardCount
                        defensePlayer.getDeck().enterDraw(duel, initialCardInfo.cardNumber, initialCardCount, 0, null, (diffenceCardInfo) => {

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
                        if (onEnd) {
                            onEnd('DrawPhase',null);
                        }
                    }
                })
            })

        }
    },


    drawInitialHandCard(player, handCardNumber, cardCount, onEnd) {
        if (!handCardNumber) {
            if (onEnd) {
                onEnd()
            }
            return
        }

        player.getDeck().enterDraw(this.duel, handCardNumber, cardCount, 0, null, (currentDrawCard) => {
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
