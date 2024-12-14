
const EndPhase = {
    enter(duel, fetchData, onEnd) {
        console.log('EndPhase !!!!!')

        const textModal = duel.getScene().add.sprite(360, 200, 'modal')
        textModal.displayWidth = 400

        let text = ''


        const palyer = duel.getTurnPlayer()

        if (palyer.getPlayerId() == 0) {
            if (fetchData.judge > 0) {
                text = '勝ち'
            } else {
                text = '負け'
            }
        } else {
            if (fetchData.judge < 0) {
                text = '勝ち'
            } else {
                text = '負け'
            }
        }

        const endText = duel.getScene().add.text(360, 216, text, { fontSize: '32px', fill: '#000' });

    },

    onEvent(event, sender, params) {
        //

    },

}

export default EndPhase;