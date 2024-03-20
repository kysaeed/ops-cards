

const DrawPhase = {
    enter(duel, onEnd) {
        this.isDrawProcessing = false

        this.duel = duel
        this.onEnd = onEnd

        const player = duel.getTurnPlayer()
        if (player.getPlayerId() === 0) {
            player.getDeck().setClickableState(true)
        } else {
            this.doDraw(duel)
        }
    },

    onEvent(event, sender, params) {

        // console.log('******* ' + event + ' *****', sender, params)
        sender.setClickableState(false)
        this.doDraw(this.duel)
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