//==============================
//     get Data from JSON
//==============================
let allData;

$.getJSON("./data/labyrinthes.json", function (data) {
  allData = data;
}).fail(function () {
  console.log("An error has occurred.");
});

//===============================
//      LOAD
//===============================

$(document).ready(function () {
  let displayBuffer = [];

  //======  get Maze  ============
  const getMaze = (param1, param2) => {
    return allData[param1][param2];
  };

  //======  Clear ============
  const clear = (element) => {
    $(`${element}`).remove();
  };

  //===========================================================
  //      function isReady to prepare display form MazeChoice
  //================================================================
  const isReady = () => {
    $("#mazeChoice").append(`<option selected disabled>Chose maze</option>`);
    for (const size in allData) {
      console.log(size);
      //display options for mazeChoice
      $("#mazeChoice").append(
        `<option value="${size}"> ${size} x ${size}</option>`
      );
    }
  };

  //=======================================================
  //      function click on isReady button to display form
  //==========================================================
  $("#isReady").click(function () {
    isReady();
    $("#formReady").removeClass("d-none");
    $(this).addClass("d-none");
    console.log(allData);
  });

  //=======================================================
  //      function on change on mazeChoice to display option
  //===========================================================
  $("#mazeChoice").on("change", function () {
    clear("#mazeSelected option");
    let current_size = $("#mazeChoice").val();
    $("#mazeSelected").append(`<option selected disabled>Default</option>`);
    for (const name in allData[current_size]) {
      //display option for mazeSelected
      $("#mazeSelected").append(`<option value="${name}"> ${name}</option>`);
    }
  });

  //==========================================================
  //      function on change on mazeSelected to display Maze
  //===============================================================
  let mazeSelected;

  $("#mazeSelected").on("change", function () {
    clear("#grid-container div");
    let size = $("#mazeChoice").val();
    let name = $("#mazeSelected").val();
    mazeSelected = getMaze(`${size}`, `${name}`);
    console.log(mazeSelected);
    displayMaze(mazeSelected, size);
  });

  //===============================
  //      function displayMaze
  //===============================
  function displayMaze(maze, size) {
    let box = 100;
    if (size >= 20) box = 20;
    else if (size >= 15) box = 30;
    else if (size >= 10) box = 50;

    //initiate grid
    document.getElementById(
      "grid-container"
    ).style.gridTemplateColumns = `repeat(${size}, ${box}px)`;
    document.getElementById(
      "grid-container"
    ).style.gridTemplateRows = `repeat(${size}, ${box}px)`;

    //loop in maze to create div element for each cell of grid
    for (let i = 0; i < maze.length; i++) {
      let borderstyle = "";

      //loop in walls of cell to create border
      for (let j = 0; j < maze[i]["walls"].length; j++) {
        if (maze[i]["walls"][j]) {
          borderstyle = borderstyle + "solid ";
        } else {
          borderstyle = borderstyle + "none ";
        }
      }

      //create element + add class
      // console.log(borderstyle, "cell n° " + i);
      let element = document.createElement("DIV");
      element.className = "cell cell_" + i;
      element.id = "id_" + i;
      if (i == maze.length - 1) {
        element.className = "cell cell_end";
      }
      element.style.borderStyle = borderstyle;
      document.getElementById("grid-container").appendChild(element);
    }
  }

  //=========================================================
  //=========================   DFS   =======================
  //=========================================================

  //==================================
  //      function on click on DFS do
  //====================================
  $("#DFS").click(function () {
    let size = $("#mazeChoice").val();
    let name = $("#mazeSelected").val();
    mazeSelected = getMaze(`${size}`, `${name}`);

    dfs(size, mazeSelected);
    startDisplay();
  });

  //===============================
  //      function neighbours
  //===============================
  const neighbours = (maze, size, cell) => {
    const neighbours = [];

    const index_cell = maze.indexOf(cell);
    // console.log("index_cell : " + index_cell);
    // console.log("indexOf cell : " + maze.indexOf(cell));
    // console.log("size : " + size);

    size = parseInt(size);

    //define neighbours top, right, bottom, left
    let top_cell;
    if (index_cell > size) {
      top_cell = index_cell - size;
    } else top_cell = null;

    let right_cell = index_cell + 1;

    let bottom_cell;
    if (index_cell < maze.length - size) {
      bottom_cell = index_cell + size;
    } else bottom_cell = null;

    let left_cell = index_cell - 1;

    //push neighbour in neighbours array
    if (cell.walls[0] == false && top_cell) {
      neighbours.push(top_cell);
    }
    if (cell.walls[3] == false && left_cell) {
      neighbours.push(left_cell);
    }
    if (cell.walls[1] == false && right_cell) {
      neighbours.push(right_cell);
    }
    if (cell.walls[2] == false && bottom_cell) {
      neighbours.push(bottom_cell);
    }

    return neighbours;
  };

  //=========   DFS   ==================

  const dfs = (size, maze) => {
    console.log("----------DFS---------------");
    const start = maze[0];

    for (let i = 0; i < maze.length; i++) {
      maze[i].isVisited = false;
    }

    let stack = [];
    stack.push(start);
    start.isVisited = true;

    while (stack.length != 0) {
      let current_cell = stack.pop();
      displayBuffer.push(maze.indexOf(current_cell));
      if (current_cell == maze[maze.length - 1]) {
        console.log("WIN");
        return;
      }
      let arrayNeighbours = neighbours(maze, size, current_cell);
      console.log("arrayNeighbours : " + arrayNeighbours);

      arrayNeighbours.forEach((neighbour) => {
        console.log("neighbour : " + neighbour);
        if (maze[neighbour].isVisited === false) {
          console.log("neighbour : " + neighbour);
          stack.push(maze[neighbour]);
          maze[neighbour].isVisited = true;
        }
      });

    }
    return false;
  };

  const startDisplay = () => {
    setInterval(() => {
      $("#id_" + displayBuffer.shift()).addClass("good");
    }, 500);
  };

  //========================================================
  //      BFS
  //=======================================================

  //==================================
  //      function on click on DFS do
  //====================================
  $("#BFS").click(function () {
    let size = $("#mazeChoice").val();
    let name = $("#mazeSelected").val();
    mazeSelected = getMaze(`${size}`, `${name}`);

    bfs(size, mazeSelected);
    startDisplay();
  });

  //====    BFS   ==============

  const bfs = (size, maze) => {
    console.log("----------BFS---------------");
    const start = maze[0];

    for (let i = 0; i < maze.length; i++) {
      maze[i].isVisited = false;
    }

    let queue = [];
    queue.push(start);
    start.isVisited = true;

    while (queue.length != 0) {
      let current_cell = queue.shift();
      displayBuffer.push(maze.indexOf(current_cell));
      if (current_cell == maze[maze.length - 1]) {
        console.log("WIN");
        return;
      }
      let arrayNeighbours = neighbours(maze, size, current_cell);
      console.log("arrayNeighbours : " + arrayNeighbours);

      arrayNeighbours.forEach((neighbour) => {
        console.log("neighbour : " + neighbour);

        if (maze[neighbour].isVisited === false) {
          console.log("neighbour : " + neighbour);
          queue.push(maze[neighbour]);
          maze[neighbour].isVisited = true;
        }
      });
    }
    return false;
  };
});
