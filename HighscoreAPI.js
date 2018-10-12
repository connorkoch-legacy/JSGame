var competition_id = queryData('competition_id');
var game_id = queryData('game_id');

var current_player_score = null;

function update_scores() {
    $.ajax({
        method: "GET",
        url: 'https://connect.mines.edu/gameapi/gethighscores/' + competition_id + '/' + game_id,
        dataType: 'json',
    }).done(function(data) {
        console.log(data);

        var table = document.getElementById("hightable");
        var count = 0;

        for(var i = 0; i < data.length; i++) {
            if(data[i]['name'] == null) {
                $('#myhighscore').html('<td colspan="2">'+data[i]['score']+'</td>');
                current_player_score = data[i]['score'];
            } else {
                var row = table.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                cell1.innerHTML = data[i]['name'];
                cell2.innerHTML = data[i]['score'];
                count++;
            }
        }

        if(count == 0) {
            var row = table.insertRow(-1);
            var cell = row.insertCell(0);
            cell.colSpan = 2;
            cell.innerHTML = 'No highscores found';
        }
    });
}


function highscore(score) {
    var message = "";
    if(current_player_score) {
        if(current_player_score > score) {
            window.alert('You already have a higher score!');
            return;
        }
        message = 'Your SAVED high score is ' + current_player_score + '. ';
    } else {
        message = 'You have no SAVED score for this game. ';
    }

    if (confirm(message + 'Would you like to submit your new score of ' + score + ' to CS-CONNECT?')) {
        $.ajax({
            method: "GET",
            url: 'https://connect.mines.edu/gameapi/submitscore/' + competition_id + '/' + game_id + '/' + score
        }).done(function (msg) {
            if(msg === 'success') {
                window.alert("SUCCESS\n\nYour high score has been submitted and saved!");
                reset_table();
                update_scores();
                return;
            } else if (msg === 'competition-inactive') {
                window.alert("Score submission failed... competition is inactive.");
                return;
            }

            window.alert("ERROR\n\nYour high score was unable to be saved!");
        });

    }
}

function reset_table(){
    $('#hightable').html('<tr><th>User</th><th>Score</th></tr>');
    $('#myhightable').html('<table id="myhightable"><tr><th colspan="2">Your High Score</th></tr><tr id="myhighscore"><td colspan="2">You dont have one yet!</td></tr></table>');
}

function queryData(variable) {
    var data = window.location.search.substring(1)
    data = data.split('&');
    for (var i = 0; i < data.length; i++) {
        var subdata = data[i].split('=');
        if(subdata[0] == variable){return subdata[1]};
    }
    return false;
}
