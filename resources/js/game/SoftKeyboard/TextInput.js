const CharWidth = 50

export default class TextInput {

    constructor(scene) {
        this.scene = scene
        this.text = ''
        this.cursorPosition = 0

        this.inputList = []

        for(let i = 0; i < 10; i++) {
            const inputCahr = this.scene.add.text(i * CharWidth, 0, '', { fontSize: '50px', fill: '#000' }).setPadding(0, 4, 0, 4);
            this.inputList.push(inputCahr)
        }

        this.cursor = scene.add.image(
            0, 0,
            'key_cursor'
        )

        this.cursor.scale = 0.4
        this.cursor.y = 30

        scene.tweens.chain({
            targets:  this.cursor,
            repeat: -1,
            yoyo: true,
            tweens: [
                {
                    alpha: 1.0,
                    duration: 200,
                    ease: 'power1',
                },
                {
                    delay: 1000,
                    alpha: 0.0,
                    duration: 50,
                    ease: 'power1',
                },
                {
                    delay: 1000,
                    alpha: 0.0,
                    duration: 50,
                    ease: 'power1',
                },
                {
                    alpha: 1.0,
                    duration: 50,
                    ease: 'power1',
                },
            ],
        })

        this.sprite = scene.add.container(50, 20, this.inputList)
        this.sprite.add([
            //this.inputText,
            this.cursor,
        ])


        //
    }

    add(text) {
        if (this.cursorPosition >= (this.inputList.length - 1)) {
            return
        }

        const textObj = this.inputList[this.cursorPosition]
        textObj.text = text

        this.cursorPosition++
        this.text += '' + text
        this.update()
    }

    del() {
        textObj.text = ''
        this.cursorPosition--
        this.text = this.text.substring(0, -1)
        this.update()
    }

    update() {
        //this.inputText.text = this.text

        this.cursor.x = this.cursorPosition * CharWidth
        //this.cursor.x = (this.text.length) * 50

console.log(this.inputText)

    }
}