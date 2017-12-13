
<script>
//VERSION 4.1
//Last updated 12/8/2017
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
}

function get_IDISP_array(dispo) {
	// Create an array for IDISPS to pipe into URL. Ensure all cells have something in them, even if it's just an empty string
	var IDISP_array = [];
	for(var j= 0; j < 21; ++j) {
		IDISP_array[j] = "";
	}

	currentUrl = window.location.href;
	var i = 1;

	while(i < 21) {
		// Create a string for the current IDISP we want to examine in the URL
		if(i < 10) {
			idisp_iteration = "IDISP0" + i;
		}
		else {
			idisp_iteration = "IDISP" + i;
		}

		// Find the disposition code associated with the IDISP string we made earlier by locating the substring IDISP(X)
		// When IDISP(x) is located, we grab whatever is 4 characters after it, which is either garbled text or the dispo code
		dispo_code = currentUrl.substring(currentUrl.indexOf(idisp_iteration));
		dispo_code = dispo_code.substring(8,12);

		// If the dispo code is a number, add the code to the IDISP_array, thereby creating an array filled with disp history
		if(!isNaN(dispo_code)) {
			IDISP_array[i] = dispo_code;
			i += 1;
		}

		// If the dispo_code is not a number, we add the dispo code the interviewer selected to the end of the array
		// The array is now a complete history. We break out of the loop and return the array
		if(isNaN(dispo_code)) {
			IDISP_array[i] = dispo;
			break;
		}
	}

	return IDISP_array;
}

function create_disp_history_JSON(IDISP_array) {

	// Create JSON
	var disp_history_obj = {
		2110:0,
		2111:0,
		2112:0,
		2117:0,
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

	// Iterate through IDISP_array and for each cell in IDISP_array increment the corresponding JSON property by 1
	for(var i = 0; i < 21; ++i) {
		if(disp_history_obj.hasOwnProperty(IDISP_array[i])) {
			array_content = IDISP_array[i];
			array_content = parseInt(array_content);
			disp_history_obj[array_content] += 1;
		}
	}

	// Get total number of attempts

	var total_attempts = 0;
	for(var key in disp_history_obj) {
		total_attempts += disp_history_obj[key];
	}

	// Pass tree to method that runs logic checks
	var new_dispo = run_logic_checks(disp_history_obj, total_attempts);

	return new_dispo;
}

function run_logic_checks(dho, total_attempts) {
	var max_attempts = 6;
	var six_attempts = true;
	var eight_attempts = false;
	var ten_attempts = false;

	if(dho[5130] + dho[5150] + dho[5220] > 0) {
		max_attempts = 8;
		six_attempts = false;
		eight_attempts = true;
	}
	if(dho[5100] + dho[5050] + dho[5105] + dho[5107] + dho[5111] + dho[5112] + dho[5117] + dho[5120] + dho[5121] + dho[5320] + dho[5330] + dho[5560] + dho[9000] + dho[9100] > 0) {
		max_attempts = 10;
		six_attempts = false;
		eight_attempts = false;
		ten_attempts = true;
	}
	max_attempts += dho[5100];
	max_attempts += dho[5105];
	max_attempts += dho[5107];

	var wave = "${e://Field/Wave}";

	console.log("disp_history_obj: " + JSON.stringify(dho));
	console.log("total_attempts: " + total_attempts);
	console.log("max_attempts: " + max_attempts);
	console.log("wave: " + wave);
	var new_dispo;

	{
		function dispo_4200(dho) {
			// At least one 5200 dispo
			if(dho[5200] > 0) {
				return true;
			}
			return false;
		}
	
		function dispo_4300(dho) {
			// At least one 5300 dispo
			if(dho[5300] > 0) {
				return true;
			}
			return false;
		}
	
		function dispo_4400(dho) {
			// At least one 5400 dispo
			if(dho[5400] > 0) {
				return true;
			}
			return false;
		}
	}

	function dispo_3100(dho) {
	// 3100 - Two refusals unknown whether sp (ex: pu/hu x2)
		console.log("function dispo_3100 entered");
		if(dho[5050] == 2) {
			return true;
		}
		return false;
	}

	function dispo_3130(dho) {
	// 3130 - 8 attempts with plurality of attempts assigned 5130
		for(var key in dho) {
			if(key != 5130 && dho[key] >= dho[5130]) {
				return false;
			}
		}
		return true;
	}

	function dispo_3140(dho) {
	// 3140 - 8 attempts with plurality of attempts assigned 5140
		for(var key in dho) {
			if(key != 5140 && dho[key] >= dho[5140]) {
				return false;
			}
		}
		return true;
	}

	function dispo_3150(dho) {
	// 3150 - 8 attempts with plurality of attempts assigned 5140
		for(var key in dho) {
			if(key != 5150 && dho[key] >= dho[5150]) {
				return false;
			}
		}
		return true;
	}

	function dispo_2120(dho) {
		// 2120 - Two refusals OR FINAL REFUSAL after SP/Proxy has started survey, but before the partial complete point
		if(wave > 0 && wave < 24) {
			console.log("wave > 0 and < 24");
			if(dho[5050] + dho[5111] + dho[5112] + dho[5117] > 1) {
				return true;
			}
			if(dho[2110] + dho[2111] + dho[2112] + dho[2117] > 0) {
				return true;
			}
		}
		return false;
	}

	function dispo_2112(dho) {
		if(dho[5112] == 2) {
			return true;
		}
		if(dho[5112] > 0 && dho[5111] > 0) {
			return true;
		}
		if(dho[5112] > 0 && dho[5050] > 0) {
			return true;
		}
		return false;
	}

	function dispo_2117(dho) {
		if(dho[5117] == 2) {
			return true;
		}
		if(dho[5117] > 0 && dho[5111] > 0) {
			return true;
		}
		if(dho[5117] > 0 && dho[5050] > 0) {
			return true;
		}
		return false;
	}

	function dispo_2111(dho) {
		if(dho[5111] == 2) {
			return true;
		}
		if(dho[5111] > 0 && dho[5050]) {
			return true;
		}
		return false;
	}

	function dispo_2112_10_attempts(dho) {
		// 2112 - 10+ attempts with 1 refusal by SP
		if(dho[5112] > 0 && wave == 0) {
			return true;
		}
		return false;
	}

	function dispo_2117_10_attempts(dho) {
		// 2117 - 10+ attempts with 1 refusal by proxy
		if(dho[5112] + wave == 0 && dho[5117] > 0) {
			return true;
		}
		return false;
	}

	function dispo_2111_10_attempts(dho) {
		// 2111 - 10+ attempts with one 5111
		if(dho[5112] + dho[5117] == 0 && dho[5111] > 0) {
			return true;
		}
		return false;
	}

	function dispo_2210_10_attempts(dho, wave) {
		// 2210 - 10+ attempts with one 5100 and no refusals without SP initiating the survey
		console.log("running dispo_2210_10_attempts");
		if(wave < 1) {
			if( dho[5100] > 0) {
				if( dho[5111] + dho[5112] + dho[5117] + dho[5050] == 0) {
					return true;
				}
			}
		}
		return false;
	}

	function dispo_1200(dho, wave) {
	// 1200 - Wave >= 24 and survey ended
		if(wave >= 24) {
			if(dho[5050] + dho[5111] + dho[5112] + dho[5117] > 1) {
				return true;
			}
			if(dho[2110] + dho[2111] + dho[2112] + dho[2117] > 0) {
				return true;
			}
		}
		return false;
	}

	function dispo_1200_20_attempts(wave) {
		if(wave >= 24) {
			return true;
		}
		return false;
	}

	function dispo_2120_20_attempts(wave) {
		if(wave > 0 && wave < 24) {
			return true;
		}
		return false;
	}

	// Run checks on 6 attempts IF max_attempts = 6
	if(six_attempts && total_attempts == 6) {
		if(dispo_4200(dho)) {
			return 4200;
		}
		if(dispo_4400(dho)) {
			return 4400;
		}
		if(dispo_4300(dho)) {
			return 4300;
		}
	}

	// Run these checks if max_attempts = 8
	
	if(eight_attempts && total_attempts == 8) {		
		var plurality = true;
		if(dho[5150] > 1 && dho[5150] == dho[5140]) {
			for(var key in dho) {
				if(dho[key] > dho[5150]) {
					plurality = false;
				}
			}
			if (plurality) {
				return 3150;
			}
		}

		if(dho[5150] > 1 && dho[5150] == dho[5130]) {
			for(var key in dho) {
				if(dho[key] > dho[5150]) {
					plurality = false;
				}
			}
			if (plurality) {
				return 3150;
			}
		}

		if(dho[5140] > 1 && dho[5140] == dho[5130]) {
			for(var key in dho) {
				if(dho[key] > dho[5140]) {
					plurality = false;
				}
			}
			if (plurality) {
				return 3140;
			}
		}

		if(dispo_3150(dho)) {
			return 3150;
		}
		if(dispo_3140(dho)) {
			return 3140;
		}
		if(dispo_3130(dho)) {
			return 3130;
		}
	}

	// Run these checks if max_attempts > 9 and attempt number > 9

	if(ten_attempts && total_attempts > 9) {
		if(dispo_2112_10_attempts(dho)) {
			return 2112;
		}
		if(dispo_2117_10_attempts(dho)) {
			return 2117;
		}
		if(dispo_2111_10_attempts(dho)) {
			return 2111;
		}
		if(dispo_2210_10_attempts(dho, wave)) {
			return 2210;
		}
	}

	// Run these checks on every dispo
	
	if(dispo_1200(dho, wave)) {
		return 1200;
	}
	if(dispo_2120(dho)) {
		return 2120;
	}
	if(dispo_2112(dho)) {
		return 2112;
	}
	if(dispo_2117(dho)) {
		return 2117;
	}
	if(dispo_2111(dho)) {
		return 2111;
	}
	if(dispo_3100(dho)) {
		console.log("3100 true");
		return 3100;
	}

	// Run these checks if total_attempts = 20
	if(total_attempts == 20) {
		if(dispo_1200_20_attempts(wave)) {
				return 1200;
			} else if(dispo_2120_20_attempts(wave)) {
				return 2120;
			} else {
				return 2210;
			}
		}
	return new_dispo;
}

function get_embedded_data_url(dispo) {
	var IDISP_array = get_IDISP_array(dispo);
	var new_dispo = create_disp_history_JSON(IDISP_array);

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
	url += "IDISP01=" + IDISP_array[1] + "/";
	url += "IDISP02=" + IDISP_array[2] + "/";
	url += "IDISP03=" + IDISP_array[3] + "/";
	url += "IDISP04=" + IDISP_array[4] + "/";
	url += "IDISP05=" + IDISP_array[5] + "/";
	url += "IDISP06=" + IDISP_array[6] + "/";
	url += "IDISP07=" + IDISP_array[7] + "/";
	url += "IDISP08=" + IDISP_array[8] + "/";
	url += "IDISP09=" + IDISP_array[9] + "/";
	url += "IDISP10=" + IDISP_array[10] + "/";
	url += "IDISP11=" + IDISP_array[11] + "/";
	url += "IDISP12=" + IDISP_array[12] + "/";
	url += "IDISP13=" + IDISP_array[13] + "/";
	url += "IDISP14=" + IDISP_array[14] + "/";
	url += "IDISP15=" + IDISP_array[15] + "/";
	url += "IDISP16=" + IDISP_array[16] + "/";
	url += "IDISP17=" + IDISP_array[17] + "/";
	url += "IDISP18=" + IDISP_array[18] + "/";
	url += "IDISP19=" + IDISP_array[19] + "/";
	url += "IDISP20=" + IDISP_array[20] + "/";
	url += "Wave=${e://Field/Wave}/";	
	url += "IntVStatus=" + intVStatus + "/";
	if(new_dispo) {
		url += "Dispo=" + new_dispo;
	} else {
		url += "Dispo=" + dispo;
	}
	url = url.replaceAll(' ', '_');
	// alert('Alert box to pause');
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
    var element =  document.getElementById('myModal');
}

//Root menu
$('<div id="myModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>INTERVIEWER: You are now ready to answer questions to assign a disposition code. If you continue past this screen, you will select the outcome of this call attempt.</p><ul style="list-style:none;"><li><button id="complete">***COMPLETE***</button></li><li><button id="supervisorAttention">Supervisor attention*</button></li><li><button id="scheduleAnAppointmentForCallback">Schedule an appointment for callback</button></li><li><button id="scheduledAnInPersonInterview">Scheduled an in-person interview</button></li><li><button id="spokeWithAPerson">Spoke with a person</button></li><li><button id="didNotSpeakWithAPerson">Did not speak with a person</button></li><li><button id="selectedPersonTransferedToANursingHome">Selected person transfered to a nursing home</button></li><li><button id="selectedPersonDead">Selected person dead</button></li></ul></div></div>').appendTo("body");

//Complete modal
$('<div id="completeModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Is the complete with the proxy, or the SP?</p><ul style="list-style:none;"><li><li><button id="completeWithSP">Complete with the SP</button></li><li><button id="completeWithAProxy">Completed with a proxy</button></li><li><button id="completeModalBackButton">Back</button></li></ul></div></div>').appendTo("body");
$('<div id="dispo1100Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 1100</p><p>COMPLETE WITH SP</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo1100next">Next</button></li><li><button id="dispo1100back">Back</button></li></ul></div></div>').appendTo("body");
$('<div id="dispo1107Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 1107</p><p>COMPLETE WITH A PROXY</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo1107next">Next</button></li><li><button id="dispo1107back">Back</button></li></ul></div></div>').appendTo("body");


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
	$('<div id="spokeWithAPersonModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>INTERVIEWER: You indicated that you spoke with a person before the interview was terminated. Please select the appropriate response below to indicate how the interview ended. </p><ul style="list-style:none;"><li><li><button id="spokeWithAPersonModalRefusal">*A refusal/hang up/termination</button></li><li><button id="spokeWithAPersonModalFinalRefusal">*Final refusal/hang up/termination</button></li><li><button id="spokeWithAPersonLanguageProblem">Language problem</button></li><li><button id="spokeWithAPersonPhysicalOrMentalImpairment">Physical or mental impairment</button></li><li><button id="spokeWithAPersonBusinessOnly">Business only</button></li><li><button id="spokeWithAPersonReachedDifferentNumber">Number reached different than number dialed</button></li><li><button id="spokeWithAPersonNotInPA">Resident no longer lives in PA</button></li><li><button id="spokeWithAPersonNumberDoesNotBelongToResp">Number does not belong to respondent</button></li><li><button id="spokeWithAPersonCallDropped">Call dropped</button></li><li><button id="spokeWithAPersonModalback">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="physicalOrMentalImpairmentModal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Soft or final?</p><ul style="list-style:none;"><li><button id="physicalOrMentalImpairmentSoft">Call again later</button></li><li><button id="physicalOrMentalImpairmentHard">Do not call again</button></li><li><button id="physicalOrMentalImpairmentModalback">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo2320Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 2320</p><p>Physical or mental impairment FINAL</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo2320next">Next</button></li><li><button id="dispo2320back">Back</button></li></ul></div></div>').appendTo("body");
	$('<div id="dispo5320Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 5320</p><p>Physical or mental impairment SOFT</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo5320next">Next</button></li><li><button id="dispo5320back">Back</button></li></ul></div></div>').appendTo("body");
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
	$('<div id="dispo4100Modal" class="modal"><div class="modal-content"><span class="close">&times;</span><br><br><p>Disposition code = 4100</p><p>T. Number not in PA</p><p>HIT "NEXT" TO ASSIGN THIS DISPOSITION CODE</p><ul style="list-style:none;"><li><button id="dispo4100next">Next</button></li><li><button id="dispo4100back">Back</button></li></ul></div></div>').appendTo("body");
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

//Complete
{
	var completeButton = document.getElementById('complete');
	completeButton.onclick = function() {
		modal.style.display = "none";
		completeModal.style.display = "block";
	}
	var completeWithSPButton = document.getElementById('completeWithSP');
	completeWithSPButton.onclick = function() {
		completeModal.style.display = "none";
		dispo1100Modal.style.display = "block";
	}

	var dispo1100nextButton = document.getElementById('dispo1100next');
	dispo1100nextButton.onclick = function() {
		window.open(get_embedded_data_url(1100));
	}

	var dispo1100backButton = document.getElementById('dispo1100back');
	dispo1100backButton.onclick =function() {
		dispo1100Modal.style.display = "none";
		completeModal.style.display = "block";
	}

	var completeWithAProxyButton = document.getElementById('completeWithAProxy');
	completeWithAProxyButton.onclick = function() {
		completeModal.style.display = "none";
		dispo1107Modal.style.display = "block";
	}

	var dispo1107nextButton = document.getElementById('dispo1107next');
	dispo1107nextButton.onclick = function() {
		window.open(get_embedded_data_url(1107));
	}

	var dispo1107backButton = document.getElementById('dispo1107back');
	dispo1107backButton.onclick = function() {
		dispo1107Modal.style.display = "none";
		completeModal.style.display = "block";
	}

	var completeModalBackButton = document.getElementById('completeModalBackButton');
	completeModalBackButton.onclick = function() {
		completeModal.style.display = "none";
		modal.style.display = "block";
	}
}
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

		var spokeWithAPersonPhysicalOrMentalImpairmentButton = document.getElementById('spokeWithAPersonPhysicalOrMentalImpairment');
		spokeWithAPersonPhysicalOrMentalImpairmentButton.onclick = function() {
		   spokeWithAPersonModal.style.display = "none";
		   physicalOrMentalImpairmentModal.style.display = "block";
		}
		var physicalOrMentalImpairmentHardButton = document.getElementById('physicalOrMentalImpairmentHard');
		physicalOrMentalImpairmentHardButton.onclick = function() {
			physicalOrMentalImpairmentModal.style.display = "none";
			dispo2320Modal.style.display = "block";
		}

		var physicalOrMentalImpairmentSoftButton = document.getElementById('physicalOrMentalImpairmentSoft');
		physicalOrMentalImpairmentSoftButton.onclick = function() {
			physicalOrMentalImpairmentModal.style.display = "none";
			dispo5320Modal.style.display = "block";
		}
		var physicalOrMentalImpairmentModalbackButton = document.getElementById('physicalOrMentalImpairmentModalback');
		physicalOrMentalImpairmentModalbackButton.onclick = function() {
			physicalOrMentalImpairmentModal.style.display = "none";
			modal.style.display = "block";
		}

		var dispo2320nextButton = document.getElementById('dispo2320next');
		dispo2320nextButton.onclick = function() {
	        window.open(get_embedded_data_url(2320));
	    }
		var dispo2320backButton = document.getElementById('dispo2320back');
		dispo2320backButton.onclick = function() {
			dispo2320Modal.style.display = "none";
			physicalOrMentalImpairmentModal.style.display = "block";
		}

		var dispo5320nextButton = document.getElementById('dispo5320next');
		dispo5320nextButton.onclick = function() {
	        window.open(get_embedded_data_url(5320));
	    }
		var dispo5320backButton = document.getElementById('dispo5320back');
		dispo5320backButton.onclick = function() {
			dispo5320Modal.style.display = "none";
			physicalOrMentalImpairmentModal.style.display = "block";
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

		var spokeWithAPersonNotInPAButton = document.getElementById('spokeWithAPersonNotInPA');
		spokeWithAPersonNotInPAButton.onclick = function() {
			spokeWithAPersonModal.style.display = "none";
			dispo4100Modal.style.display = "block";
		}
		var dispo4100nextButton = document.getElementById('dispo4100next');
		dispo4100nextButton.onclick = function() {
			window.open(get_embedded_data_url(4100));
		}
		var dispo4100backButton = document.getElementById('dispo4100back');
		dispo4100backButton.onclick = function() {
			dispo4100Modal.style.display = "none";
			spokeWithAPersonModal.style.display = "block";
		}

		var spokeWithAPersonNumberDoesNotBelongToRespButton = document.getElementById('spokeWithAPersonNumberDoesNotBelongToResp');
		spokeWithAPersonNumberDoesNotBelongToRespButton.onclick = function() {
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
    }
});

</script>