// libraries +++++++++++++++++++++++++++++++++++++
console.log('util')

// libraries -------------------------------------

import {
  chess
} from './setup'
import {
  socket
} from "../api"


export function addMessage(text, username, style = {
  'color': 'blue'
}) {
  if (text !== '') {
    console.log(`log: ${text}`);
    const messageBox = $('.chat-messages');
    const ul = $('.chat-messages ul')
    const messageElement = $('<li>').html(`<b>${username}: </b><span>${text}</span>`);
    messageElement.find('span').css(style);

    ul.append(messageElement);
    messageBox.scrollTop(messageBox.prop('scrollHeight'));
  }
}

export function Check(color) {
  let piece = chess.kings[color]
  $('#b-' + piece.src).css({
    "border": "2px solid red",
    "box-shadow": "0px 0px 10px min(.3vh,.3vw) red",
    "color": "red"
  }); // change color of current box
}

export function CheckMate(color, type = 'CheckMate') {
  if (socket.end_game === false) {
    if (socket.opponent != null) {
      addMessage(`${socket.color==color? socket.username :socket.opponent.username} 🎊🎊WINS🎉🎉 with a <b>${type}</b> against ${socket.color==color? socket.opponent.username :socket.username}.`, 'Admin')
      socket.opponent.send({
        username: socket.username,
        id: socket.peer._id,
        message: type == "CheckMate" ? 'checkmate' : "resign",
        color: socket.color,
      });

      socket.opponent.color = socket.opponent.color == 'b' ? 'w' : 'b'
      socket.color = socket.color == 'b' ? 'w' : 'b'

    } else {
      addMessage(`${color == 'b' ?  'Black' : 'White'} 🎊🎊WINS🎉🎉 with a <b>${type}</b> against ${color == 'w'?  'Black' : 'White'}.`, 'Admin', {
        'color': 'green'
      })
    }


    if (color == 'b') {
      $('#r-2 span').text('Black');
      $('#r-1').css({
        'outline': '30px #171716 solid'
      })
    } else {
      $('#r-2 span').text('White');
      $('#r-1').css({
        'outline': '30px #d1d1d1 solid'
      })

    }
    $('#result').css({
      'z-index': 3,
      'opacity': 1
    })
    socket.end_game = true
  }

}

export function load_history(history) {
  Reset_Game()
  var interval = 500;
  history.forEach(function (el, index) {
    setTimeout(function () {
      let res, piece;
      piece = chess.get(el.move.piece.src)
      res = Update_Game({
        piece: piece,
        dst: el.move.dst,
        type: el.move.type
      }, false, true);
    }, index * interval);
  });
}

export function Move(message) {
  let piece = chess.get(message.piece.src)
  Update_Game({
    piece: piece,
    dst: message.dst,
    type: message.type
  });
}

export function Movement_Possibility(src, dst) {
  let piece = chess.get(src)
  let Possibility = chess.moves(piece)
  return Possibility.filter(move => move.dst == dst)
}

export function Put_Pieces(e, type, color) {
  if (color == 'b') {
    $(e).css({
      "color": 'black',
      '-webkit-text-stroke': '2px white',
      'text-stroke': '2px white'
    });
  } else {
    $(e).css({
      "color": 'white',
      '-webkit-text-stroke': '2px black',
      'text-stroke': '2px black'
    });
  }



  $(e).text(type);
}


export function Reset_Sections(e = ["#board label", ".captured"]) {
  $.each(e, function (index, item) {
    $(item).css({
      border: "",
      "box-shadow": "",
      'background-color': ""
    }); // change color of all boxes
  });
  $("war").fadeOut();

  if ($('#result').css('opacity') == 1) {
    $('#r-0').css({
      'opacity': .6,
      "background-color": "transparent"
    })
    $('#r-1').css({
      'opacity': .6
    })
    $('#r-2').css({
      'opacity': .6
    })
    $('#result').css({
      'z-index': 3,
      'opacity': 1
    })
  }
  // WAR = null;
}

function Remove_Pieces(e, type = '0', color = "#ffcf9e00") {
  $(e).css({
    "color": color,
    '-webkit-text-stroke': '0px transparent',
    'text-stroke': '0px transparent'
  });
  $(e).text(type);
}

export function saveText(text, filename) {
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  a.setAttribute('download', filename);
  a.click()
}

export function turn_update() {
  if (chess.turn == "b") {
    $("#PB").css({
      'box-shadow': '0px 0px 15px 12px #ad00ad'
    })
    $("#PW").css({
      'box-shadow': '0px 0px 0px 0px #d1d1d1'
    })

  } else {
    $("#PW").css({
      'box-shadow': '0px 0px 15px 12px #ad00ad'
    })
    $("#PB").css({
      'box-shadow': '0px 0px 0px 0px #d1d1d1'
    })
  }

}

export function Select_Square(e, color) {
  $(e).css({
    "border": `.2vh solid ${color}`,
    "box-shadow": `0px 0px 10px 2px ${color}`,
    'background-color': `${color}`
  }); // change color of current box
}

export function Show_Moves(chess, tag, click_pos) {
  let Moves = chess.moves(chess.get(tag))
  if (Moves.length > 0) {
    click_pos.src = tag;
    $.each(Moves, function (_, item) {
      if (item.type == 'move') {
        $('#b-' + item.dst).css({
          "border": "2px solid #009699",
          "box-shadow": "0px 0px 10px 2px #009699",
          'background-color': "#009699"
        });
      } else {
        $('#b-' + item.dst).css({
          "border": "2px solid red",
          "box-shadow": "0px 0px 10px 2px red",
          'background-color': "red"
        });
      }

    });
  }
}



export function update_board() {
  chess.board.forEach((row, x) => {
    row.forEach((piece, y) => {
      if (piece) {
        Put_Pieces(`#b-${x}-${y}`, piece.symbol, piece.color);
      } else {
        Remove_Pieces(`#b-${x}-${y}`)
      }
    })
  })

  if (chess.in_check()[chess.turn]) {
    Check();
  }
}

export function Update_Game(Move = {
  piece: null,
  dst: null,
  type: constant.PLACE
}, admin = false, history = false) {
  if (socket.opponent === null || (admin || socket.color === chess.turn) || history) {
    let res = chess.move(Move);
    turn_update();
    if (res) {
      switch (Move.type) {
        case chess.MOVEMENT:
          update_board();
          break;


        case chess.ATTACK:
          update_board();
          let temp = chess.captured;
          temp = temp[temp.length - 1]
          if (temp.color == chess.BLACK) {
            let num = chess.captured.filter(function (x) {
              return (x.name == temp.name && x.color == 'b')
            }).length
            $("#bc-" + temp.symbol).find("sub").text(num)
            Select_Square("#bc-" + temp.symbol, '#000000')

          } else {
            let num = chess.captured.filter(function (x) {
              return (x.name == temp.name && x.color == 'w')
            }).length
            $("#wc-" + temp.symbol).find("sub").text(num)
            Select_Square("#wc-" + temp.symbol, '#000000')
          }

          break;
      }
    }

    if (socket.opponent && admin == false && history == false) {
      let lastMove = chess.history[chess.history.length - 1]
      lastMove.message = 'move'
      socket.opponent.send(lastMove)
    }
    return res;
  }
}

export function update_tier(pos) {
  let item = chess.get(pos)
  $.each(item, function (index, item) {
    if (item) {
      Put_Pieces("#t-" + index, item.symbol, item.color)
    } else {
      Remove_Pieces("#t-" + index)
    }
  });
}


export function Reset_Game() {
  chess.reset()
  update_board()
  turn_update()
  Reset_Sections()

  $('#result').css({
    'z-index': 0,
    'opacity': 0
  })

  for (let index = 0; index < 3; index++) {
    Remove_Pieces("#t-" + index)
  }


  socket.history = []
  socket.click = true
  socket.end_game = false
  socket.click_pos = {
    src: null,
    dst: null
  }

  let stockpile = {
    "帥": 1,
    "兵": 9,
    "忍": 2,
    "砲": 2,
    "砦": 2,
    "侍": 2,
    "謀": 1,
    "筒": 1,
    "馬": 2,
    "弓": 2,
    "大": 6,
    "中": 4,
    "小": 4
  }

  $.each(stockpile, function (key, value) {
    $(`#bs-${key} sub`).text(value)
    $(`#ws-${key} sub`).text(value)

    $(`#bc-${key} sub`).text(0)
    $(`#wc-${key} sub`).text(0)
  });

  $('#PHASE h3').text('Draft Phase')

  $("#ReadyButton").text('Ready')
    .css({
      color: 'green',
      border: '3px solid green',
      'background-color': 'transparent'
    })

  $("#ReadyButton").hover(function () {
    $(this).css({
      'background-color': 'green',
      color: 'white',
      cursor: 'pointer'
    })
  }, function () {
    $(this).css({
      'background-color': 'transparent',
      color: 'green'
    })
  })

}