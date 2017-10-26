<script>
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
}

function get_disp_history(dispo) {
	console.log("Entered get_disp_history");
	var disp_history_obj = {
		5050:0,
		5100:0,
		5105:0,
		5107:0,
		5111:0,
		5112:0,
		5117:0,
		5121:0,
		5130:0,
		5140:0,
		5150:0,
		5200:0,
		5300:0,
		5320:0,
		5330:0,
		5400:0,
		5550:0,
		5560:0,
		5700:0,
		5900:0,
		9100:0
	}

	idisp_field_name = "";
	var idisp_iteration = "";
	var idisp_content = "";

	for(var i = 0; i <= 20; ++i) {
		if(i > 10) {
			idisp_iteration = "${e://Field/IDISP0" + i.toString() + "}";
			idisp_field_name = "IDISP0" + i.toString();
		} else {
			idisp_iteration = "${e://Field/IDISP" + i.toString() + "}";
			idisp_field_name = "IDISP" + i.toString();
		}
		if(idisp_iteration) {
			idisp_content = idisp_iteration;
		} else {
			break;
		}

		if(disp_history_obj.hasOwnProperty(parseInt(idisp))) {
			disp_history_obj[parseInt(idisp)] += 1;
			Qualtrics.SurveyEngine.setEmbeddedData(idisp_field_name, dispo);
		}
	}

	console.log("Leaving get_disp_history");
	
	return disp_history_obj;
}

function get_embedded_data_url(dispo) {
	var disp_history_json = get_disp_history(dispo);
	if(disp_history_json.hasOwnProperty(dispo)) {
		disp_history_json[dispo] += 1;
	}

	console.log(disp_history_json);

	var intVStatus = 3;
	if(dispo < 5000) {
		intVStatus = 4;
	}
	var url = "http://130.49.206.205:8090/ReturnToWincati/";
	url += "PassCode=${e://Field/PassCode}/";
	url += "PCA=${e://Field/PCA}/";
	url += "HOMEMAKER=${e://Field/HOMEMAKER}/";
	url += "CASEMGR=${e://Field/CASEMGR}/";
	url += "VALFU=${e://Field/VALFU}/";
	url += "LEFTMSG=${e://Field/LEFTMSG}/";
	url += "KEYDISP=${e://Field/KEYDISP}/";
	url += "NSOC=${e://Field/NSOC}/";
	url += "NSOCname=${e://Field/NSOCname}/";
	url += "NSOCphone=${e://Field/NSOCphone}/";
	url += "NSOCother=${e://Field/NSOCother}/";
	url += "NSOCtime=${e://Field/NSOCtime}/";
	url += "Wave=${e://Field/Wave}/";
	url += "IntVStatus=" + intVStatus + "/";
	url += "Dispo=" + dispo;
	url = url.replaceAll(' ', '_');
	alert('halp');
	return url;
}

function loadJs(src, callback) {
    var s = document.createElement('script');
    document.getElementsByTagName('head')[0].appendChild(s);
    s.onload = function() {
        //callback if existent.
        if (typeof callback == "function") callback();
        callback = null;
    }
    s.onreadystatechange = function() {
        if (s.readyState == 4 || s.readyState == "complete") {
            if (typeof callback == "function") callback();
            callback = null; // Wipe callback, to prevent multiple calls.
        }
    }
    s.src = src;
}

loadJs('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', function() {
    //$('body').append('<p>It works!</p>');
    //alert("loaded JQuery")

    var element =  document.getElementById('myModal');

    if (typeof(element) != 'undefined' && element != null)
    {
        //alert("it already exists")
    } else
    {

//Root menu
$('<div id="myModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>INTERVIEWER: You are now ready to answer questions to assign a disposition code. If you continue past this screen, you will select the outcome of this call attempt.</p><ul style="list-style:none;"><li><button id="supervisorAttention">Supervisor attention*</button></li><li><button id="scheduleAnAppointmentForCallback">Schedule an appointment for callback</button></li><li><button id="scheduledAnInPersonInterview">Scheduled an in-person interview</button></li><li><button id="spokeWithAPerson">Spoke with a person</button></li><li><button id="didNotSpeakWithAPerson">Did not speak with a person</button></li><li><button id="selectedPersonTransferedToANursingHome">Selected person transfered to a nursing home</button></li><li><button id="selectedPersonDead">Selected person dead</button></li></ul></div></div>').appendTo("body");

//Supervisor attention
$('<div id="supervisorAttentionModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5700</p><p>SUPERVISOR ATTENTION</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="supervisorAttentionNext">Next</button></li><li><button id="dispo5700back">Back</button></li></ul></div></div>').appendTo("body");

//Schedule an appointment for callback
{
	$('<div id="scheduleAnAppointmentForCallbackModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Is the appointment with the proxy, or the SP?</p><ul style="list-style:none;"><li><li><button id="scheduleAnAppointmentForCallbackModalproxy">Proxy</button></li><li><button id="scheduleAnAppointmentForCallbackModalSP">SP</button></li><li><button id="scheduleAnAppointmentForCallbackModaldontKnow">Dont know</button></li><li><button id="scheduleAnAppointmentForCallbackModalNeither">Neither</button></li><li><button id="receivedAlternateNumberForSP">Received alternate number for SP</button></li><li><button id="scheduleAnAppointmentForCallbackBack">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5107Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5107</p><p>APPOINTMENT WITH PROXY</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5107next">Next</button></li><li><button id="dispo5107back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5100Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5100</p><p>T. Appointment</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5100next">Next</button></li><li><button id="dispo5100back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5105Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5105</p><p>APPOINTMENT USING ALTERNATIVE NUMBER</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5105next">Next</button></li><li><button id="dispo5105back">Back</button></li></ul></div></div>').appendTo("body");

}

//Scheduled an in person interview
$('<div id="scheduledAnInPersonInterviewModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 9100</p><p>IN-PERSON INTERVIEW</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo9100next">Next</button></li><li><button id="dispo9100back">Back</button></li></ul></div></div>').appendTo("body");

//Spoke with a person
{
	$('<div id="spokeWithAPersonModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>INTERVIEWER: You indicated that you spoke with a person before the interview was terminated. Please select the appropriate response below to indicate how the interview ended. </p><ul style="list-style:none;"><li><li><button id="spokeWithAPersonModalRefusal">*A refusal/hang up/termination</button></li><li><button id="spokeWithAPersonModalFinalRefusal">*Final refusal/hang up/termination</button></li><li><button id="spokeWithAPersonLanguageProblem">Language problem</button></li><li><button id="spokeWithAPersonPhysicalOrMentalImpairment">Physical or mental impairment</button></li><li><button id="spokeWithAPersonBusinessOnly">Business only</button></li><li><button id="spokeWithAPersonReachedDifferentNumber">Number reached different than number dialed</button></li><li><button id="spokeWithAPersonPhoneNumberNotInPa">Number does not belong to respondent</button></li><li><button id="spokeWithAPersonCallDropped">Call dropped</button></li><li><button id="spokeWithAPersonModalback">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="softRefusalModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Did the Selected Person refuse?</p><ul style="list-style:none;"><li><button id="softRefuseYes">Yes</button></li><li><button id="softRefuseNo">No</button></li><li><button id="softRefuseDontKnow">Dont know</button></li><li><button id="softRefusalModalback">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5112Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5112</p><p>T. Refusal by selected respondent</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5112next">Next</button></li><li><button id="dispo5112back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="softProxyRefusalModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Did a proxy refuse to be interviewed on behalf of the selected person?</p><ul style="list-style:none;"><li><button id="softProxyRefuseYes">Yes</button></li><li><button id="softProxyRefuseNo">No</button></li><li><button id="softProxyRefusalBack">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5117Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5117</p><p>T. Refusal by proxy</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5117next">Next</button></li><li><button id="dispo5117back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5111Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5111</p><p>T. Refusal not by selected person</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5111next">Next</button></li><li><button id="dispo5111back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5050Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5050</p><p>T. Refusal - Unknown who refused</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5050next">Next</button></li><li><button id="dispo5050back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo2112Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 2112</p><p>T. Refusal - Selected respondent refused</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo2112next">Next</button></li><li><button id="dispo2112back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="hardRefusalProxyModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Did a proxy refuse to be interviewed on behalf of the selected person?</p><ul style="list-style:none;"><li><button id="hardRefuseProxyYes">Yes</button></li><li><button id="hardRefuseProxyNo">No</button></li><li><button id="hardRefusalProxyModalBack">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5330Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5330</p><p>T. Language barrier</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5330next">Next</button></li><li><button id="dispo5330back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo2117Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 2117</p><p>Proxy refused to be interviewed on selected persons behalf.</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo2117next">Next</button></li><li><button id="dispo2117back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo2111Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 2111</p><p>T. Refusal - someone OTHER THAN selected respondent refused on behalf of selected respondent</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo2111next">Next</button></li><li><button id="dispo2111back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo2110Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 2110</p><p>T. Refusal - refusal, unknown who refused</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo2110next">Next</button></li><li><button id="dispo2110back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5300Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5300</p><p>T. Possible nonworking number</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5300next">Next</button></li><li><button id="dispo5300back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="hardRefusalModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Did the Selected Person refuse?</p><ul style="list-style:none;"><li><button id="hardRefuseYes">Yes</button></li><li><button id="hardRefuseNo">No</button></li><li><button id="hardRefuseDontKnow">Dont know</button></li><li><button id="hardRefusalModalback">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5320Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5320</p><p>T. Physical/Mental impairment</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5320next">Next</button></li><li><button id="dispo5320back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo4500Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 4500</p><p>Business only</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo4500next">Next</button></li><li><button id="dispo4500back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo4300Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 4300</p><p>FINAL nonworking number</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo4300next">Next</button></li><li><button id="dispo4300back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo4700Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 4700</p><p>Number does not belong to respondent</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo4700next">Next</button></li><li><button id="dispo4700back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5121Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5121</p><p>T. Call dropped</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5121next">Next</button></li><li><button id="dispo5121back">Back</button></li></ul></div></div>').appendTo("body");
}

//Did not speak with a person
{
	$('<div id="didNotSpeakWithAPersonModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>INTERVIEWER: You indicated that you did NOT speak with a person before the interview was terminated. Please select the response below to indicate how the interview was ended.</p><ul style="list-style:none;"><li><button id="answeringMachine">Answering machine</button></li><li><button id="telecomBarrier">Telecommunications barrier (Call forward, call block, etc...)</button></li><li><button id="possibleNonworkingNumber">Possible non-working number</button></li><li><button id="noAnswerToNormalRing">No answer to normal telephone ring</button></li><li><button id="normalBusySignal">Normal busy signal</button></li><li><button id="fax/data/modemSound">Fax/data/modem sound</button></li><li><button id="techBarrier">Technological barrier (fast busy, circuits busy, beeping, etc...)</button></li><li><button id="nullAttempt">Null attempt</button></li><li><button id="finalTritone">FINAL tritone or message indicating non-working number</button></li><li><button id="didNotSpeakWithAPersonModalBack">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5140Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5140</p><p>T. Answering device</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5140next">Next</button></li><li><button id="dispo5140back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5150Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5150</p><p>T. Telecommunication barrier</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5150next">Next</button></li><li><button id="dispo5150back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5130Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5130</p><p>T. No answer to normal telephone ring</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5130next">Next</button></li><li><button id="dispo5130back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5550Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5550</p><p>T. Busy signal</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5550next">Next</button></li><li><button id="dispo5550back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5200Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5200</p><p>T. Fax/Data/Modem</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5200next">Next</button></li><li><button id="dispo5200back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5400Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5400</p><p>T. Technological barrier</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5400next">Next</button></li><li><button id="dispo5400back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5900Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5900</p><p>T. NULL ATTEMPT</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5900next">Next</button></li><li><button id="dispo5900back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo4300tritoneModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 4300</p><p>FINAL nonworking number</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo4300tritoneNext">Next</button></li><li><button id="dispo4300tritoneback">Back</button></li></ul></div></div>').appendTo("body");
}

//Selected person transfered to a nursing home
$('<div id="dispo4505Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 4505</p><p>Selected person transfered to nursing home</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo4505next">Next</button></li><li><button id="dispo4505back">Back</button></li></ul></div></div>').appendTo("body");

//Selected person is dead :(
$('<div id="dispo2310Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 2310</p><p>Respondent dead</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo2310next">Next</button></li><li><button id="dispo2310back">Back</button></li></ul></div></div>').appendTo("body");

// Get the modal    
var modal = document.getElementById('myModal');

// Press f9 (value 120) to open disposition modal
{
    $(document).keyup(function(event) {
        if (event.which == 120) {
            modal.style.display = "block";
        }
    });
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// When the user clicks on <span> (x), close the modal
$('.close').click(function(){
	$('.modal').each(function(i){
		this.style.display = "none";
	});
});

//Supervisor attention
{
	var supervisorAttentionButton = document.getElementById('supervisorAttention');
	supervisorAttentionButton.onclick = function() {
	    modal.style.display = "none";
	    supervisorAttentionModal.style.display = "block";
	}
    var supervisorAttentionNextButton = document.getElementById('supervisorAttentionNext');
    supervisorAttentionNextButton.onclick = function() {
        window.open(get_embedded_data_url(5700));
    }
	var dispo5700backButton = document.getElementById('dispo5700back');
	dispo5700backButton.onclick = function() {
	    supervisorAttentionModal.style.display = "none";
	    modal.style.display = "block";
	}
}

//Schedule an appointment for callback
{
	var scheduleAnAppointmentForCallbackButton = document.getElementById('scheduleAnAppointmentForCallback');
	scheduleAnAppointmentForCallbackButton.onclick = function() {
	    modal.style.display = "none";
	    scheduleAnAppointmentForCallbackModal.style.display = "block";
	}

	// appointment modal
	var scheduleAnAppointmentForCallbackModalproxyButton = document.getElementById('scheduleAnAppointmentForCallbackModalproxy');
	scheduleAnAppointmentForCallbackModalproxyButton.onclick = function() {
	    scheduleAnAppointmentForCallbackModal.style.display = "none";
	    dispo5107Modal.style.display = "block";
	}
	var dispo5107nextButton = document.getElementById('dispo5107next');
    dispo5107nextButton.onclick = function() {
        window.open(get_embedded_data_url(5107));
    }
	var dispo5107backButton = document.getElementById('dispo5107back');
	dispo5107backButton.onclick = function() {
	    dispo5107Modal.style.display = "none";
	    scheduleAnAppointmentForCallbackModal.style.display = "block";
	}

	var scheduleAnAppointmentForCallbackModalSPButton = document.getElementById('scheduleAnAppointmentForCallbackModalSP');
	scheduleAnAppointmentForCallbackModalSPButton.onclick = function() {
	    scheduleAnAppointmentForCallbackModal.style.display = "none";
	    dispo5100Modal.style.display = "block";
	}

	var scheduleAnAppointmentForCallbackModaldontKnowButton = document.getElementById('scheduleAnAppointmentForCallbackModaldontKnow');
	scheduleAnAppointmentForCallbackModaldontKnowButton.onclick = function() {
	    scheduleAnAppointmentForCallbackModal.style.display = "none";
	    dispo5100Modal.style.display = "block";
	}

	var scheduleAnAppointmentForCallbackModalNeitherButton = document.getElementById('scheduleAnAppointmentForCallbackModalNeither');
	scheduleAnAppointmentForCallbackModalNeitherButton.onclick = function() {
	    scheduleAnAppointmentForCallbackModal.style.display = "none";
	    dispo5100Modal.style.display = "block";
	}
	var dispo5100nextButton = document.getElementById('dispo5100next');
    dispo5100nextButton.onclick = function() {
        window.open(get_embedded_data_url(5100));
    }
	var dispo5100backButton = document.getElementById('dispo5100back');
	dispo5100backButton.onclick = function() {
	    dispo5100Modal.style.display = "none";
	    scheduleAnAppointmentForCallbackModal.style.display = "block";
	}

	var scheduleAnAppointmentForCallbackBackButton = document.getElementById('scheduleAnAppointmentForCallbackBack');
	scheduleAnAppointmentForCallbackBackButton.onclick = function() {
	    scheduleAnAppointmentForCallbackModal.style.display = "none";
	    modal.style.display = "block";
	}
}

//Scheduled an in person interview
{
	var scheduledAnInPersonInterviewButton = document.getElementById('scheduledAnInPersonInterview');
	scheduledAnInPersonInterviewButton.onclick = function() {
	    modal.style.display = "none";
	    scheduledAnInPersonInterviewModal.style.display = "block";
	}
	var dispo9100nextButton = document.getElementById('dispo9100next');
    dispo9100nextButton.onclick = function() {
        window.open(get_embedded_data_url(9100));
    }
	var dispo9100backButton = document.getElementById('dispo9100back');
	dispo9100backButton.onclick = function() {
	    scheduledAnInPersonInterviewModal.style.display = "none";
	    modal.style.display = "block";
	}
}

//Spoke with a person
{
	//Outermost tree
	{
		var spokeWithAPersonButton = document.getElementById('spokeWithAPerson');
		spokeWithAPersonButton.onclick = function() {
		    modal.style.display = "none";
		    spokeWithAPersonModal.style.display = "block";
		}

		var spokeWithAPersonModalFinalRefusalButton = document.getElementById('spokeWithAPersonModalFinalRefusal');
		spokeWithAPersonModalFinalRefusalButton.onclick = function() {
		    spokeWithAPersonModal.style.display = "none";
		    hardRefusalModal.style.display = "block";
		}

		var spokeWithAPersonLanguageProblemButton = document.getElementById('spokeWithAPersonLanguageProblem');
		spokeWithAPersonLanguageProblemButton.onclick = function() {
		    spokeWithAPersonModal.style.display = "none";
		    dispo5330Modal.style.display = "block";
		}
		var dispo5330nextButton = document.getElementById('dispo5330next');
   		dispo5330nextButton.onclick = function() {
	        window.open(get_embedded_data_url(5330));
	    }
		var dispo5330backButton = document.getElementById('dispo5330back');
		dispo5330backButton.onclick = function() {
			dispo5330Modal.style.display = "none";
			spokeWithAPersonModal.style.display = "block";
		}

		var spokeWithAPersonPhysicalOrMentalImpairmentButton = document.getElementById('spokeWithAPersonPhysicalOrMentalImpairment')
		spokeWithAPersonPhysicalOrMentalImpairment.onclick = function() {
		    spokeWithAPersonModal.style.display = "none";
		    dispo5320Modal.style.display = "block";
		}
		var dispo5320nextButton = document.getElementById('dispo5320next');
		dispo5320nextButton.onclick = function() {
	        window.open(get_embedded_data_url(5320));
	    }
		var dispo5320backButton = document.getElementById('dispo5320back');
		dispo5320backButton.onclick = function() {
			dispo5320Modal.style.display = "none";
			spokeWithAPersonModal.style.display = "block";
		}

		var spokeWithAPersonBusinessOnlyButton = document.getElementById('spokeWithAPersonBusinessOnly');
		spokeWithAPersonBusinessOnlyButton.onclick = function() {
		    spokeWithAPersonModal.style.display = "none";
		    dispo4500Modal.style.display = "block";
		}
		var dispo4500nextButton = document.getElementById('dispo4500next');
		dispo4500nextButton.onclick = function() {
	        window.open(get_embedded_data_url(4500));
	    }
		var dispo4500backButton = document.getElementById('dispo4500back');
		dispo4500backButton.onclick = function() {
			dispo4500Modal.style.display = "none";
			spokeWithAPersonModal.style.display = "block";
		}
		var spokeWithAPersonReachedDifferentNumberButton = document.getElementById('spokeWithAPersonReachedDifferentNumber');
		spokeWithAPersonReachedDifferentNumberButton.onclick = function() {
		    spokeWithAPersonModal.style.display = "none";
		    dispo4300Modal.style.display = "block";
		}
		var dispo4300nextButton = document.getElementById('dispo4300next');
		dispo4300nextButton.onclick = function() {
	        window.open(get_embedded_data_url(4300));
	    }
		var dispo4300backButton = document.getElementById('dispo4300back');
		dispo4300backButton.onclick = function() {
			dispo4300Modal.style.display = "none";
			spokeWithAPersonModal.style.display = "block";
		}

		var spokeWithAPersonNumberNotInPAButton = document.getElementById('spokeWithAPersonPhoneNumberNotInPa');
		spokeWithAPersonNumberNotInPAButton.onclick = function() {
		    spokeWithAPersonModal.style.display = "none";
		    dispo4700Modal.style.display = "block";
		}
		var dispo4700nextButton = document.getElementById('dispo4700next');
		dispo4700nextButton.onclick = function() {
	        window.open(get_embedded_data_url(4700));
	    }
		var dispo4700backButton = document.getElementById('dispo4700back');
		dispo4700backButton.onclick = function() {
			dispo4700Modal.style.display = "none";
			spokeWithAPersonModal.style.display = "block";
		}

		var spokeWithAPersonCallDroppedButton = document.getElementById('spokeWithAPersonCallDropped');
		spokeWithAPersonCallDroppedButton.onclick = function() {
		    spokeWithAPersonModal.style.display = "none";
		    dispo5121Modal.style.display = "block";
		}
		var dispo5121nextButton = document.getElementById('dispo5121next');
		dispo5121nextButton.onclick = function() {
	        window.open(get_embedded_data_url(5121));
	    }
		var dispo5121backButton = document.getElementById('dispo5121back');
		dispo5121backButton.onclick = function() {
			dispo5121Modal.style.display = "none";
			spokeWithAPersonModal.style.display = "block";
		}

		var spokeWithAPersonModalbackButton = document.getElementById('spokeWithAPersonModalback');
		spokeWithAPersonModalbackButton.onclick = function() {
		    spokeWithAPersonModal.style.display = "none";
		    modal.style.display = "block";
		}
	}

	//Soft refusal tree
	{
		var softRefusalModalButton = document.getElementById('spokeWithAPersonModalRefusal');
		softRefusalModalButton.onclick = function() {
		    spokeWithAPersonModal.style.display = "none"; // was blank for setting modal to "none"
		    softRefusalModal.style.display = "block";
		}
		var softRefuseYesButton = document.getElementById('softRefuseYes');
		softRefuseYesButton.onclick = function() {
			spokeWithAPersonModal.style.display = "none";
	    	dispo5112Modal.style.display = "block";
		}
		var dispo5112nextButton = document.getElementById('dispo5112next');
		dispo5112nextButton.onclick = function() {
	        window.open(get_embedded_data_url(5112));
	    }
		var dispo5112backButton = document.getElementById('dispo5112back');
		dispo5112backButton.onclick = function() {
		    dispo5112Modal.style.display = "none";
		    softRefusalModal.style.display = "block";
		}
		var softProxyRefusalModalButton = document.getElementById('softRefuseNo');
		softProxyRefusalModalButton.onclick = function() {
		    softRefusalModal.style.display = "none";
		    softProxyRefusalModal.style.display = "block";
		}
		var softRefuseDontKnowButton = document.getElementById('softRefuseDontKnow');
		softRefuseDontKnowButton.onclick = function() {
		    softRefusalModal.style.display = "none";
		    dispo5050Modal.style.display = "block";
		}
		var dispo5050nextButton = document.getElementById('dispo5050next');
		dispo5050nextButton.onclick = function() {
	        window.open(get_embedded_data_url(5050));
	    }
		var dispo5050backButton = document.getElementById('dispo5050back');
		dispo5050backButton.onclick = function() {
			dispo5050Modal.style.display = "none";
			softRefusalModal.style.display = "block";
		}
		var softRefusalModalBackButton = document.getElementById('softRefusalModalback');
		softRefusalModalBackButton.onclick = function() {
		    softRefusalModal.style.display = "none";
		    spokeWithAPersonModal.style.display = "block";
		}
	}

	//Soft refusal PROXY tree
	{
		var softProxyRefusalYesButton = document.getElementById('softProxyRefuseYes');
		softProxyRefusalYesButton.onclick = function() {
		    softProxyRefusalModal.style.display = "none";
		    dispo5117Modal.style.display = "block";
		}
		var dispo5117nextButton = document.getElementById('dispo5117next');
		dispo5117nextButton.onclick = function() {
	        window.open(get_embedded_data_url(5117));
	    }
		var dispo5117backButton = document.getElementById('dispo5117back');
		dispo5117backButton.onclick = function() {
		    dispo5117Modal.style.display = "none";
		    softProxyRefusalModal.style.display = "block";
		}

		var softProxyRefuseNoButton = document.getElementById('softProxyRefuseNo');
		softProxyRefuseNoButton.onclick = function() {
		    softProxyRefusalModal.style.disdplay = "none";
		    dispo5111Modal.style.display = "block";
		}
		var dispo5111nextButton = document.getElementById('dispo5111next');
		dispo5111nextButton.onclick = function() {
	        window.open(get_embedded_data_url(5111));
	    }
		var dispo5111backButton = document.getElementById('dispo5111back');
		dispo5111backButton.onclick = function() {
			dispo5111Modal.style.display = "none";
			softProxyRefusalModal.style.display = "block";
		}

		var softProxyRefusalBackButton = document.getElementById('softProxyRefusalBack');
		softProxyRefusalBackButton.onclick = function() {
			softProxyRefusalModal.style.display = "none";
			softRefusalModal.style.display = "block";
		}
	}

	//Hard refusal tree
	{
		var hardRefuseYesButton = document.getElementById('hardRefuseYes');
				hardRefuseYesButton.onclick = function() {
		    hardRefusalModal.style.display = "none";
		    dispo2112Modal.style.display = "block";
		}
		var dispo2112nextButton = document.getElementById('dispo2112next');
		dispo2112nextButton.onclick = function() {
	        window.open(get_embedded_data_url(2112));
	    }
		var dispo2112backButton = document.getElementById('dispo2112back');
		dispo2112backButton.onclick = function() {
			dispo2112Modal.style.display = "none";
			hardRefusalModal.style.display = "block";
		}

		var hardRefuseNoButton = document.getElementById('hardRefuseNo');
		hardRefuseNoButton.onclick = function() {
		    hardRefusalModal.style.display = "none";
		    hardRefusalProxyModal.style.display = "block";
		}

		var hardRefuseDontKnowButton = document.getElementById('hardRefuseDontKnow'); //TODO: Missing Onclick function
		hardRefuseDontKnow.onclick = function() {
		    hardRefusalModal.style.display = "none";
		    dispo2110Modal.style.display = "block";
		}
		var dispo2110nextButton = document.getElementById('dispo2110next');
		dispo2110nextButton.onclick = function() {
	        window.open(get_embedded_data_url(2110));
	    }
		var dispo2110backButton = document.getElementById('dispo2110back');
		dispo2110backButton.onclick = function() {
			dispo2110Modal.style.display = "none";
			hardRefusalModal.style.display = "block";
		}

		var hardRefusalModalbackButton = document.getElementById('hardRefusalModalback'); //THIS NEEDS FIXED
		hardRefusalModalbackButton.onclick = function() {
		    hardRefusalModal.style.display = "none";
		    spokeWithAPersonModal.style.display = "block";
		}
	}

	//Hard refusal PROXY tree
	{
		var hardRefuseProxyYesButton = document.getElementById('hardRefuseProxyYes');
		hardRefuseProxyYesButton.onclick = function() {
			hardRefusalProxyModal.style.display = "none";
			dispo2117Modal.style.display = "block";
		}
		var dispo2117nextButton = document.getElementById('dispo2117next');
		dispo2117nextButton.onclick = function() {
	        window.open(get_embedded_data_url(2117));
	    }
		var dispo2117backButton = document.getElementById('dispo2117back');
		dispo2117backButton.onclick = function() {
			dispo2117Modal.style.display = "none";
			hardRefusalProxyModal.style.display = "block";
		}
		var hardRefuseProxyNoButton = document.getElementById('hardRefuseProxyNo');
		hardRefuseProxyNoButton.onclick = function() {
			hardRefusalProxyModal.style.display = "none";
			dispo2111Modal.style.display = "block";
		}
		var dispo2111nextButton = document.getElementById('dispo2111next');
		dispo2111nextButton.onclick = function() {
	        window.open(get_embedded_data_url(2111));
	    }
		var dispo2111backButton = document.getElementById('dispo2111back');
		dispo2111backButton.onclick = function() {
			dispo2111Modal.style.display = "none";
			hardRefusalProxyModal.style.display = "block";
		}
		var hardRefusalProxyModalBackButton = document.getElementById('hardRefusalProxyModalBack');
		hardRefusalProxyModalBackButton.onclick = function() {
			hardRefusalProxyModal.style.display = "none";
			hardRefusalModal.style.display = "block";
		}
	}
}

//Did not speak with a person
{
	var didNotSpeakWithAPersonButton = document.getElementById('didNotSpeakWithAPerson');
	didNotSpeakWithAPersonButton.onclick = function() {
	    modal.style.display = "none";
	    didNotSpeakWithAPersonModal.style.display = "block";
	}

	var answeringMachineButton = document.getElementById('answeringMachine');
	answeringMachineButton.onclick = function() {
	    didNotSpeakWithAPersonModal.style.display = "none";
	    dispo5140Modal.style.display = "block";
	}
	var dispo5140nextButton = document.getElementById('dispo5140next');
	dispo5140nextButton.onclick = function() {
        window.open(get_embedded_data_url(5140));
    }
	var dispo5140backButton = document.getElementById('dispo5140back');
	dispo5140backButton.onclick = function() {
		dispo5140Modal.style.display = "none";
		didNotSpeakWithAPersonModal.style.display = "block";
	}

	var telecommBarrierButton = document.getElementById('telecomBarrier');
	telecommBarrierButton.onclick = function() {
	    didNotSpeakWithAPersonModal.style.display = "none";
	    dispo5150Modal.style.display = "block";
	}
	var dispo5150nextButton = document.getElementById('dispo5150next');
	dispo5150nextButton.onclick = function() {
        window.open(get_embedded_data_url(5150));
    }
	var dispo5150backButton = document.getElementById('dispo5150back');
	dispo5150backButton.onclick = function() {
		dispo5150Modal.style.display = "none";
		didNotSpeakWithAPersonModal.style.display = "block";
	}

	var possibleNonworkingNumberButton = document.getElementById('possibleNonworkingNumber');
	possibleNonworkingNumberButton.onclick = function() {
	    didNotSpeakWithAPersonModal.style.display = "none";
	    dispo5300Modal.style.display = "block";
	}

	var dispo5300nextButton = document.getElementById('dispo5300next');
	dispo5300nextButton.onclick = function() {
        window.open(get_embedded_data_url(5300));
    }
	var dispo5300backButton = document.getElementById('dispo5300back');
	dispo5300backButton.onclick = function() {
		dispo5300Modal.style.display = "none";
		didNotSpeakWithAPersonModal.style.display = "block";
	}

	var noAnswerButton = document.getElementById('noAnswerToNormalRing');
	noAnswerButton.onclick = function() {
	    didNotSpeakWithAPersonModal.style.display = "none";
	    dispo5130Modal.style.display = "block";
	}
	var dispo5130nextButton = document.getElementById('dispo5130next');
	dispo5130nextButton.onclick = function() {
        window.open(get_embedded_data_url(5130));
    }
	var dispo5130backButton = document.getElementById('dispo5130back');
	dispo5130backButton.onclick = function() {
		dispo5130Modal.style.display = "none";
		didNotSpeakWithAPersonModal.style.display = "block";
	}

	var busyButton = document.getElementById('normalBusySignal');
	busyButton.onclick = function() {
	    didNotSpeakWithAPersonModal.style.display = "none";
	    dispo5550Modal.style.display = "block";
	}
	var dispo5550nextButton = document.getElementById('dispo5550next');
	dispo5550nextButton.onclick = function() {
        window.open(get_embedded_data_url(5550));
    }
	var dispo5550backButton = document.getElementById('dispo5550back');
	dispo5550backButton.onclick = function() {
		dispo5550Modal.style.display = "none";
		didNotSpeakWithAPersonModal.style.display = "block";
	}

	var faxdatamodemButton = document.getElementById('fax/data/modemSound');
	faxdatamodemButton.onclick = function() {
	    didNotSpeakWithAPersonModal.style.display = "none";
	    dispo5200Modal.style.display = "block";
	}
	var dispo5200nextButton = document.getElementById('dispo5200next');
	dispo5200nextButton.onclick = function() {
        window.open(get_embedded_data_url(5200));
    }
	var dispo5200backButton = document.getElementById('dispo5200back');
	dispo5200backButton.onclick = function() {
		dispo5200Modal.style.display = "none";
		didNotSpeakWithAPersonModal.style.display = "block";
	}

	var techBarrierButton = document.getElementById('techBarrier');
	techBarrierButton.onclick = function() {
	    didNotSpeakWithAPersonModal.style.display = "none";
	    dispo5400Modal.style.display = "block";
	}
	var dispo5400nextButton = document.getElementById('dispo5400next');
	dispo5400nextButton.onclick = function() {
        window.open(get_embedded_data_url(5400));
    }
	var dispo5400backButton = document.getElementById('dispo5400back');
	dispo5400backButton.onclick = function() {
		dispo5400Modal.style.display = "none";
		didNotSpeakWithAPersonModal.style.display = "block";
	}

	var nullAttemptButton = document.getElementById('nullAttempt');
	nullAttemptButton.onclick = function() {
	    didNotSpeakWithAPersonModal.style.display = "none";
	    dispo5900Modal.style.display = "block";
	}
	var dispo5900nextButton = document.getElementById('dispo5900next');
	dispo5900nextButton.onclick = function() {
        window.open(get_embedded_data_url(5900));
    }
	var dispo5900backButton = document.getElementById('dispo5900back');
	dispo5900backButton.onclick = function() {
		dispo5900Modal.style.display = "none";
		didNotSpeakWithAPersonModal.style.display = "block";
	}

	var finalTritoneButton = document.getElementById('finalTritone');
	finalTritoneButton.onclick = function() {
	    didNotSpeakWithAPersonModal.style.display = "none";
	    dispo4300tritoneModal.style.display = "block";
	}
	var dispo4300tritoneNextButton = document.getElementById('dispo4300tritoneNext');
	dispo4300tritoneNextButton.onclick = function() {
        window.open(get_embedded_data_url(4300));
    }
	var dispo4300tritonebackButton = document.getElementById('dispo4300tritoneback');
	dispo4300tritonebackButton.onclick = function() {
		dispo4300tritoneModal.style.display = "none";
		didNotSpeakWithAPersonModal.style.display = "block";
	}

	var didNotSpeakWithAPersonModalBackButton = document.getElementById('didNotSpeakWithAPersonModalBack');
	didNotSpeakWithAPersonModalBackButton.onclick = function() {
		didNotSpeakWithAPersonModal.style.display = "none";
		modal.style.display = "block";
	}
}

//Recieved alternate number for SP
{
	var altApptButton = document.getElementById('receivedAlternateNumberForSP');
	altApptButton.onclick = function() {
	    modal.style.display = "none";
	    dispo5105Modal.style.display = "block";
	}
	var dispo5105nextButton = document.getElementById('dispo5105next');
	dispo5105nextButton.onclick = function() {
        window.open(get_embedded_data_url(5105));
    }
	var dispo5105backButton = document.getElementById('dispo5105back');
	dispo5105backButton.onclick = function() {
		dispo5105Modal.style.display = "none";
		modal.style.display = "block";
	}
}

//Person transfered to nursing home
{
	var nursingHomeButton = document.getElementById('selectedPersonTransferedToANursingHome')
	nursingHomeButton.onclick = function() {
	    modal.style.display = "none";
	    dispo4505Modal.style.display = "block";
	}
	var dispo4505nextButton = document.getElementById('dispo4505next');
	dispo4505nextButton.onclick = function() {
        window.open(get_embedded_data_url(4505));
    }
	var dispo4505backButton = document.getElementById('dispo4505back');
	dispo4505backButton.onclick = function() {
		dispo4505Modal.style.display = "none";
		modal.style.display = "block";
	}
}

//Person is dead :(
{
	var deathButton = document.getElementById('selectedPersonDead');;
	deathButton.onclick = function() {
	    modal.style.display = "none";
	    dispo2310Modal.style.display = "block";
	}
	var dispo2310nextButton = document.getElementById('dispo2310next');
	dispo2310nextButton.onclick = function() {
        window.open(get_embedded_data_url(2310));
    }
	var dispo2310backButton = document.getElementById('dispo2310back');
	dispo2310backButton.onclick = function() {
		dispo2310Modal.style.display = "none";
		modal.style.display = "block";
	}
}
        //alert("there, I added it")  
    }
});

</script>