

const DrawPhase = {
    enter(duel, onEnd) {
        this.isDrawProcessing = false

        this.duel = duel
        this.onEnd = onEnd


        const player = duel.getTurnPlayer()
        if (player.getPlayerId() === 0) {
            this.doDrawHandCard(duel, () => {
                player.getDeck().setClickableState(true)
            })
        } else {
            this.doDraw(duel)
        }
    },

    onEvent(event, sender, params) {

        // console.log('******* ' + event + ' *****', sender, params)

        if (event === 'click') {
            sender.setClickableState(false)
            this.doDraw(this.duel)
        }

        if (event === 'click-hand') {
            sender.setClickableState(false)
            console.log('On hand card clicked ....')

            this.attackByHandCard(this.duel, () => {
                this.onEnd('AttackPhase')
            })
        }

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
        currentCard.moveToAttackPosition(() => {
            duel.getTurnPlayer().getCardStack().addCard(currentCard)
            if (onEnd) {
                onEnd()
            }
        })

    },

    doDrawHandCard(duel, onEnd) {

        const turnPlayer = duel.getTurnPlayerId()
        const player = duel.getTurnPlayer()

        if (player.getHandCard()) {



            if (onEnd) {
                onEnd()
            }
            return
        }

        player.deck.draw(duel, 0, turnPlayer, (currentDrawCard) => {
            if (currentDrawCard) {
                currentDrawCard.showDetial(() => {

                    currentDrawCard.moveToHandPosition(() => {
                        // duel.getTurnPlayer().getCardStack().addCard(currentDrawCard)
                        currentDrawCard.setClickableState(true)

                        duel.getTurnPlayer().setHandCard(currentDrawCard)
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
                    //const stackCount = duel.getPlayer(turnPlayer).getCardStack().getStackCount()
                    currentDrawCard.moveToAttackPosition(() => {
                        duel.getTurnPlayer().getCardStack().addCard(currentDrawCard)
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