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
	// Probably better that this doesn't fire if you're not logged in...
	var is_anonymous = JIRA.Users.LoggedInUser.isAnonymous();

	if (jira.app && is_issue > 0 && issue_type != 'Epic' && !is_anonymous) {

		var issue_key = jira.app.issue.getIssueKey();

		var issue_summary = jQ('#summary-val').text();
		if ( !issue_summary.match('/\.$/') ) {
			issue_summary += '.';
		}
		var bg_color = jQ('#details-module').css('background-color');
		var font_size = jQ('#descriptionmodule .user-content-block p').css('font-size');
		var line_height = jQ('#descriptionmodule .user-content-block p').css('line-height');

		var messages = '<style>#commit-dialog input.commit-message{width:100%; border:0px solid ' + bg_color + '; font-size: ' + font_size + '; + line-height: ' + line_height + '; cursor: hand; cursor: pointer;}</style><ul>';
		messages += '<li>Message from Issue Summary: <input class="commit-message"  type="text" name="" value="' + issue_key + ': ' + issue_summary + '" /></li>';

		// Attempt to contact the API for current JIRA instance
		var latest_comment_index, latest_comment_body;
		var api_comment_url = AJS.params.baseURL + '/rest/api/latest/issue/' + issue_key + '/comment?expand';
		jQ.getJSON(api_comment_url, function(data){
			latest_comment_index = data.total - 1;
			latest_comment_body = data.comments[latest_comment_index].body;
			if ( !latest_comment_body.match('/\.$/') ) {
				latest_comment_body += '.';
			}
		})
		.fail(function() { /*do nothing*/ })
		.always(function() {
			// We're waiting for the response from the REST service to do anything.
			if (latest_comment_body.length > 0){
				messages += '<li>Message from most recent Comment: <input class="commit-message" type="text" name="" value="' + issue_key + ': ' + latest_comment_body + '" /></li>';
			}
			messages += '</ul>';

			jQ('#details-module').after('<div id="commit-dialog" title="Commit Message" class="module toggle-wrap"><div class="mod-header"><h2 class="toggle-title">Suggested Commit Messages</h2></div><div class="mod-content">' + messages + '</div></div>');

			jQ('#commit-dialog .mod-content input').click(function(){
				jQ(this).focus();
				jQ(this).select();
			});
		});
	}
}

// load jQuery and execute the main function
	addJQuery(main);
