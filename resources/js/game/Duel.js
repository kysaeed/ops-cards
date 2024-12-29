
import Const from '../Const.js'
import ObjectManager from './ObjectManager.js'
import Player from './Player.js'
import Flag from './Flag.js'



export default class Duel {
    constructor(scene) {
        this.scene = scene
        this.currentPhase = null
        this.turnPlayerId = 0

        this.cardBoard = scene.add.container(Const.Screen.Width * 0.5, 280, [])
        scene.anchor.add(this.cardBoard)

        this.objectManager = new ObjectManager(scene)

        this.playerList = []
        this.playerList.push(new Player(this, 0, 1))
        this.playerList.push(new Player(this, 1, -1))

        this.flag = new Flag(this.scene, 580, 170)

        this.curtain = this.scene.add.rectangle(Const.Screen.Width / 2, Const.Screen.Height / 2, Const.Screen.Width + 1, Const.Screen.Height + 1, 0x000000)

    }

    getScene() {
        return this.scene
    }

    getCardBoard() {
        return this.cardBoard
    }

    setCurrentPhase(phase) {
        this.currentPhase = phase
    }

    getCurrentPhase() {
        return this.currentPhase
    }

    getFlag() {
        return this.flag
    }

    getTurnPlayerId() {
        return this.turnPlayerId
    }

    getTurnPlayer() {
        return this.playerList[this.getTurnPlayerId()]
    }

    getOtherPlayer() {
        return this.playerList[1 - this.getTurnPlayerId()]
    }

    getPlayer(playerId) {
        return this.playerList[playerId]
    }

    getObjectManager() {
        return this.objectManager
    }

    isTurnPlayer(player) {
        if (this.getTurnPlayerId() === player.getPlayerId()) {
            return true
        }

        return false
    }

    show(onEnd) {
        this.scene.tweens.chain({
            targets: this.curtain,
            tweens: [
                {
                    duration: 500,
                    alpha: 0.0,
                },
            ],
            onComplete: () => {
                this.curtain.visible = false
                if (onEnd) {
                    onEnd()
                }
            }
        })
    }

    hide(onEnd) {
        this.scene.tweens.chain({
            targets: this.curtain,
            tweens: [
                {
                    duration: 500,
                    alpha: 1.0,
                },
            ],
            onComplete: () => {
                this.curtain.visible = false
                if (onEnd) {
                    onEnd()
                }
            }
        })
    }

    onUpdate() {
        this.objectManager.onUpdate()
    }
}
