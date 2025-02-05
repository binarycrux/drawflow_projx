// Create a new Drawflow
var id = document.getElementById("drawflow");
const editor = new Drawflow(id);
editor.reroute = true;
editor.start();

// Events!
editor.on("nodeCreated", function (id) {
  console.log("Node created " + id);
});

editor.on("nodeRemoved", function (id) {
  console.log("Node removed " + id);
});

editor.on("nodeSelected", function (id) {
  console.log("Node selected " + id);
});

editor.on("moduleCreated", function (name) {
  console.log("Module Created " + name);
});

editor.on("moduleChanged", function (name) {
  console.log("Module Changed " + name);
});

editor.on("connectionCreated", function (connection) {
  console.log("Connection created");
  console.log(connection);
});

editor.on("connectionRemoved", function (connection) {
  console.log("Connection removed");
  console.log(connection);
});

editor.on("mouseMove", function (position) {
  console.log("Position mouse x:" + position.x + " y:" + position.y);
});

editor.on("nodeMoved", function (id) {
  console.log("Node moved " + id);
});

editor.on("zoom", function (zoom) {
  console.log("Zoom level " + zoom);
});

editor.on("translate", function (position) {
  console.log("Translate x:" + position.x + " y:" + position.y);
});

editor.on("addReroute", function (id) {
  console.log("Reroute added " + id);
});

editor.on("removeReroute", function (id) {
  console.log("Reroute removed " + id);
});

/* DRAG EVENT */

/* Mouse and Touch Actions */
var elements = document.getElementsByClassName("drag-node");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("touchend", drop, false);
  elements[i].addEventListener("touchmove", positionMobile, false);
  elements[i].addEventListener("touchstart", drag, false);
}

var mobile_item_selec = "";
var mobile_last_move = null;
function positionMobile(ev) {
  mobile_last_move = ev;
}

// Prevent default behavior to drop
function allowDrop(ev) {
  ev.preventDefault();
}

/* Drag */
function drag(ev) {
  if (ev.type === "touchstart") {
    mobile_item_selec = ev.target
      .closest(".drag-node")
      .getAttribute("data-node");
  } else {
    ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
  }
}

/* Drop */
function drop(ev) {
  if (ev.type === "touchend") {
    var parentdrawflow = document
      .elementFromPoint(
        mobile_last_move.touches[0].clientX,
        mobile_last_move.touches[0].clientY
      )
      .closest("#drawflow");
    if (parentdrawflow != null) {
      addNodeToDrawFlow(
        mobile_item_selec,
        mobile_last_move.touches[0].clientX,
        mobile_last_move.touches[0].clientY
      );
    }
    mobile_item_selec = "";
  } else {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("node");
    addNodeToDrawFlow(data, ev.clientX, ev.clientY);
  }
}

/* END DRAG EVENT */
function addNodeToDrawFlow(name, pos_x, pos_y) {
  if (editor.editor_mode === "fixed") {
    return false;
  }
  pos_x =
    pos_x *
      (editor.precanvas.clientWidth /
        (editor.precanvas.clientWidth * editor.zoom)) -
    editor.precanvas.getBoundingClientRect().x *
      (editor.precanvas.clientWidth /
        (editor.precanvas.clientWidth * editor.zoom));
  pos_y =
    pos_y *
      (editor.precanvas.clientHeight /
        (editor.precanvas.clientHeight * editor.zoom)) -
    editor.precanvas.getBoundingClientRect().y *
      (editor.precanvas.clientHeight /
        (editor.precanvas.clientHeight * editor.zoom));
  switch (data) {
    case "github":
      var githubtemplate = `
        <div>
          <div class="title-box"><i class="fab fa-github"></i> Github Stars</div>
          <div class="box">
            <p>Enter Repository URL</p>
            <input type="text" df-name>
          </div>
        </div>
      `;
      editor.addNode(
        "github",
        1,
        1,
        pos_x,
        pos_y,
        "github",
        { name: "" },
        githubtemplate
      );
      break;
    case "telegram":
      var telegramtemplate = `
        <div>
          <div class="title-box"><i class="fab fa-telegram"></i> Send Telegram</div>
          <div class="box">
            <p>Enter Telegram Message</p>
            <input type="text" df-message>
          </div>
        </div>
      `;
      editor.addNode(
        "telegram",
        1,
        1,
        pos_x,
        pos_y,
        "telegram",
        { message: "" },
        telegramtemplate
      );
      break;
    case "aws":
      var awstemplate = `
        <div>
          <div class="title-box"><i class="fab fa-aws"></i> AWS</div>
          <div class="box">
            <p>Enter AWS Configuration</p>
            <input type="text" df-config>
          </div>
        </div>
      `;
      editor.addNode(
        "aws",
        1,
        1,
        pos_x,
        pos_y,
        "aws",
        { config: "" },
        awstemplate
      );
      break;
    case "email":
      var emailtemplate = `
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Send Email</div>
          <div class="box">
            <p>Enter Email Address</p>
            <input type="text" df-email>
          </div>
        </div>
      `;
      editor.addNode(
        "email",
        1,
        1,
        pos_x,
        pos_y,
        "email",
        { email: "" },
        emailtemplate
      );
      break;
    case "template":
      var templatetemplate = `
        <div>
          <div class="title-box"><i class="fas fa-code"></i> Node Template</div>
          <div class="box">
            <p>Enter Template Data</p>
            <input type="text" df-data>
          </div>
        </div>
      `;
      editor.addNode(
        "template",
        1,
        1,
        pos_x,
        pos_y,
        "template",
        { data: "" },
        templatetemplate
      );
      break;
    default:
      console.error("Unknown node type: " + data);
  }
};

var transform = "";
// Show popup
function showpopup(e) {
  e.target.closest(".drawflow-node").style.zIndex = "9999";
  e.target.children[0].style.display = "block";
  transform = editor.precanvas.style.transform;
  editor.precanvas.style.transform = "";
  editor.precanvas.style.left = editor.canvas_x + "px";
  editor.precanvas.style.top = editor.canvas_y + "px";
  console.log(transform);

  editor.editor_mode = "fixed";
}

/* Close popup */
function closemodal(e) {
  e.target.closest(".drawflow-node").style.zIndex = "2";
  e.target.parentElement.parentElement.style.display = "none";
  editor.precanvas.style.transform = transform;
  editor.precanvas.style.left = "0px";
  editor.precanvas.style.top = "0px";
  editor.editor_mode = "edit";
}

/* Change Module */
function changeModule(event) {
  var all = document.querySelectorAll(".menu ul li");
  for (var i = 0; i < all.length; i++) {
    all[i].classList.remove("selected");
  }
  event.target.classList.add("selected");
}
// change mode
function changeMode(option) {
  if (option == "lock") {
    lock.style.display = "none";
    unlock.style.display = "block";
  } else {
    lock.style.display = "block";
    unlock.style.display = "none";
  }
}

/* ************************* */
// Function to handle export
function exportNodes() {
  const data = editor.export();
  const filteredData = {};

  for (const [key, node] of Object.entries(data.drawflow.Home.data)) {
    filteredData[key] = {
      id: node.id,
      name: node.name,
      data: node.data,
    };
  }