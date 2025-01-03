
class HeroWord {
    constructor(duel, player, x, y) {
        //
        this.duel = duel
        const scene = this.duel.getScene()

        this.heroWordFrame = scene.add.image(80, -30, 'hero_word')
        this.heroWordText = scene.add.text(80, -30, '', { fontSize: '14px', fill: '#000' }).setOrigin(0.5, 0.5)

        this.sprite = scene.add.container(x, y, [
            this.heroWordFrame,
            this.heroWordText,
        ])

        this.sprite.visible = false
    }

    show(text) {
console.log('HERO WORD **** SHOW ****', text)


        this.heroWordText.text = text
        this.sprite.visible = true
    }

}

export default HeroWord
