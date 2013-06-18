// ==UserScript==
// @name       		Commit message from JIRA
// @namespace  		http://knowclassic.com/
// @version    		0.1-dev
// @description  	Uses ticket information from JIRA to cobble together a basic version control commit message.
// @include	   		https://jira.*
// @grant       	none
// @copyright  		2013+, Classic Graphics
// ==/UserScript==

//From http://stackoverflow.com/questions/2246901/how-can-i-use-jquery-in-greasemonkey-scripts-in-google-chrome

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
	var script = document.createElement("script");
	script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
	script.addEventListener('load', function() {
			var script = document.createElement("script");
			script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
			document.body.appendChild(script);
		}, false);
	document.body.appendChild(script);
}

function main() {

	var is_issue = jQ('div.issue-body').length;
	var issue_type = jQ('#type-val').text().replace(/\s+/g, '');

	if (jira.app && is_issue > 0 && issue_type != 'Epic') {

		var issue_key = jira.app.issue.getIssueKey();
		var issue_summary = jQ('#summary-val').text();
		if ( !issue_summary.match('/\.$/') ) {
			issue_summary += '.';
		}
		var bg_color = jQ('#details-module').css('background-color');
		var font_size = jQ('#descriptionmodule .user-content-block p').css('font-size');
		var line_height = jQ('#descriptionmodule .user-content-block p').css('line-height');

		jQ('#details-module').after('<div id="commit-dialog" title="Commit Message" class="module toggle-wrap"><div class="mod-header"><h2 class="toggle-title">Commit Message</h2></div><div class="mod-content"><input type="text" name="" value="' + issue_key + ': ' + issue_summary + '" style="width:100%; border:0px solid ' + bg_color + '; font-size: ' + font_size + '; + line-height: ' + line_height + '; cursor: hand; cursor: pointer;" /></div></div>');

		jQ(document).ready(function(){
			jQ('#commit-dialog .mod-content input').click(function(){
				jQ(this).focus();
				jQ(this).select();
			})
		});

	}

}

// load jQuery and execute the main function
addJQuery(main);
