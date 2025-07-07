import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from "../square";

export default class Rook extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        let moves =  new Array(0);
        let current_location = board.findPiece(this);
        let current_row = current_location.row;
        let current_col = current_location.col;

        for (let i = current_row - 1; i >= 0; i--) {
            moves.push(Square.at(i, current_col));
        }
        for (let i = current_row + 1; i <= 7; i++) {
            moves.push(Square.at(i, current_col));
        }
        for (let i = current_col - 1; i >= 0; i--) {
            moves.push(Square.at(current_row, i));
        }
        for (let i = current_col + 1; i <= 7; i++) {
            moves.push(Square.at(current_row, i));
        }

        moves.push();
        return moves;
    }
}
