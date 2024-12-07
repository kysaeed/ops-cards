
/**
 * Phaser3
 *  https://newdocs.phaser.io/docs/3.70.0/gameobjects
 */
import Phaser from 'phaser'
import _ from 'lodash'
import Axios from 'axios'

import Const from './Const.js'
import Duel from './game/Duel.js'
import DamageMark from './game/DamageMark.js'
import phase from './phase'

import SoftKeyboard from './game/SoftKeyboard/SoftKeyboard.js'

const BaseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8080'


const axios = Axios.create({
    baseURL: BaseUrl,
    headers: {
        'Content-Type': 'application/json',
      },
      //timeout: 2000,
})
window.axios = axios //@


const scene = {
    preload() {
        this.load.spritesheet('number', 'assets/number.png', {
            frameWidth: 20,
            frameHeight: 20,
        });

        this.load.image('flag', 'assets/flag.png');
        this.load.image('card', 'assets/card.png'); // (160 * 220) * 0.5
        this.load.image('card_pow', 'assets/card_pow.png');
        this.load.image('card_type', 'assets/card_type.png');
        this.load.image('card_back', 'assets/card_back.png');
        this.load.image('card_shadow', 'assets/card_shadow.png');
        this.load.image('deck_shadow', 'assets/deck_shadow.png');
        this.load.image('card_tip', 'assets/card_tip.png');
        this.load.image('card_tip_shadow', 'assets/card_tip_shadow.png');
        this.load.image('deck_clickable', 'assets/deck_clickable.png');
        this.load.image('board', 'assets/board.png');
        this.load.image('modal', 'assets/modal.png');
        this.load.image('damage', 'assets/damage.png');

        this.load.image('desc_effect', 'assets/desc_effect.png')

        this.load.image('key', 'assets/key.png');
        this.load.image('key_cursor', 'assets/key_cursor.png');



        /**
         * todo :
         *　  表示するカードだけプリロードする
         */
        this.load.image('chara', 'assets/chara.png');
        this.load.image('ch_kage', 'assets/ch_kage.png');
        this.load.image('ch_magi', 'assets/ch_magi.png');
        this.load.image('ch_whell', 'assets/ch_whell.png');
        this.load.image('ch_eye', 'assets/ch_eye.png');
        this.load.image('ch_oddc', 'assets/ch_oddc.png');
        this.load.image('ch_snake', 'assets/ch_snake.png');
        this.load.image('ch_moon', 'assets/ch_moon.png');
        this.load.image('ch_mono', 'assets/ch_mono.png');
        this.load.image('ch_star', 'assets/ch_star.png');
        this.load.image('ch_mass', 'assets/ch_mass.png');
        this.load.image('ch_db', 'assets/ch_db.png');
        this.load.image('ch_clown', 'assets/ch_clown.png');
        this.load.image('ch_dog', 'assets/ch_dog.png');
        this.load.image('ch_machine', 'assets/ch_machine.png');
        this.load.image('ch_scarecrow', 'assets/ch_scarecrow.png');
        this.load.image('ch_frasco', 'assets/ch_frasco.png');
        this.load.image('cat', 'assets/cat.png');

        // this.load.spritesheet('dude',
        //   'assets/dude.png',
        //   { frameWidth: 32, frameHeight: 48 }
        // );

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
        // this.anchor.angle = 90
        // this.anchor.x = 800

        this.duel = new Duel(this)

        this.cardBoard = this.duel.getCardBoard()

        let currentPhase = phase['SetupPhase']

        this.duel.setCurrentPhase(currentPhase)

        const scene = this;
        this.objectManager = this.duel.getObjectManager()

        this.damageMark = new DamageMark(scene, 400, 280)

        const toNextPhase = (next, fetchData) => {
console.log('to Next State : ', fetchData)
            currentPhase = phase[next]
            this.duel.setCurrentPhase(currentPhase)
            currentPhase.enter(this.duel, fetchData, (next, fetchData) => {
                toNextPhase(next, fetchData)
            })
        }

        currentPhase.enter(this.duel, {}, toNextPhase)


        const softKeyboard = new SoftKeyboard(this)




    },
    update() {
        this.duel.onUpdate()
    },
};

const config = {
    parent: 'app',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    type: Phaser.AUTO, ////Phaser.WEBGL, ///
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'app',
        width: Const.Screen.Width,
        height: Const.Screen.Height
    },
    scene,
};

window.game = new Phaser.Game(config);
