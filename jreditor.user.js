// ==UserScript==
// @name       		Stash message from JIRA
// @namespace  		http://knowclassic.com/
// @version    		0.1-dev
// @description  	Uses ticket information from JIRA to cobble together a basic Stash commit message.
// @include	   		https://jira.*
// @grant       	none
// @copyright  		2013+, Classic Graphics
// ==/UserScript==

var is_issue = $('div.issue-body').length;
var issue_type = $('#type-val').text().replace(/\s+/g, '');

if (jira.app && is_issue > 0 && issue_type != 'Epic') {

	var issue_key = jira.app.issue.getIssueKey();
	var issue_summary = $('#summary-val').text();
	if ( !issue_summary.match('/\.$/') ) {
		issue_summary += '.';
	}
	var bg_color = $('#details-module').css('background-color');
	var font_size = $('#descriptionmodule .user-content-block p').css('font-size');
	var line_height = $('#descriptionmodule .user-content-block p').css('line-height');

	$('#details-module').after('<div id="stash-dialog" title="Stash Message" class="module toggle-wrap"><div class="mod-header"><h2 class="toggle-title">Stash Message</h2></div><div class="mod-content"><input type="text" name="" value="' + issue_key + ': ' + issue_summary + '" style="width:100%; border:0px solid ' + bg_color + '; font-size: ' + font_size + '; + line-height: ' + line_height + '; cursor: hand; cursor: pointer;" /></div></div>');

	$(document).ready(function(){
		$('#stash-dialog .mod-content input').click(function(){
			$(this).focus();
			$(this).select();
		})
	});

}
