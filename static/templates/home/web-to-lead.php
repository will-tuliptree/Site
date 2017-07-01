<!-- Note :
   - You can modify the font style and form style to suit your website.
   - Code lines with comments “Do not remove this code”  are required for the form to work properly, make sure that you do not remove these lines of code.
   - The Mandatory check script can modified as to suit your business needs.
   - It is important that you test the modified form before going live.-->
<div id='crmWebToEntityForm' class="t-modal " style='margin:auto;'>
    <div class="t-modal_subscribe">
   <button class="modal-close vex-dialog-button-secondary vex-dialog-button vex-last"> X </button>
   <META HTTP-EQUIV ='content-type' CONTENT='text/html;charset=UTF-8'>
   <form action='https://crm.zoho.com/crm/WebToLeadForm' name=WebToLeads2501603000000144002 method='POST' onSubmit='javascript:document.charset="UTF-8"; return checkMandatory()' accept-charset='UTF-8'>

	 <!-- Do not remove this code. -->
	<input type='text' style='display:none;' name='xnQsjsdp' value='e56feef530c13ae497dcf1c63613d0021475b1c7f96f90f6917f26f37528a8f3'/>
	<input type='hidden' name='zc_gad' id='zc_gad' value=''/>
	<input type='text' style='display:none;' name='xmIwtLD' value='7b2d8d197821f73c504d199c93f0f3471f64e14267e4b629cf36ae35e65b8c57'/>
	<input type='text' style='display:none;'  name='actionType' value='TGVhZHM='/>

	<input type='text' style='display:none;' name='returnURL' value='http&#x3a;&#x2f;&#x2f;tuliptree.nyc' />
	 <!-- Do not remove this code. -->
	<style>
		tr , td {
			padding:6px;
			border-spacing:0px;
			border-width:0px;
			}
	</style>
	<table style='background-color:white;color:black' class="t-subscribe">

	<tr class="subscribe-title"><td colspan='2'><strong>Sign Up</strong><span> Sign up and get the latest news... <span></td></tr>

	<tr><td  style='nowrap:nowrap;text-align:left;font-size:12px;font-family:Arial;width:200px;'>Company<span style='color:red;'>*</span></td><td  ><input type='text'   maxlength='100' name='Company' /></td></tr>

	<tr><td  style='nowrap:nowrap;text-align:left;font-size:12px;font-family:Arial;width:200px;'>First Name</td><td  ><input type='text'  maxlength='40' name='First Name' /></td></tr>

	<tr><td  style='nowrap:nowrap;text-align:left;font-size:12px;font-family:Arial;width:200px;'>Last Name<span style='color:red;'>*</span></td><td  ><input type='text' s  maxlength='80' name='Last Name' /></td></tr>

	<tr><td  style='nowrap:nowrap;text-align:left;font-size:12px;font-family:Arial;width:200px;'>Email</td><td  ><input type='text'   maxlength='100' name='Email' /></td></tr>

	<tr><td  style='nowrap:nowrap;text-align:left;font-size:12px;font-family:Arial;width:200px;'>Phone</td><td  ><input type='text'   maxlength='30' name='Phone' /></td></tr>

	<tr><td colspan='2' style='padding-top:15px;'>
		<input class="btn t-button" type='submit' value='Submit' />
	    </td>
	</tr>
   </table>
	<script>
 	  var mndFileds=new Array('Company','Last Name');
 	  var fldLangVal=new Array('Company','Last Name');
		var name='';
		var email='';

 	  function checkMandatory() {
		for(i=0;i<mndFileds.length;i++) {
		  var fieldObj=document.forms['WebToLeads2501603000000144002'][mndFileds[i]];
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
