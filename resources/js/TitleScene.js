import Const from './Const.js'

const TitleScene = {
    key: 'TitleScene',
    active: false,

    preload() {},

    create() {

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

        /*
        // 旧仕様互換
        window.onorientationchange = () => {
        onResize()
        }
        */

        screen.orientation.onchange = () => {
            onResize()
        }

        // 回転の初期化
        fit()


        const txtTitle = this.add.text(200, 100, 'カードゲームのタイトル画面', { fontSize: '42px', fill: '#fff' });
        const txtSub = this.add.text(450, 400, '画面をクリック！', { fontSize: '20px', fill: '#fff' });

        this.input.on('pointerdown', () => {
            //

            this.scene.start('DuelScene')

        })

    },

    update() {},

}

export default TitleScene
