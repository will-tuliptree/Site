
<html>
  <head>
    <title>Gmail API Quickstart</title>
    <meta charset='utf-8' />
  </head>
  <body>
    <p>Gmail API Quickstart</p>

    <!--Add buttons to initiate auth sequence and sign out-->
    <button id="authorize-button" style="">Authorize</button>
    <button id="signout-button" style="display: none;">Sign Out</button>

    <pre id="content"></pre>

    <script type="text/javascript">
      // Client ID and API key from the Developer Console
      var CLIENT_ID = '850599549940-p4pvivmjsn9n5oki8q97in21tbfh3hol.apps.googleusercontent.com';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = 'https://www.googleapis.com/auth/gmail.settings.sharing https://www.googleapis.com/auth/gmail.settings.basic';

      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');

      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          discoveryDocs: DISCOVERY_DOCS,
          clientId: CLIENT_ID,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          listLabels();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print all Labels in the authorized user's inbox. If no labels
       * are found an appropriate message is printed.
       */
      function listLabels() {
        gapi.client.gmail.users.labels.list({
          'userId': 'me'
        }).then(function(response) {
          var labels = response.result.labels;
          appendPre('Labels:');

          if (labels && labels.length > 0) {
            for (i = 0; i < labels.length; i++) {
              var label = labels[i];
              appendPre(label.name)
            }
          } else {
            appendPre('No Labels found.');
          }
        });

//https://www.googleapis.com/gmail/v1/users/will@tuliptree.nyc/profile

      /*  console.log(gapi.client.gmail.users.getProfile({
            "userId": 'me',

          }));*/
        console.log(gapi.client.gmail.users.settings.sendAs.patch({
            "userId": 'me',
            "sendAsEmail": "will@tuliptree.nyc",
            "signature": "\u003cdiv dir=\"ltr\"\u003e\u003cdiv\u003e\u003cfont color=\"#002e5e\"\u003eWill Watkins\u003c/font\u003e\u003c/div\u003e\u003cdiv\u003e\u003cfont color=\"#022e5f\"\u003eChief Technology Officer\u003c/font\u003e\u003c/div\u003e\u003cdiv\u003e\u003cfont color=\"#002e5e\"\u003e313.938.8743\u003c/font\u003e\u003c/div\u003e\u003cdiv\u003e\u003cfont color=\"#002e5e\"\u003e\u003ca href=\"http://tuliptree.nyc/\" target=\"_blank\"\u003eTULIPTREE.NYC\u003c/a\u003e\u003cbr\u003e\u003c/font\u003e\u003c/div\u003e\u003cdiv\u003e\u003cimg src=\"https://docs.google.com/uc?export=download&amp;id=0B7SBUcuZTIPvR1M3M0RSLW5hQjA&amp;revid=0B7SBUcuZTIPvVTh3eTRnNmNzaTdXNVI0M3NZazYxQ3BTTXFZPQ\"\u003e\u003cbr\u003e\u003c/div\u003e\u003c/div\u003e",

          }).execute());

        //  "signature": "\u003cdiv dir=\"ltr\"\u003e\u003cdiv\u003e\u003cfont color=\"#3d85c6\"\u003eWill Watkins\u003c/font\u003e\u003c/div\u003e\u003cdiv\u003e\u003cfont color=\"#022e5f\"\u003eChief Technology Officer\u003c/font\u003e\u003c/div\u003e\u003cdiv\u003e\u003cfont color=\"#3d85c6\"\u003e313.938.8743\u003c/font\u003e\u003c/div\u003e\u003cdiv\u003e\u003cfont color=\"#3d85c6\"\u003e\u003ca href=\"http://tuliptree.nyc/\" target=\"_blank\"\u003eTULIPTREE.NYC\u003c/a\u003e\u003cbr\u003e\u003c/font\u003e\u003c/div\u003e\u003cdiv\u003e\u003cimg src=\"https://docs.google.com/uc?export=download&amp;id=0B7SBUcuZTIPvR1M3M0RSLW5hQjA&amp;revid=0B7SBUcuZTIPvVTh3eTRnNmNzaTdXNVI0M3NZazYxQ3BTTXFZPQ\"\u003e\u003cbr\u003e\u003c/div\u003e\u003c/div\u003e",

          //userId='me',sendAsEmail='will@tuliptree.nyc', body="signature"));



      }

      /*GMAIL.users().settings().sendAs().patch(userId='me',
        sendAsEmail=YOUR_EMAIL, body=signature).execute()*/

    </script>

    <script async defer src="https://apis.google.com/js/api.js"
      onload="this.onload=function(){};handleClientLoad()"
      onreadystatechange="if (this.readyState === 'complete') this.onload()">
    </script>
  </body>
</html>
