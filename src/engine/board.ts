import Player from './player';
import GameSettings from './gameSettings';
import gameSettings from './gameSettings';
import Square from './square';
import Piece from './pieces/piece';
import Pawn from "./pieces/pawn";
import King from "./pieces/king";
import Rook from "./pieces/rook";

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

    public constructor(currentPlayer?: Player) {
        this.currentPlayer = currentPlayer ? currentPlayer : Player.WHITE;
        this.board = this.createBoard();
        this.maxCol = gameSettings.BOARD_SIZE-1;
        this.maxRow = gameSettings.BOARD_SIZE-1;
        this.minCol = 0;
        this.minRow = 0;
        this.whitePawnStartRow = 1;
        this.blackPawnStartRow = this.maxRow - 1;
        this.enPassantCol = undefined;
        this.whiteShortCastle = true;
        this.whiteLongCastle = true;
        this.blackShortCastle = true;
        this.blackLongCastle = true;
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
            if (movingPiece instanceof Pawn && Math.abs(fromSquare.col - toSquare.col) === 1 && !this.getPiece(toSquare)) {
                if (movingPiece.player === Player.WHITE) {
                    this.setPiece(Square.at(toSquare.row-1, toSquare.col), undefined);
                } else {
                    this.setPiece(Square.at(toSquare.row+1, toSquare.col), undefined);
                }
            }

            this.setPiece(toSquare, movingPiece);
            this.setPiece(fromSquare, undefined);


            if (movingPiece instanceof Pawn && Math.abs(fromSquare.row - toSquare.row) === 2) {
                this.enPassantCol = toSquare.col;
            } else {
                this.enPassantCol = undefined;
            }

            if (movingPiece instanceof King) {
                if (this.currentPlayer === Player.WHITE) {
                    this.whiteShortCastle = false;
                    this.whiteLongCastle = false;
                } else {
                    this.blackShortCastle = false;
                    this.blackLongCastle = false;
                }

                if (toSquare.col - fromSquare.col === 2) {
                    const rook = this.getPiece(Square.at(toSquare.row, toSquare.col+1));
                    this.setPiece(Square.at(toSquare.row, toSquare.col-1), rook);
                    this.setPiece(Square.at(toSquare.row, toSquare.col+1), undefined);
                } else if (toSquare.col - fromSquare.col === -2) {
                    const rook = this.getPiece(Square.at(toSquare.row, toSquare.col-2));
                    this.setPiece(Square.at(toSquare.row, toSquare.col+1), rook);
                    this.setPiece(Square.at(toSquare.row, toSquare.col-2), undefined);
                }
            } else if (movingPiece instanceof Rook) {
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



    }

    private createBoard() {
        const board = new Array(GameSettings.BOARD_SIZE);
        for (let i = 0; i < board.length; i++) {
            board[i] = new Array(GameSettings.BOARD_SIZE);
        }
        return board;
    }
}
