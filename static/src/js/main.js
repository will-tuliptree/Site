//Onclicks
//on more info click
//get info from hidden div with id of attr
//info = div
//vex.dialog.alert({ unsafeMessage: div })


/*var modalNode = document.getElementById("modal-claims").cloneNode(true);
vex.dialog.open({
    unsafeMessage: modalNode

})*/

//var navItems = document.getElementsByClassName("nav-item");
function openModal(button, id){
    button.addEventListener("click", function( event ) {
        var modalNode = document.getElementById(id).cloneNode(true);
        vex.dialog.open({
            unsafeMessage: modalNode
            })

    });
}
document.addEventListener("DOMContentLoaded", function(event) {
    var btnList = document.getElementsByClassName("t-btn_modal");
    for (var i = 0; i < btnList.length; i++) {
        var modalId = btnList[i].dataset.modalid;
        openModal(btnList[i], modalId);
    }
});

/*for (var i = 0; i < navItems.length; i++) {
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
    if( navItem.getElementsByClassName("nav-item_box")[0] != undefined)
    {
        navItem.addEventListener("mouseenter", function( event ) {
            console.log(this);
            var secondTier = this.getElementsByClassName("nav-item_box")[0];
            secondTier.classList.remove("hidden");
            this.classList.toggle("top");
        });
    }

}*/
