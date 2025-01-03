
const heroX = -55
const heroY = 232


class Hero {
    constructor(duel, player) {

        const scene = duel.getScene()

        const direction = player.getDirection()

        let text = player.getName()
        this.heroImage = scene.add.image(0, 0, 'hero')
        this.heroImage.scale = 0.8

        this.heroWord = scene.add.image(80, -30, 'hero_word')
        this.heroWordText = scene.add.text(80, -30, '平地が溢れた', { fontSize: '14px', fill: '#000' }).setOrigin(0.5, 0.5)

        this.name = scene.add.text(0, 45, text, { fontSize: '18px', fill: '#000' }).setOrigin(0.5, 0.5)

        this.sprite = scene.add.container(heroX * direction, heroY * direction, [
            this.heroImage,
            this.name,
            this.heroWord,
            this.heroWordText,
        ])

        const board = duel.getCardBoard()
        board.add(this.sprite)
    }

    setName(name) {
        this.name.setText(name)
    }

}

export default Hero
