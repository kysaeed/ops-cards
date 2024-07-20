
export default class Number {
    constructor(scene, x, y, maxDigit = 3, isShowSymbol = false) {
        this.number = 0
        this.maxDigit = maxDigit
        this.isShowSymbol = isShowSymbol

        this.sprites = []
        for (let i = 0; i < (maxDigit + 1); i++) {
            const sprite = scene.add.sprite(-17 * i, 0, 'number', 1)
            sprite.visible = false
            sprite.scale = 1.3
            this.sprites.push(sprite)
        }


        this.container = scene.add.container(x, y, this.sprites)
    }

    getSprite() {
        return this.container
    }

    setNumber(number) {
        this.number = parseInt(number)

        let digitNumber = this.number
        let displayDigit = 0
        for (let i = 0; i < this.maxDigit; i++) {
            let currentDigit = digitNumber % 10
            if ((i > 0) && (currentDigit < 1)) {
                this.sprites[i].visible = false
            } else {
                this.sprites[i].visible = true
                this.sprites[i].setFrame(digitNumber % 10)
                displayDigit++
            }
            digitNumber /= 10
        }

        if (this.isShowSymbol) {
            if (number > 0) {
                this.sprites[displayDigit].setFrame(10)
                this.sprites[displayDigit].visible = true
            } else if (number < 0) {
                this.sprites[displayDigit].setFrame(11)
                this.sprites[displayDigit].visible = true
            } else {
                this.sprites[displayDigit].visible = false
            }
        } else {
            this.sprites[displayDigit].visible = false
        }

    }

    getNumber() {
        return this.number
    }
}