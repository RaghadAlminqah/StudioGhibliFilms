firebase.initializeApp(Config);
var messageAppReference = firebase.database();
var messageAppAuth = firebase.auth();

$(() => {
  initApp();
  getFanMessages()
var firebaseCurrentUser = {};
  var $messageBoardDiv = $('.message-board');

    $('#message-form').submit(function(event) {
      event.preventDefault()
 
    var message = $('#message').val()
    $('#message').val('')
 
    var messagesReference = messageAppReference.ref('messages');
 
    messagesReference.push({
      message: message,
      votes: 0,
      user: messageAppAuth.currentUser.uid,
      email: messageAppAuth.currentUser.email
    })
  }) 

  function getFanMessages() {    
    // var firebaseCurrentUser = {};
    console.log(firebaseCurrentUser)
    // console.log(firebaseCurrentUserId)

    messageAppReference
    .ref('messages')
    .on('value', (results) => {
      $messageBoardDiv.empty()

      // VAL() IS A FIREBASE METHOD
      let allMessages = results.val()
      
      for (let msg in allMessages) {        
        
        // UPVOTES
        var $upVoteElement = $(`<i class="fa fa-thumbs-up pull-right"></i>`)
        $upVoteElement.on('click', (e) => {
          let id = e.target.parentNode.id
          let updatedUpvotes = parseInt(e.target.parentNode.getAttribute('data-votes')) + 1
          
          messageAppReference
            .ref(`messages/${id}/`)
            .update({votes: updatedUpvotes})
              .then(() => { console.log("Update Upvotes succeeded.") })
              .catch(error => { console.log("Update failed: " + error.message) });
        }) 

        // DOWNVOTES
        var $downVoteElement = $(`<i class="fa fa-thumbs-down pull-right"></i>`)
        $downVoteElement.on('click', (e) => {
          let id = e.target.parentNode.id
          let updatedDownVotes = parseInt(e.target.parentNode.getAttribute('data-votes')) - 1

          messageAppReference
            .ref(`messages/${id}/`)
            .update({votes: updatedDownVotes})
              .then(() => { console.log("Update Downvotes succeeded.") })
              .catch(error => { console.log("Update failed: " + error.message) });
        })        
        
        // DELETE MESSAGE
        var $deleteElement = $(`<i class="fa fa-trash pull-right delete"></i>`)
        $deleteElement.on('click', (e) => {
          let id = e.target.parentNode.id
          let userId = e.target.parentNode.getAttribute('data-user')
          
          console.log(userId)
          console.log(messageAppAuth.currentUser.uid)
          
          if (userId === messageAppAuth.currentUser.uid) {
            messageAppReference
            .ref(`messages/${id}`)
            .remove()
              .then(() => { console.log("Remove succeeded.") })
              .catch(error => { console.log("Remove failed: " + error.message) });
          } else {
            alert(`Only ${userId} can delete that!!`)
          }
        })

        // CREATE VOTES DISPLAY
        var $votes = $(`<div class="pull-right">${allMessages[msg].votes}</div>`)

        // CREATE NEW MESSAGE LI ELEMENT
        let $newMessage = $(`<li id=${msg} data-user=${allMessages[msg].user} data-votes=${allMessages[msg].votes}>${allMessages[msg].message}</li>`);
        
        // CREATE CURRENT USER DISPLAY
        var $firebaseCurrentUser = $(`<div class="pull-right">${allMessages[msg].email}</div>`)

        // APPEND ICONS TO THE LI
        $newMessage
          .append($votes)
          .append($deleteElement)
          .append($downVoteElement)
          .append($upVoteElement)
          .append($firebaseCurrentUser)

        // APPEND NEW MESSAGE TO MESSAGE BOARD  
        $messageBoardDiv
          .append($newMessage);
      }
    })
  }

// FIREBASE AUTH STUFF
 /**
     * Handles the sign in button press.
     */
    function toggleSignIn() {
      if (messageAppAuth.currentUser) {
        firebaseCurrentUser = messageAppAuth.currentUser
        console.log(firebaseCurrentUser)
        // [START signout]
        messageAppAuth.signOut();
        // [END signout]
      } else {
        // firebaseCurrentUser = "Not Logged In"
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        messageAppAuth.signInWithEmailAndPassword(email, password)
        .then(response => {
          console.log(response.user.uid)
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });
        // [END authwithemail]
      }
      document.getElementById('quickstart-sign-in').disabled = true;
    }
    /**
     * Handles the sign up button press.
     */
    function handleSignUp() {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START createwithemail]
      messageAppAuth.createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END createwithemail]
    }
    /**
     * Sends an email verification to the user.
     */
    function sendEmailVerification() {
      // [START sendemailverification]
      messageAppAuth.currentUser.sendEmailVerification().then(function() {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('Email Verification Sent!');
        // [END_EXCLUDE]
      });
      // [END sendemailverification]
    }
    function sendPasswordReset() {
      var email = document.getElementById('email').value;
      // [START sendpasswordemail]
      messageAppAuth.sendPasswordResetEmail(email).then(function() {
        // Password Reset Email Sent!
        // [START_EXCLUDE]
        alert('Password Reset Email Sent!');
        // [END_EXCLUDE]
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/invalid-email') {
          alert(errorMessage);
        } else if (errorCode == 'auth/user-not-found') {
          alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
      });
      // [END sendpasswordemail];
    }
    /**
     * initApp handles setting up UI event listeners and registering Firebase auth listeners:
     *  - messageAppAuth.onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    function initApp() {
      // Listening for auth state changes.
      // [START authstatelistener]
      messageAppAuth.onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-verify-email').disabled = true;
        // [END_EXCLUDE]
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE]
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
          document.getElementById('quickstart-sign-in').textContent = 'Sign out';
          document.getElementById('quickstart-account-details').textContent = JSON.stringify({uid: user.uid, email: user.email}, null, '  ');
          if (!emailVerified) {
            document.getElementById('quickstart-verify-email').disabled = false;
          }
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]
          document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
          document.getElementById('quickstart-sign-in').textContent = 'Sign in';
          document.getElementById('quickstart-account-details').textContent = 'null';
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authstatelistener]
      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
      document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
      document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
      document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);

    }
  }) 
     
  
 
var ghibliArticles = [];
var allArticlesArray = [];
var imgs = [
  'https://upload.wikimedia.org/wikipedia/en/f/f5/Castle_in_the_Sky_%281986%29.png',
  'https://upload.wikimedia.org/wikipedia/en/a/a5/Grave_of_the_Fireflies_Japanese_poster.jpg',
  'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
  'https://upload.wikimedia.org/wikipedia/en/0/07/Kiki%27s_Delivery_Service_%28Movie%29.jpg',
  'https://upload.wikimedia.org/wikipedia/en/4/46/OYpost.jpg',
  'https://upload.wikimedia.org/wikipedia/en/f/fc/Porco_Rosso_%28Movie_Poster%29.jpg',
  'https://upload.wikimedia.org/wikipedia/en/6/68/Pompokoposter.jpg',
  'https://upload.wikimedia.org/wikipedia/en/9/93/Whisper_of_the_Heart_%28Movie_Poster%29.jpg',
  'https://upload.wikimedia.org/wikipedia/en/8/8c/Princess_Mononoke_Japanese_poster.png',
  'https://upload.wikimedia.org/wikipedia/en/4/4b/My_Neighbors_the_Yamadas_%281999%29.jpg',
  'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png',
  'https://upload.wikimedia.org/wikipedia/en/8/8e/Cat_Returns.jpg',
  'https://upload.wikimedia.org/wikipedia/en/a/a0/Howls-moving-castleposter.jpg',
  'https://upload.wikimedia.org/wikipedia/en/e/e5/Gedo6sn.jpg',
  'https://upload.wikimedia.org/wikipedia/en/9/9d/Ponyo_%282008%29.png',
  'https://upload.wikimedia.org/wikipedia/en/e/e7/Karigurashi_no_Arrietty_poster.png',
  'https://upload.wikimedia.org/wikipedia/en/c/c9/From_Up_on_Poppy_Hill.png',
  'https://upload.wikimedia.org/wikipedia/en/a/a3/Kaze_Tachinu_poster.jpg',
  'https://upload.wikimedia.org/wikipedia/en/6/68/The_Tale_of_the_Princess_Kaguya_%28poster%29.jpg',
  'https://upload.wikimedia.org/wikipedia/en/a/a7/When_Marnie_Was_There.png'
]
// var comments = messagesReference;
// console.log(comments)
var $popUp = $('#popUp');
var $cpopUp = $('#cpopUp');
var $main = $('#main');
var $LpopUp = $('#LpopUp');

// var $LclosePopUp =$('#LclosePopUp');

function appendDom(array) {
  array.forEach((article, index) => {
    // console.log(article)
    $main.append(`
      <article class="article" >
        <section class="featuredImage">
          <img src=${article.image} alt="">
        </section>
        <section class="articleContent">
          <a href='#'><h3 id=${index}>${article.title}</h3></a>
          <h6> Director: ${article.director}</h6>
          <h6> Producer: ${article.producer}</h6>
          <h6> Year: ${article.year}</h6>
          
        </section>
        <section class="impressions">
        <h3> Rating: </h3>
         <h5> ${article.score}/100</h5>
        </section>
        <div class="clearfix"></div>
      </article>
    `)
  })

  $('.article a').on('click', (e) => {
    let chosenArticle = array[e.target.id]
    
    $popUp
    .empty()
      .attr('class', '')
      .prepend(`
        <a href="#" class="closePopUp">X</a>
        <div class="container">
          <h1>${chosenArticle.title}</h1>

          <img src=${chosenArticle.image} />
          
          <p>
          ${chosenArticle.description}
          </p>
          <br/>
          </div>
           
          <button class="bcomment">Post to board</button>
         
      `)

    $('.closePopUp').on('click', () => {
      $popUp.addClass('hidden')
      $cpopUp.addClass('hidden')
    })

    $('.bcomment').on('click', () => {
      $cpopUp
        .attr('class', '')
        $('.cclosePopUp').on('click', () => {
          $cpopUp.addClass('hidden')
        })
        // var chosencomments = chosenArticle.comments
        // $('.message-board').append(chosencomments)
      
    })
  })
}


async function getAllArticles() {
  let ghibliResponse = await $.get('https://ghibliapi.herokuapp.com/films')
 
  await parseArticles(ghibliResponse)
  await appendDom(ghibliArticles)
  $popUp.addClass('hidden');
  console.log(ghibliArticles);
  console.log("Articles loaded");
}  

function parseArticles(ghibliResponse) {
  ghibliResponse.forEach(function(article , imgs ) {
    ghibliArticles.push({
      title: article.title,
      director: article.director,
      producer: article.producer,
      year: article.release_date,
      url: "",
      score: article.rt_score,
      image: imgs=this.imgs[imgs],
      comments: "",
      source: "",
      description: article.description
    })
  })  
} 

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
 

$(() => {
 
  getAllArticles()
  $main.empty()
  
})

$('.loginPopUp').on('click', () => {
  $LpopUp
    .attr('class', '')
    $('.lclosePopUp').on('click', () => {
      $LpopUp.addClass('hidden')
    }) })
  