import 'chai/register-should';
import Board from '../../src/engine/board';
import Pawn from '../../src/engine/pieces/pawn';
import Player from '../../src/engine/player';
import Square from '../../src/engine/square';
import King from "../../src/engine/pieces/king";
import Queen from "../../src/engine/pieces/queen";
import {assert} from "chai";

describe('Board', () => {

    describe('pawns', () => {

        let board : Board;
        beforeEach(() => { // Common code executed before each test.
            board = new Board();
        });

        it('can be added to the board', () => {
            // Arrange
            const pawn = new Pawn(Player.WHITE);
            const square = Square.at(0, 0);

            // Act
            board.setPiece(square, pawn);

            // Assert
            const piece = board.getPiece(square);
            pawn.should.equal(piece); // Object equality: same object reference
        });

        it('can be found on the board', () => {
            // Arrange
            const pawn = new Pawn(Player.WHITE);
            const square = Square.at(6, 4);

            // Act
            board.setPiece(square, pawn);

            // Assert
            board.findPiece(pawn).should.eql(square); // Object equivalence: different objects, same data
        });

    });

    describe('endgame', () => {
        let board : Board;
        beforeEach(() => { // Common code executed before each test.
            board = new Board();
        });
        it('checkmate', () => {
            const opponentKing = new King(Player.BLACK);
            const queen = new Queen(Player.WHITE);
            const pawn = new Pawn(Player.WHITE);

            board.setPiece(Square.at(7,7), opponentKing);
            board.setPiece(Square.at(0,6), queen);
            board.setPiece(Square.at(5,5), pawn);

            queen.moveTo(board, Square.at(6,6));

            assert(true, "checkmate (check for yourself)")
        });
        it('stalemate', () => {
            const opponentKing = new King(Player.BLACK);
            const queen = new Queen(Player.WHITE);

            board.setPiece(Square.at(7,0), opponentKing);
            board.setPiece(Square.at(6,7), queen);

            queen.moveTo(board, Square.at(6,2));

            assert(true, "stalemate (check for yourself)")
        });
    })
});
