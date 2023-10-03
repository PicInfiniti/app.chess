// libraries +++++++++++++++++++++++++++++++++++++
import $ from "jquery"

// libraries -------------------------------------

const tier_color = ["#000000", "#8a8a8a", "#fc9803", "#cc0000"]

export function Put_Pieces(e, type, tier) {
  $(e).css({
    "color": tier_color[tier - 1],
    "border-radius": "50px",
    "outline": "5px #d1d1d1 solid",
    "outline-offset": "-5px",
    "background-color": "white"
  });
  $(e).text(type);
}


export function Remove_Pieces(e, color = "#ffba75") {
  $(e).css({
    "color": color,
    "border-radius": "5px",
    "outline": "0px #999999 solid",
    "outline-offset": "0px"
  });
}

export function Movement_Possibility(chess, src, dst) {
  let piece = chess.get_top(src)
  let Possibility = chess.moves(piece)
  return Possibility.filter(move => move.dst == dst)[0]
}

export function Reset_Sections(e = [".box", ".tier", ".stockpile", ".captured"]) {
  $.each(e, (_, item) => {
    $(item).css({
      "border": "1px solid #ffba75",
      "box-shadow": "0px 0px 0px 0px #999999"
    }); // change color of all boxes
  });
}

export function Select_Square(e, color) {
  $(e).css({
    "border": "1px solid " + color,
    "box-shadow": "0px 0px 5px 1px " + color
  }); // change color of current box

}

export function Update_Game(chess, Move) {
  let res = chess.move(Move);
  if (res) {
    switch (Move.type) {
      case chess.MOVEMENT:
        update_board(chess);

        break;
      case chess.STACK:
        update_board(chess);
        break;
    }
    return res;
  }
}

export function update_board(chess) {
  chess.board.forEach((row, x) => {
    row.forEach((column, y) => {
      column.forEach((piece, z) => {
        if (piece == null && z == 0) {
          Remove_Pieces(`#${chess.tag}-${x}-${y}`)
          $(`#${chess.tag}-${x}-${y}`).css({
            "background-color": "#ffba75"
          });
        } else if (piece) {
          Put_Pieces(`#${chess.tag}-${x}-${y}`, piece.symbol, piece.tier);
        }
      })
    })
  })
}

export function Show_Moves(chess, src) {
  let Moves = chess.moves(chess.get_top(src))
  if (Moves.length > 0) {
    $.each(Moves, (_, item) => {
      if (item.type == 'move') {
        $(`#${chess.tag}-${item.dst}`).css({
          "border": "1px solid #009699",
          "box-shadow": "0px 0px 5px 1px #009699",
        });
      } else {
        $(`#${chess.tag}-${item.dst}`).css({
          "border": "1px solid red",
          "box-shadow": "0px 0px 5px 1px red"
        });
      }

    });
  }
  return Moves.length
}

export function table(name, tag) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      $(name).append(`<label class='box boarder' type='text' id='${tag}-${i}-${j}' name='${i}-${j}'>${i}${j}</label>`)
    }
  }
}