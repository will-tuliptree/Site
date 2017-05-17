<header id="header">
    <div id="nav-container">
      <nav id="nav">
        <div class="row text-center">
            <div class="nav-item-container">
              <div class="nav-item"><a href="#"> ABOUT US</a> </div>
              <div class="nav-item"><a href="#"> OUR SERVICES </a>  </div>
              <div class="nav-item"><a href="#"> <img class="nav-logo" src="images/logo.png"> </a>  </div>
              <div class="nav-item"><a href="#"> GET A QUOTE </a>  </div>
              <div class="nav-item"><a href="#"> CONTACT US </a>  </div>
              <div class="nav-item" id="nav-signUp"><a href="#"> SIGN UP </a>  </div>

            </div>
            <!--<div class="nav-signUp"><a href="#"> Sign Up </a>  </div>-->

        </div>
      </nav>


    <nav id="mobile-nav">
      <button class="hamburger hamburger--spin" type="button" id="mobile-nav-button">
        <span class="hamburger-box">
          <span class="hamburger-inner"></span>
        </span>
      </button>
      <ul class="mobile-nav-wrapper hidden fadeOut animated" id="mobile-nav-list">
        <li> <a href="#"> ABOUT US</a></li>
        <li> <a href="#"> OUR SERVICES </a></li>
        <li> <a href="#"> GET A QUOTE </a></li>
        <li><a href="#"> CONTACT US</a>  </li>
        <li><a href="#"> SIGN UP</a>  </li>
      </ul>
    </nav>


<script>

var mobileNav = document.getElementById('mobile-nav');
var mobileNavButton = document.getElementById('mobile-nav-button');
var mobileNavList = document.getElementById('mobile-nav-list');
mobileNavButton.onclick = function(event) {
  console.log(this);
  this.classList.toggle("is-active");
  mobileNav.classList.toggle("mobile-nav-active");
  mobileNavList.classList.toggle("hidden");
  mobileNavList.classList.toggle("fadeIn");
  mobileNavList.classList.toggle("fadeOut");







 };



</script>

    </div>
</header>
