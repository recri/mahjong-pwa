/* the proposition is that the web app can be launched
   with a url that specifies the game to be played as
   a parameter to https://mahjong.elf.org#gameIdentifier
   a decimal number is a gameIndentifier as an int
   a hexadecimal number is a gameIdentifier as an int
   an arbitrary string is a gameIdentifier which is hashed to an int
   the int may be masked to its lower bits and used as a seed for the
   games random number generator.
   
   this means that clicking a url with a gameIdentifier will take you
   to the web app to play the selected game.

   I guess it follows that you need to be able to get to the game id
   of the game you're playing, either by copying the url as a selection
   or by popping out to a browser hosted window with url controls.
*/   
if ("launchQueue" in window) {
  window.launchQueue.setConsumer((launchParams) => {
    if (launchParams.targetURL) {
      const params = new URL(launchParams.targetURL).searchParams;

      // Assuming a music player app that gets a track passed to it to be played
      const track = params.get("track");
      if (track) {
        audio.src = track;
        title.textContent = new URL(track).pathname.substring(1);
        audio.play();
      }
    }
  });
}
