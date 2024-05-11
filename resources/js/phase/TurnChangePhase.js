

const TurnChangePhase = {
    enter(duel, onEnd) {
        duel.getTurnPlayer().getCardStack().each((c, i) => {
            c.hideStatusTip()
        })

        duel.turnPlayerId = (1 - duel.getTurnPlayerId())

        // todo: 守備側カードをたたむ
        onEnd('DrawPhase');
    },

}

export default TurnChangePhase
