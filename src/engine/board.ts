import Player from './player';
import GameSettings from './gameSettings';
import gameSettings from './gameSettings';
import Square from './square';
import Piece from './pieces/piece';
import Pawn from "./pieces/pawn";

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
            this.currentPlayer = (this.currentPlayer === Player.WHITE ? Player.BLACK : Player.WHITE);

            if (movingPiece instanceof Pawn && Math.abs(fromSquare.row - toSquare.row) === 2) {
                this.enPassantCol = toSquare.col;
            } else {
                this.enPassantCol = undefined;
            }
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
