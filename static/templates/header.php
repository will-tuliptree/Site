<header id="header">
    <div id="nav-container">
      <nav id="nav">
        <div class="row text-center">
            <div class="nav-item-container">
              <div class="nav-item">
                  <a href="#about-content"> ABOUT US</a>
                  <div class="nav-item_box ">
                      <div class="nav-item_box_content">
                          <a class="sub-nav_link t-btn_modal" href="JavaScript:Void(0)" data-modalid="modal-about" > MORE INFO </a>
                    </div>
                  </div>
              </div>
              <div class="nav-item">
                  <a href="#services"> OUR SERVICES </a>
                  <div class="nav-item_box ">
                      <div class="nav-item_box_content">
                          <a class="sub-nav_link" href="#cu-services" > CLAIMS & UNDERWRITING </a>
                          <a class="sub-nav_link t-btn_modal" href="JavaScript:Void(0)" data-modalid="modal-exp-mod_review"> MOD REVIEWS </a>
                         <!-- <a class="sub-nav_link" href=""> BROKER </a> -->

                    </div>
                  </div>
              </div>
              <div class="nav-item"><a href="#"> <img class="nav-logo" src="images/logo.png"> </a>  </div>
              <div class="nav-item">
                  <a href="JavaScript:Void(0)" class="t-btn_modal" data-modalid="get-a-quote_form"> GET A QUOTE </a>
                  <div class="nav-item_box ">
                      <div class="nav-item_box_content">
                          <a class="sub-nav_link t-btn_modal" data-modalid="get-a-quote_form" href="JavaScript:Void(0)"> EMR </a>
                          <a class="sub-nav_link t-btn_modal" data-modalid="get-a-quote_form" href="JavaScript:Void(0)"> CLAIMS REPRESENTATION </a>
                    </div>
                  </div>
              </div>
              <div class="nav-item"><a href="#contact-us"> CONTACT US </a>  </div>
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
        <li> <a href="#about-content"> ABOUT US</a></li>
        <li> <a href="#services"> OUR SERVICES </a></li>
        <li> <a class="t-btn_modal" href="javaScript:void(0)" data-modalid="get-a-quote_form"> GET A QUOTE </a></li>
        <li><a href="#contact-us"> CONTACT US</a>  </li>
        <li><a class="t-btn_modal" href="JavaScript:Void(0)" data-modalid="crmWebToEntityForm"> SIGN UP</a>  </li>
      </ul>
      <div id="mobile-nav-logo" href="#">
          <img class="nav-logo" src="images/logo.png">
      </div>
    </nav>



<script>

var mobileNav = document.getElementById('mobile-nav');
var mobileNavButton = document.getElementById('mobile-nav-button');
var mobileNavList = document.getElementById('mobile-nav-list');
var mobileLogo = document.getElementById('mobile-nav-logo');
mobileNavButton.onclick = function(event) {
  this.classList.toggle("is-active");
  mobileNav.classList.toggle("mobile-nav-active");
  mobileNavList.classList.toggle("hidden");
  mobileNavList.classList.toggle("fadeIn");
  mobileNavList.classList.toggle("fadeOut");
  mobileLogo.classList.toggle("hidden");
 };

mobileNavList.onclick = function(event){
    mobileNavButton.classList.toggle("is-active");
    mobileNav.classList.toggle("mobile-nav-active");
    mobileNavList.classList.toggle("fadeIn");
    mobileNavList.classList.toggle("fadeOut");
    mobileNavList.classList.toggle("hidden");
    mobileLogo.classList.toggle("hidden");



}

</script>

    </div>
</header>
