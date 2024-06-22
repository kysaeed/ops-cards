import Const from '../Const.js'

import SetupPhase from './SetupPhase.js'
import DrawPhase from './DrawPhase.js'
import AttackPhase from './AttackPhase.js'
import TurnChangePhase from './TurnChangePhase.js'
import EndPhase from './EndPhase.js'


// constants
const Bevel = Const.Bevel
const HeightBase = 100
const WidthBase = -30



const phase = {
    SetupPhase,
    DrawPhase,
    AttackPhase,
    TurnChangePhase,
    EndPhase,
}

export default phase
