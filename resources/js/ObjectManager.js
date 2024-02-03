export default class ObjectManager {
    constructor() {
        this.objecList = []
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