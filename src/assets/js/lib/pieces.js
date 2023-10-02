export class King {
  constructor(color, src = null) {
    this.color = color
    this.name = 'king'
    this.symbol = '♚'
    this.src = src
  }

  Possible_moves(board) {
    return point_generator(this, board)
  }
}

export class Pawn {
  constructor(color, src = null) {
    this.color = color
    this.name = 'pawn'
    this.symbol = '♟'
    this.src = src
  }

  Possible_moves(board) {
    return pawn_moves(this, board)
  }

  Promotion(type = 'queen') {
    switch (type) {
      case 'queen':
        this.name = 'queen'
        this.symbol = '♛'
        this.Possible_moves = function (board) {
          return path_generator(this, board, ['East', 'North', 'NE', 'SE'])
        }

        break;
      case 'rook':
        this.name = 'rook'
        this.symbol = '♜'
        this.Possible_moves = function (board) {
          return path_generator(this, board, ['East', 'North'])
        }

        break;

      case 'bishop':
        this.name = 'bishop'
        this.symbol = '♝'
        this.Possible_moves = function (board) {
          return path_generator(this, board, ['NE', 'SE'])
        }

        break;

      case 'knight':
        this.name = 'knight'
        this.symbol = '♞'
        this.Possible_moves = function (board) {
          return point_generator(this, board, [
            [1, 2],
            [1, -2],
            [2, 1],
            [2, -1],
            [-1, 2],
            [-1, -2],
            [-2, 1],
            [-2, -1]
          ])
        }

        break;
        
      default:
        break;
    }

  }
}

export class Queen {
  constructor(color, src = null) {
    this.color = color
    this.name = 'queen'
    this.symbol = '♛'
    this.src = src
  }

  Possible_moves(board) {
    return path_generator(this, board, ['East', 'North', 'NE', 'SE'])
  }

}

export class Rook {
  constructor(color, src = null) {
    this.color = color
    this.name = 'rook'
    this.symbol = '♜'
    this.src = src
  }

  Possible_moves(board) {
    return path_generator(this, board, ['East', 'North'])
  }

}

export class Bishop {
  constructor(color, src = null) {
    this.color = color
    this.name = 'bishop'
    this.symbol = '♝'
    this.src = src
  }

  Possible_moves(board) {
    return path_generator(this, board, ['NE', 'SE'])
  }

}


export class Knight {
  constructor(color, src = null) {
    this.color = color
    this.name = 'knight'
    this.symbol = '♞'
    this.src = src
  }

  Possible_moves(board) {
    return point_generator(this, board, [
      [1, 2],
      [1, -2],
      [2, 1],
      [2, -1],
      [-1, 2],
      [-1, -2],
      [-2, 1],
      [-2, -1]
    ])
  }

}

// related functions
function path_generator(piece, board, direction = ['East']) {
  let path = []
  let src = {
    x: Number(piece.src.split('-')[0]),
    y: Number(piece.src.split('-')[1])
  }

  direction.forEach(function (d) {
    switch (d) {
      case 'East':
        for (let y = src.y + 1; y < 8; y++) {
          if (board[src.x][y]) {
            let temp = board[src.x][y]
            path = path.concat(movement_limitation(piece, temp, src.x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: src.x + '-' + y,
            type: 'move'
          })
        }

        for (let y = src.y - 1; y >= 0; y--) {
          if (board[src.x][y]) {
            let temp = board[src.x][y]
            path = path.concat(movement_limitation(piece, temp, src.x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: src.x + '-' + y,
            type: 'move'
          })
        }
        break;

      case 'North':
        for (let x = src.x + 1; x < 8; x++) {
          if (board[x][src.y]) {
            let temp = board[x][src.y]
            path = path.concat(movement_limitation(piece, temp, x + '-' + src.y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + src.y,
            type: 'move'
          })
        }

        for (let x = src.x - 1; x >= 0; x--) {
          if (board[x][src.y]) {
            let temp = board[x][src.y]
            path = path.concat(movement_limitation(piece, temp, x + '-' + src.y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + src.y,
            type: 'move'
          })
        }
        break;


      case 'NE':
        for (let x = src.x + 1, y = src.y + 1; x < 8 && y < 8; x++, y++) {
          if (board[x][y]) {
            let temp = board[x][y]
            path = path.concat(movement_limitation(piece, temp, x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + y,
            type: 'move'
          })
        }

        for (let x = src.x - 1, y = src.y - 1; x >= 0 && y >= 0; x--, y--) {
          if (board[x][y]) {
            let temp = board[x][y]
            path = path.concat(movement_limitation(piece, temp, x + '-' + y))
            break
          }
          path.push({
            piece: piece,
            dst: x + '-' + y,
            type: 'move'
          })
        }

        break;



      case 'SE':
        for (let x = src.x + 1, y = src.y - 1; x < 8 && y >= 0; x++, y--) {
          if (board[x][y]) {
            let temp = board[x][y]
            path = path.concat(movement_limitation(piece, temp, x + '-' + y))
            break
          }
          path.push({
            piece: piece,
            dst: x + '-' + y,
            type: 'move'
          })
        }

        for (let x = src.x - 1, y = src.y + 1; x >= 0 && y < 8; x--, y++) {
          if (board[x][y]) {
            let temp = board[x][y]
            path = path.concat(movement_limitation(piece, temp, x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + y,
            type: 'move'
          })
        }
    }
  })


  return path;
}

function pawn_moves(piece, board) {
  let temp = []
  let x = Number(piece.src.split('-')[0])
  let y = Number(piece.src.split('-')[1])


  if (piece.color == 'b') {
    if (x + 1 < 8 && !board[x + 1][y]) {
      temp.push({
        piece: piece,
        dst: `${x+1}-${y}`,
        type: 'move'
      })

    }

    if (x + 1 < 8 && y + 1 < 8 && board[x + 1][y + 1] && board[x + 1][y + 1].color == 'w') {
      temp.push({
        piece: piece,
        dst: `${x+1}-${y+1}`,
        type: 'attack'
      })
    }

    if (x + 1 < 8 && y - 1 >= 0 && board[x + 1][y - 1] && board[x + 1][y - 1].color == 'w') {
      temp.push({
        piece: piece,
        dst: `${x+1}-${y-1}`,
        type: 'attack'
      })
    }

    if (x == 1 && !board[x + 1][y] && !board[x + 2][y]) {
      temp.push({
        piece: piece,
        dst: `${x+2}-${y}`,
        type: 'move'
      })
    }


  } else {
    if (x - 1 >= 0 && !board[x - 1][y]) {
      temp.push({
        piece: piece,
        dst: `${x-1}-${y}`,
        type: 'move'
      })

    }

    if (x - 1 >= 0 && y + 1 < 8 && board[x - 1][y + 1] && board[x - 1][y + 1].color == 'b') {
      temp.push({
        piece: piece,
        dst: `${x-1}-${y+1}`,
        type: 'attack'
      })
    }

    if (x - 1 >= 0 && y - 1 >= 0 && board[x - 1][y - 1] && board[x - 1][y - 1].color == 'b') {
      temp.push({
        piece: piece,
        dst: `${x-1}-${y-1}`,
        type: 'attack'
      })
    }

    if (x == 6 && !board[x - 1][y] && !board[x - 2][y]) {
      temp.push({
        piece: piece,
        dst: `${x-2}-${y}`,
        type: 'move'
      })
    }
  }

  return temp;
}

function point_generator(piece, board, points = [
  [1, -1],
  [1, 0],
  [1, 1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1]
]) {
  let temp = [];
  let src = {
    x: Number(piece.src.split('-')[0]),
    y: Number(piece.src.split('-')[1])
  }

  points.forEach(function (item) {
    let x = piece.color == 'b' ? item[0] : -item[0]
    if (
      src.x + x < 8 && src.x + x >= 0 &&
      src.y + item[1] < 8 && src.y + item[1] >= 0
    ) {
      if (board[src.x + x][src.y + item[1]]) {
        let top = board[src.x + x][src.y + item[1]]
        temp = temp.concat(movement_limitation(piece, top, (src.x + x) + '-' + (src.y + item[1])))
      } else {
        temp.push({
          piece: piece,
          dst: (src.x + x) + '-' + (src.y + item[1]),
          type: 'move'
        })
      }


    }
  })
  return temp;
}

function movement_limitation(piece, top_piece, dst) {
  if (top_piece.color === piece.color) {
    return []
  } else {
    return [{
      piece: piece,
      dst: dst,
      type: 'attack'
    }]

  }
}