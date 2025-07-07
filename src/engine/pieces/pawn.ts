import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square'

export default class Pawn extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        let moves =  new Array(0);
        let current_location = board.findPiece(this);
        if (this.player === Player.WHITE) {
            moves.push(Square.at(current_location.row+1, current_location.col));
        } else {
            moves.push(Square.at(current_location.row-1, current_location.col));
        }
        moves.push();
        return moves;
    }
}
