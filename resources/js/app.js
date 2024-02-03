
/**
 * Phaser3
 *  https://newdocs.phaser.io/docs/3.70.0/gameobjects
 */
import Phaser from 'phaser'
import _ from 'lodash'

import ObjectManager from './ObjectManager.js'
import CardList from './CardList'
import Card from './Card.js'
import Flag from './Flag.js'
import DamageMark from './DamageMark.js'
import Bench from './Bench.js'



const Bevel = 8
const HeightBase = 100
const WidthBase = -30

let y = HeightBase
let enemyY = -HeightBase
let direction = 1



class CardStack {
    constructor(scene) {
        this.scene = scene
        this.cards = []
    }

    addCard(card) {
        this.cards.push(card)
    }

    getTotalPower() {
        //
        let power = 0
        this.cards.forEach((c) => {
            power += c.cardInfo.p
        })
        return power
    }

    getTopCard() {
        if (!this.cards.length) {
            return null
        }
        return this.cards[this.cards.length - 1]
    }

    takeAll() {
        const cards = this.cards
        this.cards = []
        return cards
    }
}

const setTurnPlayer = (player) => {
    DuelInfo.turnPlayer = player
    if (!player) {
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
    enter(scene, cardBoard, flag, DuelInfo, onEnd) {
        const turnPlayer = DuelInfo.turnPlayer

        DuelInfo.player = []
        DuelInfo.player.push(new Player(scene, 0, 1))
        DuelInfo.player.push(new Player(scene, 1, -1))

        const player = DuelInfo.player[1 - turnPlayer]

        DuelInfo.player.forEach((player) => {
            player.getDeck().setCardList([1, 1, 1, 2, 2, 3, 4])
            player.getDeck().shuffle()

            // todo !!!
            const x = 0
            const y = 0
            player.bench = new Bench(DuelInfo, scene, player.id, x, y)


        })

        const diffenceCardInfo = player.deck.draw(scene, cardBoard, DuelInfo.objectManager, 400, turnPlayer)
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
    enter(scene, cardBoard, flag, DuelInfo, onEnd) {

        const turnPlayer = DuelInfo.turnPlayer
        const enemyCard = DuelInfo.player[1 - turnPlayer].cardStack.getTopCard()

        const newAttackCard = DuelInfo.player[turnPlayer].deck.draw(scene, cardBoard, DuelInfo.objectManager, 0, turnPlayer);
        if (newAttackCard) {

            const stackCount = DuelInfo.player[turnPlayer].cardStack.cards.length
            const x = (WidthBase * direction) - (stackCount * 8)

            scene.tweens.chain({
                targets: newAttackCard.card,
                tweens: [
                    {
                        x: -100,
                        y: -10,
                        scale: 2.5,
                        duration: 100,
                        angle: 0,
                    },
                    {
                        delay: 1000,
                        scale: 1.0,
                        x: x,
                        y: y - (stackCount * 8),
                        ease: 'power1',
                        duration: 200,
                        angle: Bevel + (180 * turnPlayer),
                    },
                    {
                        x: x,
                        y: y - (stackCount * 8),
                        scale: 1.0,
                        duration: 100,
                    },
                ],
                onComplete() {

                    console.log('diffence-card: OK!')

                    DuelInfo.player[turnPlayer].cardStack.addCard(newAttackCard)

                    const total = DuelInfo.player[turnPlayer].cardStack.getTotalPower()

                    DuelInfo.player[turnPlayer].cardStack.cards.forEach((c, i) => {
                        const stackCount = i
                        c.attack(stackCount)
                    })


                    scene.damageMark.setDamage(1) // dummy parama

                    if (total >= enemyCard.cardInfo.p) {
                        enemyCard.damaged(() => {
                            console.log('かった！' + turnPlayer, DuelInfo.player[turnPlayer].cardStack)

                            DuelInfo.player[turnPlayer].cardStack.cards.forEach((c) => {
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
                            const enemyPlayer = DuelInfo.player[1 - turnPlayer]

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

                            setTurnPlayer(1 - turnPlayer)

                            onEnd(AttackPhase);
                        })
                    } else {
                        onEnd(AttackPhase);
                    }

                },
            })

        }

    },

}

const DamagePhase = {
    enter(scene, cardBoard, flag, DuelInfo, onEnd) {

        onEnd();
    },

}


class Deck {
    constructor(player) {
        this.cards = []
        this.player = player
    }

    setCardList(cardList) {
        this.cards = _.cloneDeep(cardList)
    }
    shuffle() {
        this.cards = _.shuffle(this.cards)
    }

    draw(scene, cardBoard, objectManager, stackCount, turnPlayer) {
        if (this.isEmpty()) {
            return null
        }
        const cardId = this.cards.shift()
        const cardInfo = CardList[cardId - 1]
        const card = new Card(scene, cardBoard, objectManager, cardInfo, this.player, stackCount * 8, y + stackCount * 8, turnPlayer)

        return card
    }

    isEmpty() {
        if (!this.cards.length) {
            return true
        }
        return false
    }

}

class Player {
    constructor(scene, id, direction) {
        this.id = id
        this.direction = direction
        this.deck = new Deck(this)
        this.cardStack = new CardStack(scene)
    }

    getPlayerId() {
        return this.id
    }

    getBaseY() {
        return 100 * this.direction
    }

    getDeck() {
        return this.deck
    }
}

const DuelInfo = {
    turnPlayer: 0,
    player: [],
    scene: null,
    cardBoard: null,
    objectManager: null,
}

const scene = {
    preload() {
        this.load.image('flag', 'assets/flag.png');
        this.load.image('card', 'assets/card.png');
        this.load.image('card_back', 'assets/card_back.png');
        this.load.image('card_shadow', 'assets/card_shadow.png');
        this.load.image('chara', 'assets/chara.png');
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

        let currentPhase = SetupPhase

        this.add.image(400, 300, 'sky');


        const scene = this;
        this.objectManager = new ObjectManager()
        DuelInfo.objectManager = this.objectManager


        const self = this;
        this.deckSprite = this.add.sprite(180, 520, 'card_back').setInteractive();
        this.deckSprite.on('pointerdown', function (pointer) {
            AttackPhase.enter(scene, self.cardBoard, flag, DuelInfo, () => {
            })
        });



        const flag = new Flag(scene, 480, 170)
        this.cardBoard = scene.add.container(400, 280, [])
        DuelInfo.cardBoard = this.cardBoard

        this.damageMark = new DamageMark(scene, 400, 280)


        const toNextPhase = (next) => {
            currentPhase = next
            currentPhase.enter(scene, this.cardBoard, flag, DuelInfo, (next) => {
                toNextPhase(next)
            })
        }

        currentPhase.enter(scene, this.cardBoard, flag, DuelInfo, toNextPhase)


        //this.scoreText = this.add.text(16, 16, 'ちゃれんじゃ', { fontSize: '32px', fill: '#000' });
    },
    update() {
        this.objectManager.onUpdate()

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
