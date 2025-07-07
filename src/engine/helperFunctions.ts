import Board from './board';
import Square from './square';
import player from "./player";

export function moveWithDirection(x: number, y: number, current_location: Square, board: Board) {
    let moves =  new Array(0);
    let i = current_location.row + x;
    let j = current_location.col + y;
    let hit_piece = false


    while (i >= 0 && i <= 7 && j >= 0 && j <= 7 && !hit_piece) {
        let square = Square.at(i, j);

        if (!board.getPiece(square)) {
            moves.push(square);
            i += x;
            j += y;
        } else {
            hit_piece = true;
        }


    }

    return moves;
}

export function moveByVector(x: number, y: number, current_location: Square, board: Board) {
    let new_x = current_location.row + x;
    let new_y = current_location.col + y;
    if (new_x >= 0 && new_x <= 7 && new_y >= 0 && new_y <= 7) {
        let square = Square.at(new_x, new_y);

        if (!board.getPiece(square)) {
            console.log(board.getPiece(square))
            return [square];
        }
        return [];
    } else {
        return [];
    }
}