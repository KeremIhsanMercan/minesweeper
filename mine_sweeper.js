if (document.querySelector("#grid_selector") != null) {
    player_name = prompt("Welcome! Your Name?");
    localStorage["player_name"] = player_name;
}

var time_passed = 0;
var time_interval = setInterval(myTimer, 1000);


const grid_edge_unit = document.getElementById("button_grid").dataset.size; // grid edge length !!!!!
let button_holder = "";
let button_html = '<button class="notMine grid_button" onclick="decider(this)" data-ismine="false" data-minecount="0"><button class="flag_button" onclick="flag(this)"></button></button>';
let corners = [0, (grid_edge_unit-1), (grid_edge_unit*(grid_edge_unit-1)), ((grid_edge_unit*grid_edge_unit)-1)]
for (let i = 0; i < (grid_edge_unit*grid_edge_unit); i++) {
    
    button_holder += button_html;

    if (i % grid_edge_unit == (grid_edge_unit - 1)) {
        button_holder += '<br>';
    }
}

document.getElementById("button_grid").innerHTML = button_holder;

var buttons = document.querySelectorAll(".grid_button");
var flg_buttons = document.querySelectorAll(".flag_button");
let random_mine = [];
let mine_count_input = 0;
let nan_checker;


function myTimer() {
    time_passed += 1;
}

do {
    
    mine_count_input = prompt("How many mines do you want? Min:" + grid_edge_unit + " Max:" + Math.floor(grid_edge_unit*grid_edge_unit/4)); // mine count !!!!!
    nan_checker = isNaN(mine_count_input);
    nan_checker = nan_checker || mine_count_input*1 < grid_edge_unit;
    nan_checker = nan_checker || mine_count_input > Math.floor(grid_edge_unit*grid_edge_unit/4);

// } while (isNaN(mine_count_input) || mine_count_input < grid_edge_unit || mine_count_input > Math.floor(grid_edge_unit*grid_edge_unit/4));
} while (nan_checker);

random_mine.length = mine_count_input;
let random_array_index = 0;



do {
    
    let x = Math.floor(Math.random() * (grid_edge_unit * grid_edge_unit));
    if (random_mine.includes(x) || corners.includes(x)) {
        continue;
    }
    random_mine[random_array_index] = x;
    random_array_index++;
    
} while ((random_mine.includes(null) || random_mine.includes(undefined)));



let notmine_counter = 0;
let opened_notmine_buttons = 0;


for(let i = 0; i < buttons.length; i++) {
    buttons[i].id = "btn" + i;
    buttons[i].dataset.x = Math.floor(i / grid_edge_unit);
    buttons[i].dataset.y = i % grid_edge_unit;
    flg_buttons[i].id = "flg" + i;
}

for (let i = 0; i < random_mine.length; i++) {
    
    buttons[random_mine[i]].dataset.ismine = "true";
}

for(let i = 0; i < buttons.length; i++) {
    buttons[i].dataset.minecount = around_mineCounter(buttons[i]);
    
    if (buttons[i].dataset.ismine == "false") {
        notmine_counter++;
    } 
}

let total_mine_count = buttons.length - notmine_counter;
let mines_left = total_mine_count;

document.querySelector("#mines_left").innerHTML = `<h1>Mines Left: ${mines_left}</h1>`;

var scw  = Math.min( (screen.width+"").replace("px")*1 , (screen.height+"").replace("px","")*1) / grid_edge_unit - 5;
if(grid_edge_unit > 10) {
    buttons.forEach(x=>{x.style.width = scw + "px"; x.style.height = scw + "px";});
    flg_buttons.forEach(flgbutton => flgbutton.style.marginLeft="-" + scw +"px");
}


function decider(thisone) {
    if (thisone.dataset.ismine == "true") {
        mine(thisone);
    } else {
        notMine(thisone, thisone.dataset.minecount);
    }
}

function game_over_screen(input) {
    clearTimeout(time_interval);
    let score = (grid_edge_unit * 200) + (mine_count_input-grid_edge_unit)*500;

    score -= time_passed;
    
    let name = localStorage["player_name"];
    if (input == 1) {
        
        alert("Congratulations " + name + ". YOU WIN!!! You scored " + score + ".");
    } else {
        alert("I am sorry " + name + ". YOU LOST!!! You scored 0.");
    }
    document.body.innerHTML = '<div id="reseter"><a href="gameArena'+grid_edge_unit+'.html" id="link">CLICK ME TO RESET</a></div>';
}

function mine(thisone) {
    if (thisone.dataset.statu == "flag") {
        thisone.style.backgroundImage = "none";
        thisone.dataset.statu = "empty";
    } else {
        thisone.style.backgroundImage = "url(images/mine.png)";
        let flag_btn_id = thisone.nextSibling.id;
        document.getElementById(flag_btn_id).style.visibility = "hidden";
        document.querySelector("body").style.backgroundColor = "#b00202";
        setTimeout(() => {
            game_over_screen(0);
        }, 200);
        thisone.dataset.statu = "opened";
    }
}

function notMine(thisone, mine_count) {


    if (thisone.dataset.statu == "opened" && thisone.dataset.isjustopened == "false" && thisone.dataset.minecount > 0) {
        
        let flag_count = 0;
        let x = parseInt(thisone.dataset.x); // thisone x
        let y = parseInt(thisone.dataset.y); // thisone y

        flag_count += flagChecker(x-1, y-1); // top left
        flag_count += flagChecker(x  , y-1); // top center
        flag_count += flagChecker(x+1, y-1); // top right
    
        flag_count += flagChecker(x-1, y  ); // mid left
        flag_count += flagChecker(x+1, y  ); // mid right

        flag_count += flagChecker(x-1, y+1); // bot left
        flag_count += flagChecker(x  , y+1); // bot center
        flag_count += flagChecker(x+1, y+1); // bot right

        if (flag_count == thisone.dataset.minecount) {

            thisone.dataset.isjustopened = "true";

            if (!(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y-1)+"']") == null || document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y-1)+"']") == undefined) && !(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y-1)+"']").dataset.statu == "opened") && !(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y-1)+"']").dataset.statu == "flag")) { // null checker
                decider(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y-1)+"']"));  // top left
            }
            if (!(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y-1)+"']") == null || document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y-1)+"']") == undefined) && !(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y-1)+"']").dataset.statu == "opened") && !(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y-1)+"']").dataset.statu == "flag")) { // null checker
                decider(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y-1)+"']"));  // center left
            }
            if (!(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y-1)+"']") == null || document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y-1)+"']") == undefined) && !(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y-1)+"']").dataset.statu == "opened") && !(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y-1)+"']").dataset.statu == "flag")) { // null checker
                decider(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y-1)+"']"));  // bot left
            }
            
            if (!(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y  )+"']") == null || document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y  )+"']") == undefined) && !(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y  )+"']").dataset.statu == "opened") && !(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y  )+"']").dataset.statu == "flag")) { // null checker
                decider(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y  )+"']"));  // top mid
            }
            if (!(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y  )+"']") == null || document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y  )+"']") == undefined) && !(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y  )+"']").dataset.statu == "opened") && !(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y  )+"']").dataset.statu == "flag")) { // null checker
                decider(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y  )+"']"));  // bot mid
            }

            if (!(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y+1)+"']") == null || document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y+1)+"']") == undefined) && !(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y+1)+"']").dataset.statu == "opened") && !(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y+1)+"']").dataset.statu == "flag")) { // null checker
                decider(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y+1)+"']"));  // top right
            }
            if (!(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y+1)+"']") == null || document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y+1)+"']") == undefined) && !(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y+1)+"']").dataset.statu == "opened") && !(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y+1)+"']").dataset.statu == "flag")) { // null checker
                decider(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y+1)+"']"));  // center right
            }
            if (!(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y+1)+"']") == null || document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y+1)+"']") == undefined) && !(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y+1)+"']").dataset.statu == "opened") && !(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y+1)+"']").dataset.statu == "flag")) { // null checker
                decider(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y+1)+"']"));  // bot right
            }
        }

        return;
    }

    if (thisone.dataset.statu == "opened") {
        return;
    }
    
    if (thisone.dataset.statu == "flag") {
        thisone.style.backgroundImage = "none";
        thisone.dataset.statu = "empty";
        mines_left++;
    } else {
        if (mine_count == 0) { // open every next square if a square without mines opened
            let x = parseInt(thisone.dataset.x);
            let y = parseInt(thisone.dataset.y);
            thisone.dataset.statu = "opened";
            thisone.dataset.isjustopened = "true";
            if (!(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y-1)+"']") == null || document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y-1)+"']") == undefined)) { // null checker
                notMine(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y-1)+"']"), document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y-1)+"']").dataset.minecount);  // top left
            }
            if (!(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y-1)+"']") == null || document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y-1)+"']") == undefined)) { // null checker
                notMine(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y-1)+"']"), document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y-1)+"']").dataset.minecount);  // center left
            }
            if (!(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y-1)+"']") == null || document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y-1)+"']") == undefined)) { // null checker
                notMine(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y-1)+"']"), document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y-1)+"']").dataset.minecount);  // bot left
            }
            
            if (!(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y  )+"']") == null || document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y  )+"']") == undefined)) { // null checker
                notMine(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y  )+"']"), document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y  )+"']").dataset.minecount);  // top mid
            }
            if (!(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y  )+"']") == null || document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y  )+"']") == undefined)) { // null checker
                notMine(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y  )+"']"), document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y  )+"']").dataset.minecount);  // bot mid
            }

            if (!(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y+1)+"']") == null || document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y+1)+"']") == undefined)) { // null checker
                notMine(document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y+1)+"']"), document.querySelector("[data-x='"+(x-1)+"'][data-y='"+(y+1)+"']").dataset.minecount);  // top right
            }
            if (!(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y+1)+"']") == null || document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y+1)+"']") == undefined)) { // null checker
                notMine(document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y+1)+"']"), document.querySelector("[data-x='"+(x  )+"'][data-y='"+(y+1)+"']").dataset.minecount);  // center right
            }
            if (!(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y+1)+"']") == null || document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y+1)+"']") == undefined)) { // null checker
                notMine(document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y+1)+"']"), document.querySelector("[data-x='"+(x+1)+"'][data-y='"+(y+1)+"']").dataset.minecount);  // bot right
            }
        }
        thisone.style.backgroundImage = "url(images/Minesweeper_"+mine_count+".png)";
        let flag_btn_id = thisone.nextSibling.id;
        document.getElementById(flag_btn_id).style.visibility = "hidden";
        thisone.dataset.isjustopened = "false";
        thisone.dataset.statu = "opened";
        opened_notmine_buttons++;
    }

    if (opened_notmine_buttons == notmine_counter) {
        document.querySelector("body").style.backgroundColor = "#006847";
        setTimeout(() => {
            game_over_screen(1);
        }, 200);
    }
    
}

function flag(thisone) {
    let prev_elmnt_id = thisone.previousSibling.id;
    let prev_element = document.getElementById(prev_elmnt_id);

    if (prev_element.dataset.statu == undefined) {
        prev_element.dataset.statu = "empty";
    }

    if (prev_element.dataset.statu == "empty") {
        prev_element.style.backgroundImage = "url(images/Minesweeper_flag.png)";
        prev_element.dataset.statu = "flag";
        mines_left--;
        
        if (mines_left > -1) {
            document.querySelector("#mines_left").innerHTML = `<h1>Mines Left: ${mines_left}</h1>`;
        }
    } else {
        prev_element.style.backgroundImage = "none";
        prev_element.dataset.statu = "empty";
        mines_left++;
        if (mines_left > -1) {
            document.querySelector("#mines_left").innerHTML = `<h1>Mines Left: ${mines_left}</h1>`;
        }
    }
    
}

function mineChecker(x, y) {
    let element = document.querySelector("[data-x='"+x+"'][data-y='"+y+"']");

    if (!(element == null || element == undefined)) {
        if (element.dataset.ismine == "true") {
            return 1;
        }
    }
    return 0;
}

function flagChecker(x, y) {
    let element = document.querySelector("[data-x='"+x+"'][data-y='"+y+"']");

    if (!(element == null || element == undefined)) {
        if (element.dataset.statu == "flag") {
            return 1;
        }
    }
    return 0;
}

function around_mineCounter(thisone) {
    var mine_count = 0;
    // count mines one by one through dataset-x dataset-y
    let x = parseInt(thisone.dataset.x); // thisone x
    let y = parseInt(thisone.dataset.y); // thisone y
    
    mine_count += mineChecker(x-1, y-1); // top left
    mine_count += mineChecker(x  , y-1); // top center
    mine_count += mineChecker(x+1, y-1); // top right
    
    mine_count += mineChecker(x-1, y  ); // mid left
    mine_count += mineChecker(x+1, y  ); // mid right

    mine_count += mineChecker(x-1, y+1); // bot left
    mine_count += mineChecker(x  , y+1); // bot center
    mine_count += mineChecker(x+1, y+1); // bot right

    console.log(mine_count);
    return mine_count;
}

