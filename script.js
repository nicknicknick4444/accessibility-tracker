var last_update = document.getElementById("last-update");
var pressy = document.getElementById("pressy");
var time_warning = document.getElementById("time-warning");
const bullet = document.getElementById("bullet");
var api_output = document.getElementById("api-output");
const footer = document.getElementById("footer");
var pix = "-222px";
var sta_width = 3000;
let data_back = {};
let multi = {};
let collect_it = [];
const delay = 30000;

function make_req() {
    fetch("https://api.tfl.gov.uk/Disruptions/Lifts/")
    .then(response => response.json())
    .then(data => {
        data_back = data;
        localStorage.setItem("data_back", JSON.stringify(data_back));
        })
    .then(() => {
        show_output();
    })
    .catch(error => console.log("ERROR!", error));
};

function fill_dicts(arr, element, x, keyo, keyo2) {
    let holder = [];
    if (arr[element] === undefined) {
        arr[element] = [];
        holder.push(JSON.parse(localStorage.getItem("data_back"))[x][keyo]);
        holder.push(JSON.parse(localStorage.getItem("data_back"))[x][keyo2]);
        arr[element].push(holder);
    } else {
        holder.push(JSON.parse(localStorage.getItem("data_back"))[x][keyo]);
        holder.push(JSON.parse(localStorage.getItem("data_back"))[x][keyo2]);
        arr[element].push(holder);
    }
};

function checko(this_array, i, n) {
    if (this_array[i]["stopPointName"] === this_array[n]["stopPointName"] && 
        this_array[i]["outageStartArea"] === this_array[n]["outageStartArea"] && 
        this_array[i]["outageEndArea"] === this_array[n]["outageEndArea"]) {
        return true;
    } else {
        return false;
    }
}

function filter_loop(this_array, lookupval, word) {
    var new_array = [];
    console.log("GORCE!", this_array);
    for (let i in this_array) {
        if (this_array[i][lookupval] !== word) {
            new_array.push(this_array[i]);
        } 
    }

    new_array = new_array.sort((a, b) => {
        if (a.stopPointName < b.stopPointName) {
            return -1;
        } else if (a.stopPointName > b.stopPointName) {
            return 1;
        } else {
            return 0;
        }
    });

    return new_array;
};

function show_output() {
    var the_data = JSON.parse(localStorage.getItem("data_back"));
    for (let i in the_data) {
        for (let n in the_data) {
            if (i !== n && n > i && checko(the_data, i, n)) {
                the_data[n]["stopPointName"] = "DELETE";
            }
        }
    }
    filter_loop("the_data", "stopPointName", "DELETE");
    var the_data2 = filter_loop(the_data, "stopPointName", "DELETE");
    localStorage.setItem("data_back", JSON.stringify(the_data2));
    the_data = JSON.parse(localStorage.getItem("data_back"));
    console.log("PUNZEL!", the_data2);
    var words = "";
    var the_name = "";
    collect_it = [];
    for (let n in the_data) {
        let group = [];
        let lookup = JSON.parse(localStorage.getItem("data_back"))[n]["stopPointName"];
        fill_dicts(multi, lookup, n, "outageStartArea", "outageEndArea");

        group.push(JSON.parse(localStorage.getItem("data_back"))[n]["stopPointName"]);
        group.push(JSON.parse(localStorage.getItem("data_back"))[n]["outageStartArea"]);
        group.push(JSON.parse(localStorage.getItem("data_back"))[n]["outageEndArea"]);
        var messagey = JSON.parse(localStorage.getItem("data_back"))[n]["message"].split(":")[1];
        if (messagey === undefined) {
            messagey = JSON.parse(localStorage.getItem("data_back"))[n]["message"].split("-")[1];
        }
        if (messagey === undefined) {
            messagey = JSON.parse(localStorage.getItem("data_back"))[n]["message"];
        }
        group.push(messagey);
        collect_it.push(group);
    }
    for (let ent in multi) {
        multi[ent] = multi[ent].filter((value, index) => multi[ent].indexOf(value) === index);
    }
    for (let entry in collect_it) {
        let counto = 0;
        for (let inner in collect_it) {
            if (entry !== inner) {
                if (collect_it[entry][0] === collect_it[inner][0]) {
                    counto += 1;
                    if (counto >= 2) {
                        console.log("YOGS!", collect_it[entry]);
                        collect_it[inner][1] = "DELETE";
                    }
                }
            }
            console.log("POLK!", collect_it[entry][0]);
        }
    };
    collect_it = collect_it.filter(entry => entry[1] !== "DELETE");
    for (let q in collect_it) {
            let namey = collect_it[q][0];
            var some_output = "";
            if (multi[namey].length > 1) {
                var info_class = "";
                for (let itemy in multi[namey]) {
                info_class = itemy > 0 ? (window.innerWidth > 570 ? "info-list" : "info-list-mob") : "info";
                    some_output += `<p class=\"${info_class}\" style=\"\">${collect_it[q][3]}</p>
                                    <p class=\"area\">TFL Codes for Area Affected:<br />Start:&nbsp;${multi[namey][itemy][0]}&nbsp;&nbsp;|&nbsp;&nbsp;End: ${multi[namey][itemy][1]}</p>`;
                }
            } 
            else {
                some_output = `<p class=\"info\" style=\"\">${collect_it[q][3]}</p>
                                <p class=\"area\">TFL Codes for Area Affected:<br />Start:&nbsp;${collect_it[q][1]}&nbsp;&nbsp|&nbsp;&nbsp;End:&nbsp;&nbsp;${collect_it[q][2]}</p>`;
            }
            if (collect_it[q][0] !== the_name) {
                the_name = collect_it[q][0];
                collect_it[q][0] = collect_it[q][0].replace("Road", "Rd").replace("Station", "Stn");
                words += `<div class=\"unit\" id=unit-${q}>`;
                var heading = `<p class=\"station\" id=station-${q}><span class=\"heading\" id=heading-${q}>${collect_it[q][0]}</span>
                                <span class=\"notification\"><span id=inner-${q} class=\"notif-inner\" style=\"left: -222px;\" id=goose-${q}>${multi[the_name].length} OUTAGE${multi[the_name].length < 2 ? "" : "S"}</apan></span>`;
                words += `<span style=\"display: inline;\" class=\"control\" id=expand-${q}>+</span>`;
                words += heading;
                words += `<div class=\"detail\" id=detail-${q} style=\"display: none;\">`;
                var heading2 = `<p class=\"station2\" id=station-${q}-2 style=\"display: none;\"><span class=\"heading2\" id=heading-${q}>${collect_it[q][0]}</span>`;
                words += heading2;
                words += `<span style=\"display: none;\" class=\"control2\" id=collapse-${q}>-</span></p>`;
                words += some_output;
                words += `</div></div>`;
            } else {
                words = words;
            }
    }
    api_output.style.display = "none";
    api_output.offsetHeight;
    api_output.innerHTML = "";
    api_output.innerHTML = words;
    api_output.style.display = "block";
    localStorage.setItem("loaded", "Y");
};

function make_clickable() {
    document.addEventListener("click", function(e) {
        var target = e.target;
        var id = target.id.split("-")[1];
        var heado = document.getElementById(`station-${id}`);
        var heado2 = document.getElementById(`station-${id}-2`);
        var detail = document.getElementById(`detail-${id}`);
        var expando = document.getElementById(`expand-${id}`);
        var collapso = document.getElementById(`collapse-${id}`);

        if (target.id === `expand-${id}` && localStorage.getItem("opened") !== "true") {
            let position = event.clientY + 250;
            console.log("GOUCH! ID!", target.id);
            if (detail.style.display === "none") {
                detail.style.display = "block";
                heado.style.display = "none";
                heado2.style.display = "block";
                expando.style.display = "none";
                collapso.style.display = "inline";
                console.log("BOULES!", position);
                localStorage.setItem("opened", "true");
            }
        } else if (target.id === `collapse-${id}`) {
            let position = event.clientY - 100;
            scrollTo(0, position);
            detail.style.display = "none";
            heado.style.display = "block";
            heado2.style.display = "none";
            expando.style.display = "inline";
            collapso.style.display = "none";
            localStorage.setItem("opened", "false");
        }
    });
};

function slide() {
    var ids = [];
    var headers_list = document.getElementsByClassName("heading");

    for (let h in headers_list) {
        if (headers_list[h]["id"] !== undefined) {
            ids.push(headers_list[h]["id"].replace("heading-", ""));
        }
    }

    for (let i in ids) {
        // let header = document.getElementById(`heading-${ids[i]}`);
        let station = document.getElementById(`station-${ids[i]}`);
        let notif = document.getElementById(`inner-${ids[i]}`);

        if (notif.id === `inner-${ids[i]}`) {
            if (notif.style.left === "-222px") {
                let left = station.offsetWidth - 300;
                console.log("Start!", left);
                notif.style.left = left.toString() + "px";
            }
            let left2 = parseInt(notif.style.left.replace("px", ""));
            left2 -= 4;
            if (window.innerWidth > 570) {
                notif.style.left = left2.toString() + "px";
                // if (parseInt(notif.style.left.replace("px", "")) < header.offsetWidth - (header.offsetWidth < 500 ? (notif.offsetWidth) * 4 : (notif.offsetWidth * 6))) {
                if (parseInt(notif.style.left.replace("px", "")) < (0 - (notif.offsetWidth * 1.25))) {
                    let left3 = station.offsetWidth - 65;
                    notif.style.left = left3.toString() + "px";
                }
            } else {
                if (station.offsetWidth !== 0) {
                    sta_width = station.offsetWidth;
                } else {
                    console.log("BAGS!", station.innerHTML, station.innerHTML);
                    sta_width = window.innerWidth;
                }
                if (parseInt(notif.style.left.replace("px", "")) < 0 - 110) {
                    // if (station !== null) {
                    //     console.log("CUBBINS!", station.innerHTML, sta_width);
                    // }
                    pix = (sta_width - 70).toString() + "px";
                    // notif.style.left = pix;
                } 
                // else {
                    notif.style.left = pix;
                // }
            }
        }
    }

    pix = parseInt(pix.replace("px", ""));
    pix -= 4;
    pix = pix.toString() + "px";
    setTimeout(slide, 50);
};

function live_bullet() {
    if (bullet.style.display === "none") {
        bullet.style.display = "inline";
    } else if (bullet.style.display === "inline") {
        bullet.style.display = "none";
    }
    setTimeout(live_bullet, 560);
};

function make_two_digits(item) {
    if (item.length < 2) {
        item = "0" + item;
    }
    return item;
};

function make_time() {
    var hours = new Date().getHours();
    var minutes = new Date().getMinutes();
    var seconds = new Date().getSeconds();

    hours = make_two_digits(hours.toString());
    minutes = make_two_digits(minutes.toString());
    seconds = make_two_digits(seconds.toString());
    var update_string = `${hours}:${minutes}:${seconds}`;
    localStorage.setItem("update-time", update_string);
    return update_string;
}

function show_time() {
    var today = new Date().getDate();
    console.log("PAGS!", today);
    last_update.style.display = "none";
    last_update.offsetHeight;
    last_update.style.display = "block";
    if (parseInt(localStorage.getItem("api_day")) === today) {
        last_update.innerHTML = `Last updated at ${localStorage.getItem("update-time")}`;
    } else {
        last_update.innerHTML = "Update available";
    }
};

function time_check() {
    if (parseInt(localStorage.getItem("later_press_time")) - parseInt(localStorage.getItem("first_press_time"))) {
        return true;
    } else {
        return false;
    }
};

function time_calc() {
    return new Date().getTime() - parseInt(localStorage.getItem("first_press_time"));
};

function time_reaction() {
    var raw = time_calc();
    // Convert to minutes
    raw = raw / 60000;
    var left = parseInt((5 - raw));

    if (time_calc() < delay) {
        time_warning.style.display = "block";
        var reset_message = "";
        if (left > 1) {
            reset_message = "s"
        } else if (left === 1) {
            reset_message = "";
        } else if (left < 1) {
            left = "Under a "
            reset_message = "";
        }
        time_warning.innerHTML = `${left} minute${reset_message} until you can refresh`;
    }
    setTimeout(() => {time_warning.style.display = "none"}, 2000);
};

function button_decide() {
    var latest = new Date().getTime() - parseInt(localStorage.getItem("first_press_time"));
    if (latest < delay) {
        pressy.className = "too-soon";
        pressy.innerHTML = "Refresh";
    } else {
        pressy.className = "good-to-go";
        pressy.innerHTML = "Refresh";
        localStorage.setItem("loaded", "N");
    }
    if (localStorage.getItem("data_back") === null) {
        pressy.clasName = "good-to-go";
        pressy.innerHTML = "Refresh"
    }
    setTimeout(button_decide, 1000);
};

function all_three() {
    let timestamp = new Date().getTime();

    if (localStorage.getItem("data_back") !== null) {
        localStorage.setItem("data_back", "");
    }
    make_req();
    make_clickable();
    localStorage.setItem("first_press_time", timestamp);
    make_time();
    show_time();
};

pressy.addEventListener("click", function() {
    var today = new Date().getDate();
    pressy.innerHTML = "Refresh";
    pressy.className = "too-soon";
    let stamp = new Date().getTime();
    multi = {};
    localStorage.setItem("api_day", today);

    if (localStorage.getItem("data_back") === null || 
        (parseInt(localStorage.getItem("later_press_time")) - parseInt(localStorage.getItem("first_press_time")) >= delay || localStorage.getItem("loaded") === "N")) {
        localStorage.setItem("loaded", "N");
        all_three();
    } else {
        setTimeout(time_reaction(), 2000);
        if (localStorage.getItem("loaded") !== "Y") {
            all_three();
        }
        else {
            console.log("NO POY!");
        }
    }
    if (localStorage.getItem("loaded") === "N" || localStorage.getItem("first_press_time") === null) {
        localStorage.setItem("first_press_time", stamp);
    } else if (localStorage.getItem("loaded") === "Y") {
        localStorage.setItem("later_press_time", stamp);
    }
    if (localStorage.getItem("later_press_time") !== null && 
        (parseInt(localStorage.getItem("later_press_time")) - parseInt(localStorage.getItem("first_press_time")) >= delay)) {
        console.log("wooo!", parseInt(localStorage.getItem("later_press_time")) - parseInt(localStorage.getItem("first_press_time")));
        localStorage.setItem("loaded", "N");
        localStorage.setItem("later_press_time", stamp);
    } else {
        console.log("Nope! 15 minutes you idiot!");
    }
});

function begin() {
    var today = new Date().getDate();
    var year = new Date().getFullYear();

    if (localStorage.getItem("api_day") === null) {
        localStorage.setItem("api_day", today);
    }
    if (localStorage.getItem("opened") === null) {
        localStorage.setItem("opened", "false");
    } else {
        localStorage.setItem("opened", "false");
    }
    if (localStorage.getItem("data_back") === null) {
        localStorage.setItem("loaded", "N");
        console.log("CAG!");
        all_three();
    } 
    else if (localStorage.getItem("loaded") !== "Y") {
        api_output.style.display = "none";
        api_output.offsetHeight;
        api_output.style.display = "block";
        console.log("Poxy");
        show_output();
        make_clickable();
    } 
    else if (localStorage.getItem("loaded") === "Y") {
            console.log("YOGZ!");
            api_output.style.display = "none";
            api_output.offsetHeight;
            api_output.style.display = "block";
            console.log("Droxy");
            show_output();
            make_clickable();
    }
    if (localStorage.getItem("update-time") !== null) {
        show_time();
    } else {
        last_update.style.display = "none";
    }
    button_decide();
    slide();
    live_bullet();
    footer.innerHTML = `© Nick Hart ${year}`;
};

window.onload = begin();
