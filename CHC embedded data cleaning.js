Qualtrics.SurveyEngine.addOnload(function()
{
	String.prototype.replaceAll = function (find, replace) {
    	var str = this;
    	return str.replace(new RegExp(find, 'g'), replace);
	};
	
	pca = "${e://Field/PCA}/";
	pca.replaceAll(' ', '_');
	Qualtrics.SurveyEngine.setEmbeddedData("${e://Field/PCA}/", pca);

	homemaker = "${e://Field/HOMEMAKER}/";
	homemaker.replaceAll(' ', '_');
	Qualtrics.SurveyEngine.setEmbeddedData("${e://Field/HOMEMAKER}/", homemaker);

	casemgr = "${e://Field/CASEMGR}/";
	casemgr.replaceAll(' ', '_');
	Qualtrics.SurveyEngine.setEmbeddedData("${e://Field/CASEMGR}/", casemgr);

	nsocName = "${e://Field/NSOCname}/";
	nsocName.replaceAll(' ', '_');
	Qualtrics.SurveyEngine.setEmbeddedData("${e://Field/NSOCname}/", nsocName);

	nsocPhone = "${e://Field/NSOCphone}/";
	nsocPhone.replaceAll(' ', '_');
	Qualtrics.SurveyEngine.setEmbeddedData("${e://Field/NSOCphone}/", nsocPhone);

	nsocOther = "${e://Field/NSOCother}/";
	nsocOther.replaceAll(' ', '_');
	Qualtrics.SurveyEngine.setEmbeddedData("${e://Field/NSOCother}/", nsocOther);

	nsocTime = "${e://Field/NSOCtime}/";
	nsocTime.replaceAll(' ', '_');
	Qualtrics.SurveyEngine.setEmbeddedData("${e://Field/NSOCtime}/", nsocTime);

});
