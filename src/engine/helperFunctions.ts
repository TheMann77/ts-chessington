import Board from './board';
import Square from './square';
import Player from "./player";
import Rook from "./pieces/rook";

export function moveWithDirection(moveByRows: number, moveByColumns: number, currentPosition: Square, board: Board, player: Player) {
    const moves = [];
    let newPositionRow = currentPosition.row + moveByRows;
    let newPositionColumn = currentPosition.col + moveByColumns;
    let haveHitPiece = false

    while (newPositionRow >= board.minCol && newPositionRow <= board.maxCol && newPositionColumn >= board.minRow && newPositionColumn <= board.maxRow && !haveHitPiece) {
        let square = Square.at(newPositionRow, newPositionColumn);
        let piece = board.getPiece(square);
        if (!piece) {
            if (!board.inCheck(player, currentPosition, square)) {
                moves.push(square);
            }
            newPositionRow += moveByRows;
            newPositionColumn += moveByColumns;
        } else {
            if (piece.player !== player) {
                if (!board.inCheck(player, currentPosition, square)) {
                    moves.push(square);
                }
            }
            haveHitPiece = true;
        }
    }

    return moves;
}

export function moveByVector(moveByRows: number, moveByColumns: number, currentPosition: Square, board: Board, player: Player) {
    let newRow = currentPosition.row + moveByRows;
    let newColumn = currentPosition.col + moveByColumns;
    if (newRow >= board.minCol && newRow <= board.maxCol && newColumn >= board.minRow && newColumn <= board.maxRow) {
        let square = Square.at(newRow, newColumn);
        let piece = board.getPiece(square);
        if (!board.inCheck(player, currentPosition, square)) {
            if (!piece) {
                return [square];
            } else if (piece.player !== player) {
                return [square];
            }
        }
    }
    return [];
}

export function movePawnByVector(moveByRows: number, moveByColumns: number, currentPosition: Square, board: Board, player: Player) {
    let newRow = currentPosition.row + moveByRows;
    let newColumn = currentPosition.col + moveByColumns;
    let pawnIsTaking = (moveByColumns !== 0);
    if (newRow >= board.minCol && newRow <= board.maxCol && newColumn >= board.minRow && newColumn <= board.maxRow) {
        let newPosition = Square.at(newRow, newColumn);
        let piece = board.getPiece(newPosition);
        if (!board.inCheck(player, currentPosition, newPosition)) {
            if (!piece) {
                if (!pawnIsTaking || newColumn === board.enPassantCol) {
                    return [newPosition];
                }
            } else if (piece.player !== player && pawnIsTaking) {
                    return [newPosition];
            }
        }
    }
    return [];
}

export function castles(board: Board, player: Player) {
    const castlingRow = player === Player.WHITE ? board.minRow : board.maxRow;
    const moves = [];

    function squaresBlocked(leftSquareColumn: number, rightSquareColumn: number) {
        for (let i = leftSquareColumn; i <= rightSquareColumn; i++) {
            if (!!board.getPiece(Square.at(castlingRow, i))) {
                return true
            }
        }
        return false;
    }

    function squaresChecked(leftSquareColumn: number, rightSquareColumn: number) {
        for (let i = leftSquareColumn; i <= rightSquareColumn; i++) {
            if (board.inCheck(player, Square.at(castlingRow, 4), Square.at(castlingRow, i))) {
                return true
            }
        }
        return false;
    }

    if ((player === Player.WHITE && board.whiteShortCastle) || (player === Player.BLACK && board.blackShortCastle)) {
        const rook = board.getPiece(Square.at(castlingRow, board.maxCol));
        if (rook instanceof Rook && rook.player === player) {
            if (!squaresBlocked(5, 6) && !squaresChecked(4,6)) {
                moves.push(Square.at(castlingRow, 6));
            }
        }
    }
    if ((player === Player.WHITE && board.whiteLongCastle) || (player === Player.BLACK && board.blackLongCastle)) {
        const rook = board.getPiece(Square.at(castlingRow, board.minCol));
        if (rook instanceof Rook && rook.player === player) {
            if (!squaresBlocked(1, 3) && !squaresChecked(2,4)) {
                moves.push(Square.at(castlingRow, 2));
            }
        }
    }
    return moves;
}