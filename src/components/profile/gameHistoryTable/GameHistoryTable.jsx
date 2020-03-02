import React from 'react';

import './GameHistoryTable.scss';
import {statusesSettings} from '../../../constants/gameResultStatuses';

export default class GameHistoryTable extends React.Component {

    render() {
        const dateFormatter = new Intl.DateTimeFormat('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });

        return (
            <div className='game-history-table-container'>
                <table>
                    <tbody>

                    {this.props.games.map(game =>
                        <tr key={game.date}>
                            <td className={statusesSettings[game.status].style}>
                                {statusesSettings[game.status].text}
                            </td>
                            <td>
                                {dateFormatter.format(game.date)}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        );
    }
}
