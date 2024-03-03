// constants
const Bevel = 8
const HeightBase = 100
const WidthBase = -30


const AttackPhase = {
    enter(duel, onEnd) {
        this.onEnd = onEnd

        const turnPlayer = duel.getTrunPlayerId()
        const enemyCard = duel.getPlayer(1 - turnPlayer).cardStack.getTopCard()

        const player = duel.getPlayer(turnPlayer)
        const ohterPlayer = duel.getPlayer(1 - turnPlayer)
        //player.getCardStack().addCard(newAttackCard)

        const total = duel.getPlayer(turnPlayer).cardStack.getTotalPower()

        player.cardStack.cards.forEach((c, i) => {
            const stackCount = i
            c.attack(stackCount, () => {
                //
            })
        })
        duel.getScene().damageMark.setDamage(null) // dummy param

        if (total >= enemyCard.cardInfo.power) {
            ohterPlayer.getCardStack().criticalDamaged(() => {
                // console.log('かった！' + turnPlayer, duel.playerList[turnPlayer].cardStack)

                duel.getPlayer(turnPlayer).cardStack.cards.forEach((c) => {
                    c.angle = Bevel + (180 * turnPlayer)

                    // console.log(c.sprite)
                    // duel.getScene().tweens.chain({
                    //   targets:  c.sprite,
                    //   tweens: {
                    // //     x: 400,
                    // //     y: 0,
                    // //     duration: 100,
                    // //     //scale: 1.0,
                    // //     // angle: 0,
                    //   }
                    // })
                })

                duel.getFlag().moveTo(520, 170 + (200 * (1 - turnPlayer)))

                // 攻撃側から見た敵プレイヤー
                const enemyPlayer = duel.getPlayer(1 - turnPlayer)

                // ディフェンス側のカードを横へ
                const deffenceCards = enemyPlayer.cardStack.takeAll()
                enemyPlayer.getBench().addCards(1 - turnPlayer, deffenceCards, () => {

                    if (enemyPlayer.getDeck().isEmpty()) {

                        console.log('END!')
                        const textModal = duel.getScene().add.sprite(360, 200, 'modal')
                        textModal.displayWidth = 400

                        let text = ''
                        if (turnPlayer == 0) {
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
