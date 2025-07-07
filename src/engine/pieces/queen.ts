import Piece from './piece';
import Player from '../player';
import Board from '../board';
import {moveWithDirection} from "../helperFunctions";

export default class Queen extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        let moves =  new Array(0);
        let current_location = board.findPiece(this);

        moves.push(...moveWithDirection(-1, 0, current_location, board, this.player))
        moves.push(...moveWithDirection(1, 0, current_location, board, this.player))
        moves.push(...moveWithDirection(0, -1, current_location, board, this.player))
        moves.push(...moveWithDirection(0, 1, current_location, board, this.player))
        moves.push(...moveWithDirection(-1, -1, current_location, board, this.player))
        moves.push(...moveWithDirection(1, 1, current_location, board, this.player))
        moves.push(...moveWithDirection(1, -1, current_location, board, this.player))
        moves.push(...moveWithDirection(-1, 1, current_location, board, this.player))

        return moves;
    }
}
