

const DrawPhase = {
    enter(duel, onEnd) {
        this.isDrawProcessing = false

        this.duel = duel
        this.onEnd = onEnd


        const player = duel.getTurnPlayer()
        if (player.getPlayerId() === 0) {
            this.doDrawHandCard(duel, () => {
                player.setCardClickableState(true)
            })
        } else {
            this.doDraw(duel)
        }
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
            card.onEnterToAttackPosition()
            duel.getTurnPlayer().getCardStack().addCard(card)

            if (onEnd) {
                onEnd();
            }
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
                        player.setHandCard(currentDrawCard)
                        console.log(player)
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
        player.deck.draw(duel, 0, turnPlayer, (currentDrawCard) => {
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