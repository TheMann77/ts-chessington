import Piece from './piece';
import Player from '../player';
import Board from '../board';
import Square from "../square";
import {moveWithDirection} from "../helperFunctions";

export default class Rook extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        const moves =  [];
        const currentPosition = board.findPiece(this);

        const moveDirections = [[-1,0],[0,-1],[0,1],[1,0]]

        for (let direction of moveDirections) {
            moves.push(...moveWithDirection(direction[0], direction[1], currentPosition, board, this.player))
        }

        return moves;
    }
}
