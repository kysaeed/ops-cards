import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

import CardList from '../game/CardList.js'

// console.log(CardList)

const data = {}

writeFileSync(
    './resources/settings/cards.json',
    JSON.stringify(CardList, null, 4),
)