import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from "../square";
import {moveWithDirection} from "../helperFunctions";

export default class Bishop extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        let moves =  new Array(0);
        let current_location = board.findPiece(this);

        moves.push(...moveWithDirection(-1, -1, current_location))
        moves.push(...moveWithDirection(1, 1, current_location))
        moves.push(...moveWithDirection(1, -1, current_location))
        moves.push(...moveWithDirection(-1, 1, current_location))

        return moves;
    }
}
