import Piece from './piece';
import Player from '../player';
import Board from '../board';
import {castles, moveByVector} from "../helperFunctions";

export default class King extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        let moves =  new Array(0);
        let current_location = board.findPiece(this);

        moves.push(...moveByVector(-1, 0, current_location, board, this.player, false))
        moves.push(...moveByVector(1, 0, current_location, board, this.player, false))
        moves.push(...moveByVector(0, -1, current_location, board, this.player, false))
        moves.push(...moveByVector(0, 1, current_location, board, this.player, false))
        moves.push(...moveByVector(-1, -1, current_location, board, this.player, false))
        moves.push(...moveByVector(1, 1, current_location, board, this.player, false))
        moves.push(...moveByVector(1, -1, current_location, board, this.player, false))
        moves.push(...moveByVector(-1, 1, current_location, board, this.player, false))

        console.log(castles(board, this.player))
        moves.push(...castles(board, this.player))

        return moves;
    }
}
