console.log('desk')
import {
  King,
  Pawn,
  Knight,
  Queen,
  Rook,
  Bishop
} from '../lib/pieces'

export default class Desk {
  constructor() {
    // constants +++++++++++++++++++++++++++++++++
    this.BLACK = 'b'
    this.WHITE = 'w'
    this.ATTACK = 'attack'
    this.MOVEMENT = 'move'
    this.STACK = 'stack'
    this.PLACE = 'place'
    this.READY = 'ready'
    this.KNIGHT = ['♘', '♞']
    this.BISHOP = ['♗', '♝']
    this.ROOK = ['♖', '♜']
    this.QUEEN = ['♕', '♛']
    this.PAWN = ['♙', '♟']
    this.KING = ['♔', '♚']
    this.ROW = 8
    this.COLUMN = 8
    // --------------------------------------------

    // initial setup +++++++++++++++++++++++++++++++++
    this.board = this.board_generator(this.ROW, this.COLUMN)
    this.board_1D = this.D3_to_1d(this.board) // one dimension board
    this.board_temp;
    this.turn = this.WHITE
    this.kings = {
      b: this.get('0-4'),
      w: this.get('7-4')
    }

    this.captured = []
    this.state = {
      b: null,
      w: null
    } // in_check || in_checkmate || in_settlement

    this.army_size = {
      b: 0,
      w: 0
    }

    // territory 
    this.territory = {
      'b': [],
      'w': []
    }

    // move number
    this.count = 0

    //history
    this.history = []

  }

  // util functions --------------------------------------------
  board_generator = () => {
    let board = [
      [new Rook('b', '0-0'), new Knight('b', '0-1'), new Bishop('b', '0-2'), new Queen('b', '0-3'), new King('b', '0-4'), new Bishop('b', '0-5'), new Knight('b', '0-6'), new Rook('b', '0-7')],
      [new Pawn('b', '1-0'), new Pawn('b', '1-1'), new Pawn('b', '1-2'), new Pawn('b', '1-3'), new Pawn('b', '1-4'), new Pawn('b', '1-5'), new Pawn('b', '1-6'), new Pawn('b', '1-7')],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [new Pawn('w', '6-0'), new Pawn('w', '6-1'), new Pawn('w', '6-2'), new Pawn('w', '6-3'), new Pawn('w', '6-4'), new Pawn('w', '6-5'), new Pawn('w', '6-6'), new Pawn('w', '6-7')],
      [new Rook('w', '7-0'), new Knight('w', '7-1'), new Bishop('w', '7-2'), new Queen('w', '7-3'), new King('w', '7-4'), new Bishop('w', '7-5'), new Knight('w', '7-6'), new Rook('w', '7-7')]
    ]
    return board;
  }

  D1_to_3d() {
    let board = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ]
    this.board_1D.forEach((piece) => {
      let x = Number(piece.src.split('-')[0])
      let y = Number(piece.src.split('-')[1])
      board[x][y] = piece
    })
    return board
  }

  D3_to_1d(board = this.board) {
    let board_1D = []
    board.forEach(function (row, r) {
      row.forEach(function (piece, c) {
        if (piece) {
          board_1D.push(piece)
        }
      })
    })

    return board_1D
  }


  get(pos) {
    if (pos) {
      let x = Number(pos.split('-')[0]);
      let y = Number(pos.split('-')[1])
      return this.board[x][y];
    } else {
      return -1
    }
  }

  in_check(board = this.board) {
    let territory = this.update_territory(board)
    let check = {
      'b': territory.w.indexOf(this.kings.b.src) != -1,
      'w': territory.b.indexOf(this.kings.w.src) != -1
    }
    return check
  }

  in_checkmate(board = this.board) {
    let check = this.in_check(board)
    return ((check.w || check.b) && this.in_stalemate())
  }

  in_stalemate() {
    let possible_moves = []
    let temp;

    temp = this.board_1D.filter((piece) => {
      return (piece.color == this.turn && this.get(piece.src) == piece)
    })

    temp.forEach((piece, _) => {
      console.log('in_stalemate')
      possible_moves = possible_moves.concat(this.moves(piece))
    })

    return possible_moves.length == 0
  }
  // game rules
  // game rules
  legal_moves = (move) => {
    let temp_src, temp_top;
    let legal = [move.piece.color == this.turn]; // check turn
    let opposite = this.kings[move.piece.color == 'b' ? 'w' : 'b']
    let x = Number(move.dst.split('-')[0])
    let y = Number(move.dst.split('-')[1])
    if (move.piece.name == 'king') {
      legal.push(!this.king_neighborhood(opposite, move.dst)) // check distance of two king
      legal.push(this.territory[opposite.color].indexOf(move.dst) == -1) // forbid king to go in opponent territory
    }


    // fake move -------------------
    switch (move.type) {
      case 'move':
        temp_src = move.piece.src;
        // ------------------------------------------------------------
        move.piece.src = move.dst
        // ------------------------------------------------------------
        this.board_temp = this.D1_to_3d()
        legal.push(!this.in_check(this.board_temp)[move.piece.color])
        // ------------------------------------------------------------
        move.piece.src = temp_src

        break;

      case 'attack':
        temp_top = this.get(move.dst)
        temp_src = move.piece.src;
        // ------------------------------------------------------------
        move.piece.src = move.dst
        this.board_1D = this.D3_to_1d()
        // ------------------------------------------------------------
        this.board_temp = this.D1_to_3d()
        legal.push(!this.in_check(this.board_temp)[move.piece.color])
        // ------------------------------------------------------------
        move.piece.src = temp_src

        break;
    }

    // console.log(legal)
    return legal.indexOf(false) == -1
  }

  king_neighborhood(king, dst) {
    if (king.Possible_moves(this.board).filter((move) => {
        return move.dst == dst
      }).length > 0) {
      return true
    } else {
      return false
    }
  }

  moves(piece) {
    if (piece) {
      console.log(piece.Possible_moves(this.board))
      return piece.Possible_moves(this.board).filter((move) => {
        return this.legal_moves(move)
      })

    } else {
      return []
    }
  }

  move(Move) { // piece is an object

    if (this.moves(Move.piece).filter((move) => {
        return Dict_Compare(move, Move)
      }).length == 1) {
      let top, x, y, index;

      switch (Move.type) {

        case this.MOVEMENT:
          x = Number(Move.piece.src.split('-')[0]);
          y = Number(Move.piece.src.split('-')[1])
          this.board[x][y] = null

          // add to history -----------------------------
          this.history.push({
            Num: this.count++,
            move: {
              piece: {
                symbol: Move.piece.symbol,
                color: Move.piece.color,
                name: Move.piece.name,
                src: Move.piece.src
              },
              dst: Move.dst,
              type: this.MOVEMENT
            }
          })

          // ---------------------------
          Move.piece.src = Move.dst; // update piece position
          this.update_turn() // update game turn


          // put piece on board desireable position
          x = Number(Move.dst.split('-')[0]);
          y = Number(Move.dst.split('-')[1])
          this.board[x][y] = Move.piece

          // update territory
          this.territory = this.update_territory(this.board)
          return {
            piece: Move.piece,
              dst: Move.dst,
              type: Move.type
          }



          case this.ATTACK:
            // get top piece of destination -----------------------------
            top = this.get(Move.dst);

            // remove piece from current place -----------------------------
            x = Number(Move.piece.src.split('-')[0]);
            y = Number(Move.piece.src.split('-')[1])
            this.board[x][y] = null
            // update army size
            this.army_size[Move.piece.color == 'b' ? 'w' : 'b']--;

            // add to history -----------------------------
            this.history.push({
              Num: this.count++,
              move: {
                piece: {
                  symbol: Move.piece.symbol,
                  color: Move.piece.color,
                  name: Move.piece.name,
                  src: Move.piece.src
                },
                dst: Move.dst,
                type: this.ATTACK
              }
            })
            // -----------------------------
            Move.piece.src = Move.dst; // update piece position
            this.update_turn() // update game turn


            // put piece on board desireable position
            x = Number(Move.dst.split('-')[0]);
            y = Number(Move.dst.split('-')[1])
            this.board[x][y] = Move.piece

            // captured
            this.captured.push(top)
            this.board_1D = this.D3_to_1d()

            // update territory
            this.territory = this.update_territory(this.board)
            return {
              piece: Move.piece,
                dst: Move.dst,
                type: this.ATTACK
            }

      }
    } else {
      return null
    }
  }

  // update territory
  update_territory(board) {
    let territory = {
      'b': [],
      'w': []
    };

    board.forEach(function (row, r) {
      row.forEach(function (piece, c) {
        if (piece) {
          territory[piece.color] = territory[piece.color].concat(piece.Possible_moves(board))
        }
      })
    })
    territory.b = territory.b.map((move) => {
      return move.dst
    })
    territory.w = territory.w.map((move) => {
      return move.dst
    })

    return territory;
  }

  update_turn() {
    if (this.state.b == this.state.w) {
      this.turn = this.turn == 'b' ? 'w' : 'b'
    } else if (this.state.b == 'draft') {
      this.turn = 'b'
    } else {
      this.turn = 'w'
    }
  }

  reset() {
    this.board = this.board_generator(this.ROW, this.COLUMN)
    this.board_1D = [] // one dimension board
    this.board_temp;
    this.turn = this.WHITE
    this.kings = {
      b: new King('b'),
      w: new King('w')
    }

    this.captured = []
    this.state = {
      b: null,
      w: null
    } // in_check || in_checkmate || in_settlement

    this.army_size = {
      b: 0,
      w: 0
    }

    // territory 
    this.territory = {
      'b': [],
      'w': []
    }

    // move number
    this.count = 0

    //history
    this.history = []

  }
}

function Dict_Compare(d1, d2) {
  for (let i in d1) {
    if (d1[i] != d2[i]) {
      return false
    }
  }
  return true
}