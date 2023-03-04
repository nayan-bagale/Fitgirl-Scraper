var local_data = [];
var counter;
const userCard = $("[data-user-template]");
const searchInput = $("[data-search]");
const selectInput = $("[data-select]");
const showMore = $("[data-show-more]");

$(document).ready(async function () {
  let responce = await fetch("https://fitgirl-scraper-production.up.railway.app/data");
  let data = await responce.json();
  local_data = data.map((e, i) => {
    const card = userCard.clone(true).contents();
    card.find("[data-title]").text(e.title);
    card.find("[data-genre]").text(e.genres);
    card.find("[data-link]").attr("href", e.link);
    $(".row").append(card);
    if (i < 50) {
      card.toggleClass("hide", false);
      counter = i;
    } else {
      card.toggleClass("hide", true);
    }
    return { title: e.title, genres: e.genres, element: card };
  });
});

showMore.on("click", function (e) {
  e.preventDefault();
  for (var i = counter; counter < i + 50; counter++) {
    const card = local_data[counter].element;
    card.toggleClass("hide", false);
  }
});

searchInput.on("input", function (e) {
  let value = e.target.value.toLowerCase();
  local_data.forEach((data, i) => {
    
    const isvisible = data.title.toLowerCase().includes(value);
    data.element.toggleClass("hide", !isvisible);
  });
});

selectInput.on("change", function (e) {
  let genre = e.target.value.toLowerCase();
  try {
    local_data.forEach((data) => {
      let boolean = false;
      if (genre == "default") {
        throw 'Break';
      }
      data.genres.forEach((item) => {
        const isvisible = item.toLowerCase().match(genre);
        if(isvisible){
          data.element.toggleClass("hide", !isvisible);
          boolean = true;
        }else if(boolean){
          return;
        }else{
          data.element.toggleClass("hide", !isvisible);
        }
      });
    });
  } catch(e) {
    if (e !== 'Break') throw e
    else{
      local_data.forEach((data, i) => {
        if( counter >=  i){
          data.element.toggleClass("hide", false);
        }else{
          data.element.toggleClass("hide", true);
        }
      });
    }
  }
});

//   $(".card").on({
//     mouseenter: function () {
//         $(this).removeClass("border-info");
//     $(this).addClass("text-bg-info");
//     },
//     mouseleave: function () {
//         $(this).removeClass("text-bg-info");
//     $(this).removeClass("border-info");
//     }
// });

// $(".card").hover(function(){
//   $(this).removeClass("border-info");
//     $(this).addClass("text-bg-info");
//   }, function(){
//     $(this).removeClass("text-bg-info");
//     $(this).removeClass("border-info");
// });