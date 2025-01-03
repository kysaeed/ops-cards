import Const from "../Const"

const AttackPhase = {
    enter(duel, fetchData, onEnd) {
        this.onEnd = onEnd

        const turnPlayerId = duel.getTurnPlayerId()
        const enemyCard = duel.getOtherPlayer().cardStack.getTopCard()

        const ohterPlayer = duel.getOtherPlayer()
        //player.getCardStack().addCard(newAttackCard)
        //const total = duel.getTurnPlayer().cardStack.getTotalPower()


        const defenseCard = ohterPlayer.getCardStack().getTopCard()
        defenseCard.onEnterToDefense(() => { // defense側のablity判定

            duel.getTurnPlayer().cardStack.cards.forEach((c, stackCount) => {
                c.attack(stackCount, () => {
                    if (stackCount < 1) {
                        duel.getScene().damageMark.setDamage(null) // dummy param

                        if (fetchData.isTurnChange) {
                            ohterPlayer.getCardStack().criticalDamaged(() => {

                                duel.getFlag().moveTo(620, 170 + (200 * (1 - turnPlayerId)))

                                // 攻撃側から見た敵プレイヤー
                                const enemyPlayer = duel.getOtherPlayer()

                                // ディフェンス側のカードを横へ
                                enemyPlayer.getCardStack().each(() => {
                                    c.hideStatusTip()
                                })

                                const deffenceCards = enemyPlayer.getCardStack().takeAll()

                                deffenceCards.forEach((c) => {
                                    c.hideStatusTip()
                                })

                                if (fetchData.judge !== 2) {
                                    enemyPlayer.getBench().addCards(deffenceCards, () => {

                                        if (fetchData.judge) {
                                            onEnd('EndPhase', fetchData)
                                            return
                                        }

                                        onEnd('TurnChangePhase', fetchData)
                                    })
                                } else {
console.log('enemyPlayer.getBench().breakCards()')
                                    enemyPlayer.getBench().breakCards(deffenceCards, () => {
                                        onEnd('EndPhase', fetchData)
                                    })
                                }

                            })
                        } else {
                            enemyCard.damaged(() => {
                                if (fetchData.judge) {
                                    onEnd('EndPhase', fetchData)
                                    return
                                }

                                onEnd('DrawPhase', fetchData)
                            })
                        }

                    }

                })
            })
        })




    },

    onEvent(event, sender, params) {
        // console.log('******* ' + event + ' *****', sender, params)
        // sender.setClickableState(false)
        // if (this.onEnd) {
        //     this.onEnd('DrawPhase')
        // }
    }
}

export default AttackPhase;
