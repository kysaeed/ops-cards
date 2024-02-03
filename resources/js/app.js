
/**
 * Phaser3
 *  https://newdocs.phaser.io/docs/3.70.0/gameobjects
 */
import Phaser from 'phaser'
import _ from 'lodash'

import CardList from './CardList'
import Card from './Card.js'




const Bevel = 8
const HeightBase = 100
const WidthBase = -30

let y = HeightBase
let enemyY = -HeightBase
let direction = 1

class DamageMark {
  constructor(scene, x, y) {
    this.scene = scene
    this.damage = scene.add.sprite(0, 0, 'damage')

    this.sprite = scene.add.container(x, y, [
      this.damage,
    ])


    this.sprite.setBlendMode(Phaser.BlendModes.MULTIPLY);

    this.sprite.alpha = 0.8
    this.sprite.visible = false

  }

  setDamage(damage) {
    this.sprite.scale = 0
    this.sprite.visible = true
    // this.sprite.alpha = 0.5

    const self = this;
    this.scene.tweens.chain({
      targets: this.sprite,
      tweens: [
        {
          // x: x,
          // y: y,
          //angle: angle + 90 + Bevel,
          ease: 'power1',
          scale: 2.0,
          duration: 100,
        },
        {
          // x: x,
          // y: y,
          //angle: angle + Bevel,
          ease: 'power1',
          //alpha: 0,
          duration: 150,
        },
      ],
      onComplete: ()=> {
        console.log('dm: OK!')
        self.sprite.visible = false
      },
    })
    //
  }

}

class Bench {
  constructor(scene, playerId, x, y) {
    this.playerId = playerId
    this.scene = scene
    this.cards = []
    this.x = x
    this.y = y
  }

  addCards(playerId, cardList) {

    playerId = this.playerId


    const currentPlayer = DuelInfo.player[playerId]
    cardList.forEach((c, i) => {
      const benchIndex = this.cards.length

      // this.cards.push([c])
      this.addCardElement(playerId, c)
    })

  }

  addCardElement(playerId, card) {

    const getBenchY = (benchIndex, playerId) => {
      if (playerId == 0) {
        return 200 - (benchIndex * 70)
      }
      return (-200 + (benchIndex * 70));
    }

    for (let i = 0; i < this.cards.length; i++) {
      const list = this.cards[i]
      if (list.length < 1) {
        list.push(card)
        card.moveToBench(-200 + ((1 - playerId) * 400), getBenchY(i, playerId));

        return
      } else {
        if (list[0].cardInfo.name == card.cardInfo.name) {
          const stackCount = list.length
          list.push(card)
          card.moveToBench(
            -200 + ((1 - playerId) * 400) - (stackCount * 4),
            getBenchY(i, playerId) - (stackCount * 4)
          );
          return
        }
      }
    }

    const benchIndex = this.cards.length
    this.cards.push([
      card
    ])
    card.moveToBench(-200 + ((1 - playerId) * 400), getBenchY(benchIndex, playerId));

  }
}


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

class Flag {
  constructor(scene, x, y) {
    this.scene = scene
    this.sprite = scene.add.sprite(x, y, 'flag')

  }

  moveTo(x, y, onEnd) {
    const basePosition = {
      x: this.sprite.x,
      y: this.sprite.y,
    }
    this.scene.tweens.chain({
      targets: this.sprite,
      tweens: [
        {
          // x: x,
          // y: y,
          angle: 0,
          scale: 1.0,
          duration: 300,
        },
        {
          angle: 0,
          // x: x,
          // y: y,
          scale: 1.4,
          ease: 'power1',
          duration: 300,
        },
        {
          x: x,
          y: y,
          angle: 0,
          scale: 1.0,
          duration: 200,
        },
      ],
      onComplete() {
        console.log('flag: OK!')
        if (onEnd) {
          onEnd()
        }
      },
    });
  }
}


const SetupPhase = {
  enter(scene, cardBoard, flag, DuelInfo, onEnd) {
    const turnPlayer = DuelInfo.turnPlayer

    DuelInfo.player = []
    DuelInfo.player.push(new Player(0, 1))
    DuelInfo.player.push(new Player(1, -1))

    const player = DuelInfo.player[1 - turnPlayer]

    DuelInfo.player.forEach((player) => {
      player.getDeck().setCardList([1, 1, 1, 2, 2 ,3, 4])
      player.getDeck().shuffle()

      // todo !!!
      const x = 0
      const y = 0
      player.bench = new Bench(scene, player.id, x, y)

      player.cardStack = new CardStack(scene)

    })

    const diffenceCardInfo = player.deck.draw(scene, cardBoard, 400, turnPlayer)
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

    const newAttackCard = DuelInfo.player[turnPlayer].deck.draw(scene, cardBoard, 0, turnPlayer);
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
            y: y  - (stackCount * 8),
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
              console.log('かった！'  + turnPlayer, DuelInfo.player[turnPlayer].cardStack)

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

  draw(scene, cardBoard, stackCount, turnPlayer) {
    if (this.isEmpty()) {
      return null
    }
    const cardId = this.cards.shift()
    const cardInfo = CardList[cardId - 1]
    const card = new Card(scene, cardBoard, cardInfo, this.player, stackCount * 8, y + stackCount * 8, turnPlayer)
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
    constructor(id, direction) {
        this.id = id
        this.direction = direction
        this.deck = new Deck(this)
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


    const self = this;
    this.deckSprite = this.add.sprite(180, 520, 'card_back').setInteractive();
    this.deckSprite.on('pointerdown', function(pointer) {
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

    currentPhase.enter(scene, this.cardBoard, flag,DuelInfo, toNextPhase)


    //this.scoreText = this.add.text(16, 16, 'ちゃれんじゃ', { fontSize: '32px', fill: '#000' });
  },
  update() {
    //

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
