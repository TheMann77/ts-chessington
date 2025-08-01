import Rook from '../../../src/engine/pieces/rook';
import Board from '../../../src/engine/board';
import Player from '../../../src/engine/player';
import Square from '../../../src/engine/square';
import Pawn from '../../../src/engine/pieces/pawn';
import King from '../../../src/engine/pieces/king';
import Bishop from "../../../src/engine/pieces/bishop";

describe('Rook', () => {
    let board: Board;
    beforeEach(() => board = new Board());

    it('can move laterally', () => {
        const rook = new Rook(Player.WHITE);
        board.setPiece(Square.at(1, 2), rook);

        const moves = rook.getAvailableMoves(board);

        const expectedMoves = [
            // Horizontal
            Square.at(1, 0), Square.at(1, 1), Square.at(1, 3), Square.at(1, 4), Square.at(1, 5), Square.at(1, 6), Square.at(1, 7),
            // Vertical
            Square.at(0, 2), Square.at(2, 2), Square.at(3, 2), Square.at(4, 2), Square.at(5, 2), Square.at(6, 2), Square.at(7, 2)
        ];

        moves.should.deep.include.members(expectedMoves);
    });

    it('cannot make any other moves', () => {
        const rook = new Rook(Player.WHITE);
        board.setPiece(Square.at(1, 2), rook);

        const moves = rook.getAvailableMoves(board);

        moves.should.have.length(14);
    });

    it('cannot move through friendly pieces', () => {
        const rook = new Rook(Player.WHITE);
        const friendlyPiece = new Pawn(Player.WHITE);
        board.setPiece(Square.at(4, 4), rook);
        board.setPiece(Square.at(4, 6), friendlyPiece);

        const moves = rook.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(4, 7));
    });

    it('cannot move through opposing pieces', () => {
        const rook = new Rook(Player.WHITE);
        const opposingPiece = new Pawn(Player.BLACK);
        board.setPiece(Square.at(4, 4), rook);
        board.setPiece(Square.at(4, 6), opposingPiece);

        const moves = rook.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(4, 7));
    });

    it('can take opposing pieces', () => {
        const rook = new Rook(Player.WHITE);
        const opposingPiece = new Pawn(Player.BLACK);
        board.setPiece(Square.at(4, 4), rook);
        board.setPiece(Square.at(4, 6), opposingPiece);

        const moves = rook.getAvailableMoves(board);

        moves.should.deep.include(Square.at(4, 6));
    });

    it.skip('cannot take the opposing king', () => {
        const rook = new Rook(Player.WHITE);
        const opposingKing = new King(Player.BLACK);
        board.setPiece(Square.at(4, 4), rook);
        board.setPiece(Square.at(4, 6), opposingKing);

        const moves = rook.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(4, 6));
    });

    it('cannot take friendly pieces', () => {
        const rook = new Rook(Player.WHITE);
        const friendlyPiece = new Pawn(Player.WHITE);
        board.setPiece(Square.at(4, 4), rook);
        board.setPiece(Square.at(4, 6), friendlyPiece);

        const moves = rook.getAvailableMoves(board);

        moves.should.not.deep.include(Square.at(4, 6));
    });

    it('cannot move into check', () => {
        const king = new King(Player.WHITE);
        const bishop = new Bishop(Player.BLACK);
        const rook = new Rook(Player.WHITE);
        board.setPiece(Square.at(0, 4), king);
        board.setPiece(Square.at(3, 1), bishop);
        board.setPiece(Square.at(1,3), rook);

        const moves = rook.getAvailableMoves(board);

        moves.should.have.length(0);
    })
});
