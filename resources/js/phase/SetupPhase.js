
// constants
import Const from '../Const.js'
const Bevel = Const.Bevel
const HeightBase = 100
const WidthBase = -30


//
const SetupPhase = {
    enter(duel, onEnd) {
        window.axios.get('api/data/deck').then((res) => {
            console.log('res', res.data)
            const data = res.data

            const turnPlayerId = duel.getTurnPlayerId()
            const player = duel.getPlayer(1 - turnPlayerId)

            duel.playerList.forEach((player) => {
                const playerId = player.getPlayerId()
                const deckData = data.players[playerId].deck

                player.getDeck().setInitilCardCount(data.players[playerId].cardCount)
            })

            player.getDeck().draw(duel, 400, turnPlayerId, (diffenceCardInfo) => {

                let enemyY = -HeightBase
                if (turnPlayerId) {
                    enemyY = HeightBase
                }
                diffenceCardInfo.sprite.angle = Bevel + (180 * (1 - turnPlayerId)) // todo enterToにマージ

                ///////
                player.cardStack.addCard(diffenceCardInfo)
                diffenceCardInfo.enterTo(-WidthBase, enemyY, 1 - turnPlayerId)

                if (onEnd) {
                    onEnd('DrawPhase');
                }
            })
        })
    },

}

export default SetupPhase;
