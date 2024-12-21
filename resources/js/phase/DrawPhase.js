

const DrawPhase = {

    enter(duel, fetchData, onEnd) {
        this.isDrawProcessing = false

        this.duel = duel
        this.onEnd = onEnd

        const player = duel.getTurnPlayer()
console.log('******* ' + player.getPlayerId())
        /*
        if (player.getDeck().isEmpty()) {
            if (!player.getHandCard()) {
                /// todo!!!
                onEnd('EndPhase', fetchData) // todo 勝敗表示へ
            }
        }
        */

        /**
         * プレイヤー側のUIでのドローと敵側の処理を分岐
         */
        if (player.getPlayerId() === 0) {
            player.setCardClickableState(true)
        } else {

            this.fetchDraw(duel, null, (data) => {

                this.doDrawHandCard(duel, data, () => {

                    if (data.isHandCard) {

                        // 手札を使用
                        if (player.getHandCard()) {
                            this.attackByHandCard(this.duel, data, () => {
                                this.onEnd('AttackPhase', data)
                            })
                        }

                    } else {
                        // 山札を使用
                        this.doDraw(this.duel, data)

                    }

                })
            })
        }
    },

    onEvent(event, sender, params) {

        // console.log('******* ' + event + ' *****', sender, params)
        const player = this.duel.getTurnPlayer()

        if (event === 'click') {
            player.setCardClickableState(false)
            this.fetchDraw(this.duel, false, (data) => {
console.log('onEvent hand-card click!!!', data)
                this.doDraw(this.duel, data)
            })
        }

        if (event === 'click-hand') {
            player.setCardClickableState(false)
            this.fetchDraw(this.duel, true, (data) => {

                console.log('On hand card clicked ....')
                this.attackByHandCard(this.duel, data, () => {
                    this.onEnd('AttackPhase', data)
                })
            })
        }

    },

    attack(card, data, onEnd) {
        //
        const duel = this.duel
        card.moveToAttackPosition(() => {
            const add = data.addAttackPower
            card.onEnterToAttackPosition(data, () => {
                duel.getTurnPlayer().getCardStack().addCard(card)
                if (onEnd) {
                    onEnd()
                }
            })
        })
    },

    attackByHandCard(duel, data, onEnd) {
console.log('attackByHandCard')
        // const turnPlayer = duel.getTurnPlayerId()
        const player = duel.getTurnPlayer()
        const currentCard = player.takeHandCard()
        if (!currentCard) {
            console.log('empty....')
            if (onEnd) {
                onEnd()
            }
            return
        }

        currentCard.setShadowParams(1.0, 1.0, 2)
        currentCard.bringToTop()

        // 攻撃実行
        const nextCard = null
        //let
        this.attack(currentCard, data, () => {
            if (data.nextHnadCardNumber) {
                this.doDrawHandCard(this.duel, { cardNumber: data.nextHnadCardNumber, cardCount: data.cardCount }, () => {
                    if (onEnd) {
                        onEnd()
                    }
                })
            } else {
                if (onEnd) {
                    onEnd()
                }
            }
        })
    },

    doDrawHandCard(duel, data, onEnd) {
        console.log('doDrawHandCard')

        const turnPlayer = duel.getTurnPlayerId()
        const player = duel.getTurnPlayer()

        // 手札を持っている場合は引かない
        if (player.getHandCard()) {
            if (onEnd) {
                onEnd()
            }
            return
        }

        if (!data?.cardNumber) {

            if (onEnd) {
                onEnd()
            }

            return
        }

console.log(data)
        player.getDeck().enterDraw(duel, data.cardNumber, data.cardCount, 0, (currentDrawCard) => {
            if (currentDrawCard) {
                // ドローしたカードを手札にする
                player.setHandCard(currentDrawCard)
            }
        }, (currentDrawCard) => {
            if (currentDrawCard) {
                currentDrawCard.moveToHandPosition(() => {
                    currentDrawCard.setShadowParams(1.4, 0.2, 6) // todo moveToHandPosition内へ
                })
            }
            if (onEnd) {
                onEnd()
            }
        })
    },

    doDraw(duel, data) {
console.log('doDraw')
        if (this.isDrawProcessing) {
            return
        }

        this.isDrawProcessing = true

        const player = duel.getTurnPlayer()

        player.getDeck().enterDraw(duel, data.cardNumber, data.cardCount, 0, null, (currentDrawCard) => {
            if (currentDrawCard) {
                currentDrawCard.showDetial(() => {
                    // 攻撃実行
                    this.attack(currentDrawCard, data, () => {
                        this.isDrawProcessing = false
                        if (this.onEnd) {
                            this.onEnd('AttackPhase', data)
                        }
                    })
                })
            } else {
                if (this.onEnd) {
                    this.onEnd('AttackPhase', data)
                }
            }
        })
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
            // console.log(res.data)

            // let cardId = res.data.cardNumber
            // this.deckIndex++
            //const cardInfo = CardList[cardId - 1]

console.log('judge *** ', res.data?.judge)

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