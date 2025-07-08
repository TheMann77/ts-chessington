import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from '../square'
import {movePawnByVector} from "../helperFunctions";

export default class Pawn extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        const moves =  [];
        const currentPosition = board.findPiece(this);

        const forward = this.player === Player.WHITE ? 1 : -1
        const pawnStartRow = this.player === Player.WHITE ? board.whitePawnStartRow : board.blackPawnStartRow;

        let singleSquareMoves = movePawnByVector(forward,0,currentPosition, board, this.player)
        if (singleSquareMoves.length > 0) {
            moves.push(...singleSquareMoves);
            if (currentPosition.row === pawnStartRow) {
                moves.push(...movePawnByVector(2*forward,0,currentPosition, board, this.player));
            }
        }
        moves.push(...movePawnByVector(forward,1,currentPosition, board, this.player))
        moves.push(...movePawnByVector(forward,-1,currentPosition, board, this.player))

        return moves;
    }
}
