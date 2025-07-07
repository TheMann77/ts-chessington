import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square'
import {moveByVector} from "../helperFunctions";

export default class Pawn extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        let moves =  new Array(0);
        let current_location = board.findPiece(this);
        if (this.player === Player.WHITE) {
            let moves_to_add = moveByVector(1,0,current_location, board)
            if (moves_to_add.length > 0) {
                moves.push(...moves_to_add);
                if (current_location.row === 1) {
                    moves.push(...moveByVector(2,0,current_location, board));
                }
            }
        } else {
            let moves_to_add = moveByVector(-1,0,current_location, board)
            if (moves_to_add.length > 0) {
                moves.push(...moves_to_add);
                if (current_location.row === 6) {
                    moves.push(...moveByVector(-2,0,current_location, board));
                }
            }
        }
        return moves;
    }
}
