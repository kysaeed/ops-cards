import Const from './Const.js'
import CardSprite from './game/CardSprite.js'
import CardList from './game/CardList'


const ShopScene = {
    key: 'ShopScene',
    active: false,

    preload() {

        this.load.spritesheet('number', 'assets/number.png', {
            frameWidth: 20,
            frameHeight: 20,
        });

        this.load.image('bg_shop', 'assets/bg_shop.png')

        this.load.image('card', 'assets/card.png') // (160 * 220) * 0.5
        this.load.image('card_pow', 'assets/card_pow.png')
        this.load.image('card_type', 'assets/card_type.png')
        this.load.image('card_back', 'assets/card_back.png')
        this.load.image('card_shadow', 'assets/card_shadow.png')
        this.load.image('deck_shadow', 'assets/deck_shadow.png');
        this.load.image('card_tip', 'assets/card_tip.png')
        this.load.image('card_tip_shadow', 'assets/card_tip_shadow.png')
        this.load.image('deck_clickable', 'assets/deck_clickable.png')

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
         this.load.image('cat', 'assets/cat.png')
    },

    create() {

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


        // const txtTitle = this.add.text(200, 100, 'カードゲームのタイトル画面', { fontSize: '42px', fill: '#fff' });
        // const txtSub = this.add.text(450, 400, '画面をクリック！', { fontSize: '20px', fill: '#fff' });

        this.input.on('pointerdown', () => {
            //
            this.scene.start('DuelScene')
        })

        this.add.image(
            (Const.Screen.Width * 0.5),
            (Const.Screen.Height * 0.5),
            'bg_shop'
        )

        for (let i=0; i < 3; i++) {
            const c = new CardSprite(this, CardList[i])

            c.sprite.x = 200 + (i * 120)
            c.sprite.y = 200
            c.sprite.scale = 0.55

            c.onUpdate()

            c.setClickEventListener((sender) => {
                console.log('clicked!!!', sender)
            })
            c.setClickable(true)
        }


        let x = 0
        let y = 0
        for (let i=1; i <= 20; i++) {
            const c = new CardSprite(this, CardList[i % 10])

            c.sprite.x = x + 180
            c.sprite.y = y + 380
            c.sprite.scale = 0.34
            const Bevel = 20
            c.sprite.angle = (Math.random() * Bevel) - (Bevel * 0.5)

            c.onUpdate()

            x += 60
            if (!(i % 10)) {
                x = 0
                y += 100
            }
        }
    },

    update() {
        //
    },

}

export default ShopScene
