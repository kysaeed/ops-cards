//import Phaser from 'phaser'

import Const from './Const.js'
import Duel from './game/Duel.js'
import DamageMark from './game/DamageMark.js'
import phase from './phase'


const DuelScene = {
    key: 'DuelScene',
    active: false,

    preload() {
        this.load.spritesheet('number', 'assets/number.png', {
            frameWidth: 20,
            frameHeight: 20,
        });

        this.load.image('flag', 'assets/flag.png')
        this.load.image('card', 'assets/card.png') // (160 * 220) * 0.5
        this.load.image('card_pow', 'assets/card_pow.png')
        this.load.image('card_type', 'assets/card_type.png')
        this.load.image('card_back', 'assets/card_back.png')
        this.load.image('card_shadow', 'assets/card_shadow.png')
        this.load.image('deck_shadow', 'assets/deck_shadow.png');
        this.load.image('card_tip', 'assets/card_tip.png')
        this.load.image('card_tip_shadow', 'assets/card_tip_shadow.png')
        this.load.image('deck_clickable', 'assets/deck_clickable.png')
        this.load.image('board', 'assets/board.png?v=3')
        this.load.image('modal', 'assets/modal.png')
        this.load.image('damage', 'assets/damage.png')
        this.load.image('coin', 'assets/damage.png')

        this.load.image('desc_effect', 'assets/desc_effect.png')

        this.load.image('hero', 'assets/hero/hero.png')
        this.load.image('hero_word', 'assets/hero/hero_word.png')


        /**
         * todo :
         *　  表示するカードだけプリロードする？
         */
        this.load.image('chara', 'assets/chara.png')
        this.load.image('ch_kage', 'assets/ch_kage.png')
        this.load.image('ch_magi', 'assets/ch_magi.png')
        this.load.image('ch_whell', 'assets/ch_whell.png')
        this.load.image('ch_eye', 'assets/ch_eye.png')
        this.load.image('ch_oddc', 'assets/ch_oddc.png')
        this.load.image('ch_snake', 'assets/ch_snake.png')
        this.load.image('ch_moon', 'assets/ch_moon.png')
        this.load.image('ch_mono', 'assets/ch_mono.png')
        this.load.image('ch_star', 'assets/ch_star.png')
        this.load.image('ch_mass', 'assets/ch_mass.png')
        this.load.image('ch_db', 'assets/ch_db.png')
        this.load.image('ch_clown', 'assets/ch_clown.png')
        this.load.image('ch_dog', 'assets/ch_dog.png')
        this.load.image('ch_machine', 'assets/ch_machine.png')
        this.load.image('ch_scarecrow', 'assets/ch_scarecrow.png')
        this.load.image('ch_frasco', 'assets/ch_frasco.png')
        this.load.image('ch_parade', 'assets/ch_parade.png')
        this.load.image('ch_cat', 'assets/ch_cat.png')
        this.load.image('ch_darkness', 'assets/ch_darkness.png')

        // this.load.spritesheet('dude',
        //   'assets/dude.png',
        //   { frameWidth: 32, frameHeight: 48 }
        // )

    },
    create() {
        this.anchor = this.add.container(0, 0)
        this.anchor.add(
            this.add.image(
                (Const.Screen.Width * 0.5),
                (Const.Screen.Height * 0.5),
                'board'
            )
        )

        // this.add.image(400, 300, 'board')

        this.duel = new Duel(this)

        this.cardBoard = this.duel.getCardBoard()

        let currentPhase = phase['SetupPhase']

        this.duel.setCurrentPhase(currentPhase)

        const scene = this;
        this.objectManager = this.duel.getObjectManager()

        this.damageMark = new DamageMark(scene, 480, 280)

        const toNextPhase = (next, fetchData) => {
console.log('to Next State : ', fetchData)
            currentPhase = phase[next]
            this.duel.setCurrentPhase(currentPhase)
            currentPhase.enter(this.duel, fetchData, (next, fetchData) => {
                toNextPhase(next, fetchData)
            })
        }


        if (!game.device.os.desktop) { // PCの場合は、ディレプレイの持ち方を変えないので回転しない
            // 90度回転の中心点を設定
            this.cameras.main.originX = 0.5
            this.cameras.main.originY = (Const.Screen.Height * 0.5) / Const.Screen.Width


            const isVertical = () => {

                const game = window.game

                const w = game.scale.parentSize.width
                const h = game.scale.parentSize.height

                let isVertical = false
                if (w && h) {
                  if (w < h) {
                    isVertical = true
                  }
                }

                return isVertical
            }

            const setRotateState = (isRotate) => {
                if (isRotate) {
                    // [|] 縦長スクリーンに表示
                    game.scale.displaySize.setAspectRatio( Const.Screen.Height/Const.Screen.Width );
                    game.scale.resize(Const.Screen.Height, Const.Screen.Width)
                    this.cameras.main.setRotation(Math.PI * 0.5)
                    game.scale.refresh()
                } else {
                    // [--] 横長スクリーンに表示
                    game.scale.displaySize.setAspectRatio( Const.Screen.Width/Const.Screen.Height );
                    game.scale.resize(Const.Screen.Width, Const.Screen.Height)
                    this.cameras.main.setRotation(0)
                    game.scale.refresh()
                }
            }

            const fit = () => {
                /*
                // PCの場合は、ディレプレイの持ち方を変えないので回転しない
                if (game.device.os.desktop) {
                    return
                }
                */
                setRotateState(isVertical())
            }

            let h
            const onResize = () => {

                if (h) {
                    clearTimeout(h)
                }
                h = setTimeout(() => {
                    fit()
                }, 100)
            }

            window.onresize = () => {
                onResize()
            }

            screen.orientation.onchange = () => {
                onResize()
            }

            // 回転の初期化
            fit()
        }

        // ログイン処理 @todo タイトルで実行するように治す
        // window.axios.get('sanctum/csrf-cookie').then(() => {
        //     window.axios.post('api/login', {}).then(() => {
        //         currentPhase.enter(this.duel, {}, toNextPhase)
        //     })
        // })
        currentPhase.enter(this.duel, {}, toNextPhase)

    },
    update() {
        this.duel.onUpdate()
    },
};

export default DuelScene