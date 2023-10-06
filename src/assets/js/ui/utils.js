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
  
  if($(e).find("span").length === 0){
    let span = $('<span>').text(type)
    $(e).append(span)
  }

}


export function Reset_Sections() {

  for (let item of $("#board label")) {
    let box = $(item).attr('name')
    let x = Number(box[0])
    let y = Number(box[2])
    $(item).css({
      'border': "",
      "box-shadow": "",
      'background-color': (x + y) % 2 == 0 ? "#ffba75" : "#EB9E53"
    }); // change color of all boxes

  }


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

}

function Remove_Pieces(e, type = '0', color = "#ffcf9e00") {
  $(e).css({
    "color": color,
    '-webkit-text-stroke': '0px transparent',
    'text-stroke': '0px transparent'
  });
  $(e).find('span').remove();
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
  Reset_Sections()
  $(e).css({
    "border": `.2vh solid ${color}`,
    "box-shadow": `0px 0px 10px 2px ${color}`,
    'background-color': `${color}`
  }); // change color of current box
}

export function Show_Moves(chess, tag, click_pos) {
  let Moves = chess.moves(chess.get(tag))
  if (Moves.length > 0) {
    $.each(Moves, function (_, item) {
      if (item.type == 'move') {
        $('#b-' + item.dst).css({
          "border": "2px solid #009699",
          "box-shadow": "0px 0px 10px 2px #009699",
          'background-color': "#009699"
        });
      } else if (item.type == 'attack') {
        $('#b-' + item.dst).css({
          "border": "2px solid red",
          "box-shadow": "0px 0px 10px 2px red",
          'background-color': "red"
        })
      } else {
        $('#b-' + item.dst).css({
          "border": "2px solid orange",
          "box-shadow": "0px 0px 10px 2px orange",
          'background-color': "orange"
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
    Check(chess.turn);
  }
}

export function Update_Game(Move = {
  piece: null,
  dst: null,
  type: 'move'
}, admin = false, history = false) {
  if (socket.opponent === null || (admin || socket.color === chess.turn) || history) {
    socket.click = false
    let $src = $(`#b-${Move.piece.src} span`);
    let s_x = Number(Move.piece.src[0])
    let s_y = Number(Move.piece.src[2])
    let d_x = Number(Move.dst[0])
    let d_y = Number(Move.dst[2])

    let res = chess.move(Move);

    turn_update();

    var animationDuration = 400;

    function moveElement() {
      var targetTop = `${(d_x-s_x)*100}px`
      var targetLeft = `${(d_y-s_y)*100}px`
      $src.animate({
        top: targetTop,
        left: targetLeft
      }, animationDuration, function () {
        // This function will be executed after the animation is complete
        console.log("Animation finished. Triggering a function...");
        // You can call your function here
        $src.css({
          top: "0px",
          left: "0px"
        })
        update_board();
        socket.click = true

      });
    }
    moveElement()

    if (socket.opponent && admin == false && history == false) {
      let lastMove = chess.history[chess.history.length - 1]
      lastMove.message = 'move'
      socket.opponent.send(lastMove)
    }
    return res;
  }
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

}

document.update_board = update_board