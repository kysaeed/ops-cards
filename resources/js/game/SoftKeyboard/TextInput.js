export default class TextInput {

    constructor(scene) {
        this.scene = scene
        this.text = ''

        this.inputText = scene.add.text(0, 0, this.text, { fontSize: '50px', fill: '#000' }).setPadding(0, 4, 0, 4);
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

        this.sprite = scene.add.container(50, 20, [
            this.inputText,
            this.cursor,
        ])


        //
    }

    add(text) {
        this.text += '' + text
        this.update()
    }

    del() {
        this.text = this.text.substring(0, -1)
        this.update()
    }

    update() {
        this.inputText.text = this.text
        this.cursor.x = (this.text.length) * 50

console.log(this.inputText)

    }
}