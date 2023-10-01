// libraries +++++++++++++++++++++++++++++++++++++
console.log('interaction')

// libraries -------------------------------------

import {
  Reset_Sections,
  Select_Square,
  Show_Moves,
  Movement_Possibility,
  Update_Game,
  Check,
  CheckMate,
  saveText,
  load_history
} from './utils'

import {
  chess
} from './setup'

import {
  Constants
} from '../constants'
import {
  socket
} from '../api'




$("#result").click(function () {
  Reset_Sections();
});

$("#Resign").click(function () {
  Reset_Sections();
  if (chess.in_check()['b'] || chess.in_check()['w']) {
    Check(chess.in_check()['b'] ? 'b' : 'w');
    Check(chess.in_check()['w'] ? 'w' : 'b');
  }

  if (socket.opponent != null) {
    CheckMate(socket.color == 'w' ? 'b' : 'w', 'Resign')
  } else {
    CheckMate(chess.turn == 'w' ? 'b' : 'w', 'Resign')
  }

  socket.click = false



  if (chess.phase == 'game') {
    $('#PHASE h3').text('Game Phase')
    $("#ReadyButton").text('Resign')
    $("#ReadyButton").css({
      color: 'white',
      border: '3px solid red',
      'background-color': 'red'
    })

    $("#ReadyButton").hover((event) => {
      $(this).css({
        'background-color': 'red',
        color: 'white',
        cursor: 'pointer'
      })
    }, (event) => {
      $(this).css({
        'background-color': 'white',
        color: 'red'
      })
    })

  }


  socket.click_pos = {
    src: null,
    dst: null
  }

  if (chess.in_checkmate() && $('#r-2').css('opacity') != .6) {
    CheckMate(chess.in_check().b ? 'w' : 'b')
  }
});


$("#save").click(function () {
  saveText(JSON.stringify({
    move: chess.history
  }), "history.json");
});

// read json ----------------------

function onReaderLoad(event) {
  var obj = JSON.parse(event.target.result);
  socket.history = obj.move
  if (socket.opponent === null) {
    load_history(socket.history)
  } else {
    socket.opponent.send({
      username: socket.username,
      id: socket.peer._id,
      message: "load_history",
      history: socket.history,
      color: socket.color,
    });
  }

}

$("#jsonfile").change((event) => {
  var reader = new FileReader();
  reader.onload = onReaderLoad;
  reader.readAsText(event.target.files[0]);
});

// ---------------------------------------

$('#board label').mousedown(function (event) {
  Reset_Sections();
  if (!chess.in_checkmate()) {
    switch (event.which) {
      case 1: // grab left click
        Select_Square(this, 'green');
        if (socket.click) {
          Show_Moves(chess, $(this).attr("name"), socket.click_pos)
          socket.click_pos.dst = $(this).attr("name");
          
          let Movement = Movement_Possibility(socket.click_pos.src, socket.click_pos.dst)
          if (Movement.length == 1) {
            Update_Game({
              piece: chess.get(socket.click_pos.src),
              dst: socket.click_pos.dst,
              type: Movement[0].type
            })

            socket.click_pos.src = null;
            socket.click_pos.dst = null
          } else if (Movement.length == 2) {
            $("#war").css("display", "flex").hide().fadeIn();

          }

          
        }
        // --------------------------------------------------------
        break;


      default:
        console.log("You have a strange Mouse!");
        break;
    }
  }
  if (chess.in_check()['b'] || chess.in_check()['w']) {
    Check(chess.in_check()['b'] ? 'b' : 'w');
    Check(chess.in_check()['w'] ? 'w' : 'b');
  }

  if (chess.in_checkmate() && $('#r-2').css('opacity') != .6) {
    CheckMate(chess.in_check().b ? 'w' : 'b')
  }
});