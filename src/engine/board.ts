import Player from './player';
import GameSettings from './gameSettings';
import gameSettings from './gameSettings';
import Square from './square';
import Piece from './pieces/piece';
import Pawn from "./pieces/pawn";
import King from "./pieces/king";
import Rook from "./pieces/rook";
import Queen from "./pieces/queen";

export default class Board {
    public currentPlayer: Player;
    private readonly board: (Piece | undefined)[][];
    public maxCol: number;
    public maxRow: number;
    public whitePawnStartRow: number;
    public blackPawnStartRow: number;
    public minCol: number;
    public minRow: number;
    public enPassantCol: number | undefined;
    public whiteShortCastle: boolean;
    public whiteLongCastle: boolean;
    public blackShortCastle: boolean;
    public blackLongCastle: boolean;
    public isCopy: boolean;

    public constructor(currentPlayer?: Player, board?: (Piece | undefined)[][]) {
        this.currentPlayer = currentPlayer ? currentPlayer : Player.WHITE;
        this.board = board ? board : this.createBoard();
        this.maxCol = gameSettings.BOARD_SIZE - 1;
        this.maxRow = gameSettings.BOARD_SIZE - 1;
        this.minCol = 0;
        this.minRow = 0;
        this.whitePawnStartRow = 1;
        this.blackPawnStartRow = this.maxRow - 1;
        this.enPassantCol = undefined;
        this.whiteShortCastle = true;
        this.whiteLongCastle = true;
        this.blackShortCastle = true;
        this.blackLongCastle = true;
        this.isCopy = false;
    }

    public setPiece(square: Square, piece: Piece | undefined) {
        this.board[square.row][square.col] = piece;
    }

    public getPiece(square: Square) {
        return this.board[square.row][square.col];
    }

    public findPiece(pieceToFind: Piece) {
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] === pieceToFind) {
                    return Square.at(row, col);
                }
            }
        }
        throw new Error('The supplied piece is not on the board');
    }

    public movePiece(fromSquare: Square, toSquare: Square) {
        const movingPiece = this.getPiece(fromSquare);
        if (!!movingPiece && movingPiece.player === this.currentPlayer) {

            //Take pawn in en Passant:
            if (movingPiece instanceof Pawn && Math.abs(fromSquare.col - toSquare.col) === 1 && !this.getPiece(toSquare)) {
                if (movingPiece.player === Player.WHITE) {
                    this.setPiece(Square.at(toSquare.row - 1, toSquare.col), undefined);
                } else {
                    this.setPiece(Square.at(toSquare.row + 1, toSquare.col), undefined);
                }
            }

            this.setPiece(toSquare, movingPiece);
            this.setPiece(fromSquare, undefined);


            if (movingPiece instanceof Pawn && Math.abs(fromSquare.row - toSquare.row) === 2) {
                this.enPassantCol = toSquare.col;
            } else {
                this.enPassantCol = undefined;
            }

            if (movingPiece instanceof Pawn) {
                if (toSquare.row === this.minRow || toSquare.row === this.maxRow) {
                    this.setPiece(toSquare, new Queen(movingPiece.player));
                }
            }

            if (movingPiece instanceof King) {
                if (this.currentPlayer === Player.WHITE) {
                    this.whiteShortCastle = false;
                    this.whiteLongCastle = false;
                } else {
                    this.blackShortCastle = false;
                    this.blackLongCastle = false;
                }

                //Move rook in castling:
                if (toSquare.col - fromSquare.col === 2) {
                    const rook = this.getPiece(Square.at(toSquare.row, toSquare.col + 1));
                    this.setPiece(Square.at(toSquare.row, toSquare.col - 1), rook);
                    this.setPiece(Square.at(toSquare.row, toSquare.col + 1), undefined);
                } else if (toSquare.col - fromSquare.col === -2) {
                    const rook = this.getPiece(Square.at(toSquare.row, toSquare.col - 2));
                    this.setPiece(Square.at(toSquare.row, toSquare.col + 1), rook);
                    this.setPiece(Square.at(toSquare.row, toSquare.col - 2), undefined);
                }
            }

            if (movingPiece instanceof Rook) {
                if (this.currentPlayer === Player.WHITE) {
                    if (fromSquare.row === this.minRow && fromSquare.col == this.minCol) {
                        this.whiteLongCastle = false;
                    } else if (fromSquare.row === this.minRow && fromSquare.col == this.maxCol) {
                        this.whiteShortCastle = false;
                    }
                } else {
                    if (fromSquare.row === this.maxRow && fromSquare.col == this.minCol) {
                        this.blackLongCastle = false;
                    } else if (fromSquare.row === this.maxRow && fromSquare.col == this.maxCol) {
                        this.blackShortCastle = false;
                    }
                }
            }
            this.currentPlayer = (this.currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE);
        }


        //Note: player has already changed here
        if (!this.isCopy && !this.hasMove()) {
            if (this.inCheck(this.currentPlayer)) {
                console.log((this.currentPlayer === Player.WHITE ? "Black" : "White") + " wins");
            } else {
                console.log("Draw by stalemate");
            }
        }

    }

    public inCheck(player: Player, squareFrom: Square | undefined = undefined, squareTo: Square | undefined = undefined) {
        if (this.isCopy) {
            return false
        }

        const opp: Player = player === Player.WHITE ? Player.BLACK : Player.WHITE;
        let newBoard: Board = this.copy(player);
        if (!!squareFrom && !!squareTo) {
            newBoard.movePiece(squareFrom, squareTo);
        }

        const kingSquare: Square | undefined = newBoard.findKing(player);

        if (kingSquare === undefined) {
            return false
        }

        const doesPieceAttackKing = (square: Square) => {

            let piece = newBoard.getPiece(square)
            if (!piece || piece.player !== opp) {
                return false;
            }
            return newBoard.contains(piece.getAvailableMoves(newBoard), kingSquare);
        }

        for (let i = newBoard.minRow; i <= newBoard.maxRow; i++) {
            for (let j = newBoard.minCol; j <= newBoard.maxRow; j++) {
                if (doesPieceAttackKing(Square.at(i, j))) {
                    return true
                }
            }
        }
        return false;
    }

    private findKing(player: Player) {
        for (let i = this.minRow; i <= this.maxRow; i++) {
            for (let j = this.minCol; j <= this.maxRow; j++) {
                let piece = this.getPiece(Square.at(i, j))
                if (!!piece && piece.player === player && piece instanceof King) {
                    return Square.at(i, j);
                }
            }
        }
        return undefined;
    }

    private contains(arr: Square[], elem: Square) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].equals(elem)) {
                return true;
            }
        }
        return false;
    }

    private createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board
    }

    private copy(player: Player) {
        const oldGrid = this.board;
        const newGrid: (Piece | undefined)[][] = oldGrid.map(row=>[...row]);
        const newBoard = new Board(player, newGrid);
        newBoard.isCopy = true;
        return newBoard;
    }

    private hasMove() {
        let pieceExists = false;
        for (let i = this.minRow; i <= this.maxRow; i++) {
            for (let j = this.minCol; j <= this.maxRow; j++) {
                let piece = this.getPiece(Square.at(i, j))
                if (!!piece && piece.player === this.currentPlayer) {
                    pieceExists = true;
                    if (piece.getAvailableMoves(this).length > 0) {
                        return true
                    }
                }
            }
        }
        return !pieceExists;

    }
}
