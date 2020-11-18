let allData;

$.getJSON("./data/labyrinthes.json", function (data) {
  allData = data;
}).fail(function () {
  console.log("An error has occurred.");
});

$(document).ready(function () {
  const getMaze = (param1, param2) => {
    return allData[param1][param2];
  };

  const clear = (element) => {
    $(`${element}`).remove();
  };

  //   getMaze("4", "ex-0");

  const isReady = () => {
    for (const size in allData) {
      console.log(size);
      $("#mazeChoice").append(
        `<option value="${size}"> ${size} x ${size}</option>`
      );
    }
  };

  $("#mazeChoice").on("change", function () {
    clear("#mazeSelected option");
    let current_size = $("#mazeChoice").val();

    for (const name in allData[current_size]) {
      $("#mazeSelected").append(`<option value="${name}"> ${name}</option>`);
    }
  });

  $("#isReady").click(function () {
    isReady();
    $("#formReady").removeClass("d-none");
    $(this).addClass("d-none");
    console.log(allData);
  });

  let mazeSelected;

  $("#mazeSelected").on("change", function () {
    clear("#grid-container div");
    let size = $("#mazeChoice").val();
    let name = $("#mazeSelected").val();
    mazeSelected = getMaze(`${size}`, `${name}`);
    console.log(mazeSelected);
    displayMaze(mazeSelected, size);
  });

  function displayMaze(maze, size) {

    let box = 100;
    if (size>=20) box = 20;
    else if(size>=15) box = 30;
    else if(size>=10) box = 50;

    document.getElementById(
      "grid-container"
    ).style.gridTemplateColumns = `repeat(${size}, ${box}px)`;
    document.getElementById(
      "grid-container"
    ).style.gridTemplateRows = `repeat(${size}, ${box}px)`;

    for (let i = 0; i < maze.length; i++) {
      let borderstyle = "";

      for (let j = 0; j < maze[i]["walls"].length; j++) {
        if (maze[i]["walls"][j]) {
          borderstyle = borderstyle + "solid ";
        } else {
          borderstyle = borderstyle + "none ";
        }
      }

      console.log(borderstyle, "cell n° " + i);
      let element = document.createElement("DIV");
      element.className = "cell cell_" + i;
      if (i == maze.length - 1) {
        element.className = "cell cell_end";
      }
      element.style.borderStyle = borderstyle;
      document.getElementById("grid-container").appendChild(element);
    }
  }
});
