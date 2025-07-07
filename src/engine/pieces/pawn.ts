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
            moves.push(...moveByVector(1,0,current_location));
            if (current_location.row === 1) {
                moves.push(...moveByVector(2,0,current_location));
            }
        } else {
            moves.push(...moveByVector(-1,0,current_location));
            if (current_location.row === 6) {
                moves.push(...moveByVector(-2,0,current_location));
            }
        }
        moves.push();
        return moves;
    }
}
