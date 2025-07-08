import Piece from './piece';
import Player from '../player';
import Board from '../board';
import {castles, moveByVector, moveWithDirection} from "../helperFunctions";

export default class King extends Piece {
    public constructor(player: Player) {
        super(player);
    }

    public getAvailableMoves(board: Board) {
        const moves =  [];
        const currentPosition = board.findPiece(this);

        const moveDirections = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]

        for (let direction of moveDirections) {
            moves.push(...moveByVector(direction[0], direction[1], currentPosition, board, this.player))
        }

        moves.push(...castles(board, this.player))

        return moves;
    }
}
