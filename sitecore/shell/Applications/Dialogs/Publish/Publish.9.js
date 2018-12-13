jQuery(document).ready(function ($) {
	
	// ----- stage status please update these variables for your environment --- //

	let testRunnerHost = "http://localhost:3000";
	let stageTargetName = "Stage SC3";
	
	// ---- stage status code START ---- //	
	
	let passColor ='#51af51';
	let failColor = '#af5151';
	let neutralColor ='#54708c'
	
	let bannerColor = neutralColor;
	
	let statusText = "loading...";
	
	// Shows last run test status
	
	jQuery('#SettingsPane').prepend(`<p id="stageStatusBanner" style='padding: 10px; background: ${bannerColor}; color: #fff; margin-bottom: 10px;'>Stage Status: ${statusText}</p>`);
		
	jQuery.get(`${testRunnerHost}/results`, (data, status) => {
		console.info(data);
		if (data.status.isRunning) {
			bannerColor = neutralColor;
			statusText = "Tests still running...";
			jQuery('#stageStatusBanner').text(`Stage Status: ${statusText}. Started: ${new Date(data.status.lastStartTime).toLocaleString()}`);
		} else {
			bannerColor = data.failures === 0 ? passColor : failColor;
			statusText = data.failures === 0 ? "Pass" : `Failed ${data.failures} tests`;
			jQuery('#stageStatusBanner').html(`Stage Status: ${statusText}. Last run: ${new Date(data.end).toLocaleString()} <a style='float:right;color:#fff' target='_blank' href='${testRunnerHost}/report'>View report</a>`);
		}
		
		jQuery('#stageStatusBanner').css('background', bannerColor);

	}).fail(function() {
		statusText = "Could not get test status";
		jQuery('#stageStatusBanner').text(`Stage Status: ${statusText}.`);
	});
		
		
	// Runs the test if intention to publish to stage
		
	let stageIsBeingPublishedTo = false;

	let targetLabels = jQuery("#PublishingTargets input[type='checkbox']");
	
	targetLabels.each((index, checkboxItem) => {
		
		let targetId = jQuery(checkboxItem).attr('id');
		
		let targetName = jQuery("#PublishingTargets label[for='"+targetId+"']").text();
		
		if (targetName.toLowerCase().indexOf(stageTargetName.toLowerCase()) > -1) {
			console.log("found stage target");
			
			if (jQuery(checkboxItem).is(":checked")) {
				stageIsBeingPublishedTo = true;
			}
			
			jQuery(checkboxItem).change(function() {
				stageIsBeingPublishedTo = this.checked;
			});		
		} 		
	});
	
	$('#NextButton').click(function () {	

        console.info("stageIsBeingPublishedTo: " + stageIsBeingPublishedTo);
				
		if (stageIsBeingPublishedTo) {
			jQuery.get("http://localhost:3000/", (data, status) => {
				if (!data.isRunning) {
					jQuery.get("http://localhost:3000/run", (data, status) => {
						
					});
				}
			});
		}

    });
	
	// ---- stage status code END ---- //	
	
	
    $('#SelectAllLanguages').click(function () {
        $('#Languages').find(':checkbox').attr('checked', this.checked);
    });

    $('#Languages').find(':checkbox').click(function () {
        var total = $('#Languages input').length;
        var checked = $('#Languages input:checked').length;
        $('#SelectAllLanguages').attr('checked', total == checked);
    });
	
});