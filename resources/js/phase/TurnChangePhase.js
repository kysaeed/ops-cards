

const TurnChangePhase = {
    enter(duel, onEnd) {
        duel.turnPlayerId = 1 - duel.getTrunPlayerId()
        onEnd('DrawPhase');
    },

}

export default TurnChangePhase
