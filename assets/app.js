$(document).ready(function () {

    $.getJSON("./data/labyrinthes.json", function (data) {
      let maze1 = data["3"]["ex-0"];
      console.log(maze1);
      maze1.forEach((element) => {});
    }).fail(function () {
      console.log("An error has occurred.");
    });
    
  });