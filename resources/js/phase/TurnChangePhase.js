

const TurnChangePhase = {
    enter(duel, onEnd) {
        duel.getTurnPlayer().getCardStack().each((c, i) => {
            c.hideStatusTip()
        })

        duel.turnPlayerId = (1 - duel.getTurnPlayerId())

        const defensePlayer = duel.getOtherPlayer()
        const defenseCardStack = defensePlayer.getCardStack()

        // 守備側カードをたたむ
        defenseCardStack.fold(() => {

            onEnd('DrawPhase');
        })
    },

}

export default TurnChangePhase
