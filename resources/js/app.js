
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


const axios = Axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
      },
      //timeout: 2000,
})


const SetupPhase = {
    enter(scene, duel, onEnd) {

        const turnPlayerId = duel.turnPlayerId

        axios.get('api/data/deck').then((res) => {
            console.log('res', res.data)
            const data = res.data

            const player = duel.getPlayer(1 - turnPlayerId)

            duel.playerList.forEach((player) => {
                player.getDeck().setCardList(data.players[player.getPlayerId()].deck)
            })

            const diffenceCardInfo = player.getDeck().draw(duel, 400, turnPlayerId, () => {

                let enemyY = -HeightBase
                if (turnPlayerId) {
                    enemyY = HeightBase
                }
                diffenceCardInfo.card.angle = Bevel + (180 * (1 - turnPlayerId)) // todo enterToにマージ

                ///////
                player.cardStack.addCard(diffenceCardInfo)
                diffenceCardInfo.enterTo(-WidthBase, enemyY, 1 - turnPlayerId)

                if (onEnd) {
                    onEnd(DrawPhase);
                }
            })
        })
    },

}

const DrawPhase = {
    enter(scene, duel, onEnd) {
        this.isDrawProcessing = false

        this.duel = duel
        this.onEnd = onEnd

        const player = duel.getTrunPlayer()
        if (player.getPlayerId() === 0) {
            player.getDeck().setClickableState(true)
        } else {
            this.doDraw(duel)
        }
    },

    onEvent(event, sender, params) {

        // console.log('******* ' + event + ' *****', sender, params)
        sender.setClickableState(false)
        this.doDraw(this.duel)
    },

    doDraw(duel) {
        if (this.isDrawProcessing) {
            return
        }

        this.isDrawProcessing = true

        const turnPlayer = duel.getTrunPlayerId()
        const player = duel.getTrunPlayer()
        player.deck.draw(duel, 0, turnPlayer, (currentDrawCard) => {
            if (currentDrawCard) {
                currentDrawCard.showDetial(() => {
                    //const stackCount = duel.getPlayer(turnPlayer).getCardStack().getStackCount()
                    currentDrawCard.moveToAttackPosition(() => {
                        duel.getTrunPlayer().getCardStack().addCard(currentDrawCard)
                        this.isDrawProcessing = false
                        if (this.onEnd) {
                            this.onEnd(AttackPhase)
                        }
                    })
                })
            }
        })
    },

}

const AttackPhase = {
    enter(scene, duel, onEnd) {
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
        scene.damageMark.setDamage(null) // dummy param

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
                enemyPlayer.getBench().addCards(1 - turnPlayer, deffenceCards, () => {

                    if (enemyPlayer.getDeck().isEmpty()) {

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

                    onEnd(TurnChangePhase)
                })

            })
        } else {
            enemyCard.damaged(() => {
                onEnd(DrawPhase)
            })
        }
    },

    onEvent(event, sender, params) {
        // console.log('******* ' + event + ' *****', sender, params)
        sender.setClickableState(false)
        if (this.onEnd) {
            this.onEnd(DrawPhase)
        }
    }
}

const TurnChangePhase = {
    enter(scene, duel, onEnd) {
        duel.turnPlayerId = 1 - duel.getTrunPlayerId()
        onEnd(DrawPhase);
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
        this.load.image('ch_mono', 'assets/ch_mono.png');
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
