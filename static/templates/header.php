<header id="header">
    <div id="nav-container">
      <nav id="nav">
        <div class="row text-center">
            <div class="nav-item-container">
              <div class="nav-item"><a href="#"> ABOUT US</a> </div>
              <div class="nav-item">
                  <a href="#"> OUR SERVICES </a>
                  <div class="nav-item_box ">
                      <div class="nav-item_box_content">
                          <a class="sub-nav_link" href="#"> CLAIMS & UNDERWRITING </a>
                          <a class="sub-nav_link" href="#"> MOD REVIEWS </a>
                          <a class="sub-nav_link" href="#"> BROKER </a>

                    </div>
                  </div>
              </div>
              <div class="nav-item"><a href="#"> <img class="nav-logo" src="images/logo.png"> </a>  </div>
              <div class="nav-item">
                  <a href="#"> GET A QUOTE </a>
                  <div class="nav-item_box ">
                      <div class="nav-item_box_content">
                          <a class="sub-nav_link" href="#"> EMR </a>
                          <a class="sub-nav_link" href="#"> CLAIMS REPRESENTATION </a>
                    </div>
                  </div>
              </div>
              <div class="nav-item"><a href="#"> CONTACT US </a>  </div>
              <div class="nav-item t-btn_modal" data-modalid="crmWebToEntityForm" id="nav-signUp"><a href="JavaScript:Void(0)"> SIGN UP </a>  </div>

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
  this.classList.toggle("is-active");
  mobileNav.classList.toggle("mobile-nav-active");
  mobileNavList.classList.toggle("hidden");
  mobileNavList.classList.toggle("fadeIn");
  mobileNavList.classList.toggle("fadeOut");
 };



</script>

    </div>
</header>
