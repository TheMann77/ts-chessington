import Board from './board';
import Square from './square';
import player from "./player";

export function moveWithDirection(x: number, y: number, current_location: Square) {
    let moves =  new Array(0);
    let i = current_location.row + x;
    let j = current_location.col + y;

    while (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
        moves.push(Square.at(i, j));
        i += x;
        j += y;
    }

    return moves;
}

export function moveByVector(x: number, y: number, current_location: Square, board: Board) {
    if (current_location.row >= 0 && current_location.row <= 7 && current_location.col >= 0 && current_location.col <= 7) {
        let square = Square.at(current_location.row + x, current_location.col + y);

        if (!board.getPiece(square)) {
            console.log(board.getPiece(square))
            return [square];
        }
        return [];
    } else {
        return [];
    }
}