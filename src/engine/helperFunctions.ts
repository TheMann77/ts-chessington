import Board from './board';
import Square from './square';
import Player from "./player";
import Rook from "./pieces/rook";

export function moveWithDirection(x: number, y: number, current_location: Square, board: Board, player: Player) {
    let moves =  new Array(0);
    let i = current_location.row + x;
    let j = current_location.col + y;
    let hit_piece = false


    while (i >= board.minCol && i <= board.maxCol && j >= board.minRow && j <= board.maxRow && !hit_piece) {
        let square = Square.at(i, j);
        let piece = board.getPiece(square);
        if (!piece) {
            moves.push(square);
            i += x;
            j += y;
        } else {
            if (piece.player !== player) {
                moves.push(square);
            }
            hit_piece = true;
        }


    }

    return moves;
}

export function moveByVector(x: number, y: number, current_location: Square, board: Board, player: Player, is_pawn: boolean) {
    let new_x = current_location.row + x;
    let new_y = current_location.col + y;
    let non_taking_pawn = is_pawn && (y === 0);
    let taking_pawn = is_pawn && (y !== 0);
    if (new_x >= board.minCol && new_x <= board.maxCol && new_y >= board.minRow && new_y <= board.maxRow) {
        let square = Square.at(new_x, new_y);
        let piece = board.getPiece(square);
        if (!piece) {
            if (!taking_pawn) {
                return [square];
            } else if (new_y === board.enPassantCol){
                return [square];
            }
        } else if (piece.player !== player) {
            if (!non_taking_pawn) {
                return [square];
            }
        }
    }
    return [];
}

export function castles(board: Board, player: Player) {
    const row = player === Player.WHITE ? board.minRow : board.maxRow;
    let moves =  new Array(0);
    console.log(board.blackShortCastle, board.blackLongCastle)

    if (((player === Player.WHITE && board.whiteShortCastle) || (player === Player.BLACK && board.blackShortCastle))) {
        const rook = board.getPiece(Square.at(row, board.maxCol));
        if (rook instanceof Rook && rook.player === player) {
            let inWay = false;
            for (let i = 5; i < board.maxCol; i++) {
                if (!!board.getPiece(Square.at(row, i))) {
                    inWay = true;
                }
            }
            if (!inWay) {
                moves.push(Square.at(row, 6));
            }
        }
    }
    if ((player === Player.WHITE && board.whiteLongCastle) || (player === Player.BLACK && board.blackLongCastle)) {
        const rook = board.getPiece(Square.at(row, board.minCol));
        if (rook instanceof Rook && rook.player === player) {
            let inWay = false;
            for (let i = 3; i > board.minCol; i--) {
                if (!!board.getPiece(Square.at(row, i))) {
                    inWay = true;
                }
            }
            if (!inWay) {
                moves.push(Square.at(row, 2));
            }
        }
    }
    return moves;
}