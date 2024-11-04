import Const from "../Const"

const AttackPhase = {
    enter(duel, fetchData, onEnd) {
        this.onEnd = onEnd

        const turnPlayerId = duel.getTurnPlayerId()
        const enemyCard = duel.getOtherPlayer().cardStack.getTopCard()

        const ohterPlayer = duel.getOtherPlayer()
        //player.getCardStack().addCard(newAttackCard)

        const total = duel.getTurnPlayer().cardStack.getTotalPower()


        const defenseCard = ohterPlayer.getCardStack().getTopCard()
        defenseCard.onEnterToDefense(() => { // defense側のablity判定

            duel.getTurnPlayer().cardStack.cards.forEach((c, stackCount) => {

                c.attack(stackCount, () => {
                    if (stackCount < 1) {
                        duel.getScene().damageMark.setDamage(null) // dummy param

                        if (fetchData.isTurnChange) {
                            ohterPlayer.getCardStack().criticalDamaged(() => {

                                duel.getFlag().moveTo(520, 170 + (200 * (1 - turnPlayerId)))

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

                                enemyPlayer.getBench().addCards(deffenceCards, () => {
                                    if (enemyPlayer.getBench().getCount() > Const.Bench.Count) {
                                        console.log('***** to EndPhase !')

                                        onEnd('EndPhase')
                                        return
                                    }


                                    if (enemyPlayer.getDeck().isEmpty() && (!enemyPlayer.getHandCard())) {

                                        console.log('END!')

                                        const textModal = duel.getScene().add.sprite(360, 200, 'modal')
                                        textModal.displayWidth = 400

                                        let text = ''
                                        if (turnPlayerId == 0) {
                                            text = '勝ち'
                                        } else {
                                            text = '負け'
                                        }

                                        const endText = duel.getScene().add.text(360, 216, text, { fontSize: '32px', fill: '#000' });
                                        onEnd('EndPhase')
                                        return
                                    }

                                    onEnd('TurnChangePhase')
                                })

                            })
                        } else {
                            enemyCard.damaged(() => {
                                onEnd('DrawPhase')
                            })
                        }

                    }

                })
            })
        })




    },

    onEvent(event, sender, params) {
        // console.log('******* ' + event + ' *****', sender, params)
        sender.setClickableState(false)
        if (this.onEnd) {
            this.onEnd('DrawPhase')
        }
    }
}

export default AttackPhase;
