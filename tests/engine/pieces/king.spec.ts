import King from '../../../src/engine/pieces/king';
import Board from '../../../src/engine/board';
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';
import Pawn from '../../../src/engine/pieces/pawn';
import Rook from "../../../src/engine/pieces/rook";
import {assert} from "chai";

describe('King', () => {
    let board: Board;
    beforeEach(() => board = new Board());

    it('can move to adjacent squares', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [
            Square.at(2, 3), Square.at(2, 4), Square.at(2, 5), Square.at(3, 5),
            Square.at(4, 5), Square.at(4, 4), Square.at(4, 3), Square.at(3, 3)
        ];

        moves.should.deep.include.members(expectedMoves);
    });

    it('cannot make any other moves', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(3, 4), king);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(8);
    });

    it('cannot leave the board', () => {
        const king = new King(Player.WHITE);
        board.setPiece(Square.at(0, 0), king);

        const moves = king.getAvailableMoves(board);

        const expectedMoves = [Square.at(0, 1), Square.at(1, 1), Square.at(1, 0)];

        moves.should.have.deep.members(expectedMoves);
    });

    it('can take opposing pieces', () => {
        const king = new King(Player.WHITE);
        const opposingPiece = new Pawn(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.deep.include(Square.at(5, 5));
    });

    it.skip('cannot take the opposing king', () => {
        const king = new King(Player.WHITE);
        const opposingKing = new King(Player.BLACK);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), opposingKing);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    it('cannot take friendly pieces', () => {
        const king = new King(Player.WHITE);
        const friendlyPiece = new Pawn(Player.WHITE);
        board.setPiece(Square.at(4, 4), king);
        board.setPiece(Square.at(5, 5), friendlyPiece);

        const moves = king.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(5, 5));
    });

    it('white king can short castle', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 7), rook);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(6);
        moves.should.deep.include(Square.at(0,6));

        king.moveTo(board, Square.at(0, 6));
        assert(board.findPiece(king).equals(Square.at(0, 6)), "king at wrong place");
        assert(board.findPiece(rook).equals(Square.at(0, 5)), "rook at wrong place");
    });

    it('white king can long castle', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(6);
        moves.should.deep.include(Square.at(0,2));

        king.moveTo(board, Square.at(0, 2));

        assert(board.findPiece(king).equals(Square.at(0, 2)), "king at wrong place");
        assert(board.findPiece(rook).equals(Square.at(0, 3)), "rook at wrong place");
    });

    it('white king cannot castle after moving', () => {
        const king = new King(Player.WHITE);
        const rook1 = new Rook(Player.WHITE);
        const rook2 = new Rook(Player.WHITE);
        const oppKing = new King(Player.BLACK);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook1);
        board.setPiece(Square.at(0, 7), rook2);
        board.setPiece(Square.at(7,4), oppKing);

        king.moveTo(board, Square.at(0, 3));
        oppKing.moveTo(board, Square.at(7,3));
        king.moveTo(board, Square.at(0,4));

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(5);
        moves.should.not.deep.include(Square.at(0,2));
        moves.should.not.deep.include(Square.at(0,6));
    });

    it('white king cannot castle after rook moves', () => {
        const king = new King(Player.WHITE);
        const rook1 = new Rook(Player.WHITE);
        const rook2 = new Rook(Player.WHITE);
        const oppKing = new King(Player.BLACK);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 0), rook1);
        board.setPiece(Square.at(0, 7), rook2);
        board.setPiece(Square.at(7,4), oppKing);

        rook1.moveTo(board, Square.at(0, 1));
        oppKing.moveTo(board, Square.at(7,3));
        rook1.moveTo(board, Square.at(0,0));
        oppKing.moveTo(board, Square.at(7,4));
        rook2.moveTo(board, Square.at(0,6));
        oppKing.moveTo(board, Square.at(7,3));
        rook2.moveTo(board, Square.at(0,7));

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(5);
        moves.should.not.deep.include(Square.at(0,2));
        moves.should.not.deep.include(Square.at(0,6));
    });

    it('white king cannot castle under threat', () => {
        const king = new King(Player.WHITE);
        const rook = new Rook(Player.WHITE);
        const oppRook1 = new Rook(Player.BLACK);
        const oppRook2 = new Rook(Player.BLACK);+
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(0, 7), rook);
        board.setPiece(Square.at(7, 1), oppRook1);
        board.setPiece(Square.at(7, 6), oppRook2);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(5);
        moves.should.not.deep.include(Square.at(0,2));
        moves.should.not.deep.include(Square.at(0,6));
    });

    it('black king can short castle', () => {
        const king = new King(Player.BLACK);
        const rook = new Rook(Player.BLACK);
        const whiteKing = new King(Player.WHITE);
        board.setPiece(Square.at(7, 4), king);
        board.setPiece(Square.at(7, 7), rook);
        board.setPiece(Square.at(0,4), whiteKing);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(6);
        moves.should.deep.include(Square.at(7,6));

        whiteKing.moveTo(board, Square.at(0,3));
        king.moveTo(board, Square.at(7, 6));

        assert(board.findPiece(king).equals(Square.at(7, 6)), "king at wrong place");
        assert(board.findPiece(rook).equals(Square.at(7, 5)), "rook at wrong place");
    });

    it('black king can long castle', () => {
        const king = new King(Player.BLACK);
        const rook = new Rook(Player.BLACK);
        const whiteKing = new King(Player.WHITE);
        board.setPiece(Square.at(7, 4), king);
        board.setPiece(Square.at(7, 0), rook);
        board.setPiece(Square.at(0,4), whiteKing);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(6);
        moves.should.deep.include(Square.at(7,2));

        whiteKing.moveTo(board, Square.at(0,3));
        king.moveTo(board, Square.at(7, 2));

        assert(board.findPiece(king).equals(Square.at(7, 2)), "king at wrong place");
        assert(board.findPiece(rook).equals(Square.at(7, 3)), "rook at wrong place");
    });

    it('black king cannot castle after moving', () => {
        const king = new King(Player.BLACK);
        const rook1 = new Rook(Player.BLACK);
        const rook2 = new Rook(Player.BLACK);
        const oppKing = new King(Player.WHITE);
        board.setPiece(Square.at(7, 4), king);
        board.setPiece(Square.at(7, 0), rook1);
        board.setPiece(Square.at(7, 7), rook2);
        board.setPiece(Square.at(0,4), oppKing);

        oppKing.moveTo(board, Square.at(0,3));
        king.moveTo(board, Square.at(7, 3));
        oppKing.moveTo(board, Square.at(0,4));
        king.moveTo(board, Square.at(7,4));

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(5);
        moves.should.not.deep.include(Square.at(7,2));
        moves.should.not.deep.include(Square.at(7,6));
    });

    it('black king cannot castle after rook moves', () => {
        const king = new King(Player.BLACK);
        const rook1 = new Rook(Player.BLACK);
        const rook2 = new Rook(Player.BLACK);
        const oppKing = new King(Player.WHITE);
        board.setPiece(Square.at(7, 4), king);
        board.setPiece(Square.at(7, 0), rook1);
        board.setPiece(Square.at(7, 7), rook2);
        board.setPiece(Square.at(0,4), oppKing);

        oppKing.moveTo(board, Square.at(0,3));
        rook1.moveTo(board, Square.at(7, 1));
        oppKing.moveTo(board, Square.at(0,4));
        rook1.moveTo(board, Square.at(7,0));
        oppKing.moveTo(board, Square.at(0,3));
        rook2.moveTo(board, Square.at(7,6));
        oppKing.moveTo(board, Square.at(0,4));
        rook2.moveTo(board, Square.at(7,7));

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(5);
        moves.should.not.deep.include(Square.at(7,2));
        moves.should.not.deep.include(Square.at(7,6));
    });

    it('black king cannot castle under threat', () => {
        const king = new King(Player.BLACK);
        const rook = new Rook(Player.BLACK);
        const oppRook1 = new Rook(Player.WHITE);
        const oppRook2 = new Rook(Player.WHITE);
        board.setPiece(Square.at(7, 4), king);
        board.setPiece(Square.at(7, 7), rook);
        board.setPiece(Square.at(0, 1), oppRook1);
        board.setPiece(Square.at(0, 6), oppRook2);

        const moves = king.getAvailableMoves(board);

        moves.should.have.length(5);
        moves.should.not.deep.include(Square.at(7,2));
        moves.should.not.deep.include(Square.at(7,6));
    });

});
