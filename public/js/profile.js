$(document).ready(function() {
  let userInfo
  const nameInput = document.getElementById('userName');
  //const cmsForm = document.getElementById('cms');
      $("#cms").on('submit',(e)=>{
          
              handleFormSubmit(e)
          } );
  
  
  
      $.get("/api/user_data").then(function(data) {
        //console.log(data[0].email)
          if (!data[0].userName){
              $(".member-name").text(data[0].email);
          }else{
              $(".member-name").text(data[0].userName);
          }
          userInfo = data
        });
  
        // $.get("/api/image").then(function(data) {
        //   //console.log(data[0].email)
        //     if (!data[0].userName){
        //         $(".member-name").text(data[0].email);
        //     }
        //   });
  
  const handleFormSubmit = (e) => {
  e.preventDefault();
  
  
    const userName = {
          email: userInfo[0].email,
          userName: nameInput.value.trim()
     }   
  
  
    const updatePost = (post) => {
      fetch('/api/username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      })
        .then(() =>{
          window.location.reload()
          $('#userName').val("")
        })
        .catch((err) => console.error(err));
    };
  
  updatePost(userName)
  
  }
  
  $.get("/api/photo").then(function(data){
    if (data.length === 0) {
      $("#profileImage").attr("src", `/assets/hero1.png`);
    }else {
      let img = data[0].name
      $("#profileImage").attr("src", `/assets/tmp/${img}`)
    }
  })
  
  
  
  });
  