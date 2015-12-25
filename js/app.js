var DEApp = {
    loginStatus   : '',
    authResponse  : '',
    profilePicUrl : '',
    overlayPicUrl : 'img/netneutrality.png',
    albumTitle    : '',
    albumCaption  : '',
    imageTitle    : '', 
    imageCaption  : '',
    globalAlpha   : 0.36,
    statusChangeCallback: function(response) {
        DEApp.loginStatus = response.status;

        if (response.status === 'connected') {
            // console.log(response);
            DEApp.testAPI();
            DEApp.authResponse = response.authResponse;

            } else if (response.status === 'not_authorized') {

            document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
            } else {

            document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook.';
        }
    },
    checkLoginState: function () {
        FB.getLoginStatus(function(response) {
            DEApp.statusChangeCallback(response);
        });
    },
    testAPI: function () {
        FB.api('/me', function(response) {
            document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
            DEApp.testGetProfilePic(response.id);
        });
    },
    testGetProfilePic: function (uid){
        var profilePicUrl = "";
        FB.api(
        "/"+uid+"/picture?type=large",
        function (response) {
            if (response && !response.error) {
                profilePicUrl = response.data.url;
                DEApp.performDraw(profilePicUrl);
            }
        });
    },
    uploadManualPic: function(){
        var file    = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();

        reader.onloadend = function () {
           DEApp.performDraw(reader.result);
        }

        if (file) {
            reader.readAsDataURL(file);
        }
    },
    postPicToFb: function(uid){
        //if ((DEApp.loginStatus === 'connected')&& (typeof DEApp.authResponse.accessToken !== 'undefined')){
            var albumId = '';


                FB.api('/'+uid+'/albums', 'post', {message: 'Saitama!',
                 name: 'OPMan!', is_default: true,}, function(response){
                  console.log(response); console.log("First"); albumId = response.id;});


          //  FB.api('/'+albumId+'/photos', 'post', {caption: 'Saitamas Here!', url: document.getElementById('frm'),
            // }, function(response){ console.log(response);});

        //}
    },
    saveImg: function(){
        var canvas = document.getElementById("canvas");
        var button = document.getElementById('btn-download');
        var dataURL = canvas.toDataURL('image/png');
        button.href = dataURL;
    },
    performDraw: function (profilePicUrl){
        var canvas = document.getElementById("canvas");
        var profileImg = document.createElement('img');
        profileImg.setAttribute('crossOrigin', 'anonymous');
        var context = canvas.getContext('2d');

        // context.globalAlpha = 0.2;
        profileImg.src = profilePicUrl;
        profileImg.onload = start;

        //Draw both the original image and overlay
        function start() {
         canvas.width = profileImg.width;
         canvas.height = profileImg.height;

         context.drawImage(profileImg, 0, 0); 

         var minDimension = 0;

         if (profileImg.width < profileImg.height){
            minDimension = profileImg.width;
         }else{
            minDimension = profileImg.height;
         }
         
         drawOverlay(canvas.width, canvas.height, minDimension);
        }

        //Draw overlay image on secondCanvas and copyover to first canvas
        function drawOverlay(w, h, m){
            var canvas2 = document.createElement("canvas");
            var overlayImg = document.createElement('img');
            var ctx2=canvas2.getContext("2d");

            overlayImg.src = DEApp.overlayPicUrl;
            overlayImg.onload = function(){
                canvas2.width = m;
                canvas2.height = m;

                ctx2.globalAlpha = DEApp.globalAlpha;
                ctx2.drawImage(overlayImg, 0, 0, m, m);
                context.drawImage(canvas2, (w-m)/2, (h-m)/2);

                var img = document.getElementById('mir2');
                var d2a = document.getElementById('d2');
                img.setAttribute('crossOrigin', 'anonymous');
                img.src = canvas.toDataURL("image/png");
                d2a.href = canvas.toDataURL("image/png");

                DEApp.unhide('action_call');
            };
        }


    },
    unhide: function(id){
        var elem = document.getElementById(id);
        elem.style.display = 'block';
    }

};