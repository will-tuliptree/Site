//Onclicks
//on more info click
//get info from hidden div with id of attr
//info = div
//vex.dialog.alert({ unsafeMessage: div })
vex.dialog.alert({ unsafeMessage: "<div> hi</div>" })

var navItems = document.getElementsByClassName("nav-item");

for (var i = 0; i < navItems.length; i++) {
    var navItem = navItems[i];
    if( navItem.getElementsByClassName("nav-item_box")[0] != undefined)
    {
        var secondTierNav = navItem.getElementsByClassName("nav-item_box")[0];

        secondTierNav.addEventListener("mouseleave", function( event ) {
            //console.log(this);
            this.classList.add("hidden");
            console.log("mouseout");

        });
    }
    navItem.addEventListener("mouseenter", function( event ) {
        //console.log(this);
        var secondTier = this.getElementsByClassName("nav-item_box")[0]
        secondTier.classList.remove("hidden");


    });


}
