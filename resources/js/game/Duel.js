
import Const from '../Const.js'
import ObjectManager from './ObjectManager.js'
import Player from './Player.js'
import Flag from './Flag.js'



export default class Duel {
    constructor(scene) {
        this.scene = scene
        this.currentPhase = null
        this.turnPlayerId = 0

        this.cardBoard = scene.add.container(400, 280, [])
        scene.anchor.add(this.cardBoard)

        this.objectManager = new ObjectManager(scene)

        this.playerList = []
        this.playerList.push(new Player(this, 0, 1))
        this.playerList.push(new Player(this, 1, -1))

        this.flag = new Flag(this.scene, 580, 170)

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

    onUpdate() {
        this.objectManager.onUpdate()
    }
}
