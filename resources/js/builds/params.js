import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import CardList from '../game/CardList.js'

let cardCount = 1;
CardList.map(card => {
    console.log(`Number:${cardCount} name:${card.name}`)
    cardCount++;
})

console.log('CardList length:', CardList.length)


writeFileSync(
    './resources/settings/cards.json',
    JSON.stringify(CardList, null, 4),
)