

const TurnChangePhase = {
    enter(duel, fetchData, onEnd) {
        duel.getTurnPlayer().getCardStack().each((c, i) => {
            c.hideStatusTip()
        })

        duel.turnPlayerId = (1 - duel.getTurnPlayerId())

        const defensePlayer = duel.getOtherPlayer()
        const defenseCardStack = defensePlayer.getCardStack()

        // 守備側カードをたたむ
        defenseCardStack.fold(() => {
            // const plyaer = duel.getOtherPlayer()
            // const card = plyaer.getCardStack().getTopCard()

            onEnd('DrawPhase', fetchData);
        })
    },

}

export default TurnChangePhase
