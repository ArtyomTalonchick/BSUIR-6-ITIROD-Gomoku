const gameResultStatuses = {
    WIN: 'WIN',
    DEFEAT: 'DEFEAT',
    DRAW: 'DRAW'
};

export const statusesSettings = {
    [gameResultStatuses.WIN]: {
        text: 'Win',
        style: 'win'
    },
    [gameResultStatuses.DEFEAT]: {
        text: 'Defeat',
        style: 'defeat'
    },
    [gameResultStatuses.DRAW]: {
        text: 'Draw',
        style: 'draw'
    }
};

export default gameResultStatuses;
