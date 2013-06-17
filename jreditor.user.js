// ==UserScript==
// @name       Stash message from JIRA
// @namespace  http://knowclassic.com/
// @version    0.1-dev
// @description  Uses ticket information from JIRA to cobble together a basic Stash commit message.
// @include	   https://jira.*
// @copyright  2013+, Classic Graphics
// ==/UserScript==

if (jira.app && $('#viewissuesidebar').length() = 1) {
	issue_key = jira.app.issue.getIssueKey();
	issue_summary = $('#summary-val').text();
	if ( !issue_summary.match('/\.$/') ) {
		issue_summary += '.';
	}
	$('#viewissuesidebar').append(('<div id="stash-dialog" title="Stash Message" class="module toggle-wrap"><div class="mod-header"><h2 class="toggle-title">Stash Message</h2></div><div class="mod-content">' + issue_key + ': ' + issue_summary + '</div></div>'));
}
