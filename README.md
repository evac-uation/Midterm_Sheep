# Midterm_Sheep
Render URL: https://midterm-sheep-1.onrender.com/

1. What challenge you chose.<br>
I made a tycoon-inspired sheep clicker game. The player clicks a moving sheep in the farm to collect wool, which can be used to upgrade their sheep. Upgraded sheep produce more wool per click.

2. A description of which API endpoints you built<br>
GET /api/sheep -- get a list containing all the sheep types. Each sheep has a name, a price, and an amount of wool it can produce per click.
GET /api/games -- get a dictionary containing all the players' statuses.
GET /api/game -- get the status of the current player.
PUT /api/collect -- this API is called when the player clicks the sheep. It updates the status of the player in the server, and returns the updated status of the player.
POST /api/buy/:index --  this API is called when the player clicks the "buy" button to trade collected wool for sheep. It updates the status of the player in the server, and returns the updated status of the player.
DELETE /api/deletegame -- delete the current player from the game.
DELETE /api/delete?user=username -- delete the selected player from the game.

3. How you are using URL parameters and cookies<br>
I use cookies to store the name of the current player.
I use a URL parameter to specify the difficulty level of the game ("hard" or "normal").

4. Which animation you added <br>
I added an animation to make the sheep move back and forth. The player has to click the moving sheep to collect wool.
I also added button press animations for when the player hovers/clicks the button.

6. Identify where you challenged yourself or learned things not covered in class <br>
I learned how to use radio buttons and select them automatically depending on the URL parameter.
I learned how to use Javascript dictionaries. I learned how to iterate all the key-value pairs in a Javascript dictionary. I also learned how to remove an entry from a Javascript dictionary.
