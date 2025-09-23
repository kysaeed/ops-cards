import Phaser from 'phaser'

const DrawPhase = {

    enter(duel, fetchData, onEnd) {
        this.isDrawProcessing = false

        this.duel = duel
        this.onEnd = onEnd

        const player = duel.getTurnPlayer()


        /**
         * プレイヤー側のUIでのドローと敵側の処理を分岐
         */
        this.drawNextHandCard(duel, fetchData, () => {

            if (player.getPlayerId() === 0) {
                player.setCardClickableState(true)
            } else {
                this.fetchTurnAction(duel, null, (data) => {
                    // player.getDeck().getSprite().setCount(data.cardCount + data.drawCount)
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
            }

        });
    },

    onEvent(event, sender, params) {

        // console.log('******* ' + event + ' *****', sender, params)
        const player = this.duel.getTurnPlayer()

        if (event === 'click') {
            player.setCardClickableState(false)
            this.fetchTurnAction(this.duel, false, (data) => {
console.log('onEvent hand-card click!!!', data)
                this.doDraw(this.duel, data)
            })
        }

        if (event === 'click-hand') {
            player.setCardClickableState(false)
            this.fetchTurnAction(this.duel, true, (data) => {

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
            card.onEnterToAttackPosition(data, () => {
                const ability = data.ability
                if (ability) {
                    const enter = ability.enter

                    if (enter) {
                        const discard = enter.discard

                        if (discard?.cardNumber) {
                            let player = duel.getTurnPlayer()
                            if (!discard.isPlayer) {
                                player = duel.getOtherPlayer()
                            }

                            const targetCard = player.getBench().takeCardByCardNumber(discard.cardNumber)
                            if (targetCard) {
                                // アビリティを使うカードを攻撃位置に登場させる
                                duel.getTurnPlayer().getCardStack().addCard(card)

                                // カットインの表示をする
                                card.showAbilityEffect(() => {
                                    const direction = player.getDirection()

                                    targetCard.moveToAbyss(player.getAbyss(), () => {
                                        if (onEnd) {
                                            onEnd()
                                        }
                                    })
                                })
                                return
                            }
                        }

                        const recycle = enter.recycle
                        if (recycle?.cardNumber) {
                            const recycle = ability.enter.recycle
                            let player = duel.getTurnPlayer()
                            if (!recycle.isPlayer) {
                                player = duel.getOtherPlayer()
                            }

                            const targetCard = player.getBench().takeCardByCardNumber(recycle.cardNumber)
                            if (targetCard) {
                                // アビリティを使うカードを攻撃位置に登場させる
                                duel.getTurnPlayer().getCardStack().addCard(card)

                                // カットインの表示をする
                                card.showAbilityEffect(() => {
// console.log(data.ability.enter.recycle)
                                    //const direction = duel.getTurnPlayer().getDirection()
                                    // targetCard.moveToAbyss((420 * direction), (-240 * direction) - 50, () => {

                                    const deck = player.getDeck()
                                    targetCard.moveToDeck(deck, () => {
                                        // @todo deckの表示枚数を１つ増やす
                                        deck.getSprite().setCount(recycle.deckCount)
                                        if (onEnd) {
                                            onEnd()
                                        }
                                    })
                                })
                                return
                            }
                        }

                    }

                }

                duel.getTurnPlayer().getCardStack().addCard(card)
                if (onEnd) {
                    onEnd()
                }
                return
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
        currentCard.leaveHand()
        currentCard.bringToTop()

        // 攻撃実行
        this.attack(currentCard, data, () => {
            if (onEnd) {
                onEnd()
            }
        })
    },


    drawNextHandCard(duel, data, onEnd) {

console.log('drawNextHandCard', data?.nextPlayerState)

        if (!data?.nextPlayerState) {
            if (onEnd) {
                onEnd()
            }
            return
        }

console.log('***** DRAW ********')

        const player = duel.getTurnPlayer()
        const nextPlayerState = data.nextPlayerState

        if (nextPlayerState.nextHandCardNumber) {
            player.getDeck().enterDraw(duel, nextPlayerState.nextHandCardNumber, nextPlayerState.deckCount, 0, (currentDrawCard) => {
                if (currentDrawCard) {
                    // ドローしたカードを手札にする
                    player.setHandCard(currentDrawCard)
                }
            }, (currentDrawCard) => {
                if (currentDrawCard) {
                    currentDrawCard.moveToHandPosition(() => {
                        //
                    })
                }
                if (onEnd) {
                    onEnd()
                }
            })
            return
        }

        if (onEnd) {
            onEnd()
        }
        return
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

    fetchTurnAction(duel, isHandCard, onEnd) {
        const player = duel.getTurnPlayer()
        let isPlayer = (duel.getTurnPlayer().getPlayerId() === 0) // @todo BEで判定する

        const turnPlayerId = player.getPlayerId()

        window.axios.get('sanctum/csrf-cookie').then(() => {
            window.axios.post('api/data/deck/draw', {
                idUser: turnPlayerId,
                isHandCard: isHandCard,
                isPlayer: isPlayer, // @todo テスト用なので後で削除
            }).then((res) => {

console.log('judge *** ', res.data?.judge)

                onEnd(res.data)

            })
        })

    },

}

export default DrawPhase;