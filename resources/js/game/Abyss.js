import _ from 'lodash'
// import Const from "../Const"

const AbyssXBase = 420
const AbyssYBase = -240
const BaseLine = -50

export default class Abyss {
    constructor(duel, player /*, x, y*/) {
        this.duel = duel

        const direction = player.getDirection()

        this.x = (AbyssXBase * direction)
        this.y = (AbyssYBase * direction) + BaseLine
    }

    getX() {
        return this.x
    }
    getY() {
        return this.y
    }

}
