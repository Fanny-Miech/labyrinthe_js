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
    $("#mazeSelected option").remove();
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
    let size = $("#mazeChoice").val();
    let name = $("#mazeSelected").val();
    mazeSelected = getMaze(`${size}`, `${name}`);
    console.log(mazeSelected);
  });
});

