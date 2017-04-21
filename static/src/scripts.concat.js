var current = "start";
var ready = true;
var mobileW = 767;
var prefix = "needs";
var applicant = {};
applicant.coverage = {
    "Debt":0,
    "Income":0,
    "Funeral":0,
    "Inheritance":0
};
var curPage = 1;
var minPages = 11;
var pages = [
    "start",
    "location",
    "age",
    "status",
    "partner",
    "children",
    "education",
    "debt",
    "summary"
];

var usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'Washington DC', 'West Virginia', 'Wisconsin', 'Wyoming'
];



var usStatesAbbr = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','DC','WV','WI','WY'
];
//  validity check variables for all questions
//  1 means the Next button starts active/0 is a possible answer
var genderValid = 0;
var ageValid = 0;
var stateValid = 0;
var incomeValid = 1;
var statusValid = 0;
var partnerIncomeValid = 1;
var partnerAgeValid = 0;
var childrenValid = 1;
var childrenAgesValid = 1;
var educationValid = 0;
var coverageValid = 0;
var debtValid = 1;
var savingsValid = 1;
var existingInsuranceValid = 1;


var stateDropdown = 0;
var canAdvance = 0;
var buttonActivated = 0;

//  pointers for gender and status being selected or not
var genderSelected = {Value:0};
var statusSelected = {Value:0};

var notSkipped = 1;

var sjAdded = 0;

//check if screen is at mobile size
var checkMobile = function() {
    if (window.matchMedia("(min-width: " + mobileW + "px)").matches) {
        return false;
    } else {
        return true;
    }
};

//function to hide the adddress bar in full page mobile applications
// When ready...
window.addEventListener("load",function() {
  // Set a timeout...
  setTimeout(function(){
    // Hide the address bar!
    window.scrollTo(0, 1);
  }, 0);
});

//add correct or error classes to inputs
var processValidate = function(obj, pass, code, target) {
    //object == field being validated
    //pass == true / false
    //code == validation code
    //target == parent of the error message
    if (pass) {
        $(obj).removeClass('error');
        $(obj).addClass('success');
        $(target).find('.errorMSG').hide();
    } else {
        $(obj).removeClass('success');
        $(obj).addClass('error');
        $(target).find('.errorMSG').hide();
        $(target).find('.' + code).show();
    }
    if (current == 'summary') {
        if ($(".book .error").length === 0) {
            $(".book .default").show();
        } else {
            $(".book .default").hide();
            if (pass) {
                $(".book .generic").show();
            }
        }
    }
};

///////////////////////////////////////////////////////////////
//// AJAX CALL TO API
///////////////////////////////////////////////////////////////
var formatNeeds = function() {
    if (applicant.status == "Married"){
        applicant.Spouse = true;
        applicant.SpouseAge = applicant.partner.age;
        applicant.SpouseIncome = applicant.partner.income;
    } else {
        applicant.Spouse = false;
    }
    applicant.burial = applicant.coverage.Funeral ? true : false;
    applicant.inheritance = applicant.coverage.Inheritance ? true : false;
    applicant.CoverDebt = applicant.coverage.Debt ? true : false;
    applicant.CoverIncome = applicant.coverage.Income ? true : false;
};


var getNeeds = function() {
    $("#plan-details-loading").show();
    $(".plan-detail-list").hide();

    formatNeeds();

    $.ajax({
          url: "/api/needs",
          type:"POST",
          data: JSON.stringify(applicant),
          contentType:"application/json",
          dataType:"json",
          success: function(result){
              var polString  = commaThousands(result.Policy + "");
              $("#result_coverage").html(polString);
              $("#planDetailAmount").html(polString);
              $("#plan-total").html(polString);
              var prod;
              switch (result.Product) {
                  case "Term":
                    prod = "Term Life";
                    break;
                  case "Final":
                    prod = "Final Expenses";
                    break;
                  case "MAX":
                    prod = "Term Life";
                    break;
                  default:
                    prod = "--";
                    break;
              }

              $("#result_product").html(prod);
              if (result.Term > 0) {
                  $("#result_length").show();
                  $("#result_length").html(result.Term + " years");
              } else {
                  $("#result_length").hide();
              }
              var details = result.PolicyItems;
              $.each(details, function(key, val) {
                  var pref = val < 0 ? "- " : "";
                  var dol = commaThousands(Math.abs(val)+"");
                  $("#item_"+ key +" .itemValue").html(pref + dol);
              });

              $("#plan-details-loading").hide();
              $(".plan-detail-list").show();
          }
    });
};

function resubmit(override) {
    if (!checkMobile() || override) {
        var errorCount = $("#summary .error").length;
        if (applicant.status == "Married") {
            if (typeof applicant.income == "undefined") {
                errorCount +=  1;
                if ($("#summary_partner_income").val() === "") {
                    $("#summary_partner_income").val("0");
                    applicant.partner.age = applicant.age;
                    processValidate($("#summary_partner_income"), false, 'invalid', $("#summary_partner_income").attr("validator"));
                }
            }
        }

        if ( errorCount === 0) {
            getNeeds();
            return true;
        } else {
            return false;
        }
    }
}


//remove commas from entered numbers, truncated at '.'
function noComma(valString){
    valString = valString.replace(/,/g, "");
    valString = valString.replace(/ /g, "");
    var perIndex = valString.indexOf(".");
    if(perIndex!=-1){
        valString = valString.substr(0,perIndex);
    }
    return valString;
}

//accept any correct spelling of a state - case and space insensitive
function capitalizeState(stateString){
    stateString = stateString.charAt(0).toUpperCase() + stateString.slice(1);
    if(stateString.indexOf(" ")!= -1){
        var tempState = stateString.substr(0, (stateString.indexOf(" ")+1));
        tempState = tempState + stateString.charAt(stateString.indexOf(" ")+1).toUpperCase() + stateString.slice(stateString.indexOf(" ")+2);
        stateString = tempState;
    }
    return stateString;
}


//Navpage Updating Functions
var maxPage = function() {
    return minPages + (applicant.status == "Married" ? 1 : 0) + (applicant.Children > 0 ? 2 : 0);
};

var updatePages = function() {
    $("#book-page-count").html(curPage + " / " + maxPage());
};

var pageModify = function(p) {
    var result = p;
    if (p >= 7 && applicant.status == "Single") {
        result--;
    }
    if (p >= 10 && applicant.Children === 0) {
        result -= 2;
    }
    return result;
};


//Functions for sliding in and out pages
var rollout = function(p) {
    setTimeout(function() {
        $(p).removeClass('frame-current slideFadeOut');
    }, 2000);
};
var rollin = function(n) {
    //$(n).removeClass('hidden');
    setTimeout(function() {
        $(n).addClass('frame-current animated slideFadeIn');
        updatePages();
    }, 500);
};


function numberVal(field, mode, min){
    //0 == fail
    //1 == success
    //2 == pending
    //3 == age limit
    //4 == bad character

    var val = noComma(field.val());
    var re = new RegExp("^([0-9])+$");
    if(re.exec(val)){
        if (min === 0) {
            return 1;
        } else {
            if(min >= 10 && val>9){
                if (val >= min) {
                    return 1;
                } else {
                    return 3;
                }
            } else {
                if (mode === 0) {
                    //mode 0 = keyup
                    return 2;
                } else {
                    //mode 1 = changed
                    return 3;
                }
            }
        }
    } else if(val === ""){
        if (mode == 1) {
            if (min !== 0) {
                field.val("00");
                return 0;
            } else {
                return 2;
            }
        }
    } else {
        return 4;
    }
}


var summaryChildren = function() {
    var children = applicant.Children;
    if (typeof applicant.ChildrenAges == "undefined") {
        applicant.ChildrenAges = [];
    }
    if (children === 0) {

        $("#summary_ages_section").hide();
        $("#summary_education_section").hide();
    } else {
        $("#summary_ages_section").show();
        $("#summary_education_section").show();
        var existing = $("#summary_age_list .age-item").length;
        if (existing > children) {
            //remove the unnecessary items
            $("#summary_age_list .age-item").slice(children).remove();
            applicant.ChildrenAges = applicant.ChildrenAges.splice(0, children);
        } else if (existing < children) {
            //add more input fields
            for (var i=existing+1; i<=children; i++) {
                if (applicant.ChildrenAges.length < i) {
                    applicant.ChildrenAges[i-1] = 0;
                }
                $("#summary_age_list").append("<span class='age-item'>" + (i != 1 ? " and " : "")  + "<input class='child_input' child='"+ i +"' id='summary_child_" + i + "'  type='tel' placeholder='0' value='"  + applicant.ChildrenAges[i-1] +  "' validator='#summary_validator'/></span>");
            }
            $("#summary_age_list .child_input").off();
            $("#summary_age_list .child_input").change(function() {
                var id = $(this).attr("child");
                var success = numberVal($(this), 1, 0);
                if (success == 1) {
                    applicant.ChildrenAges[id-1] = $(this).val();
                    processValidate($(this), true, null, $(this).attr("validator"));
                } else {
                    processValidate($(this), false, "invalid", $(this).attr("validator"));
                }
            });
            $("#summary_age_list .child_input").blur(function() {
                if (!$(this).hasClass("error")) {
                    resubmit();
                }
            });
        }
    }
};



//Loads in a new question - must always happen after validation
var loadQuestion = function(next) {
    // ready = false;
    var nextItem = $("#"+next);
    var curItem = $("#"+current);
    if (next != current) {
        $(curItem).removeClass("slideFadeIn");
        $(curItem).addClass("animated slideFadeOut");
        $(".pending").removeClass("pending");
        $("#sj-"+next).addClass("pending");
        rollin(nextItem);
        rollout(curItem);
        current = next;
    } else {
        console.log("Already showing: " + next);
    }
    if (next == 'summary') {
        $("#corner-img").addClass('below');
        summaryChildren();
        $("#next").hide();

        console.log("get needs");
        setTimeout(function() {
            getNeeds(); }, 2000);
    } else {
        $("#corner-img").removeClass('below');
        $("#next").show();
    }
    ready = false;
    setTimeout(function(){
        ready=true;
    }, 1600);
};

var historyForward = function(next) {
    stateObj = {prev: next, page: curPage};
    if (location.pathname.indexOf(prefix+"/") == -1) {
        next = prefix + "/" + next;
    }
    history.pushState(stateObj, null, next);
};

//Allows the user to jump backwards to a question they have already answered
var spaceJump = function(dest) {
    if (!ready) {
        return;
    }
    loadQuestion(dest);
    historyForward(dest);
};

//Control what happens if someone tries to back out
window.onpopstate = function (event) {
  if (event.state == null) {
    return;
  }
  console.log("Backtracking to: " + event.state.prev);
  curPage = event.state.page;
  loadQuestion(event.state.prev);
};

//make the next button active
function buttonActive(){
    buttonActivated = 1;
    $("#next").removeClass("inactiveNext");
    $("#next").addClass("activeNext");
}

//make the next button inactive
function buttonInactive(){
    buttonActivated = 0;
    $("#next").removeClass("activeNext");
    $("#next").addClass("inactiveNext");
}

//increase width of input field based upon input length
function inputWidth(changed){
    var l = Math.max($(changed).val().length, 1);
    if (checkMobile()) {
        if (current == "summary") {
            $(changed).css("width", ((l-1)*3.2+8)+"vw");
        } else {
            $(changed).css("width", ((l-1)*5.9+21.5)+"vw");
        }
    } else if($(window).width()>768 && $(window).width()<993){
        $(changed).css("width", ((l-1)*20+60)+"px");
    }else {
        //$(changed).css("width", ((l-1)*25+80)+"px");
        $(changed).css("width", ((l-1)*0.85+0.75)+"em");
    }
}





//Adds a class but on a delay
var delayPopIn = function(o, c, t) {
    setTimeout(function() {
        $(o).addClass(c);
    }, 120);
};
var delayPopOut = function(o, c, t) {
    setTimeout(function() {
        $(o).removeClass(c);
    }, 120);
};


//Logic to toggle active/inactive between two images
function toggleTwo(genericClass, classOne, classTwo, selectedBool, thisClick){
    if(selectedBool.Value === 0){
        thisClick.addClass("toggled");
        $(genericClass).children(".toggleImgWrapper").children(".imgActive").addClass("toggleImg");
        thisClick.removeClass("toggleInitial");

        if(thisClick.parent().hasClass(classOne.substr(1, classOne.length))){
            $(classTwo).children(".toggleImgWrapper").addClass("toggleInactive");
            $(classTwo).children(".toggleImgWrapper").removeClass("toggleInitial");
        }else{
            $(classOne).children(".toggleImgWrapper").addClass("toggleInactive");
            $(classOne).children(".toggleImgWrapper").removeClass("toggleInitial");
        }
        selectedBool.Value=1;
    }else{
        $(genericClass).children(".toggleImgWrapper").removeClass("toggled");
        thisClick.addClass("toggleActive");
        thisClick.removeClass("toggleInactive");

        if(thisClick.parent().hasClass(classTwo.substr(1, (classTwo.length-1)))){
            $(classOne).children(".toggleImgWrapper").addClass("toggleInactive");
            $(classOne).children(".toggleImgWrapper").removeClass("toggleActive");
        }else{
            $(classTwo).children(".toggleImgWrapper").addClass("toggleInactive");
            $(classTwo).children(".toggleImgWrapper").removeClass("toggleActive");
        }
    }
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   VALIDATION CHECKS FOR NEEDS TOOL QUESTIONS    /////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//check if user has correctly selected a gender
function checkIdentity(changed, genderSelected){

    if(genderValid){
        if(checkMobile()){
            buttonActive();
        }else{
            if(ageValid){
                buttonActive();
            }
        }
        return true;
    }else{
        $(".gender-options").addClass("error");
        genderValid = 0;
        $("#genderSelectError").show();
        buttonInactive();
        return false;
    }
}

function ageCheck(field, mode, targ) {

    $(targ + " .errorMSG").hide();
    //error validation on age input!
    var success = numberVal(field, mode, 18);
    if(field.val()>79){
        success=5;
    }

    if (success == 1){
        ageValid = 1;
        var age = parseInt($(field).val());
        applicant.age = age;
        processValidate(field, true, null, null);

        if (current != "summary") {
            $("#summary_age").val(age);
        }
        if(checkMobile()){
            buttonActive();
        } else {
            if(genderValid){
                buttonActive();

            }
        }
    } else {
        ageValid = 0;
        delete applicant.age;

        buttonInactive();
        if (success === 0) {
            processValidate(field, false, "invalid", targ);
        } else if (success == 2) {
            //do nothing
        } else if (success == 3) {
            processValidate(field, false, "ageLimit", targ);
        } else if (success == 4) {

            processValidate(field, false, "invalid", targ);
        } else if (success == 5) {

            processValidate(field, false, "upperAgeLimit", targ);
        }
    }
}

//check if user has correctly selected or entered a US State
function checkState(changed){
    var selected = changed.val();
    selected = $.trim(selected);
    selected = capitalizeState(selected);
    if (usStates.indexOf(selected) != -1 && errorStates.indexOf(selected)==-1) {
        console.log("not an error state");
        applicant.state = selected;
        changed.removeClass('disabled');
        changed.removeClass('error');

        stateValid = 1;
        if(checkMobile()){
            buttonActive();
        }else{
            if(incomeValid){
                buttonActive();
            }
        }
        processValidate(changed, true, null, $("#location_validator"));
        if (selected.length > 7) {
            $("#select_state_mobile").addClass('extended');
            $("#select_state_mobile").css("width",function(){
                return (selected.length * 5.3) + 10 + "vw";
            });
        } else {
            $("#select_state_mobile").removeClass('extended');
            $("#select_state_mobile").css("width",function(){
                return (selected.length * 9.6) + 10 + "vw";
            });
        }
    } else if (errorStates.indexOf(selected)!=-1){
        stateValid = 0;
        buttonInactive();
        processValidate(changed, false, 'errorState', $("#location_validator"));
        if (selected.length > 7) {
            $("#select_state_mobile").addClass('extended');
            $("#select_state_mobile").css("width",function(){
                return (selected.length * 5.3) + 10 + "vw";
            });
        } else {
            $("#select_state_mobile").removeClass('extended');
            $("#select_state_mobile").css("width",function(){
                return (selected.length * 9.6) + 10 + "vw";
            });
        }
        delete applicant.state;
    }else {
        stateValid = 0;
        buttonInactive();
        processValidate(changed, false, 'invalid', $("#location_validator"));
        delete applicant.state;
    }
}

function incomeCheck(changed, targ, p) {
    $(targ + " .errorMSG").hide();
    //error validation on age input!
    var success = numberVal(changed, 1, 0);
    if (success == 1){
        var income = noComma(changed.val());
        if (p == 1) {
            incomeValid = 1;
            applicant.Income = parseInt(income);
            if (current != "summary") {
                $("#summary_income").val(income);
            }
        } else if (p == 2) {
            partnerIncomeValid = 1;
            applicant.partner.income = parseInt(income);
            if (current != "summary") {
                $("#summary_partner_income").val(income);
            }
        }
        processValidate(changed, true, null, $(targ));
        if(checkMobile()){
            buttonActive();
        } else {
            if (p == 1) {
                if(stateValid){
                    buttonActive();
                }
            } else if (p == 2) {
                if(partnerAgeValid){
                    buttonActive();
                }
            }
        }
    } else {
        if (p == 1) {
            incomeValid = 0;
            delete applicant.Income;
        } else if (p==2) {
            partnerIncomeValid = 0;
            delete applicant.partner.income;
        }
        buttonInactive();
        if (success === 0) {
            processValidate(changed, false, "invalid", $(targ));
        } else if (success == 2) {
            //do nothing
        } else if (success == 4) {
            processValidate(changed, false, "invalid", $(targ));
        }
    }
}

//check if user has correctly selected whether they are married or single
function checkStatus(){
    if(statusValid){
        buttonActive();
        return true;
    }else{
        statusValid = 0;
        $("#statusSelectError").show();
        buttonInactive();
        return false;
    }
}


//check if user has correctly entered their partner's age
function checkPartnerAge(changed, targ){
    if ($(changed).val() === '') {

        return 0;
    }
    var success = numberVal(changed, 0, 0);
    var age = parseInt($(changed).val());
    if((age.length===0)){
        $(change).val("00");
    }
    if (success == 1) {
        partnerAgeValid = 1;
        applicant.partner.age = age;
        processValidate(changed, true, null, $(targ));
        if(partnerIncomeValid){
            buttonActive();
        }
    } else {
        processValidate(changed, false, 'invalid', $(targ));
        //$("#partnerError").show();
        delete applicant.partner.age;
        partnerAgeValid = 0;
        buttonInactive();
    }
}

//check if user has correctly entered ALL children's ages. flagErrors is a bool
//that states if incorrect or empty inputs should receive error states or not
function checkAllChildrenAges(flagErrors){
    childrenAgesValid = 1;
    applicant.ChildrenAges = [];
    $(".child_input").each(function(){
        if($(this).val().length===0 || $(this).val() =="00"){
            childrenAgesValid = 0;
            buttonInactive();
            // $(this).val("00");

            if(flagErrors){
                $(this).val("00");
                processValidate($(this), false, null);
            }
        }else{
            var tempAge = $(this).val();
            tempAge = parseInt(tempAge);
            if ($.isNumeric(tempAge) && tempAge>0) {
                applicant.ChildrenAges.push(tempAge);
            } else {
                applicant.ChildrenAges = [];
                childrenAgesValid = 0;
                if(!$.isNumeric(tempAge)){
                    $(".children-ages-disclaimer").html("Please make sure you have entered valid ages for your children. If your child is less than one year old, round up to one.");
                }
            }
        }
    });

    if(checkMobile()){
        if(childrenAgesValid){
            buttonActive();
            $(".children-ages-disclaimer").removeClass("error");
        }else{
            buttonInactive();
            if(flagErrors){
                $(".children-ages-disclaimer").addClass("error");
            }
        }
    }else{
        if(childrenValid && childrenAgesValid){
            buttonActive();
            $(".children-ages-disclaimer").removeClass("error");
        }else{
            buttonInactive();
            if(flagErrors){
                $(".children-ages-disclaimer").addClass("error");
            }
        }
    }
}

//check if user has correctly entered a single child's age
function checkChildrenAge(changed){

    var thisTempAge = $(changed).val();
    thisTempAge = parseInt(thisTempAge);
    if($(changed).val()==="" || $(changed).val()=="00"){

    } else if ($.isNumeric(thisTempAge) && thisTempAge>0) {
        $(".children-ages-disclaimer").html("If your child is less than one year old, round up to one.");
        processValidate(changed, true, null);
    } else {
        processValidate(changed, false, null);
        if(thisTempAge!==0){
            $(".children-ages-disclaimer").html("Please make sure you have entered valid ages for your children. If your child is less than one year old, round up to one.");
        }
        $(".children-ages-disclaimer").addClass("error");
    }

    checkAllChildrenAges(0);
}

//check if user has correctly entered a number of children
function checkKids(changed){
    $("#children .errorMSG").hide();

    var re = new RegExp("^([0-9])+$");
    var children;

    children = changed.val();
    if(children===""){
        children=0;
    }
    if(children=="10+"){
        children = 10;
    }

    if(re.exec(children)){
    // if ($.isNumeric(children)) {
        children = parseInt(children);

        if(children>9){
            children=10;
            changed.val("10+");
        }
        childrenValid = 1;
        processValidate(changed, true, null);
        buttonActive();
        applicant.Children = children;
        $("#summary_children").val(children);
        var mobileSuffix = checkMobile() ? "_mobile" : "";
        var existing = $("#age-list" + mobileSuffix + " .age-item").length;
        if (existing > children) {
            //remove the unnecessary items
            $("#age-list" + mobileSuffix + " .age-item").slice(children).remove();
        } else if (existing < children) {
            //add more input fields
            for (var i=existing+1; i<=children; i++) {
                $("#age-list" + mobileSuffix).append("<span class='age-item'>" + (i != 1 ? "&" : "")  + "<input class='child_input' id='child_" + i + "'  type='tel' placeholder='0'/></span>");
            }
        }
        if (children > 0) {

            childrenAgesValid = 0;

            if(!checkMobile()){
                buttonInactive();
                checkAllChildrenAges(0);

                if(children>4){

                    $("#child_ages_desktop").addClass("bigFamily");
                }else{
                    $("#child_ages_desktop").removeClass("bigFamily");
                }
            }else{
                if(children>4){
                    $("#children-ages").addClass("bigFamily");
                }else{
                    $("#children-ages").removeClass("bigFamily");
                }
            }


            $("#children").removeClass("noKids");
            $("#child_ages_desktop").fadeIn("slow");
            $("#children").addClass("continued");

            $(".child_input").keyup(function(e){
                // inputWidth($(this));
                var l = Math.max($(this).val().length, 1);
                if (checkMobile()) {
                    $(this).css("width", ((l-1)*3+16)+"vw");
                } else if($(window).width()>768 && $(window).width()<993){
                    $(this).css("width", ((l-1)*20+60)+"px");
                }else {
                    //$(changed).css("width", ((l-1)*25+80)+"px");
                    $(this).css("width", ((l-1)*0.85+0.75)+"em");
                }
            });

            $(".age-item input").on("focus", function(){
                canAdvance = 0;
            });
            $(".age-item input").blur(function(){
                canAdvance = 1;
            });

            $(".child_input").change(function(){
                applicant.ChildrenAges = [];
                checkChildrenAge($(this));
            });
            $(".child_input").keyup(function(){
                applicant.ChildrenAges = [];
                checkChildrenAge($(this));
            });

        } else {
            buttonActive();
            childrenAgesValid = 1;
            $("#children").addClass("noKids");
            $("#child_ages_desktop").fadeOut("slow");
            $("#children").removeClass("continued");
            delete applicant.ChildrenAges;
        }
    }else{
        processValidate(changed, false, null);
        if(checkMobile()){
            $("#children .errorMSGmobile.invalid").show();
        }else{
            $("#children .errorMSGtablet.invalid").show();
        }
        buttonInactive();
        $("#children").addClass("noKids");
        $("#child_ages_desktop").fadeOut("slow");
        $("#children").removeClass("continued");
    }

}

function summaryCheckKids(field, target) {
    var val = $(field).val();
    var success = numberVal(field, 1, 0);
    if (success == 1) {
        applicant.Children = Math.min(10, parseInt(val));
        processValidate($(field), true, null, $(target));
        summaryChildren();
    } else {
        processValidate($(field), false, "invalid", $(target));
    }
}


//check if user has correctly selected an education option
function checkEducation(){
    if(educationValid){
        buttonActive();
        $("#educationError").hide();
    }else{
        buttonInactive();
        $("#educationError").show();
    }
}

//check if user has correctly selected at least one coverage item
function checkCoverage(){
    if(coverageValid){
        $(".coverage-options").removeClass("error");
        buttonActive();
        $("#coverageError").hide();
        return true;
    }else{
        buttonInactive();
        return false;
    }
}

function coverageString() {
    var t = "";
    var i = [];
    if (applicant.coverage.Debt) { i.push("debt"); }
    if (applicant.coverage.Income) { i.push("replacement income"); }
    if (applicant.coverage.Funeral) { i.push("funeral expenses"); }
    if (applicant.coverage.Inheritance) { i.push("a small inheritance"); }
    i.forEach(function(el, index, obj){
        t += (t === "" ? "" : (obj.length == 2 ? " " : ", ")) + (index+1 == obj.length && index !== 0 && obj.length >= 2 ? "and " : "" ) + el;
    } );
    if (t === "") {
        t = "nothing";
    }
    $("#summary_coverage").html(t);
}

//check if user has correctly entered debt values
function checkDebt(){
    var debtValid = 1;
    debt_total = 0;
    $(".input_debt").each(function() {
        var tempDebt = noComma($(this).val());
        var current_debt = parseInt( tempDebt );
        if ($.isNumeric(current_debt)){
            debt_total += current_debt;
        }else if($(this).val()===""){

        }else{
            debtValid = 0;
        }
    });
    $("#debt_total").html(debt_total);

    if(debtValid){
        buttonActive();
    }else{
        buttonInactive();
    }
    applicant.Debt = debt_total;
    $("#summary_debt").val(debt_total);
}

//check if user has correctly entered debt values - inline check
function checkDebtInline(changed){
    $(changed).siblings('.errorMSG').hide();
    $("#debt_total").css("color", "#ffffff");
    $("#debtClickError").hide();
    $(".debt-input-line .debtClick").hide();
    $("#zeroDebtError").hide();
    var validator = $(changed).attr("validator");

    var tempDebt = noComma(changed.val());
    var re = new RegExp("^([0-9])+$");
    var debt;
    if((tempDebt.length===0)){
        tempDebt = 0;
    }
    if(re.exec(tempDebt)){
        debt = parseInt( tempDebt );
    }
    if ($.isNumeric(debt)) {
        processValidate(changed, true, null, $(validator));
    } else {
        processValidate(changed, false, 'invalid', $(validator));
        buttonInactive();
    }
    checkDebt();
}

//check if user has correctly entered savings
function debtCheck(field, target) {
    var val = noComma($(field).val());
    var success = numberVal(field, 0, 0);
    if (success == 1) {
        if (current != 'summary') {
            $("#summary_debt").val(val);
        }
        processValidate(field, true, null, $(target));
        applicant.Debt = parseInt(val);
        buttonActive();
        debtValid=1;
    } else {
        processValidate(field, false, 'invalid', $(target));
        delete applicant.Debt;
        buttonInactive();
        debtValid=0;
    }
}



//check if user has correctly entered savings
function savingsCheck(field, target) {
    if ($(field).val() === '') {
        buttonInactive();
        return 0;
    }
    var val = noComma($(field).val());
    var success = numberVal(field, 0, 0);
    if (success == 1) {
        if (current != 'summary') {
            $("#summary_savings").val(val);
        }
        processValidate(field, true, null, $(target));
        applicant.Savings = parseInt(val);
        buttonActive();
        savingsValid=1;
    } else {
        processValidate(field, false, 'invalid', $(target));
        delete applicant.Savings;
        buttonInactive();
        savingsValid=0;
    }
}

//check if user has correctly entered existing life insurance
function existingCheck(field, target) {
    if ($(field).val() === '') {
        buttonInactive();
        return 0;
    }
    var val = noComma($(field).val());
    var success = numberVal(field, 0, 0);
    if (success == 1) {
        if (current != 'summary') {
            $("#summary_existing").val(val);
        }
        processValidate(field, true, null, $(target));
        applicant.ExistingInsurance = parseInt(val);
        buttonActive();
        existingInsuranceValid=1;
    } else {
        processValidate(field, false, 'invalid', $(target));
        delete applicant.ExistingInsurance;
        buttonInactive();
        existingInsuranceValid=0;
    }
}

// END VALIDATION CHECKS







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   NEXT/BACK/SKIP LOGIC FOR NEEDS TOOL    /////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



var next;

//check what is currently 'next' and see check all necessary variables are valid - then animate the next screen in
var checkCurrent = function() {
    console.log(applicant);
    if(notSkipped){
        next = null;
    }
    if (!ready) {
        return;
    }
    if (current == "start") {
        //verify that gender or gender and age are valid
        if (checkMobile()) {
            if(genderValid && buttonActivated){
                next = "age";
                curPage = 2;
                console.log(applicant.gender);
                $("#sj-identity-label").html(function(){
                    var tempLabel="";
                    if(applicant.gender=="F"){
                        tempLabel+="Female";
                    }else{
                        tempLabel+="Male";
                    }
                    return tempLabel;
                });
                // $("#sj--label").html(function(){
                //      var tempLabel="";
                // })
            }else{
                $(".gender-options").addClass("error");
                checkIdentity($(".toggleInitial"), genderSelected);
            }
        }else{
            if(genderValid && ageValid && buttonActivated){
                next = "location";
                curPage = 3;

                $("#sj-identity-label").html(function(){
                    var tempLabel="";
                    if(applicant.gender=="F"){
                        tempLabel+="Female";
                    }else{
                        tempLabel+="Male";
                    }
                    tempLabel+= ("/" + applicant.age);
                    return tempLabel;
                });
            }else{

                checkIdentity($(".toggleInitial"), genderSelected);
                ageCheck($("#select_age"), 1, $("#select_age").attr("validator"));
            }
        }
    } else if (current == "age") {
        //verify that age is valid
        if (ageValid && buttonActivated) {
            next = "location";
            curPage = 3;
            $("#sj-identity-label").append(function(){
                var tempLabel= ("/" + applicant.age);
                return tempLabel;
            });
        } else{
            ageCheck($("#select_age_mobile"), 1, $("#select_age_mobile").attr("validator"));
        }
    } else if (current == "location") {
        //verify that location is valid
        if (stateValid && buttonActivated) {
            if (checkMobile()) {
                next = "income";
                curPage = 4;
                $("#sj-location-label").html(function(){
                     var tempLabel="";
                     tempLabel+=applicant.state+"/";
                     return tempLabel;
                });

            } else if (incomeValid) {
                if($("#select_income").val()===""){
                    applicant.Income = 0;
                    processValidate($("#select_income"), true, null, $("#income_validator"));
                }
                next = "status";
                $("#sj-location-label").html(function(){
                     var tempLabel="";
                     tempLabel+=applicant.state+"/";
                     return tempLabel;
                });
                $("#sj-location-label").append("<br/>");
                $("#sj-location-label").append(function(){
                     return ("$"+applicant.Income);
                });
            }
        } else{
            if (checkMobile()) {
                checkState($("#select_state_mobile"));
            }else{

                checkState($("#select_state"));
                incomeCheck($("#select_income"), $("#select_income").attr("validator"));
            }


        }
    } else if (current == "budget") {
        //verify that budget is valid
        if (applicant.budget) {
            next = "income";
            $("#sj-location-label").append("<br/>");
            $("#sj-location-label").append(function(){
                 return ("$"+applicant.Income);
            });
        }
    }  else if (current == "income") {
        //verify that income is valid
        if (incomeValid && buttonActivated) {
            if($("#select_income_mobile").val()===""){
                applicant.Income = 0;
                $("#select_income_mobile").val("0");
                processValidate($("#select_income_mobile"), true, null, $("#income_validator_mobile"));
            }
            next = "status";
            curPage = 5;
            $("#sj-location-label").append("<br/>");
            $("#sj-location-label").append(function(){
                 return ("$"+applicant.Income);
            });
        }else{

        }
    } else if (current == "status") {

        if(statusValid){
            $("#sj-status-label").html(function(){
                 return applicant.status;
            });
        }

        //verify that marital status
        if (statusValid && applicant.status == 'Married') {
            next = "partner";
            $("#sj-partner").parent().removeClass("hidden");
            sjAdded++;
            curPage = 6;
        } else if (statusValid && applicant.status == 'Single') {
            next = "children";
            $("#sj-partner").parent().addClass("hidden");
            curPage = pageModify(7);
        } else{
            $(".status-options").addClass("error");
            checkStatus();
        }
    } else if (current == "partner") {
        //verify that partner info is valid
        if (partnerIncomeValid && partnerAgeValid) {
            if($("#select_partner_income").val()===""){
                applicant.partner.income = 0;
                $("#select_partner_income").val("0");
                processValidate($("#select_partner_income"), true, null);
            }
            next = "children";
            curPage = pageModify(7);
            $("#sj-partner-label").html("Partner:");
            $("#sj-partner-label").append("<br/>");
            $("#sj-partner-label").append(function(){
                var tempLabel = "";
                tempLabel+=applicant.partner.age + "/$";
                tempLabel+=applicant.partner.income;
                return tempLabel;
            });
        }else{
            incomeCheck($("#select_partner_income"), $("#select_partner_income").attr('validator'), 2);
            checkPartnerAge($("#select_partner_age"), $("#select_partner_age").attr('validator'));
        }
    } else if (current == "children") {
        //verify that number of children is valid, and that children ages are valid tablet-up
        if(childrenValid){
            if(applicant.Children==1){
                $("#sj-children-label").html(applicant.Children+" Child");
            }else{
                $("#sj-children-label").html(applicant.Children+" Children");
            }

        }
        if ((applicant.Children > 0) && childrenValid) {
            if (checkMobile()) {
                next = "children-ages";
                curPage = pageModify(8);
            } else if (childrenAgesValid){
                next = "education";
                curPage = pageModify(9);
                $("#sj-education").parent().removeClass("hidden");
                sjAdded++;
            } else{
                checkAllChildrenAges(1);
            }
        } else if (((applicant.Children === 0) || $("#select_children").val()==="") && childrenValid && childrenAgesValid) {
            applicant.Children = 0;
            $("#select_children").val("0");
            processValidate($("#select_children"), true, null);
            next = "coverage";
            curPage = pageModify(10);
            $("#sj-education").parent().addClass("hidden");
        } else {
            checkKids($("#select_children"));
        }
    } else if (current == "children-ages") {
        //verify that children's ages are valid
        if(childrenAgesValid){
            next = "education";
            curPage = pageModify(9);
        }else{
            checkAllChildrenAges(1);
        }
    } else if (current == "education") {
        //verify that education selection is valid
        if(educationValid){
            next = "coverage";
            curPage = pageModify(10);

            if(applicant.Education=="PRI"){
                $("#sj-education-label").html("Private Four");
                $("#sj-education-label").append("<br/>");
                $("#sj-education-label").append("Year College");
            }else if(applicant.Education=="PIS"){
                $("#sj-education-label").html("In-State");
                $("#sj-education-label").append("<br/>");
                $("#sj-education-label").append("University");
            }else if(applicant.Education=="POS"){
                $("#sj-education-label").html("Out of State");
                $("#sj-education-label").append("<br/>");
                $("#sj-education-label").append("University");
            }else{
                $("#sj-education-label").html("Education");
            }
            // $("#sj-education-label").html(function(){
            //     if(applicant.Education=="PRI"){
            //         return "Private Four Year College";
            //     }else if(applicant.Education=="PIS"){
            //         return "In-State University";
            //     }else if(applicant.Education=="POS"){
            //         return "Out of State University";
            //     }else{
            //         return "Education";
            //     }
            // });
        }else{
            $(".education-options").addClass("error");
            checkEducation();
        }
    } else if (current == "coverage") {
        //verify that coverage selection is valid
        if(checkCoverage()){
            next = "debt";
            curPage = pageModify(11);
        }else{
            $(".coverage-options").addClass("error");
            $("#coverageError").show();
        }
    } else if (current == "debt") {
        //verify that debt entries are valid
        checkDebt();
        if(debtValid){
            if(applicant.coverage.Debt==1 && applicant.Debt===0){
                $("#zeroDebtError").show();
            }else{
                next = "savings";
                curPage = pageModify(12);
                $("#sj-savings").parent().removeClass("hidden");
                sjAdded++;

                $("#sj-debt-label").html(function(){
                    return "$"+applicant.Debt;
                });
                $("#sj-debt-label").append("<br/>");
                $("#sj-debt-label").append("Debt");
            }

        }
        //$("#sj-summary").addClass("completed");
    }else if (current == "savings" && notSkipped) {
        //verify that savings are valid (when skip is not selected)
        savingsCheck($("#select_savings"), $("#select_savings").attr("validator"));
        if(savingsValid){
            next = "existing-insurance";
            curPage = pageModify(13);
            $("#sj-existing-insurance").parent().removeClass("hidden");
            sjAdded++;

            if(applicant.savings){
                $("#sj-savings-label").html(function(){
                    return "$"+applicant.Savings;
                });
                $("#sj-savings-label").append("<br/>");
                $("#sj-savings-label").append("Savings");
            }else{
                $("#sj-savings-label").html("$0");
                $("#sj-savings-label").append("<br/>");
                $("#sj-savings-label").append("Savings");
            }

        }
    }else if (current == "existing-insurance" && notSkipped) {
        //verify that existing insurance is valid (when skip is not selected)
        existingCheck($("#select_existing_insurance"), $("#select_existing_insurance").attr('validator'));
        if(existingInsuranceValid){
            next = "summary";
            curPage = pageModify(14);
            $("#sj-summary").addClass("completed");

            if(applicant.ExistingInsurance){
                $("#sj-existing-label").html(function(){
                    return "$"+applicant.ExistingInsurance;
                });
                $("#sj-existing-label").append("<br/>");
                $("#sj-existing-label").append("Existing Policy");
            }else{
                $("#sj-existing-label").html("$0");
                $("#sj-existing-label").append("<br/>");
                $("#sj-existing-label").append("Existing Policy");
            }
        }
    }
    if (next != null) {
        $("#sj-" + current).addClass("completed");
        $("#sj-" + current).removeClass("pending");
        $("#next").addClass("activeNext");
        $("#next").removeClass("inactiveNext");
        historyForward(next);
        loadQuestion(next);
        console.log("next is " + next);
        if(next=="children" || next=="income" || next=="debt"){
            //do not make button inactive
        }else if (next=="savings" || next == "existing-insurance"){
            //make skip visible
            $("#skip").css("visibility","visible");
        }else{
            buttonInactive();
            $("#skip").css("visibility","hidden");
        }
        notSkipped = 1;

    } else {
        console.log("Unable to answer question: " + current);
        $("#next").removeClass("activeNext");
        $("#next").addClass("inactiveNext");
    }
};






// END NEXT/BACK/SKIP LOGIC







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   CLICK/KEYUP/CHANGE EVENTS FOR NEEDS TOOL   ////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




var setClickEvents = function() {

    //Identity click event
    $(".select_gender").click(function(){
        $(".gender-options").removeClass("error");
        genderValid = 1;
        checkIdentity($(this) , genderSelected);

        var gender = $(this).attr("type");
        applicant.gender = gender;

        toggleTwo(".genderToggle", ".genderToggle1", ".genderToggle2", genderSelected, $(this));

        $("#genderSelectError").hide();
        if(gender == "M"){
            characterGender = 1;
        }else{
            characterGender = 0;
        }
    });


    //Age click events
    $("#select_age, #select_age_mobile, #summary_age").blur(function(){
        ageCheck($(this), 0, $(this).attr("validator") );
    });

    $("#select_age, #select_age_mobile, #summary_age").keyup(function(){
        ageCheck($(this), 0, $(this).attr("validator") );
        inputWidth($(this));
    });

    $("#select_age, #select_age_mobile, #summary_age").click(function(){
        if($(this).val()=="00"){
            $(this).val("");
        }
    });

    //Location click event
    for (var i=0; i<usStates.length; i++) {
        $("#select_state_mobile").append("<option value='"+ usStates[i] +"'>" + usStates[i]  + "</option>");
        $("#summary_location").append("<option value='"+ usStates[i] +"'>" + usStates[i]  + "</option>");

    }
    $("#select_state, #select_state_mobile").change(function(){
        checkState($(this));
    });
    $("#select_state").keyup(function(){
        var l = $(this).val().length;
        if (checkMobile()) {
            $(this).css("width", (l*5.9+18)+"vw");
        } else {
            $(this).css("width", (l*25+73)+"px");
        }
    });
    $("#select_state").change(function(){
        var l = $(this).val().length;
        if (checkMobile()) {
            $(this).css("width", (l*5.9+18)+"vw");
        } else {
            $(this).css("width", (l*25+73)+"px");
        }
    });
    $("#select_state_mobile").change(function(){
        var l = $(this).val().length;
        if (checkMobile()) {
            //$(this).css("width", (l*5.9+18)+"vw");
        } else {
            $(this).css("width", (l*24 +12)+"px");
        }
    });

    //income click events
    $("#select_income, #select_income_mobile, #summary_income").change(function(){
        incomeCheck($(this), $(this).attr("validator"), 1);
    });
    $("#select_income, #select_income_mobile, #summary_income").keyup(function(){
        incomeCheck($(this), $(this).attr("validator"), 1);
        inputWidth($(this));
    });

    //Marital Status click events
    $(".select_status").click(function(){
        $(".status-options").removeClass("error");
        statusValid = 1;
        checkStatus();
        var status = $(this).attr("type");
        toggleTwo(".statusToggle", ".statusToggle1", ".statusToggle2", statusSelected, $(this));

        $("#statusSelectError").hide();
        applicant.status = status;
        //$("#summary_status").val(status.toLowerCase());
        $("#summary_status").dropdown("set selected", status);
        if (status == 'Single') {
            delete applicant.partner;
            $("#summary_partner_section").hide();
        } else if (!applicant.partner) {
            applicant.partner = {};
            $("#summary_partner_section").show();
        }
    });

    //Partner Info click events
    $("#select_partner_age, #summary_partner_age").change(function(){
        checkPartnerAge($(this), $(this).attr('validator'));
        inputWidth($(this));
    });
    $("#select_partner_age, #summary_partner_age").keyup(function(){
        checkPartnerAge($(this), $(this).attr('validator'));
        inputWidth($(this));
    });

    $("#select_partner_income, #summary_partner_income").change(function(){
        incomeCheck($(this), $(this).attr("validator"), 2);
    });
    $("#select_partner_income, #summary_partner_income").keyup(function(){
        incomeCheck($(this), $(this).attr("validator"), 2);
        inputWidth($(this));
    });


    //children click events
    $("#select_children").change(function(){
        checkKids($(this));
    });
    $("#select_children").keyup(function(e){
        var key = e.keyCode ? e.keyCode : e.which;
        if(key!=8 || $(this).val().length===0){
            checkKids($(this));
        }else{
            if($(this).val()!="10"){
                checkKids($(this));
            }
        }
    });
    $("#select_children").keyup(function(e){
        var l = $(this).val().length;
        if (checkMobile()) {
            $(this).css("width", ((l-1)*5.9+18)+"vw");
        } else if($(window).width()>768 && $(window).width()<993){
            $(this).css("width", ((l-1)*22+48)+"px");
        }else {
            $(this).css("width", ((l-1)*25+80)+"px");
        }
        var key = e.keyCode ? e.keyCode : e.which;

    });

    $("#summary_children").change(function(){
        summaryCheckKids($(this), $(this).attr('validator'));
    });
    $("#summary_children").keyup(function(){
        summaryCheckKids($(this), $(this).attr('validator'));
    });

    $("#summary input").blur(function() {
        resubmit();
    });


    //education click events
    $(".select_education").click(function(){
        educationValid = 1;
        checkEducation();
        var type = $(this).attr("type");
        applicant.Education = type;
        $("#summary_education").dropdown("set selected", type);
    });
    var educationSelected = 0;
    $(".select_education").click(function(){
        $(".education-options").removeClass("error");
        if(educationSelected === 0){
            $(".educationToggle").children(".toggleImgWrapper").children(".imgActive").addClass("toggleImg");
            $(".select_education").not(this).addClass("toggleInactive");
            $(".select_education").removeClass("toggleInitial");
            $(this).addClass("toggled");
            educationSelected=1;
        }else{
            $(".select_education").removeClass("toggled");
            $(".select_education").removeClass("toggleActive");
            $(".select_education").not(this).addClass("toggleInactive");
            $(this).addClass("toggleActive");
            $(this).removeClass("toggleInactive");
        }
    });

    //coverage click events
    var coverageSelected = 0;
    $(".select_coverage").click(function(){
        var type = $(this).attr("type");
        if($(this).hasClass("toggleActive")){
            $(this).addClass("toggleInactive");
            $(this).removeClass("toggleActive");
            applicant.coverage[type] = 0;
            $(this).removeClass("selected");
            $("#coverage_"+type).removeClass('selected');
        }else{
            $(this).addClass("toggleActive");
            $(this).removeClass("toggleInactive");
            applicant.coverage[type] = 1;
            $(this).addClass("selected");
            $("#coverage_"+type).addClass('selected');
        }
        coverageValid = 0;
        $(".select_coverage").each(function(){
            if($(this).hasClass("toggleActive")){
                coverageValid=1;
                coverageString();
            }
        });
        checkCoverage();
    });


    //logic for debt vertical carousel
    var currentADebt = 0;
    var debts = $(".debt-wrapper");
    var canAdvanceDebt = 1;
    $("#debt-down-arrow").click(function(){
        if(currentADebt<(debts.length-2) && canAdvanceDebt){
            canAdvanceDebt = 0;

            $(debts[currentADebt+1]).addClass("debt-A-down-arrow");
            $(debts[currentADebt+1]).removeClass("debt-B");
            $(debts[currentADebt+1]).removeClass("debt-B-down-arrow");
            $(debts[currentADebt+1]).removeClass("debt-B-up-arrow");

            $(debts[currentADebt]).addClass("debt-hide-above");
            $(debts[currentADebt]).children(".row").addClass("debt-fades-out");
            $(debts[currentADebt]).removeClass("debt-A");
            $(debts[currentADebt]).removeClass("debt-A-up-arrow");
            $(debts[currentADebt]).removeClass("debt-A-down-arrow");

            setTimeout(function(){
                $(debts[currentADebt]).addClass("debt-hidden");
                $(debts[currentADebt]).children(".row").removeClass("debt-fades-out");
            }, 151);

            $(debts[currentADebt+2]).addClass("debt-B-down-arrow");
            $(debts[currentADebt+2]).children(".row").addClass("debt-fades-in");
            $(debts[currentADebt+2]).removeClass("debt-hidden");
            $(debts[currentADebt+2]).removeClass("debt-hidden-below");
            $(debts[currentADebt+2]).removeClass("debt-hide-below");

            setTimeout(function(){
                $(debts[currentADebt]).children(".row").removeClass("debt-fades-in");
            }, 151);

            setTimeout(function(){
                currentADebt++;

                if(currentADebt==(debts.length-2)){
                    $("#debt-down-arrow").css("opacity",".33");
                }else{
                    $("#debt-down-arrow").css("opacity","1");
                }

                if(currentADebt>0){
                    $("#debt-up-arrow").css("opacity","1");
                }else{
                    $("#debt-up-arrow").css("opacity",".33");
                }

                canAdvanceDebt = 1;
            }, 152);
        }else{

        }
    });

    $("#debt-up-arrow").css("opacity",".33");

    $("#debt-up-arrow").click(function(){
        if(currentADebt>0 && canAdvanceDebt){
            canAdvanceDebt = 0;

            $(debts[currentADebt-1]).addClass("debt-A-up-arrow");
            $(debts[currentADebt-1]).removeClass("debt-hide-above");
            $(debts[currentADebt-1]).removeClass("debt-hidden");
            $(debts[currentADebt-1]).children(".row").addClass("debt-fades-in");

            setTimeout(function(){
                $(debts[currentADebt-1]).children(".row").removeClass("debt-fades-in");
            }, 151);

            $(debts[currentADebt+1]).addClass("debt-hide-below");
            $(debts[currentADebt+1]).children(".row").addClass("debt-fades-out");
            $(debts[currentADebt+1]).removeClass("debt-B");
            $(debts[currentADebt+1]).removeClass("debt-B-down-arrow");
            $(debts[currentADebt+1]).removeClass("debt-B-up-arrow");

            setTimeout(function(){
                $(debts[currentADebt+1]).addClass("debt-hidden");
                $(debts[currentADebt+1]).children(".row").removeClass("debt-fades-out");
            }, 151);

            $(debts[currentADebt]).addClass("debt-B-up-arrow");
            $(debts[currentADebt]).removeClass("debt-A");
            $(debts[currentADebt]).removeClass("debt-A-up-arrow");
            $(debts[currentADebt]).removeClass("debt-A-down-arrow");

            setTimeout(function(){
                currentADebt--;

                if(currentADebt==(debts.length-2)){
                    $("#debt-down-arrow").css("opacity",".33");
                }else{
                    $("#debt-down-arrow").css("opacity","1");
                }

                if(currentADebt>0){
                    $("#debt-up-arrow").css("opacity","1");
                }else{
                    $("#debt-up-arrow").css("opacity",".33");
                }

                canAdvanceDebt = 1;
            }, 152);
        }else{

        }
    });

    //debt click events
    $(".input_debt").change(function(){
        checkDebtInline($(this));
    });
    $(".input_debt").keyup(function(){
        checkDebtInline($(this));
    });

    $("#debt_total").click(function(){
        if(checkMobile()){
            $("#debt_total").css("color", "#df0064");
            $(".debt-input-line .debtClick").show();
        }else{
            $("#debtClickError").show();
        }
    });

    $("#summary_debt").change(function(){
        debtCheck($(this), $(this).attr("validator"));
        inputWidth($(this));
    });
    $("#summary_debt").keyup(function(){
        debtCheck($(this), $(this).attr("validator"));
        inputWidth($(this));
    });

    //savings click events
    $("#select_savings, #summary_savings").change(function(){
        savingsCheck($(this), $(this).attr("validator"));
    });
    $("#select_savings, #summary_savings").keyup(function(){
        savingsCheck($(this), $(this).attr("validator"));
        // inputWidth($(this));

        var l = Math.max($(this).val().length, 1);
        if (checkMobile()) {
            $(this).css("width", ((l-1)*4+15)+"vw");
        }else {
            inputWidth($(this));
        }
    });

    //existing insurance click events
    $("#select_existing_insurance, #summary_existing").change(function(){
        existingCheck($(this), $(this).attr('validator'));
    });
    $("#select_existing_insurance, #summary_existing").keyup(function(){
        existingCheck($(this), $(this).attr('validator'));
        var l = Math.max($(this).val().length, 1);
        if (checkMobile()) {
            $(this).css("width", ((l-1)*4+15)+"vw");
        }else {
            inputWidth($(this));
        }
    });


    //Set up click events on every space jump icon
    $(".spaceJumper").click(function() {
        if($(this).hasClass("completed")){
            buttonActive();
        }
        spaceJump($(this).attr("dest"));
    });

    //prevent enter from advancing when in input
    $('input').on("focus", function(){
        canAdvance = 0;
    });
    $('input').blur(function(){
        canAdvance = 1;
    });

    //Set up ENTER key to move forward
    window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;

        if (key == 13) {
            if(canAdvance){
                checkCurrent();
            } else{
                document.activeElement.blur();
                // checkCurrent();
                // canAdvance = 1;
                // console.log("blurred");
                // if(canAdvance){
                //     checkCurrent();
                // }
            }
        }
    };


    //autocomplete for states in location question
    $( "#select_state" ).autocomplete({
      source: usStates,
      select: function(event, ui){
        var selected = ui.item.value;
        if (usStates.indexOf(selected) != -1) {
          applicant.state = selected;
          $("#summary_location").dropdown("set selected", selected);
          $(this).removeClass('disabled');

          stateValid = 1;
          if(incomeValid){
              buttonActive();
          }
          $("#select_state_mobile").attr("width","90%");
          processValidate(this, true, null);
          if (selected.length > 7) {
              $("#select_state_mobile").addClass('extended');
          } else {
              $("#select_state_mobile").removeClass('extended');
          }
        } else {
            stateValid = 0;
            buttonInactive();
            processValidate(this, false, 'invalid');
            delete applicant.state;
        }

        $("#select_state").val(ui.item.value);
          var l = ui.item.label.length;
          if (checkMobile()) {
              $("#select_state").css("width", (l*5.9+18)+"vw");
          } else {
              $("#select_state").css("width", (l*25+73)+"px");
          }
      },
      open: function(){
          $("#input-dropdown").attr("src","/images/needs-tool/dropdown-close.png");
          stateDropdown = 1;
          canAdvance = 0;
      },
      focus: function(){
          $("#state-ui-widget").show();
      },
      minLength: 0,
      max: 5,
      close: function(){
          $("#input-dropdown").attr("src","/images/needs-tool/dropdown.png");
        setTimeout(function(){
            stateDropdown = 0;
        },200);
      }
    });

    //dropdown hack for autocomplete functionality
    $("#input-dropdown").click(function(){
        if (stateDropdown) {
            //do nothing
        } else {
            if(!checkMobile()){
                $( "#select_state" ).autocomplete("search","");
                $( "#select_state" ).focus();
            }else{
                $('#select_state_mobile').show().focus().click();
            }
        }
    });


    //summary page click EVENTS
    $("#revision-link").click(function() {
        $(".page1").addClass("opened");
        $(".clouds").addClass("cloudsIn");
    });
    $('.glossary-link').click(function() {
        $('#planGlossaryModal').modal({
            closeExisting: false
        });
    });

    //complete revise answers
    $("#reviseComplete").click(function(){
        if (resubmit(true)) {
            $(".page1").removeClass("opened");
            $(".clouds").removeClass("cloudsIn");
        }
    });

    $("#coverageList li").click(function() {
        $(this).toggleClass("selected");
        var covType = $(this).attr("rel");
        applicant.coverage[covType] = !applicant.coverage[covType];
        coverageString();
        resubmit();
    });

    $('#summary_location').dropdown({
        onChange:function(value, text) {
            applicant.state = value;
        }
    });

    $('#summary_status').dropdown({
        onChange:function(value, text) {
            applicant.status = value;
            if (applicant.status == 'Single') {
                $("#summary_partner_section").hide();
                resubmit();
            } else {
                $("#summary_partner_section").show();
                if (typeof applicant.partner == "undefined") {
                    applicant.partner = {};
                }
            }
        }
    });
    $('#summary_education').dropdown({
        direction: "upward",
        onChange:function(value, text) {
            applicant.Education = value;
            resubmit();
        }
    });
};


//compress the side-nav styling when more bubbles are added
function compressSidenav(){
    $("#side-nav").addClass("compressed");
}



// END CLICK/KEYUP/CHANGE EVENTS FOR NEEDS TOOL





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   HOMEPAGE MODULE 2 HEIGHT LOGIC   //////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






function homepageHeights(){
    var costModule = $(".cost");
    var needModule = $(".need");
    var costHeight = costModule.height();
    var needHeight = needModule.height();

    if(needHeight>costHeight){
        $(".cost").height(needHeight);
    }else if(costHeight>needHeight){
        $(".need").height(costHeight);
    }else{
        //do nothing
    }

    var p0Height = $(".testimonial").eq(0).height();
    var p1Height = $(".testimonial").eq(1).height();
    var p2Height = $(".testimonial").eq(2).height();
    if((p0Height>=p1Height) && (p0Height>=p2Height) ){
        $(".testimonial").eq(1).height(p0Height);
        $(".testimonial").eq(2).height(p0Height);
    }else if((p1Height>=p2Height) && (p1Height>=p0Height)){
        $(".testimonial").eq(0).height(p1Height);
        $(".testimonial").eq(2).height(p1Height);
    }else if((p2Height>=p1Height) && (p2Height>=p0Height)){
        $(".testimonial").eq(0).height(p2Height);
        $(".testimonial").eq(1).height(p2Height);
    }else{
        //do nothing
    }

    //tablet woman walking image
    if($(window).width()>768 && $(window).width()<993){
        $(".need-woman").height($(".need").height());
    }
}




// END HOMEPAGE LOGIC




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   DOCUMENT.READY   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$(document).ready(function(){
    //Prevent form from going
    $("#form").submit(function(e){
        e.preventDefault();
    });
    //Set up our default pop-state
    if (typeof(history.replaceState) !== "undefined") {
    history.replaceState({
          prev: "start",
          page: 1,
          slug: location.pathname.replace("/", "")
        }, null, null);
      }
    $("#next").click(function() {
        // validate();
        checkCurrent();
        if(sjAdded>2){
            compressSidenav();
        }
    });

    $("#nextArrow").click(function() {
        // validate();
        checkCurrent();
        if(sjAdded>2){
            compressSidenav();
        }
    });



    $("#backButton").click(function(){
        if(ready){
            history.back();
        }
        buttonActive();
    });

    $("#prevArrow").click(function(){
        if(ready){
            history.back();
        }
        buttonActive();
    });

    //set up skip listener
    $("#skip").on("click", function(){
        notSkipped = 0;
        if(current=="savings"){
            applicant.Savings = -1;
            $("#select_savings").val("");
            processValidate($("#select_savings"), true, null);
            $("#select_savings").removeClass("success");
            $("#select_savings").removeClass("error");

            next = "existing-insurance";
            curPage = pageModify(13);
            $("#sj-existing-insurance").parent().removeClass("hidden");
            sjAdded++;
        }else if(current=="existing-insurance"){
            $("#select_existing_insurance").val("");
            applicant.ExistingInsurance = -1;
            processValidate($("#select_existing_insurance"), true, null);
            $("#select_existing_insurance").removeClass("success");
            $("#select_existing_insurance").removeClass("error");

            next = "summary";
            curPage = pageModify(14);
            $("#sj-summary").addClass("completed");
        }else{
            //do nothing
        }
        checkCurrent();
    });
    setClickEvents();

    if (typeof(start) == "string") {
        spaceJump(start);
    }

    $( document ).tooltip();

    homepageHeights();

    $(window).resize(function(){
        homepageHeights();
    });

});

var ageValid = 0;
var coverageValid = 0;
var productValid = 0;
var termLengthValid = 0;
var genderValid = 0;
var healthRathingValid = 0;
var smokerValid = 0;
var quoteApplicant = {};
var quote = 0;
var selectedState;
var quoteResponse = {};
var sliderVisible = 0;

//On Click
function activateSubmit(){
  if(ageValid ===1&&coverageValid ===1&&productValid ===1&&termLengthValid ===1&&genderValid ===1&&healthRathingValid === 1 &&smokerValid ===1)
  {
      $('#get-quote-submit').prop('disabled', false);
      $('.mobile-submit-btn').removeClass('hidden-xs');
      $('.mobile-next-btn').addClass('hidden-xs');
  }
  else{

      $('#get-quote-submit').prop('disabled', true);
      $('.mobile-submit-btn').addClass('hidden-xs');
      $('.mobile-next-btn').removeClass('hidden-xs');


  }
}


//REST

function getQuote(applicant,tobacco){

    var premiums;
    $.ajax({
        type:"GET",
        dataType:'xml',
        data:applicant,
        headers:{
           "Accept":"application/xml",
           "Content-type":"text/html"
        },
        url:"/api/quote",
        success:function(response){
          console.log(response);

          var xml = $(response);
          console.log(xml);
          premiums = xml.find("quotedPremium");
          console.log(premiums);
          console.log("success");
            for(var i=0; i<premiums.length;i++)
            {
              if(premiums[i].attributes[1].value === tobacco)
              {
                  quoteResponse = premiums[i].childNodes;
                  console.log(quoteResponse);
                  quote = premiums[i].childNodes[5].textContent;
                  console.log(quoteResponse[5].textContent);
                  $("#your_quote_total").text(quoteResponse[5].textContent);
                  return quoteResponse;
              }

            }
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
      });

      return quoteResponse;

}
//scroll




var currentOption = 0;

var options = $(".quote-option-wrapper li");
var canAdvanceOption = 1;
$("#quote-down-arrow").click(function(){
    if(currentOption<(options.length-1) && canAdvanceOption){
        canAdvanceOption = 0;

        if(options[currentOption-1]){
            $(options[currentOption-1]).addClass("option-A-down-arrow");
            $(options[currentOption-1]).removeClass("option-A");
        }

        $(".quote-option-wrapper li").removeClass("current-option");

        $(options[currentOption]).addClass("option-B-down-arrow");
        $(options[currentOption]).removeClass("option-B");


        $(options[currentOption+1]).addClass("option-C-down-arrow");
        $(options[currentOption+1]).removeClass("option-C");

        if(options[currentOption+2]){
            $(options[currentOption+2]).addClass("option-hidden-below-down-arrow");
            $(options[currentOption+2]).removeClass("option-hidden-below");
            $(options[currentOption+2]).removeClass("quote-hidden");
        }



        setTimeout(function(){
            $(options[currentOption]).removeClass("quote-fades-out");
            $(options[currentOption-1]).removeClass("option-A-down-arrow");
            $(options[currentOption-1]).addClass("option-hidden-above");

            $(options[currentOption]).addClass("option-A");
            $(options[currentOption]).removeClass("option-B-down-arrow");

            $(options[currentOption+1]).addClass("option-B");
            $(options[currentOption+1]).removeClass("option-C-down-arrow");

            $(options[currentOption+2]).addClass("option-C");
            $(options[currentOption+2]).removeClass("option-hidden-below-down-arrow");
        }, 1001);



        setTimeout(function(){
            currentOption++;

            $(options[currentOption]).addClass("current-option");

            if(currentOption==(options.length-1)){
                $("#quote-down-arrow").css("opacity",".33");
            }else{
                $("#quote-down-arrow").css("opacity","1");
            }

            if(currentOption>0){
                $("#quote-up-arrow").css("opacity","1");
            }else{
                $("#quote-up-arrow").css("opacity",".33");
            }

            canAdvanceOption = 1;
        }, 1002);
    }else{

    }
});

$("#quote-up-arrow").css("opacity",".33");


$("#quote-down-arrow-mobile").click(function(){
    if(currentOption<(options.length-1) && canAdvanceOption){
        canAdvanceOption = 0;

        /*
        $(options[currentOption]).addClass("option-hidden-above");
        $(options[currentOption]).removeClass("option-B");
        $(options[currentOption+1]).addClass("option-B");
        $(options[currentOption+1]).removeClass("quote-hidden");
        $(options[currentOption+1]).removeClass("option-C");
        $(options[currentOption+1]).removeClass("option-hidden-above");
        $(options[currentOption+1]).removeClass("option-hidden-below");
        */

        $(options[currentOption]).addClass("option-fades-out-up");


        setTimeout(function(){
            $(options[currentOption]).addClass("option-hidden-above");
            $(options[currentOption]).addClass("quote-hidden");
            $(options[currentOption]).removeClass("option-B");
        },501);

        setTimeout(function(){
            $(options[currentOption+1]).addClass("option-B");
            $(options[currentOption+1]).removeClass("quote-hidden");
            $(options[currentOption+1]).removeClass("option-C");
            $(options[currentOption+1]).removeClass("option-hidden-above");
            $(options[currentOption+1]).removeClass("option-hidden-below");
            $(options[currentOption+1]).addClass("option-fades-in-up");
        },502);


        setTimeout(function(){
            $(options[currentOption]).removeClass("option-fades-out-up");
            $(options[currentOption+1]).removeClass("option-fades-in-up");

            currentOption++;

            $(options[currentOption]).addClass("current-option");

            if(currentOption==(options.length-1)){
                $("#quote-down-arrow-mobile").css("opacity",".33");
            }else{
                $("#quote-down-arrow-mobile").css("opacity","1");
            }

            if(currentOption>0){
                $("#quote-up-arrow-mobile").css("opacity","1");
            }else{
                $("#quote-up-arrow-mobile").css("opacity",".33");
            }

            canAdvanceOption = 1;

            $(".option-A .inactive-shield").on("click", function(){
                $("#quote-up-arrow").click();
            });
        }, 1002);
    }
});

$("#quote-up-arrow-mobile").click(function(){
    if(currentOption>0 && canAdvanceOption){
        canAdvanceOption = 0;

        /*
        $(options[currentOption]).addClass("option-hidden-below");
        $(options[currentOption-1]).addClass("option-B");
        $(options[currentOption-1]).addClass("option-B");
        $(options[currentOption-1]).removeClass("quote-hidden");
        $(options[currentOption-1]).removeClass("option-A");
        $(options[currentOption-1]).removeClass("option-hidden-above");
        $(options[currentOption-1]).removeClass("option-hidden-below");
        */

        // $(options[currentOption]).addClass("option-fades-out-up");
        //
        //
        // setTimeout(function(){
        //     $(options[currentOption]).addClass("option-hidden-above");
        //     $(options[currentOption]).removeClass("option-B");
        // },501);
        //
        // setTimeout(function(){
        //     $(options[currentOption+1]).addClass("option-B");
        //     $(options[currentOption+1]).removeClass("quote-hidden");
        //     $(options[currentOption+1]).removeClass("option-C");
        //     $(options[currentOption+1]).removeClass("option-hidden-above");
        //     $(options[currentOption+1]).removeClass("option-hidden-below");
        //     $(options[currentOption+1]).addClass("option-fades-in-up");
        // },502);

        $(options[currentOption]).addClass("option-fades-out-down");


        setTimeout(function(){
            $(options[currentOption]).addClass("option-hidden-below");
            $(options[currentOption]).addClass("quote-hidden");
            $(options[currentOption]).removeClass("option-B");
        },501);

        setTimeout(function(){
            $(options[currentOption-1]).addClass("option-B");
            $(options[currentOption-1]).removeClass("quote-hidden");
            $(options[currentOption-1]).removeClass("option-A");
            $(options[currentOption-1]).removeClass("option-hidden-above");
            $(options[currentOption-1]).removeClass("option-hidden-below");
            $(options[currentOption-1]).addClass("option-fades-in-down");
        },502);


        setTimeout(function(){
            $(options[currentOption]).removeClass("option-fades-out-down");
            $(options[currentOption-1]).removeClass("option-fades-in-down");

            currentOption--;

            $(options[currentOption]).addClass("current-option");


            if(currentOption==(options.length-1)){
                $("#quote-down-arrow-mobile").css("opacity",".33");
            }else{
                $("#quote-down-arrow-mobile").css("opacity","1");
            }

            if(currentOption>0){
                $("#quote-up-arrow-mobile").css("opacity","1");
            }else{
                $("#quote-up-arrow-mobile").css("opacity",".33");
            }

            canAdvanceOption = 1;

            $(".option-C .inactive-shield").on("click", function(){
                $("#quote-down-arrow").click();
            });
        }, 1002);
    }
});

$("#quote-up-arrow").click(function(){
    if(currentOption>0 && canAdvanceOption){
        canAdvanceOption = 0;

        if(options[currentOption-1]){
            $(options[currentOption-1]).addClass("option-A-up-arrow");
            $(options[currentOption-1]).removeClass("option-A");
        }

        $(".quote-option-wrapper li").removeClass("current-option");

        $(options[currentOption]).addClass("option-B-up-arrow");
        $(options[currentOption]).removeClass("option-B");


        $(options[currentOption+1]).addClass("option-C-up-arrow");
        $(options[currentOption+1]).removeClass("option-C");

        if(options[currentOption-2]){
            $(options[currentOption-2]).addClass("option-hidden-above-up-arrow");
            $(options[currentOption-2]).removeClass("option-hidden-above");
            $(options[currentOption-2]).removeClass("quote-hidden");
        }



        setTimeout(function(){
            //$(options[currentOption]).removeClass("quote-fades-out");
            $(options[currentOption-1]).removeClass("option-A-up-arrow");
            $(options[currentOption-1]).addClass("option-B");

            $(options[currentOption]).addClass("option-C");
            $(options[currentOption]).removeClass("option-B-up-arrow");

            $(options[currentOption+1]).addClass("option-hidden-below");
            $(options[currentOption+1]).removeClass("option-C-up-arrow");

            $(options[currentOption-2]).addClass("option-A");
            $(options[currentOption-2]).removeClass("option-hidden-above-up-arrow");
        }, 1001);



        setTimeout(function(){
            currentOption--;

            $(options[currentOption]).addClass("current-option");

            if(currentOption==(options.length-1)){
                $("#quote-down-arrow").css("opacity",".33");
            }else{
                $("#quote-down-arrow").css("opacity","1");
            }

            if(currentOption>0){
                $("#quote-up-arrow").css("opacity","1");
            }else{
                $("#quote-up-arrow").css("opacity",".33");
            }

            canAdvanceOption = 1;

            $(".option-C .inactive-shield").on("click", function(){
                $("#quote-down-arrow").click();
            });
        }, 1002);
    }else{

    }
});


// $("#quote-up-arrow").click(function(){
//     if(currentOption>0 && canAdvanceOption){
//         canAdvanceOption = 0;
//         $(options[currentOption]).siblings().removeClass("current-option");
//         $(options[currentOption]).addClass("current-option");
//
//         $(options[currentOption-1]).addClass("debt-A-up-arrow");
//         $(options[currentOption-1]).removeClass("debt-hide-above");
//         $(options[currentOption-1]).removeClass("hidden");
//         $(options[currentOption-1]).addClass("quote-fades-in");
//
//         setTimeout(function(){
//             $(options[currentOption-1]).removeClass("quote-fades-in");
//         }, 151);
//
//         $(options[currentOption+1]).addClass("debt-hide-below");
//         $(options[currentOption+1]).addClass("quote-fades-out");
//         $(options[currentOption+1]).removeClass("debt-B");
//         $(options[currentOption+1]).removeClass("debt-B-down-arrow");
//         $(options[currentOption+1]).removeClass("debt-B-up-arrow");
//
//         setTimeout(function(){
//             $(options[currentOption+1]).addClass("hidden");
//             $(options[currentOption+1]).removeClass("quote-fades-out");
//         }, 151);
//
//         $(options[currentOption]).addClass("debt-B-up-arrow");
//         $(options[currentOption]).removeClass("debt-A");
//         $(options[currentOption]).removeClass("debt-A-up-arrow");
//         $(options[currentOption]).removeClass("debt-A-down-arrow");
//
//         setTimeout(function(){
//             currentOption--;
//
//             if(currentOption==(options.length-2)){
//                 $("#quote-down-arrow").css("opacity",".33");
//             }else{
//                 $("#quote-down-arrow").css("opacity","1");
//             }
//
//             if(currentOption>0){
//                 $("#quote-up-arrow").css("opacity","1");
//             }else{
//                 $("#quote-up-arrow").css("opacity",".33");
//             }
//
//             canAdvanceOption = 1;
//         }, 152);
//     }else{
//
//     }
// });



//Event Handlers
//if current option  data is empty disable buttons
//enable it
//run this function on blur

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   Slider Logic   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function standardizeDecimal(costString){
    var tempString = costString.substr(costString.indexOf("."), costString.length);
    //console.log(tempString);
    if(tempString.length==2){
        return (costString + "0");
    }else{
        return costString;
    }
}

function commaThousands(coverageString){

    var tempString;
    if(coverageString[0]=="$"){
        tempString = coverageString.substr(1, coverageString.length);
    }else{
        tempString = coverageString;
    }

    if(tempString.length>=4){
        //console.log(tempString.substr(tempString.length-3, tempString.length));
        tempString = tempString.substr(0, tempString.length-3) + "," + tempString.substr(tempString.length-3, tempString.length);
    }
    if(tempString.length>7){
        tempString = tempString.substr(0, tempString.length-7) + "," + tempString.substr(tempString.length-7, tempString.length);
    }
    return ("$" + tempString);
    //console.log(tempString);
}


    //
function initializeSlider(){

    console.log(quoteResponse);
    console.log("quoteResponse");
    var monthlyQuote;
    var faceValue;
    if(quoteResponse.length>0){
        monthlyQuote = quoteResponse[5].textContent;
        faceValue = quoteResponse[3].textContent;
    }else{
        monthlyQuote = "44.45";
        faceValue = "144001";
    }
    // var monthlyQuote = quoteResponse[5].textContent;
    // var faceValue = quoteResponse[3].textContent;
    // console.log("monthly " + monthlyQuote + " value " + faceValue);


    var costBubble = '<div id="costWrapper"><div id="sliderCost">$XX.XX</div><div id="downcaret"></div></div>';
    var coverageBubble = '<div id="coverageWrapper"><div id="sliderCoverage">$XX.XX</div><div id="upcaret"></div></div>';
    var sliderLowVal = '<p class="sliderRangeVal" id="sliderLowVal">$XXX,XXX</p>';
    var sliderHighVal = '<p class="sliderRangeVal" id="sliderHighVal">$XXX,XXX</p>';



    // var quoteCost = 57.23;
    // var quoteCoverage = 680000;

    var quoteCost = parseFloat(monthlyQuote);
    var quoteCoverage = parseInt(faceValue);

    var multiplier = (quoteCoverage/quoteCost);

    var minCoverage;
    if(quoteCoverage>50000){
        minCoverage = quoteCoverage - 50000;
    }else{
        minCoverage = quoteCoverage;
    }

    var maxCoverage = quoteCoverage + 350000;
    if(maxCoverage>1000000){
        maxCoverage = 1000000;
    }

    var minCost = ((quoteCost/quoteCoverage)*minCoverage);
    var maxCost = ((quoteCost/quoteCoverage)*maxCoverage);

    var costBubbleVal = ("$" + ((Math.round((quoteCost)*100))/100));
    var coverageBubbleVal = ("$" + quoteCoverage);


    $("#quoteSlider").attr("min", minCost);
    $("#quoteSlider").attr("max", maxCost);
    $("#quoteSlider").attr("value", quoteCost);


    $('input[type=range]')
    .rangeslider({
        polyfill: false,
        onInit: function() {
            this.$range.children(".rangeslider__handle").append($(costBubble));
            this.$range.children(".rangeslider__handle").append($(coverageBubble));
            this.$range.append($(sliderLowVal));
            this.$range.append($(sliderHighVal));


            $("#sliderLowVal").html(commaThousands(minCoverage.toString()));
            $("#sliderHighVal").html(commaThousands(maxCoverage.toString()));

            $("#sliderCost").html(standardizeDecimal(costBubbleVal));
            $("#sliderCoverage").html(commaThousands(coverageBubbleVal));

        },
        onSlide: function(){
            var tempCostString = ("$" + ((Math.round((this.value)*100))/100));
            $("#sliderCost").html(standardizeDecimal(tempCostString));

            var tempCoverageString = ("$" + ((Math.round((this.value*multiplier)/1000))*1000));
            tempCoverageString = commaThousands(tempCoverageString);
            $("#sliderCoverage").html(tempCoverageString);

        }
    });
}



$( document ).ready(function() {

    $("#partner-logo").click(function(){
        if(!sliderVisible){
            initializeSlider();

            setTimeout(function(){
                $("#quote-form").addClass("quote-animated-short quoteFadeOutUp");
                // $("#sliderWrapper").css("display","inline-block");
            }, 10);

            setTimeout(function(){
                $("#sliderWrapper").show();
                $("#quote-form").hide();
                $("#sliderWrapper").css("display","inline-block");
                sliderVisible = 1;
                $("#quote-budget-question").html("Revise my answers");
            }, 410);

            setTimeout(function(){
                $("#quote-form").removeClass("quote-animated-short quoteFadeOutUp");
            }, 1010);
        }else{
            setTimeout(function(){
                $("#sliderWrapper").addClass("quote-animated-short quoteFadeOutUp");
                // $("#sliderWrapper").css("display","inline-block");
            }, 10);

            setTimeout(function(){
                $("#quote-form").show();
                $("#sliderWrapper").hide();
                $("#quote-form").css("display","inline-block");
                sliderVisible = 0;
                $("#quote-budget-question").html("How much coverage can I get for my budget? ");
            }, 410);

            setTimeout(function(){
                $("#sliderWrapper").removeClass("quote-animated-short quoteFadeOutUp");
            }, 1010);
        }
    });

    $("#quote-budget-question").click(function(){
        if(!sliderVisible){
            initializeSlider();

            setTimeout(function(){
                $("#quote-form").addClass("quote-animated-short quoteFadeOutUp");
                // $("#sliderWrapper").css("display","inline-block");
            }, 10);

            setTimeout(function(){
                $("#sliderWrapper").show();
                $("#quote-form").hide();
                $("#sliderWrapper").css("display","inline-block");
                sliderVisible = 1;
                $("#quote-budget-question").html("Revise my answers");
            }, 410);

            setTimeout(function(){
                $("#quote-form").removeClass("quote-animated-short quoteFadeOutUp");
            }, 1010);
        }else{
            setTimeout(function(){
                $("#sliderWrapper").addClass("quote-animated-short quoteFadeOutUp");
                // $("#sliderWrapper").css("display","inline-block");
            }, 10);

            setTimeout(function(){
                $("#quote-form").show();
                $("#sliderWrapper").hide();
                $("#quote-form").css("display","inline-block");
                sliderVisible = 0;
                $("#quote-budget-question").html("How much coverage can I get for my budget? ");
            }, 410);

            setTimeout(function(){
                $("#sliderWrapper").removeClass("quote-animated-short quoteFadeOutUp");
            }, 1010);
        }
    });




    //states
    var option = '';
    for (var i=0;i<usStates.length;i++){
       option += '<div class="item us-state" data-value="'+ usStatesAbbr[i] + '" data-state="'+ usStates[i] + '">' + usStates[i] + '</div>';
    }
    $('#quote-state-dropdown .menu').append(option);
    $('#quote-state-dropdown.dropdown')
      .dropdown()
    ;

    $('.quote-options button').click(function() {
      $(this).addClass('quote-form_selected');
      $(this).siblings().removeClass('quote-form_selected');

      //console.log($(this).parent().attr('id'));
      if($(this).parent().attr('id')==="quote-product-buttons") {
            if(this.value==="TERM" && stateCoverage[selectedState].Term ===1)
            {
              productValid = 1;
              quoteApplicant.product = this.value;
                $('#quote-product-type .quote-form_error_message').addClass('hidden');
                $('#quote-product-type').removeClass('error');
              activateSubmit();

            }


            else if(this.value==="TERM" && stateCoverage[selectedState].Term === 0)
            {
                termLengthValid = 0;
                quoteApplicant.product = this.value;

                $('#quote-product-type .quote-form_error_message').text("Unfortunately, our products are not yet available in your state.");
                $('#quote-product-type .quote-form_error_message').removeClass('hidden');
                $("#quote-product-type").addClass('error');
                return false;

            }


            else if(this.value==="FE" && stateCoverage[selectedState].Final === 1)
            {
              productValid = 1;
              quoteApplicant.product = this.value;
              $('#quote-product-type .quote-form_error_message').addClass('hidden');
              $('#quote-product-type').removeClass('error');
              activateSubmit();

            }

            else if(this.value==="FE" && stateCoverage[selectedState].Final === 0)
            {
                termLengthValid = 0;
                quoteApplicant.product = this.value;

                $('#quote-product-type .quote-form_error_message').text("Unfortunately, our products are not yet available in your state.");
                $('#quote-product-type .quote-form_error_message').removeClass('hidden');
                $('#quote-product-type').addClass('error');
                return false;
            }

      }

      else if($(this).parent().attr('id')==="quote-term-length-buttons") {
            var termLength = parseInt($(this).text());
            console.log(termLength);
            console.log(termRules[termLength].smoker);

            if (quoteApplicant.age > termRules[termLength].smoker)
            {
                $('#quote-term-length .quote-form_error_message').text("Unfortunately, you are not eligible for Final. Try Term Expense.");
                $('#quote-term-length .quote-form_error_message').removeClass('hidden');
                $("#quote-term-length").addClass('error');
                termLengthValid =0;
            }
            else{
                termLengthValid = 1;
                quoteApplicant.termLength = termLength;
                $('#quote-term-length .quote-form_error_message').addClass('hidden');

                activateSubmit();
            }
        }

      else if($(this).parent().attr('id')==="quote-gender-buttons") {
            genderValid = 1;
            quoteApplicant.gender = this.value;
            activateSubmit();
            }
      else if($(this).parent().attr('id')==="quote-smoker-buttons") {
                smokerValid = 1;
                quoteApplicant.tobacco = this.value;
                activateSubmit();
            }
    });

    $('.quote-star').click(function()
        {
          var arr = $('.quote-star');
          var starIndex = arr.index(this);
          $('.quote-star').siblings().removeClass('quote-star-selected');
          for(i=0;i<=starIndex;i++)
          {
             $(arr[i]).addClass('quote-star-selected ');
          }

          quoteApplicant.riskClass = $(this).data("value");
          console.log(this);
          console.log(this.value);
          healthRathingValid =1;
          activateSubmit();


      });





    //Validation
    //




    function checkAgeInline(changed, checkOther){
        var age = changed.text();
        $(changed).removeClass('error');

        //console.log(age);
        if ($.isNumeric(age)) {
                if (age >= 18 && age <= maxAge) {
                    ageValid = 1;
                    processValidate(changed, true, null);
                    quoteApplicant.age = parseInt(age);
                    $('#quote-age .quote-form_error_message').addClass('hidden');
                    $(changed).removeClass('error');
                    return true;
                }
                else if(age > maxAge) {
                    ageValid = 0;
                    delete quoteApplicant.age;
                    $('#quote-age .quote-form_error_message').text("Unfortunately, you are not eligible for Term. Try Final Expense.");
                    $('#quote-age .quote-form_error_message').removeClass('hidden');
                    $(changed).addClass('error');

                }
                 else {
                    ageValid = 0;
                    //processValidate(changed, false, 'ageLimit');
                    delete quoteApplicant.age;
                    //buttonInactive();
                    $('#quote-age .quote-form_error_message').text("Unfortunately, you are not eligible for Final. Try Term Expense.");
                    $('#quote-age .quote-form_error_message').removeClass('hidden');
                    $(changed).addClass('error');

                    return false;
                }
        } else if(age===""){
            ageValid = 0;
            changed.removeClass('error');
            changed.siblings('.errorMSG').hide();
            buttonInactive();
        }else {
            ageValid = 0;
            $('#quote-age .quote-form_error_message').text("Please enter a valid age.");
            $('#quote-age .quote-form_error_message').removeClass('hidden');
            $(changed).addClass('error');
            processValidate(changed, false, 'invalid');
            buttonInactive();
            delete quoteApplicant.age;
        }
    }



    function checkCoverage(changed, checkOther){
        var coverage = changed.val();
        $(changed).removeClass('error');

        //console.log(coverage);
        if ($.isNumeric(coverage)) {
                if (coverage > 0 && coverage< maxCoverage) {
                    coverageValid = 1;
                    processValidate(changed, true, null);
                    quoteApplicant.faceAmount = parseInt(coverage);
                    $('#quote-coverage .quote-form_error_message').addClass('hidden');
                    $(changed).removeClass('error');
                    return true;
                } else if (coverage < 1){
                    coverageValid = 0;
                    delete quoteApplicant.faceAmount;
                    //buttonInactive();
                    $('#quote-coverage .quote-form_error_message').text("Please enter a higher coverage amount.");
                    $('#quote-coverage .quote-form_error_message').removeClass('hidden');
                    $(changed).addClass('error');
                    return false;
                }
                else{
                    coverageValid = 0;
                    delete quoteApplicant.faceAmount;
                    //buttonInactive();
                    $('#quote-coverage .quote-form_error_message').text("Please enter a lower coverage amount.");
                    $('#quote-coverage .quote-form_error_message').removeClass('hidden');
                    $(changed).addClass('error');
                    return false;
                }
        } else if(coverage===""){
            coverageValid = 0;
            changed.removeClass('error');
            changed.siblings('.errorMSG').hide();
            buttonInactive();
        }else {
            coverageValid = 0;
            $('#quote-coverage .quote-form_error_message').text("Please enter a valid amount.");
            $('#quote-coverage .quote-form_error_message').removeClass('hidden');
            $(changed).addClass('error');
            processValidate(changed, false, 'invalid');
            buttonInactive();
            delete quoteApplicant.faceAmount;
            return false;
        }
    }


    function checkState(changed, checkOther){
        var state = changed.val();
        var stateFull = changed.siblings(".text").text();
        selectedState = stateFull;
        //console.log(state);
        if ($(state)!=="") {

            for(var i=0; i<errorStates.length;i++)
                {
                if($.trim(stateFull)===errorStates[i])
                {
                    stateValid = 0;
                    $('#quote-states .quote-form_error_message').text("Unfortunately, our products are not yet available in your state.");
                    $('#quote-states .quote-form_error_message').removeClass('hidden');
                    $(changed).addClass('error');
                    return false;
                }
            }
            stateValid = 1;
            processValidate(changed, true, null);
            quoteApplicant.state = state;
            console.log(quoteApplicant.state);
            console.log("true");
            $('#quote-states .quote-form_error_message').addClass('hidden');
            return true;
        }
        else {
            stateValid = 0;
            processValidate(changed, false, 'invalid');
            //buttonInactive();
            delete quoteApplicant.state;
        }
    }


    $(document).on("click", ".option-A .inactive-shield" , function() {
        $("#quote-up-arrow").click();
    });

    $(document).on("click", ".option-C .inactive-shield" , function() {
        $("#quote-down-arrow").click();
    });
    // $(".option-C .inactive-shield").on("click", function(){
    //     console.log("C CLICK");
    //     $("#quote-down-arrow").click();
    // });

    // $(".option-C .inactive-shield").click( function(){
    //     console.log("C CLICK");
    //     $("#quote-down-arrow").click();
    // });




    $("#quote_select_age").keyup(function(){
        checkAgeInline($(this), 1);
        activateSubmit();

    });


    $("#select_coverage_amount").keyup(function(){
        checkCoverage($(this), 1);
        activateSubmit();

    });

    $("#quote-state-dropdown input").change(function(){
        checkState($(this), 1);
        activateSubmit();

        if (stateCoverage[selectedState].Final === 0 && stateCoverage[selectedState].Term === 0)
        {
            $('#quote-states .quote-form_error_message').text("Unfortunately, our products are not yet available in your state.");
            $('#quote-states .quote-form_error_message').removeClass('hidden');
        }


        else if ($('#quote-product-type').hasClass('error'))
        {

            console.log("made it");
            //if state and product type are okay then remove error state
            switch (quoteApplicant.product) {
                case "FE":
                    if(stateCoverage[selectedState].Final === 1){
                        $('#quote-product-type .quote-form_error_message').text("");
                        $('#quote-product-type .quote-form_error_message').addClass('hidden');
                    }
                    else if ($('#quote-product-buttons .quote-form_selected').length > 0 && stateCoverage[selectedState].Final === 0)
                    {
                        $('#quote-product-type .quote-form_error_message').text("Unfortunately, our products are not yet available in your state.");
                        $('#quote-product-type .quote-form_error_message').removeClass('hidden');
                    }
                    break;
                case "TERM":
                    if(stateCoverage[selectedState].Term === 1){
                        $('#quote-product-type .quote-form_error_message').text("");
                        $('#quote-product-type .quote-form_error_message').addClass('hidden');
                    }

                    else if ($('#quote-product-buttons .quote-form_selected').length > 0 && stateCoverage[selectedState].Term === 0)
                    {
                        $('#quote-product-type .quote-form_error_message').text("Unfortunately, our products are not yet available in your state.");
                        $('#quote-product-type .quote-form_error_message').removeClass('hidden');
                    }
                    break;
                default:
                    text =" ";
            }

        }

    });



    /*$("#quote_select_age").keyup(function(){
        console.log($(this).text());
    });*/

    //Click Events
    $(".mobile-next-btn").click(function(){
        $("#quote-down-arrow").click();
    });


    $("#get-quote-submit").click(function(){
        getQuote(quoteApplicant,quoteApplicant.tobacco);
        $(".quote-apply-now").removeClass('no-height no-opacity');

    });


    $("#mobile-submit").click(function(){
        $("#get-quote-submit").click();
    });
});
