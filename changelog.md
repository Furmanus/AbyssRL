### 0.0.5 (currently developed)
* (Feature)  More advanced monster AI: monsters can be now generated in packs, and pack members will try to stay close
             to leader
* (Feature)  More advanced monster AI: they can recognize weapons and armours, pick up and equip them
* (Feature)  Added more monsters
* (Feature)  Armours, rings, amulets and weapons can be worn now, giving appropriate modifiers for stats and in combat
* (Feature)  Added armours, rings and amulets
* (Refactor) Refactored game models so game data can be now easily serialized
### 0.0.4 (01.09.2019)
* (Feature) Basic implementation of items (four weapons). Player is able to pick up, drop items and display inventory 
* (Fix)     Webpack application build fixes and improvements
### 0.0.3 (15.06.2019)
* (Feature) Basic implementation of monsters (giant rat right now)
* (Feature) Basic combat implementation
* (Feature) Randomized combat messages
* (Feature) Implementation of two natural weapons: fist and bite
* (Feature) Game can end now, player can be killed
* (Feature) Basic animal AI
* (Feature) Implemented look command
* (Feature) Special sprite when entity gets hit
* (Feature) Temporary message on game screen
### 0.0.2 (01.05.2019)
* (Feature) Added mechanism to generate random dungeon room decorators (a.k.a vaults), added
one basic random room (empty room with bed and chest of drawers)
* (Feature) Player character can use stairs
* (Technical) Added mapWithObserver object - a ES6 like map object with Observer methods
* (Fix) Camera screen should always has maximum size of level width/height
* (Fix) On dungeon type of level stairs down shouldn't generate on place of stairs up
### 0.0.1 (09.03.2019)
* Rewrite existing code to TypeScript
* Write unit tests for utility helper and position, rectangle and vector classes

Game development started in early 2017, but changelog has started here.
