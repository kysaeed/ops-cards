
const heroX = 0 + (-55)
const heroY = 232


class Hero {
    constructor(duel, player) {

        const scene = duel.getScene()

        const direction = player.getDirection()

        let text = player.getName()
console.log('*****' + text)
        this.heroImage = scene.add.image(0, 0, 'hero')
        this.heroImage.scale = 0.8

        this.name = scene.add.text(-20, 30, text, { fontSize: '18px', fill: '#000' })

        this.sprite = scene.add.container(heroX * direction, heroY * direction, [
            this.heroImage,
            this.name,
        ])

        const board = duel.getCardBoard()
        board.add(this.sprite)
    }

}

export default Hero
