
import ObjectManager from './ObjectManager.js'
import Player from './Player.js'

export default class Duel {
    constructor(scene) {
        this.scene = scene
        this.turnPlayerId = 0

        this.playerList = []
        this.playerList.push(new Player(scene, 0, 1))
        this.playerList.push(new Player(scene, 1, -1))

        this.cardBoard = scene.add.container(400, 280, [])

        this.objectManager = new ObjectManager(scene)

    }

    getScene() {
        this.scene
    }

    getPlayer(playerId) {
        return this.playerList[playerId]
    }

    getObjectManager() {
        return this.objectManager
    }

    onUpdate() {
        this.objectManager.onUpdate()
    }
}
