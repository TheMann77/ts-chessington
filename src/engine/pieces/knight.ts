import Piece from './piece';
import Player from '../player';
import Board from '../board';
import {moveByVector} from "../helperFunctions";

export default class Knight extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        let moves =  new Array(0);
        let current_location = board.findPiece(this);

        let vs = [
            [2,1],
            [2,-1],
            [1,2],
            [1,-2],
            [-1,2],
            [-1,-2],
            [-2,1],
            [-2,-1]
        ]

        for (let i = 0; i < vs.length; i++) {
            moves.push(...moveByVector(vs[i][0], vs[i][1], current_location, board, this.player, false))
        }


        return moves;
    }
}
