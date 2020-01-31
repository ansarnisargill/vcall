var maxCALLERS = 1;
var numVideoOBJS = maxCALLERS + 1;
var boxUsed = [true, false];
easyrtc.dontAddCloseButtons(false);

function callEverybodyElse(roomName, otherPeople) {

    easyrtc.setRoomOccupantListener(null); // so we're only called once.

    var list = [];
    var connectCount = 0;
    for (var easyrtcid in otherPeople) {
        list.push(easyrtcid);
    }
    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
    function establishConnection(position) {
        function callSuccess() {
            connectCount++;
            if (connectCount < maxCALLERS && position > 0) {
                establishConnection(position - 1);
            }
        }
        function callFailure(errorCode, errorText) {
            easyrtc.showError(errorCode, errorText);
            if (connectCount < maxCALLERS && position > 0) {
                establishConnection(position - 1);
            }
        }
        easyrtc.call(list[position], callSuccess, callFailure);

    }
    if (list.length > 0) {
        establishConnection(list.length - 1);
    }
}

function loginSuccess() { }
function SetSize() {
   document.getElementById("box0").style.width=(window.innerWidth/4)+'px';
   document.getElementById("box0").style.height=((window.innerHeight/4)-34)+'px';
   document.getElementById("box1").style.width=(window.innerWidth)+'px';
   document.getElementById("box1").style.height=((window.innerHeight)-34)+'px';


}
async function appInit() {
    SetSize();
    var RoomName = localStorage.RoomName;
    easyrtc.setRoomOccupantListener(callEverybodyElse);
    var roomNameForChat = RoomName.replace(new RegExp(" ", 'g'), "");
    easyrtc.easyApp(roomNameForChat, "box0", ["box1"], loginSuccess);
   // easyrtc.setPeerListener(messageListener);
    easyrtc.setDisconnectListener(function () {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });
    easyrtc.setOnCall(function (easyrtcid, slot) {
        console.log("getConnection count=" + easyrtc.getConnectionCount());
        boxUsed[slot + 1] = true;
        document.getElementById(getIdOfBox(slot + 1)).style.visibility = "visible";
    });

    easyrtc.setOnHangup(function (easyrtcid, slot) {
        boxUsed[slot + 1] = false;
       
        setTimeout(function () {
            document.getElementById(getIdOfBox(slot + 1)).style.visibility = "hidden";
        }, 20);
    });
    document.getElementById("roomName").innerText = RoomName;
    window.addEventListener("resize", SetSize);
}
function getIdOfBox(boxNum) {
    return "box" + boxNum;
}










































