import Board from './board';
import Square from './square';
import Player from "./player";
import Rook from "./pieces/rook";

export function moveWithDirection(moveByRows: number, moveByColumns: number, currentPosition: Square, board: Board, player: Player) {
    const moves =  [];
    let newPositionRow = currentPosition.row + moveByRows;
    let newPositionColumn = currentPosition.col + moveByColumns;
    let haveHitPiece = false

    while (newPositionRow >= board.minCol && newPositionRow <= board.maxCol && newPositionColumn >= board.minRow && newPositionColumn <= board.maxRow && !haveHitPiece) {
        let square = Square.at(newPositionRow, newPositionColumn);
        let piece = board.getPiece(square);
        if (!piece) {
            if (board.isCopy || !board.inCheck(player, currentPosition, square)) {
                moves.push(square);
            }
            newPositionRow += moveByRows;
            newPositionColumn += moveByColumns;
        } else {
            if (piece.player !== player) {
                if (board.isCopy || !board.inCheck(player, currentPosition, square)) {
                    moves.push(square);
                }
            }
            haveHitPiece = true;
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
        if (board.isCopy || !board.inCheck(player, current_location, square)) {
            if (!piece) {
                if (!taking_pawn) {
                    return [square];
                } else if (new_y === board.enPassantCol) {
                    return [square];
                }
            } else if (piece.player !== player) {
                if (!non_taking_pawn) {
                    return [square];
                }
            }
        }
    }
    return [];
}

export function castles(board: Board, player: Player) {
    const row = player === Player.WHITE ? board.minRow : board.maxRow;
    let moves =  new Array(0);

    if (((player === Player.WHITE && board.whiteShortCastle) || (player === Player.BLACK && board.blackShortCastle))) {
        const rook = board.getPiece(Square.at(row, board.maxCol));
        if (rook instanceof Rook && rook.player === player) {
            let castlingBlocked = false;
            for (let i = 4; i < board.maxCol; i++) {
                if (i !== 4 && !!board.getPiece(Square.at(row, i))) {
                    castlingBlocked = true;
                } else if (!board.isCopy && board.inCheck(player, Square.at(row, 4), Square.at(row, i))) {
                    castlingBlocked = true;
                }
            }
            if (!castlingBlocked) {
                moves.push(Square.at(row, 6));
            }
        }
    }
    if ((player === Player.WHITE && board.whiteLongCastle) || (player === Player.BLACK && board.blackLongCastle)) {
        const rook = board.getPiece(Square.at(row, board.minCol));
        if (rook instanceof Rook && rook.player === player) {
            let castlingBlocked = false;
            for (let i = 3; i > board.minCol; i--) {
                if (i !== 4 && !!board.getPiece(Square.at(row, i))) {
                    castlingBlocked = true;
                } else if (i >= 2 && !board.isCopy && board.inCheck(player, Square.at(row, 4), Square.at(row, i))) {
                    castlingBlocked = true;
                }
            }
            if (!castlingBlocked) {
                moves.push(Square.at(row, 2));
            }
        }
    }
    return moves;
}