import Const from './Const.js'

const TitleScene = {
    key: 'TitleScene',
    active: false,

    preload() {},

    create() {

        // 90度回転の中心点を設定
        this.cameras.main.originX = 0.5
        this.cameras.main.originY = (Const.Screen.Height * 0.5) / Const.Screen.Width


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
