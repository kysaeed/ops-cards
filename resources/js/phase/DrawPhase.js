

const DrawPhase = {

    enter(duel, onEnd) {
        this.isDrawProcessing = false

        this.duel = duel
        this.onEnd = onEnd

this.data = null


        const player = duel.getTurnPlayer()

        if (player.getDeck().isEmpty()) {
            if (!player.getHandCard()) {
                /// todo!!!
                onEnd('EndPhase') // todo 勝敗表示へ
            }
        }

        /**
         * プレイヤー側のUIでのドローと敵側の処理を分岐
         */
        if (player.getPlayerId() === 0) {

            this.fetchDraw(duel, false, (data) => {

                this.doDrawHandCard(duel, data, () => {

                    this.data = data

                    player.setCardClickableState(true)

                })
            })

        } else {

            this.fetchDraw(duel, null, (data) => {

                this.doDrawHandCard(duel, data, () => {

                    if (data.isHandCard) {

                        // 手札を使用
                        if (player.getHandCard()) {
                            this.attackByHandCard(this.duel, data, () => {
                                this.onEnd('AttackPhase')
                            })
                        }

                    } else {
                        // 山札を使用
                        this.doDraw(this.duel, data)

                    }

                    /*
                    if ((((Math.random() * 10) < 5) && player.getHandCard()) || (player.getDeck().isEmpty())) {
                        // 手札を使用
                        if (player.getHandCard()) {
                            this.attackByHandCard(this.duel, () => {
                                this.onEnd('AttackPhase')
                            })
                        }
                    } else {
                        // 山札を使用
                        this.doDraw(this.duel)
                    }
                    */
                })
            })
        }
    },

    onEvent(event, sender, params) {

        // console.log('******* ' + event + ' *****', sender, params)
        const player = this.duel.getTurnPlayer()

        if (event === 'click') {
            player.setCardClickableState(false)

            this.doDraw(this.duel, this.data)
        }

        if (event === 'click-hand') {
            player.setCardClickableState(false)

            console.log('On hand card clicked ....')

            this.attackByHandCard(this.duel, this.data, () => {
                this.onEnd('AttackPhase')
            })
        }

    },

    attack(card, onEnd) {
        //
        const duel = this.duel
        card.moveToAttackPosition(() => {
            card.onEnterToAttackPosition(() => {
                duel.getTurnPlayer().getCardStack().addCard(card)
                if (onEnd) {
                    onEnd()
                }
            })
        })
    },

    attackByHandCard(duel, data, onEnd) {
        // const turnPlayer = duel.getTurnPlayerId()
        const player = duel.getTurnPlayer()
        const currentCard = player.takeHandCard()
        if (!currentCard) {
            console.log('empty....')
            if (onEnd) {
                onEnd()
            }
        }

        currentCard.setShadowParams(1.0, 1.0, 2)
        currentCard.bringToTop()

        // 攻撃実行
        this.attack(currentCard, () => {
            if (onEnd) {
                onEnd()
            }
        })
    },

    doDrawHandCard(duel, data, onEnd) {
        const turnPlayer = duel.getTurnPlayerId()
        const player = duel.getTurnPlayer()

        // 手札を持っている場合は引かない
        if (player.getHandCard()) {
            if (onEnd) {
                onEnd()
            }
            return
        }

        // this.fetchDraw(duel, false, (data) => {
            player.getDeck().draw2(duel, data, 0, (currentDrawCard) => {
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
                }
            })
        // })

    },

    doDraw(duel, data) {
        if (this.isDrawProcessing) {
            return
        }

        this.isDrawProcessing = true

        const player = duel.getTurnPlayer()

        //this.fetchDraw(duel, false, (data) => {
            player.getDeck().draw2(duel, data, 0, (currentDrawCard) => {
                if (currentDrawCard) {
                    currentDrawCard.showDetial(() => {
                        // 攻撃実行
                        this.attack(currentDrawCard, () => {
                            this.isDrawProcessing = false
                            if (this.onEnd) {
                                this.onEnd('AttackPhase')
                            }
                        })
                    })
                }
            })
        //})
    },

    fetchDraw(duel, isHandCard, onEnd) {
        const player = duel.getTurnPlayer()
        let isPlayer = (duel.getTurnPlayer().getPlayerId() === 0) // @todo BEで判定する

        const turnPlayerId = player.getPlayerId()

        window.axios.post('api/data/deck/draw', {
            idUser: turnPlayerId,
            isHandCard: isHandCard,
            isPlayer: isPlayer, // @todo テスト用なので後で削除
        }).then((res) => {
            console.log(res.data)

            // let cardId = res.data.cardNumber
            // this.deckIndex++
            //const cardInfo = CardList[cardId - 1]

            onEnd(res.data)

            //const card = new Card(duel, cardInfo, player, stackCount * 8, y + stackCount * 8)
            // this.sprite.setDrawCardPosition(card, () => {
            //     let deckRemainCount = this.initialCardCount - this.deckIndex
            //     if (deckRemainCount < 0) {
            //         deckRemainCount = 0
            //     }
            //     this.sprite.setCount(deckRemainCount)
            //     if (onEnd) {
            //         onEnd(card)
            //     }
            // })


        })
    },

}

export default DrawPhase;