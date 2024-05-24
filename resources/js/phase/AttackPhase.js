
const AttackPhase = {
    enter(duel, onEnd) {
        this.onEnd = onEnd

        const turnPlayerId = duel.getTurnPlayerId()
        const enemyCard = duel.getOtherPlayer().cardStack.getTopCard()

        const ohterPlayer = duel.getOtherPlayer()
        //player.getCardStack().addCard(newAttackCard)

        const total = duel.getTurnPlayer().cardStack.getTotalPower()

        const topCard = duel.getTurnPlayer().cardStack.getTopCard()
        topCard.showStatusTip(() => { // todo: 引数に表示内容を設定?

            duel.getTurnPlayer().cardStack.cards.forEach((c, stackCount) => {
                c.attack(stackCount, () => {
                    if (stackCount < 1) {
                        duel.getScene().damageMark.setDamage(null) // dummy param

                        if (total >= enemyCard.cardInfo.power) {
                            ohterPlayer.getCardStack().criticalDamaged(() => {

                                duel.getFlag().moveTo(520, 170 + (200 * (1 - turnPlayerId)))

                                // 攻撃側から見た敵プレイヤー
                                const enemyPlayer = duel.getOtherPlayer()

                                // ディフェンス側のカードを横へ
                                const deffenceCards = enemyPlayer.cardStack.takeAll()
                                enemyPlayer.getBench().addCards(1 - turnPlayerId, deffenceCards, () => {

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
