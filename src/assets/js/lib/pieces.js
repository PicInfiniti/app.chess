export class King {
  constructor(color, src = null, tier = 1) {
    this.color = color
    this.name = 'king'
    this.symbol = color == 'w' ? '♚' : '♔'
    this.tier = tier
    this.src = src
  }

  Possible_moves(board) {
    switch (this.tier) {
      case -1:
        return null;

      case 1:
        return point_generator(this, board)

      default:
        return null
    }
  }

}

export class Pawn {
  constructor(color, src = null, tier = 1) {
    this.color = color
    this.name = 'pawn'
    this.symbol = color == 'w' ? '♟' : '♙'
    this.tier = tier
    this.src = src
  }

  Possible_moves(board) {
    switch (this.tier) {
      case -1:
        return null;

      case 1:
        return pawn_moves(this, board)

      default:
        return null;

    }
  }

}

export class Queen {
  constructor(color, src = null, tier = 1) {
    this.color = color
    this.name = 'queen'
    this.symbol = color == 'w' ? '♛' : '♕'
    this.tier = tier
    this.src = src
  }

  Possible_moves(board) {
    switch (this.tier) {
      case -1:
        return null;

      case 1:
        return path_generator(this, board, ['East', 'North', 'NE', 'SE'])

      default:
        return null;

    }
  }

}

export class Rook {
  constructor(color, src = null, tier = 1) {
    this.color = color
    this.name = 'rook'
    this.symbol = color == 'w' ? '♜' : '♖'
    this.tier = tier
    this.src = src
  }

  Possible_moves(board) {
    switch (this.tier) {
      case -1:
        return null;

      case 0:
        let temp = draft_moves(this, board)
        return temp != [] ? temp : null

      case 1:
        return path_generator(this, board, ['East', 'North'])

      default:
        return null;

    }
  }

}

export class Bishop {
  constructor(color, src = null, tier = 1) {
    this.color = color
    this.name = 'bishop'
    this.symbol = color == 'w' ? '♝' : '♗'
    this.tier = tier
    this.src = src
  }

  Possible_moves(board) {
    switch (this.tier) {
      case -1:
        return null;

      case 1:
        return path_generator(this, board, ['NE', 'SE'])

      default:
        return null;

    }
  }

}


export class Knight {
  constructor(color, src = null, tier = 1) {
    this.color = color
    this.name = 'knight'
    this.symbol = color == 'w' ? '♞' : '♘'
    this.tier = tier
    this.src = src
  }

  Possible_moves(board) {
    switch (this.tier) {
      case -1:
        return null;

      case 1:
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

      default:
        return null;

    }
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


function short_path(piece, board, direction = ['East', 'West', 'North', 'South'], limit = 2) {
  let path = []
  src = {
    x: Number(piece.src.split('-')[0]),
    y: Number(piece.src.split('-')[1])
  }

  direction.forEach(function (d) {
    switch (d) {
      case 'East':
        for (let y = src.y + 1; y < 8 && y <= src.y + limit; y++) {
          if (board[src.x][y]) {
            path = path.concat(movement_limitation(piece, board[src.x][y], src.x + '-' + y))
            break;
          }
          path.push({
            piece: piece,
            dst: src.x + '-' + y,
            type: 'move'
          })
        }
        break;

      case 'West':
        for (let y = src.y - 1; y >= 0 && y >= src.y - limit; y--) {
          if (board[src.x][y]) {
            path = path.concat(movement_limitation(piece, board[src.x][y], src.x + '-' + y))
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
        for (let x = src.x - 1; x >= 0 && src.x - limit <= x; x--) {
          if (board[x][src.y]) {
            path = path.concat(movement_limitation(piece, board[x][src.y], x + '-' + src.y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + src.y,
            type: 'move'
          })
        }
        break;

      case 'South':
        for (let x = src.x + 1; x < 8 && src.x + limit >= x; x++) {
          if (board[x][src.y]) {
            path = path.concat(movement_limitation(piece, board[x][src.y], x + '-' + src.y))
            break;
          }
          path.push({
            piece: piece,
            dst: x + '-' + src.y,
            type: 'move'
          })
        }
        break;
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