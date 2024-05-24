

const TurnChangePhase = {
    enter(duel, onEnd) {
        duel.getTurnPlayer().getCardStack().each((c, i) => {
            c.hideStatusTip()
        })

        duel.turnPlayerId = (1 - duel.getTurnPlayerId())

        // todo: 守備側カードをたたむ
        const defensePlayer = duel.getOtherPlayer()
        const defenseCardStack = defensePlayer.getCardStack()

        defenseCardStack.fold(() => {
            onEnd('DrawPhase');
        })
    },

}

export default TurnChangePhase
