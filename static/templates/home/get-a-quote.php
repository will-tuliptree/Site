<div id="get-a-quote_form" class="t-modal" style="margin:auto;">
    <div class="t-modal_subscribe">
        <button class="modal-close vex-dialog-button-secondary vex-dialog-button vex-last"> X </button>

   <meta http-equiv="content-type" content="text/html;charset=UTF-8">
   <form action="https://crm.zoho.com/crm/WebToContactForm" name="WebToContacts2501603000000150013" method="POST" onsubmit="javascript:document.charset=&quot;UTF-8&quot;; return checkMandatory()" accept-charset="UTF-8">

	 <!-- Do not remove this code. -->
	<input type="text" style="display:none;" name="xnQsjsdp" value="e56feef530c13ae497dcf1c63613d0021475b1c7f96f90f6917f26f37528a8f3">
	<input type="hidden" name="zc_gad" id="zc_gad" value="">
	<input type="text" style="display:none;" name="xmIwtLD" value="7b2d8d197821f73c504d199c93f0f34722299f160d2b2afc5ac38d4bd2593b7f">
	<input type="text" style="display:none;" name="actionType" value="Q29udGFjdHM=">

	<input type="text" style="display:none;" name="returnURL" value="https://tuliptree.nyc/thank-you">
	 <!-- Do not remove this code. -->
	<style>
		tr , td {
			padding:6px;
			border-spacing:0px;
			border-width:0px;
			}
	</style>
	<table style="background-color:white;color:black" class="t-subscribe">

	<tbody><tr class="subscribe-title"><td colspan="2" style="font-family:Arial;"><strong>Get A Quote</strong></td></tr>

	<tr><td style="nowrap:nowrap;text-align:left;font-size:12px;font-family:Arial;width:200px;">First Name</td><td style="width:250px;"><input type="text" style="" maxlength="40" name="First Name"></td></tr>

	<tr><td style="nowrap:nowrap;text-align:left;font-size:12px;font-family:Arial;width:200px;">Last Name<span style="color:red;">*</span></td><td style="width:250px;"><input type="text" style="" maxlength="80" name="Last Name"></td></tr>

	<tr><td style="nowrap:nowrap;text-align:left;font-size:12px;font-family:Arial;width:200px;">Email</td><td style="width:250px;"><input type="text" style="" maxlength="100" name="Email"></td></tr>

	<tr><td style="nowrap:nowrap;text-align:left;font-size:12px;font-family:Arial;width:200px;">Quote Categories</td><td style="">
		<select style="width:500px;" name="CONTACTCF1">
			<option value="-None-">-None-</option>
			<option value="EMR">EMR</option>
			<option value="Claims Representation">Claims Representation</option>
		</select></td></tr>

	<tr><td colspan="2" style="text-align:center; padding-top:15px;">
		<input class="btn t-button" style="" type="submit" value="Submit">
		<!--<input type='reset' style='font-size:12px;color:#131307' value='Reset' />-->
	    </td>
	</tr>
   </tbody></table>
	<script>
 	  var mndFileds=new Array('Last Name');
 	  var fldLangVal=new Array('Last Name');
		var name='';
		var email='';

 	  function checkMandatory() {
		for(i=0;i<mndFileds.length;i++) {
		  var fieldObj=document.forms['WebToContacts2501603000000150013'][mndFileds[i]];
		  if(fieldObj) {
			if (((fieldObj.value).replace(/^\s+|\s+$/g, '')).length==0) {
			 if(fieldObj.type =='file')
				{
				 alert('Please select a file to upload.');
				 fieldObj.focus();
				 return false;
				}
			alert(fldLangVal[i] +' cannot be empty.');
   	   	  	  fieldObj.focus();
   	   	  	  return false;
			}  else if(fieldObj.nodeName=='SELECT') {
  	   	   	 if(fieldObj.options[fieldObj.selectedIndex].value=='-None-') {
				alert(fldLangVal[i] +' cannot be none.');
				fieldObj.focus();
				return false;
			   }
			} else if(fieldObj.type =='checkbox'){
 	 	 	 if(fieldObj.checked == false){
				alert('Please accept  '+fldLangVal[i]);
				fieldObj.focus();
				return false;
			   }
			 }
			 try {
			     if(fieldObj.name == 'Last Name') {
				name = fieldObj.value;
 	 	 	    }
			} catch (e) {}
		    }
		}
	     }

</script>
	</form>
</div>
</div>
