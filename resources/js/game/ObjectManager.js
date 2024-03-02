export default class ObjectManager {
    constructor(scene) {
        this.scene = scene
        this.objecList = []
    }

    getScene() {
        return this.scene
    }

    append(object) {
        this.objecList.push(object)
    }

    onUpdate() {
        this.objecList.forEach((obj) => {
            obj.onUpdate()
        })
    }
}