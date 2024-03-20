

const TurnChangePhase = {
    enter(duel, onEnd) {
        duel.turnPlayerId = (1 - duel.getTurnPlayerId())
        onEnd('DrawPhase');
    },

}

export default TurnChangePhase
