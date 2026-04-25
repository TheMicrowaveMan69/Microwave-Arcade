import { useEffect, useRef } from 'react';

export default function CookieClickerLegacy() {
  const containerRef = useRef(null);

  const rawHtml = `
<!DOCTYPE html>
<html>
<head>
    <base href="https://orteil.dashnet.org/cookieclicker/">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-7FN7LEVWXD"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-7FN7LEVWXD');
    </script>
    <title>Cookie Clicker | Microwave Arcade</title>
    <meta name="viewport" content="width=900, initial-scale=1">
    <link href='https://fonts.googleapis.com/css?family=Merriweather:900&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <script src="base64.js"></script>
    <script src="main.js"></script>
    <link href="style.css" rel="stylesheet" type="text/css">
    <style>
      #topBar { background: #000; }
      body { background: #000; }
    </style>
</head>
<body>
<div id="wrapper">
	<div id="topBar">
		<div><b>Cookie Clicker</b>&trade; &copy; <a href="//orteil.dashnet.org" target="_blank" id="topbarOrteil">Orteil</a>, 2020 - <a href="//dashnet.org" target="_blank" id="topbarDashnet">DashNet</a></div>
		<div><a href="https://twitter.com/orteil42" target="_blank" id="topbarTwitter">twitter</a></div>
		<div><a href="https://orteil42.tumblr.com" target="_blank" id="topbarTumblr">tumblr</a></div>
		<div style="position:relative;"><div style="width:22px;height:32px;background:url(img/discord.png);position:absolute;left:0px;top:0px;pointer-events:none;"></div><a href="https://discordapp.com/invite/cookie" target="_blank" style="padding-left:16px;" id="topbarDiscord">Discord</a></div>
		<div style="position:relative;"><div style="width:25px;height:32px;background:url(img/weeHoodie.png);position:absolute;left:-2px;top:0px;pointer-events:none;"></div><a class="blueLink" href="http://www.redbubble.com/people/dashnet" target="_blank" style="padding-left:12px;" id="topbarMerch">Merch!</a></div>
		<div style="position:relative;"><div style="width:22px;height:32px;background:url(img/patreon.png);position:absolute;left:0px;top:0px;pointer-events:none;"></div><a class="orangeLink" href="https://www.patreon.com/dashnet" target="_blank" style="padding-left:16px;" id="topbarPatreon">Patreon</a></div>
		<div><a class="lightblueLink" style="font-weight:bold;" href="https://play.google.com/store/apps/details?id=org.dashnet.cookieclicker" target="_blank" id="topbarMobileCC">Cookie Clicker for Android</a></div>
		<div><a href="//orteil.dashnet.org/randomgen/" target="_blank" id="topbarRandomgen">RandomGen</a></div>
		<div><a href="//orteil.dashnet.org/igm/" target="_blank" id="topbarIGM">Idle Game Maker</a></div>
	</div>
	<div id="game">
		<div id="javascriptError">
			<div id="loader">
				<div class="spinnyBig"></div>
				<div class="spinnySmall"></div>
				<div id="loading" class="title">Loading...</div>
				<div id="failedToLoad" class="title">This is taking longer than expected.</div>
			</div>
		</div>
		<canvas id="backgroundCanvas"></canvas>
		<div id="goldenCookie" class="goldenCookie"></div>
		<div id="shimmers"></div>
		<div id="alert"></div>
		<div id="particles"></div>
		<div id="sparkles" class="sparkles"></div>
		<div id="notes"></div>
		<div id="darken"></div>
		<div id="versionNumber" class="title"></div>
		<div id="sectionLeft" class="inset">
			<canvas id="backgroundLeftCanvas" style="z-index:5;"></canvas>
			<div class="blackFiller"></div>
			<div class="blackGradient"></div>
			<div id="cookies" class="title"></div>
			<div id="bakeryNameAnchor"><div id="bakeryName" class="title">McPanic's bakery</div></div>
			<div id="cookieAnchor">
				<div id="bigCookie"></div>
				<div id="cookieNumbers"></div>
			</div>
		</div>
		<div class="separatorLeft"></div>
		<div class="separatorRight"></div>
		<div id="sectionMiddle" class="inset">
			<div id="comments" class="inset title">
				<div id="prefsButton" class="button">Options</div>
				<div id="statsButton" class="button">Stats</div>
				<div id="logButton" class="button">Info</div>
				<div id="legacyButton" class="button">Legacy</div>
				<div id="commentsTextBelow" class="commentsText"></div>
				<div id="commentsText" class="commentsText"></div>
				<div class="separatorBottom"></div>
			</div>
			<div id="centerArea">
				<div id="buildingsTitle" class="inset title zoneTitle">Buildings</div>
				<div id="buildingsMaster"></div>
				<div id="rows"></div>
				<div id="menu"></div>
			</div>
		</div>
		<div id="sectionRight" class="inset">
			<div id="store">
				<div id="storeTitle" class="inset title zoneTitle">Store</div>
				<div id="upgrades" class="storeSection upgradeBox"></div>
				<div id="products" class="storeSection"></div>
			</div>
		</div>
	</div>
</div>
</body>
</html>
  `;

  return (
    <iframe
      title="Cookie Clicker Original"
      srcDoc={rawHtml}
      className="w-full h-full border-none"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
    />
  );
}
