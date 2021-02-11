# Javascript ES6 Memory Game

The game is a simple and relaxing variation of the classic [Memory Game](https://en.wikipedia.org/wiki/Concentration_(card_game)). 

I wrote this little piece of code to achieve a couple of goal:
- [x] I like to play this game and didn't like any online version I found ;) 
- [x] I need to practice for [Javascript ES6](https://javascript.info/)

Also, it was a good opportunity to learn the most promising *utility-first CSS framework*: [TailwindCSS](https://tailwindcss.com/).

Wikipedia says *(a move is a pair of flipped cards)*:
> With perfect memorization and using an optimal strategy, the expected number of moves needed for a game with n cards converges to ≈ 0.8 n , with n → ∞ .

So, the score is simply calculated as:    100 * (0.8 * cards) / (your moves)

but keep in mind that you shouldn't compare scores obtained in different game level. In fact with a few cards it's easy to get a score greater than 100, both because the above formula is valid with n → ∞ and because *perfect memorization* is much easier with a few cards.


*credits*

Icons made by FreePik from [Flaticon](https://www.flaticon.com).
