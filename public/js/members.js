$(document).ready(function() {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page

    $.get("/api/user_data").then(function(data) {

      if (!data[0].userName){
          $(".member-name").text(data[0].email);
      }else{
          $(".member-name").text(data[0].userName);
      }
    });


  });
  