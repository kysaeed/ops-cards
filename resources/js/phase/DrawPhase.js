

const DrawPhase = {
    enter(duel, onEnd) {
        this.isDrawProcessing = false

        this.duel = duel
        this.onEnd = onEnd


        const player = duel.getTurnPlayer()

        if (player.getDeck().isEmpty()) {
            if (!player.getHandCard()) {
                /// todo!!!
                onEnd('EndPhase') // todo 勝敗表示へ
            }
        }


        this.doDrawHandCard(duel, () => {
            if (player.getPlayerId() === 0) {
                player.setCardClickableState(true)
            } else {
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
            }
        })
    },

    onEvent(event, sender, params) {

        // console.log('******* ' + event + ' *****', sender, params)
        const player = this.duel.getTurnPlayer()

        if (event === 'click') {
            player.setCardClickableState(false)

            this.doDraw(this.duel)
        }

        if (event === 'click-hand') {
            player.setCardClickableState(false)

            console.log('On hand card clicked ....')

            this.attackByHandCard(this.duel, () => {
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

    attackByHandCard(duel, onEnd) {
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

    doDrawHandCard(duel, onEnd) {
        const turnPlayer = duel.getTurnPlayerId()
        const player = duel.getTurnPlayer()

        // 手札を持っている場合は引かない
        if (player.getHandCard()) {
            if (onEnd) {
                onEnd()
            }
            return
        }

        player.deck.draw(duel, 0, turnPlayer, (currentDrawCard) => {
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

    },

    doDraw(duel) {
        if (this.isDrawProcessing) {
            return
        }

        this.isDrawProcessing = true

        const turnPlayer = duel.getTurnPlayerId()
        const player = duel.getTurnPlayer()
        player.getDeck().draw(duel, 0, turnPlayer, (currentDrawCard) => {
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
    },

}

export default DrawPhase;