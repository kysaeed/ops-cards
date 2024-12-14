/**
 * https://bodoge.hoobby.net/games/challengers/strategies/41250
 * https://www.well-boardgame.com/challengers-rule/
 */

/*
power = (addPower) => {
  return {
    power: addPower,
    text: `攻撃時：パワー +${addPower}`,
  }
}
*/


const CardTypeList = [
  {
    type: 0,
    name: "",
  },
  {
    type: 1,
    name: "魔術",
  },
];

const CardList = [

  {
      power: 1,
      name: '影',
      image: 'ch_kage',
      type: 1,
  },
  {
      power: 2,
      name: '二匹の蛇',
      image: 'ch_snake',
      type: 0,
    },
    {
      power: 3,
      name: '魔術師',
      image: 'ch_magi',
      type: 1,
    },
    {
      power: 4,
      name: '月',
      image: 'ch_moon',
      type: 1,
    },
    {
      power: 5,
      name: 'カカシ',
      image: 'ch_scarecrow',
      type: 0,
      ability: {
        defense: {
          power: 1,
        }
      },
      text: "守備時：パワー +1",
    },
    {
      power: 2,
      name: '車輪',
      image: 'ch_whell',
      type: 0,
      ability: {
        attack: {
          power: 1,
        }
      },
      text: "攻撃時：パワー +1",
    },
    {
      power: 1,
      name: '犬',
      image: 'ch_dog',
      type: 0,
    },
    {
      power: 4,
      name: 'ねこ',
      image: 'cat',
      type: 0,
    },
    {
      power: 6,
      name: '目玉',
      image: 'ch_eye',
      type: 0,
    },
    {
      power: 4,
      name: '月',
      image: 'ch_moon',
      type: 0,
    },
    {
      power: 4,
      name: 'モノリス',
      image: 'ch_mono',
      type: 0,
    },
    {
      power: 1,
      name: '道化',
      image: 'ch_clown',
      type: 0,
    },
    {
      power: 1,
      name: 'オドラデク',
      image: 'ch_oddc',
      type: 0,
    },
    {
      power: 1,
      name: 'フラスコ',
      image: 'ch_frasco',
      type: 0,
    },
    {
      power: 4,
      name: '彗星',
      image: 'ch_star',
      type: 0,
    },
    {
      power: 4,
      name: '質量兵器',
      image: 'ch_mass',
      type: 0,
    },
    {
      power: 1,
      name: '凹凸',
      image: 'ch_db',
      type: 0,
    },
    {
      power: 2,
      name: '機械仕掛け',
      image: 'ch_machine',
      type: 0,
    },
    {
      power: 1,
      name: '尖兵',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '番兵',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '伝令',
      image: 'chara',
      type: 0,
    },

    {
      power: 1,
      name: '動く森',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '井戸',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '風車',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: 'バク',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: 'フォーク',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '蜉蝣',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '予言の書',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: 'パレード',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '聖人',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '大砲',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '城',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '夢',
      image: 'chara',
      type: 0,
    },
    {
      power: 1,
      name: '科学者',
      image: 'chara',
      type: 0,
    },



];

export default CardList;