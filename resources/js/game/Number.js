
export default class Number {
    constructor(scene, x, y, maxDigit = 3) {
        this.number = 0
        this.maxDigit = maxDigit

        this.sprites = []
        for (let i = 0; i < maxDigit; i++) {
            this.sprites.push(scene.add.sprite(-17 * i, 0, 'number', 1))
        }

        this.container = scene.add.container(x, y, this.sprites)

    }

    getSprite() {
        return this.container
    }

    setNumber(number) {
        this.number = parseInt(number)

        let digitNumber = this.number
        for (let i = 0; i < this.maxDigit; i++) {
            let currentDigit = digitNumber % 10
            if ((i > 0) && (currentDigit < 1)) {
                this.sprites[i].visible = false
            } else {
                this.sprites[i].visible = true
                this.sprites[i].setFrame(digitNumber % 10)
            }
            digitNumber /= 10
        }

    }

    getNumber() {
        return this.number
    }
}