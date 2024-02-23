
/**
 * Phaser3
 *  https://newdocs.phaser.io/docs/3.70.0/gameobjects
 */
import Phaser from 'phaser'
import _, { create } from 'lodash'
import Axios from 'axios'

import Duel from './Duel.js'
import DamageMark from './DamageMark.js'



const Bevel = 8
const HeightBase = 100
const WidthBase = -30

let y = HeightBase
let enemyY = -HeightBase
let direction = 1


const axios = Axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
      },
      //timeout: 2000,
})
console.log('axios', axios)

const setTurnPlayer = (duel, playerId) => {
    duel.turnPlayerId = playerId
    if (!playerId) {
        y = HeightBase
        enemyY = -HeightBase
        direction = 1
    } else {
        y = -HeightBase
        enemyY = HeightBase
        direction = -1
    }
}


const SetupPhase = {
    enter(scene, duel, onEnd) {

        const turnPlayer = duel.turnPlayerId

        axios.get('api/data/deck').then((res) => {
            console.log('res', res.data)
            const data = res.data

            // const player = duel.playerList[1 - turnPlayer]
            const player = duel.getPlayer(1 - turnPlayer)

            duel.playerList.forEach((player) => {
                player.getDeck().setCardList(data.players[player.getPlayerId()].deck)
                player.getDeck().shuffle()
            })

            const diffenceCardInfo = player.getDeck().draw(duel, 400, turnPlayer, () => {


            diffenceCardInfo.card.angle = Bevel + (180 * (1 - turnPlayer)) // todo enterToにマージ

            ///////
            player.cardStack.addCard(diffenceCardInfo)

            diffenceCardInfo.enterTo(-WidthBase, enemyY, 1 - turnPlayer)

            if (onEnd) {
                onEnd(AttackPhase);
            }


        })


        })


    },

}

const AttackPhase = {
    enter(scene, duel, onEnd) {
        this.onEnd = onEnd

        const turnPlayer = duel.turnPlayerId

        const enemyCard = duel.getPlayer(1 - turnPlayer).cardStack.getTopCard()

        const newAttackCard = duel.getPlayer(turnPlayer).deck.draw(duel, 0, turnPlayer, (newAttackCard) => {
            if (newAttackCard) {

                const stackCount = duel.getPlayer(turnPlayer).cardStack.cards.length
                const x = (WidthBase * direction) - (stackCount * 8)
                const y = (-HeightBase) + (HeightBase * 2 * (1 - turnPlayer))

                newAttackCard.showDetial(() => {
                    const stackCount = duel.getPlayer(turnPlayer).getCardStack().getStackCount()
                    const x = (WidthBase * direction) - (stackCount * 8)
                    const y = (-HeightBase) + (HeightBase * 2 * (1 - turnPlayer))

                    scene.tweens.chain({
                        targets: newAttackCard.card,
                        tweens: [
                            {
                                delay: 1000,
                                scale: 0.6,
                                x: x,
                                y: y - (stackCount * 8),
                                ease: 'power1',
                                duration: 200,
                                angle: Bevel + (180 * turnPlayer),
                            },
                            {
                                x: x,
                                y: y - (stackCount * 8),
                                scale: 0.6,
                                duration: 100,
                            },
                        ],
                        onComplete() {
                            const player = duel.getPlayer(turnPlayer)
                            const ohterPlayer = duel.getPlayer(1 - turnPlayer)
                            player.cardStack.addCard(newAttackCard)

                            const total = duel.getPlayer(turnPlayer).cardStack.getTotalPower()

                            player.cardStack.cards.forEach((c, i) => {
                                const stackCount = i
                                c.attack(stackCount, () => {
                                    //
                                })
                            })
                            scene.damageMark.setDamage(1) // dummy param

                            if (total >= enemyCard.cardInfo.power) {
                                ohterPlayer.getCardStack().criticalDamaged(() => {
                                    // console.log('かった！' + turnPlayer, duel.playerList[turnPlayer].cardStack)

                                    duel.getPlayer(turnPlayer).cardStack.cards.forEach((c) => {
                                        c.angle = Bevel + (180 * turnPlayer)

                                        // console.log(c.card)
                                        // scene.tweens.chain({
                                        //   targets:  c.card,
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
                                    enemyPlayer.bench.addCards(1 - turnPlayer, deffenceCards) //////

                                    if (enemyPlayer.deck.isEmpty()) {

                                        console.log('END!')
                                        const textModal = scene.add.sprite(360, 200, 'modal')
                                        textModal.displayWidth = 400

                                        let text = ''
                                        if (turnPlayer == 0) {
                                            text = '勝ち'
                                        } else {
                                            text = '負け'
                                        }

                                        const endText = scene.add.text(360, 216, text, { fontSize: '32px', fill: '#000' });
                                    }

                                    setTurnPlayer(duel, 1 - turnPlayer)
                                    if (player.getPlayerId() === 0) {
                                        onEnd(AttackPhase)
                                    } else {
                                        enemyPlayer.getDeck().setClickableState(true)
                                    }
                                })
                            } else {
                                enemyCard.damaged(() => {
                                    if (player.getPlayerId() === 1) {
                                        onEnd(AttackPhase);
                                    } else {
                                        player.getDeck().setClickableState(true)
                                    }
                                })
                            }
                        },
                    })
                })
            }
        })

    },

    onEvent(event, sender, params) {
        //
        // console.log('******* ' + event + ' *****', sender, params)

        sender.setClickableState(false)

        if (this.onEnd) {
            this.onEnd(AttackPhase)
        }

    }
}

const DamagePhase = {
    enter(scene, duel, onEnd) {

        onEnd();
    },

}


const scene = {
    preload() {

        /**
         * todo :
         *　  表示するカードだけプリロードする
         */

        this.load.image('flag', 'assets/flag.png');
        this.load.image('card', 'assets/card.png'); // (160 * 220) * 0.5
        this.load.image('card_back', 'assets/card_back.png');
        this.load.image('card_shadow', 'assets/card_shadow.png');
        this.load.image('deck_shadow', 'assets/deck_shadow.png');
        this.load.image('deck_clickable', 'assets/deck_clickable.png');

        this.load.image('chara', 'assets/chara.png');
        this.load.image('ch_kage', 'assets/ch_kage.png');
        this.load.image('ch_magi', 'assets/ch_magi.png');
        this.load.image('ch_whell', 'assets/ch_whell.png');
        this.load.image('ch_eye', 'assets/ch_eye.png');
        this.load.image('ch_snake', 'assets/ch_snake.png');
        this.load.image('ch_moon', 'assets/ch_moon.png');
        this.load.image('ch_scarecrow', 'assets/ch_scarecrow.png');
        this.load.image('cat', 'assets/cat.png');
        this.load.image('sky', 'assets/board.png');
        this.load.image('modal', 'assets/modal.png');
        this.load.image('damage', 'assets/damage.png');
        // this.load.spritesheet('dude',
        //   'assets/dude.png',
        //   { frameWidth: 32, frameHeight: 48 }
        // );

    },
    create() {

        this.add.image(400, 300, 'sky');

        this.duel = new Duel(this)
        this.cardBoard = this.duel.getCardBoard()

        let currentPhase = SetupPhase

        this.duel.setCurrentPhase(currentPhase)

        const scene = this;
        this.objectManager = this.duel.getObjectManager()

        const self = this;


        this.damageMark = new DamageMark(scene, 400, 280)

        const toNextPhase = (next) => {
            currentPhase = next
            this.duel.setCurrentPhase(currentPhase)
            currentPhase.enter(scene, this.duel, (next) => {
                toNextPhase(next)
            })
        }

        currentPhase.enter(scene, this.duel, toNextPhase)

    },
    update() {
        this.duel.onUpdate()
    },
};

const config = {
    parent: 'app',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    type: Phaser.AUTO, ////Phaser.WEBGL, ///
    width: 800,
    height: 600,
    scene,
};

window.game = new Phaser.Game(config);
