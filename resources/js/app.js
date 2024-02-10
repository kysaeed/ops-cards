
/**
 * Phaser3
 *  https://newdocs.phaser.io/docs/3.70.0/gameobjects
 */
import Phaser from 'phaser'
import _ from 'lodash'
import Axios from 'axios'

import Duel from './Duel.js'
// import CardList from './CardList'
// import Card from './Card.js'
import Flag from './Flag.js'
import DamageMark from './DamageMark.js'
// import Bench from './Bench.js'



const Bevel = 8
const HeightBase = 100
const WidthBase = -30

let y = HeightBase
let enemyY = -HeightBase
let direction = 1



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
    enter(scene, cardBoard, flag, duel, onEnd) {

        const turnPlayer = duel.turnPlayerId

        // const player = duel.playerList[1 - turnPlayer]
        const player = duel.getPlayer(1 - turnPlayer)

        duel.playerList.forEach((player) => {
            player.getDeck().setCardList([1, 1, 1, 2, 2, 3, 4])
            player.getDeck().shuffle()
        })

        const diffenceCardInfo = player.getDeck().draw(duel, 400, turnPlayer)
        diffenceCardInfo.card.angle = Bevel + (180 * (1 - turnPlayer))

        ///////
        player.cardStack.addCard(diffenceCardInfo)

        diffenceCardInfo.enterTo(-WidthBase, enemyY, 1 - turnPlayer)

        if (onEnd) {
            onEnd(AttackPhase);
        }
    },

}

const AttackPhase = {
    enter(scene, cardBoard, flag, duel, onEnd) {

        const turnPlayer = duel.turnPlayerId
        const enemyCard = duel.playerList[1 - turnPlayer].cardStack.getTopCard()

        const newAttackCard = duel.playerList[turnPlayer].deck.draw(duel, /*scene, cardBoard, duel.objectManager,*/ 0, turnPlayer);
        if (newAttackCard) {

            const stackCount = duel.playerList[turnPlayer].cardStack.cards.length
            const x = (WidthBase * direction) - (stackCount * 8)
            const y = (-HeightBase) + (HeightBase * 2 * (1 - turnPlayer))

            newAttackCard.showDetial(() => {

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

                        console.log('diffence-card: OK!')

                        duel.getPlayer(turnPlayer).cardStack.addCard(newAttackCard)

                        const total = duel.playerList[turnPlayer].cardStack.getTotalPower()

                        duel.playerList[turnPlayer].cardStack.cards.forEach((c, i) => {
                            const stackCount = i
                            c.attack(stackCount, () => {
                                //
                            })
                        })
                        scene.damageMark.setDamage(1) // dummy parama
                        if (total >= enemyCard.cardInfo.p) {
                            enemyCard.damaged(() => {
                                // console.log('かった！' + turnPlayer, duel.playerList[turnPlayer].cardStack)

                                duel.playerList[turnPlayer].cardStack.cards.forEach((c) => {
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

                                flag.moveTo(520, 170 + (200 * (1 - turnPlayer)))

                                // 攻撃側から見た敵プレイヤー
                                const enemyPlayer = duel.playerList[1 - turnPlayer]

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

                                onEnd(AttackPhase);
                            })
                        } else {
                            onEnd(AttackPhase);
                        }

                    },
                })


            })
        }

    },

}

const DamagePhase = {
    enter(scene, cardBoard, flag, duel, onEnd) {

        onEnd();
    },

}


const scene = {
    preload() {
        this.load.image('flag', 'assets/flag.png');
        this.load.image('card', 'assets/card.png');
        this.load.image('card_back', 'assets/card_back.png');
        this.load.image('card_shadow', 'assets/card_shadow.png');
        this.load.image('chara', 'assets/chara.png');
        this.load.image('ch_kage', 'assets/ch_kage.png');
        this.load.image('ch_magi', 'assets/ch_magi.png');
        this.load.image('ch_whell', 'assets/ch_whell.png');
        this.load.image('cat', 'assets/cat.png');
        this.load.image('sky', 'assets/sky2.png');
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

        let currentPhase = SetupPhase

        const scene = this;
        this.objectManager = this.duel.getObjectManager()

        const self = this;
        this.deckSprite = this.add.sprite(180, 520, 'card_back').setInteractive();
        this.deckSprite.on('pointerdown', function (pointer) {
            AttackPhase.enter(scene, self.cardBoard, flag, this.duel, () => {
                //
            })
        });

        const flag = new Flag(scene, 480, 170)


        this.cardBoard = this.duel.getCardBoard()

        this.damageMark = new DamageMark(scene, 400, 280)


        const toNextPhase = (next) => {
            currentPhase = next
            currentPhase.enter(scene, this.cardBoard, flag, this.duel, (next) => {
                toNextPhase(next)
            })
        }

        currentPhase.enter(scene, this.cardBoard, flag, this.duel, toNextPhase)


        //this.scoreText = this.add.text(16, 16, 'ちゃれんじゃ', { fontSize: '32px', fill: '#000' });
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
