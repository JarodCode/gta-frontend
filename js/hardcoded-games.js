/**
 * Hardcoded list of top games by Metacritic rating.
 * This ensures consistent data for the application regardless of API availability.
 */

export const topGames = [
  {
    id: 3328,
    name: "The Witcher 3: Wild Hunt",
    released: "2015-05-18",
    background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    metacritic: 92,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } },
      { platform: { id: 186, name: "Xbox Series S/X" } }
    ],
    developers: [{ id: 9023, name: "CD PROJEKT RED" }],
    publishers: [{ id: 7411, name: "CD PROJEKT RED" }],
    description: "The third game in a series, it holds nothing back from the player. Open world adventures of the renowned monster slayer Geralt of Rivia are now even on a larger scale. Following the source material more accurately, this time Geralt is trying to find the child of the prophecy, Ciri while making a quick coin from various contracts on the side. Great attention to the world building above all creates an immersive experience, dragging the player in the low fantasy universe, filled with folk tales, politics, and racism."
  },
  {
    id: 5286,
    name: "Tomb Raider (2013)",
    released: "2013-03-05",
    background_image: "https://media.rawg.io/media/games/021/021c4e21a1824d2526f925eff6324653.jpg",
    metacritic: 86,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 881, name: "Crystal Dynamics" }],
    publishers: [{ id: 354, name: "Square Enix" }],
    description: "A cinematic revival of the iconic action-adventure franchise by Crystal Dynamics does not only introduce the new survival elements to the franchise but also reconstructs the protagonist, Lara Croft. Tomb Raider explores the story of young Lara Croft, a promising archeology student, who turns into a skillful survivor right before player's eyes."
  },
  {
    id: 4200,
    name: "Portal 2",
    released: "2011-04-18",
    background_image: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg",
    metacritic: 95,
    genres: [{ id: 2, name: "Shooter" }, { id: 7, name: "Puzzle" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 1612, name: "Valve Software" }],
    publishers: [{ id: 1612, name: "Valve" }],
    description: "Portal 2 is a first-person puzzle game developed by Valve Corporation and released on April 19, 2011. It was published and distributed by Valve Corporation. Its plot directly follows the first game's, taking place in the Half-Life universe. You play as Chell, a test subject in a research facility formerly ran by the company Aperture Science, but taken over by an evil AI that turned upon its creators, killing all of the scientists."
  },
  {
    id: 5679,
    name: "The Elder Scrolls V: Skyrim",
    released: "2011-11-11",
    background_image: "https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg",
    metacritic: 94,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 7, name: "Nintendo Switch" } }
    ],
    developers: [{ id: 2996, name: "Bethesda Game Studios" }],
    publishers: [{ id: 339, name: "Bethesda Softworks" }],
    description: "The fifth game in the series, Skyrim takes us on a journey through the coldest region of Cyrodiil. Once again player can traverse the open world RPG armed with various medieval weapons and magic, to become a hero of Nordic legends –Dovahkiin, the Dragonborn. After mandatory character creation players will have to escape not only imprisonment but a fire-breathing dragon. Something Skyrim hasn't seen in centuries."
  },
  {
    id: 12020,
    name: "Left 4 Dead 2",
    released: "2009-11-17",
    background_image: "https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg",
    metacritic: 89,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 1612, name: "Valve Software" }],
    publishers: [{ id: 1612, name: "Valve" }],
    description: "Cooperative survival horror FPS developed by Valve Corporation as a sequel to the original Left 4 Dead. The game is set in the post-apocalyptic world after a viral pandemic infected most of the population and turned them into zombie-like feral creatures."
  },
  {
    id: 4291,
    name: "Counter-Strike: Global Offensive",
    released: "2012-08-21",
    background_image: "https://media.rawg.io/media/games/736/73619bd336c894d6941d926bfd563946.jpg",
    metacritic: 81,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 1612, name: "Valve Software" }],
    publishers: [{ id: 1612, name: "Valve" }],
    description: "Counter-Strike: Global Offensive is an online first-person shooter developed by Valve Corporation and Hidden Path Entertainment. It is the fourth game in the Counter-Strike franchise. Like the previous games in the series, Global Offensive is an objective-based multiplayer first-person shooter."
  },
  {
    id: 4062,
    name: "BioShock Infinite",
    released: "2013-03-26",
    background_image: "https://media.rawg.io/media/games/fc1/fc1307a2774506b5bd65d7e8424664a7.jpg",
    metacritic: 94,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 7, name: "Nintendo Switch" } }
    ],
    developers: [{ id: 4451, name: "Irrational Games" }],
    publishers: [{ id: 2155, name: "2K Games" }],
    description: "BioShock Infinite is the third installment in the Bioshock series. It breaks away from the underwater setting of Rapture that was a hallmark of the other games in the series, instead setting the player in the airborne city of Columbia. Taking place in an alternate history 1912, Booker DeWitt is sent to Columbia to rescue a young woman, Elizabeth, who has been held captive there for most of her life."
  },
  {
    id: 3070,
    name: "Fallout 4",
    released: "2015-11-09",
    background_image: "https://media.rawg.io/media/games/d82/d82990b9c67ba0d2d09d4e6fa88885a7.jpg",
    metacritic: 84,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 2996, name: "Bethesda Game Studios" }],
    publishers: [{ id: 339, name: "Bethesda Softworks" }],
    description: "Fallout 4 is an open-world roleplaying action adventure game where the player plays as a survivor of the 23rd century after a nuclear apocalypse. The player will find various people, join different factions, travel around destroyed towns, buildings, metro, and other locations."
  },
  {
    id: 802,
    name: "Borderlands 2",
    released: "2012-09-18",
    background_image: "https://media.rawg.io/media/games/49c/49c3dfa4ce2f6f140cc4825868e858cb.jpg",
    metacritic: 89,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 567, name: "Gearbox Software" }],
    publishers: [{ id: 2155, name: "2K Games" }],
    description: "Sequel to the 4-player cooperative FPS RPG Borderlands, Borderlands 2 follows the story of four new Vault Hunters who ally with the original Vault Hunters in an attempt to defeat Handsome Jack, the megalomaniacal CEO of the Hyperion Corporation, and prevent him from awakening an alien evil known only as 'the Warrior'."
  },
  {
    id: 28,
    name: "Red Dead Redemption 2",
    released: "2018-10-26",
    background_image: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
    metacritic: 96,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 3524, name: "Rockstar Games" }],
    publishers: [{ id: 3524, name: "Rockstar Games" }],
    description: "America, 1899. The end of the wild west era has begun as lawmen hunt down the last remaining outlaw gangs. Those who will not surrender or succumb are killed. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee."
  },
  {
    id: 13536,
    name: "Portal",
    released: "2007-10-09",
    background_image: "https://media.rawg.io/media/games/7fa/7fa0b586293c5861ee32490e953a4996.jpg",
    metacritic: 90,
    genres: [{ id: 3, name: "Adventure" }, { id: 7, name: "Puzzle" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 5, name: "macOS" } }
    ],
    developers: [{ id: 1612, name: "Valve Software" }],
    publishers: [{ id: 1612, name: "Valve" }],
    description: "Portal is a first-person puzzle-platform video game developed and published by Valve Corporation. The game primarily comprises a series of puzzles that must be solved by teleporting the player's character and other simple objects using the Aperture Science Handheld Portal Device."
  },
  {
    id: 3939,
    name: "PAYDAY 2",
    released: "2013-08-13",
    background_image: "https://media.rawg.io/media/games/73e/73eecb8909e0c39fb246f457b5d6cbbe.jpg",
    metacritic: 79,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 6, name: "Linux" } }
    ],
    developers: [{ id: 3144, name: "OVERKILL Software" }],
    publishers: [{ id: 3134, name: "Starbreeze Studios AB" }],
    description: "PAYDAY 2 is a cooperative first-person shooter video game developed by Overkill Software and published by 505 Games. The game is a sequel to 2011's Payday: The Heist. It was released in August 2013 for Windows, PlayStation 3 and Xbox 360."
  },
  {
    id: 4286,
    name: "BioShock",
    released: "2007-08-21",
    background_image: "https://media.rawg.io/media/games/bc0/bc06a29ceac58652b684deefe7d56099.jpg",
    metacritic: 96,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 5, name: "macOS" } }
    ],
    developers: [{ id: 4451, name: "Irrational Games" }],
    publishers: [{ id: 2155, name: "2K Games" }],
    description: "BioShock is a first-person shooter video game developed by 2K Boston and published by 2K Games. The game is set in the underwater city of Rapture, which was built to be an objectivist utopia, but has since fallen into dystopia."
  },
  {
    id: 11859,
    name: "Team Fortress 2",
    released: "2007-10-10",
    background_image: "https://media.rawg.io/media/games/46d/46d98e6910fbc0706e2948a7cc9b10c5.jpg",
    metacritic: 92,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 5, name: "macOS" } }
    ],
    developers: [{ id: 1612, name: "Valve Software" }],
    publishers: [{ id: 1612, name: "Valve" }],
    description: "Team Fortress 2 is a team-based first-person shooter multiplayer video game developed and published by Valve Corporation. The game is a sequel to the original Team Fortress mod of 1996 and its 1999 remake, Team Fortress Classic."
  },
  {
    id: 32,
    name: "Destiny 2",
    released: "2017-09-06",
    background_image: "https://media.rawg.io/media/games/34b/34b1f1850a1c06fd971bc6ab3ac0ce0e.jpg",
    metacritic: 82,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 7556, name: "Bungie" }],
    publishers: [{ id: 3578, name: "Activision Blizzard" }],
    description: "Destiny 2 is an online multiplayer first-person shooter video game developed by Bungie and published by Activision. It was released for PlayStation 4 and Xbox One on September 6, 2017, followed by a Microsoft Windows version the following month."
  },
  {
    id: 1030,
    name: "Limbo",
    released: "2010-07-21",
    background_image: "https://media.rawg.io/media/games/942/9424d6bb763dc38d9378b488603c87fa.jpg",
    metacritic: 88,
    genres: [{ id: 3, name: "Adventure" }, { id: 7, name: "Puzzle" }, { id: 51, name: "Indie" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 5, name: "macOS" } }
    ],
    developers: [{ id: 1672, name: "Playdead" }],
    publishers: [{ id: 1672, name: "Playdead" }],
    description: "Limbo is a puzzle-platform video game developed by independent studio Playdead. The game was released on Xbox Live Arcade in July 2010, and has since been ported to several other systems."
  },
  {
    id: 3272,
    name: "Rocket League",
    released: "2015-07-07",
    background_image: "https://media.rawg.io/media/games/8cc/8cce7c0e99dcc43d66c8efd42f9d03e3.jpg",
    metacritic: 86,
    genres: [{ id: 4, name: "Action" }, { id: 15, name: "Sports" }, { id: 1, name: "Racing" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 7, name: "Nintendo Switch" } }
    ],
    developers: [{ id: 14333, name: "Psyonix" }],
    publishers: [{ id: 14333, name: "Psyonix" }],
    description: "Rocket League is a vehicular soccer video game developed and published by Psyonix. The game was first released for Microsoft Windows and PlayStation 4 in July 2015, with ports for Xbox One and Nintendo Switch released later on."
  },
  {
    id: 2454,
    name: "DOOM (2016)",
    released: "2016-05-13",
    background_image: "https://media.rawg.io/media/games/c4b/c4b0cab189e73432de3a250d8cf1c84e.jpg",
    metacritic: 85,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 7, name: "Nintendo Switch" } }
    ],
    developers: [{ id: 2772, name: "id Software" }],
    publishers: [{ id: 339, name: "Bethesda Softworks" }],
    description: "DOOM (2016) is a first-person shooter video game developed by id Software and published by Bethesda Softworks. It was released worldwide on Microsoft Windows, PlayStation 4, and Xbox One in May 2016 and is a reboot of the Doom franchise."
  },
  {
    id: 58175,
    name: "God of War",
    released: "2018-04-20",
    background_image: "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be59.jpg",
    metacritic: 94,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 2225, name: "Santa Monica Studio" }],
    publishers: [{ id: 369, name: "Sony Computer Entertainment" }],
    description: "God of War is an action-adventure video game developed by Santa Monica Studio and published by Sony Interactive Entertainment. It was released for PlayStation 4 in April 2018, with a Windows port released in January 2022."
  },
  {
    id: 11973,
    name: "Middle-earth: Shadow of Mordor",
    released: "2014-09-30",
    background_image: "https://media.rawg.io/media/games/d1a/d1a2e99ade53494c6330a0ed945fe823.jpg",
    metacritic: 85,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 599, name: "Monolith Productions" }],
    publishers: [{ id: 8352, name: "Warner Bros. Interactive" }],
    description: "Middle-earth: Shadow of Mordor is an action-adventure video game developed by Monolith Productions and published by Warner Bros. Interactive Entertainment. The game is set in the world of J.R.R. Tolkien's Legendarium, taking place between the events of The Hobbit and The Lord of the Rings."
  },
  {
    id: 19103,
    name: "Half-Life 2",
    released: "2004-11-16",
    background_image: "https://media.rawg.io/media/games/b8c/b8c243eaa0fbac8115e0cdccac3f91dc.jpg",
    metacritic: 96,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 5, name: "macOS" } }
    ],
    developers: [{ id: 1612, name: "Valve Software" }],
    publishers: [{ id: 1612, name: "Valve" }],
    description: "Half-Life 2 is a first-person shooter video game developed and published by Valve Corporation. It is the sequel to 1998's Half-Life and was released in November 2004 following a five-year development phase."
  },
  // Adding more games (first batch)
  {
    id: 3498,
    name: "Grand Theft Auto V",
    released: "2013-09-17",
    background_image: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    metacritic: 97,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 3524, name: "Rockstar North" }],
    publishers: [{ id: 3524, name: "Rockstar Games" }],
    description: "Grand Theft Auto V is an action-adventure game set in the open world environment of San Andreas, based on Los Angeles. The game follows three criminals as they commit heists while under pressure from government agencies."
  },
  {
    id: 4252,
    name: "Mirror's Edge",
    released: "2008-11-11",
    background_image: "https://media.rawg.io/media/games/8e4/8e4de3f54ac659e08a7ba6a2b731682a.jpg",
    metacritic: 81,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 120, name: "DICE" }],
    publishers: [{ id: 1612, name: "Electronic Arts" }],
    description: "Mirror's Edge is a first-person action-adventure game where the player takes control of Faith Connors, a runner who transports sensitive information across rooftops in a dystopian city."
  },
  {
    id: 5563,
    name: "Fallout: New Vegas",
    released: "2010-10-19",
    background_image: "https://media.rawg.io/media/games/995/9951d9d55323d08967640f7b9ab3e342.jpg",
    metacritic: 84,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 27, name: "Obsidian Entertainment" }],
    publishers: [{ id: 339, name: "Bethesda Softworks" }],
    description: "Fallout: New Vegas is a post-apocalyptic action role-playing video game. The game takes place in the year 2281, four years after the events of Fallout 3, within the region formerly known as Nevada."
  },
  {
    id: 4161,
    name: "Far Cry 3",
    released: "2012-11-28",
    background_image: "https://media.rawg.io/media/games/15c/15c95a4915f88a3e89c821526afe05fc.jpg",
    metacritic: 88,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 865, name: "Ubisoft Montreal" }],
    publishers: [{ id: 918, name: "Ubisoft Entertainment" }],
    description: "Far Cry 3 is an open-world first-person shooter set on an island in the midst of a hostile takeover. Players take control of Jason Brody and can approach combat missions using stealth, ranged attacks, or head-on assault."
  },
  {
    id: 4332,
    name: "Spec Ops: The Line",
    released: "2012-06-26",
    background_image: "https://media.rawg.io/media/games/b49/b4912b5dbfc7ed8927b65f05b8507f6c.jpg",
    metacritic: 76,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 18429, name: "Yager Development" }],
    publishers: [{ id: 2155, name: "2K Games" }],
    description: "Spec Ops: The Line is a third-person shooter that challenges players' perspectives of modern military shooters, following a three-man Delta Force team sent into a post-catastrophe Dubai."
  },
  {
    id: 3636,
    name: "The Last Of Us",
    released: "2013-06-14",
    background_image: "https://media.rawg.io/media/games/1bd/1bd2657b81eb0c99338120ad444b24ff.jpg",
    metacritic: 95,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 16, name: "PlayStation 3" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 2425, name: "Naughty Dog" }],
    publishers: [{ id: 369, name: "Sony Computer Entertainment" }],
    description: "The Last of Us is a post-apocalyptic action-adventure game following Joel and Ellie as they navigate a United States ravaged by a fungal infection that turns humans into hostile creatures."
  },
  {
    id: 9767,
    name: "Hollow Knight",
    released: "2017-02-24",
    background_image: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg",
    metacritic: 87,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }, { id: 51, name: "Indie" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 7, name: "Nintendo Switch" } }
    ],
    developers: [{ id: 16205, name: "Team Cherry" }],
    publishers: [{ id: 16205, name: "Team Cherry" }],
    description: "Hollow Knight is a challenging, beautifully hand-drawn 2D action-adventure. You'll explore twisting caverns, battle tainted creatures and escape intricate traps, all to solve an ancient long-hidden mystery."
  },
  {
    id: 4459,
    name: "Grand Theft Auto IV",
    released: "2008-04-29",
    background_image: "https://media.rawg.io/media/games/4a0/4a0a1316102366260e6f38fd2a9cfdce.jpg",
    metacritic: 90,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 3524, name: "Rockstar North" }],
    publishers: [{ id: 3524, name: "Rockstar Games" }],
    description: "Grand Theft Auto IV is an action-adventure game following Eastern European immigrant Niko Bellic as he arrives in Liberty City, based on New York City, to escape his past and pursue the American Dream."
  },
  {
    id: 3696,
    name: "Wolfenstein: The New Order",
    released: "2014-05-20",
    background_image: "https://media.rawg.io/media/games/c80/c80bcf321da44d69b18a06c04d942662.jpg",
    metacritic: 81,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 4764, name: "MachineGames" }],
    publishers: [{ id: 339, name: "Bethesda Softworks" }],
    description: "Wolfenstein: The New Order is a first-person shooter set in an alternate history where Nazi Germany won World War II. Players control war veteran William 'B.J.' Blazkowicz in a resistance movement against the Nazi regime."
  },
  {
    id: 1447,
    name: "Deus Ex: Human Revolution",
    released: "2011-08-23",
    background_image: "https://media.rawg.io/media/games/00d/00d374f12a3ab5f96c500a2cfa901e15.jpg",
    metacritic: 90,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 1012, name: "Eidos Montréal" }],
    publishers: [{ id: 354, name: "Square Enix" }],
    description: "Deus Ex: Human Revolution is an action role-playing game with first-person shooter and stealth mechanics. The game follows Adam Jensen, a security manager at a biotech company who becomes a mechanically-augmented operative and investigates global conspiracies."
  },
  // Adding more games (second batch)
  {
    id: 5583,
    name: "Hitman: Absolution",
    released: "2012-11-20",
    background_image: "https://media.rawg.io/media/games/d46/d46373f39458670305704ef089387520.jpg",
    metacritic: 79,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 121, name: "IO Interactive" }],
    publishers: [{ id: 354, name: "Square Enix" }],
    description: "Hitman: Absolution is a stealth video game where players assume the role of assassin Agent 47, who works for a secret agency specializing in carrying out assassinations of high-profile targets."
  },
  {
    id: 3192,
    name: "Metal Gear Solid V: The Phantom Pain",
    released: "2015-09-01",
    background_image: "https://media.rawg.io/media/games/490/49016e06ae2103881ff6373248843069.jpg",
    metacritic: 91,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 3307, name: "Konami" }],
    publishers: [{ id: 3307, name: "Konami" }],
    description: "Metal Gear Solid V: The Phantom Pain is an open-world stealth game following Punished 'Venom' Snake as he leads a mercenary group in Afghanistan during the Soviet-Afghan War."
  },
  {
    id: 4828,
    name: "Batman: Arkham Knight",
    released: "2015-06-23",
    background_image: "https://media.rawg.io/media/games/310/3106b0e012271c5ffb16497b070be739.jpg",
    metacritic: 85,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 21, name: "Rocksteady Studios" }],
    publishers: [{ id: 8352, name: "Warner Bros. Interactive" }],
    description: "Batman: Arkham Knight brings the award-winning Arkham trilogy from Rocksteady Studios to its epic conclusion. Developed exclusively for the new generation of consoles and PCs, Batman: Arkham Knight introduces Rocksteady's uniquely designed version of the Batmobile."
  },
  {
    id: 3287,
    name: "Batman: Arkham Asylum",
    released: "2009-08-25",
    background_image: "https://media.rawg.io/media/games/aa3/aa36ba4b486a03ddfaef274fb4f5afd4.jpg",
    metacritic: 91,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 21, name: "Rocksteady Studios" }],
    publishers: [{ id: 8352, name: "Warner Bros. Interactive" }],
    description: "Batman: Arkham Asylum is an action-adventure stealth game set in the Batman universe, where players control Batman as he battles classic villains while trapped in Arkham Asylum, a high-security psychiatric hospital."
  },
  {
    id: 16944,
    name: "The Witcher 2: Assassins of Kings",
    released: "2011-05-17",
    background_image: "https://media.rawg.io/media/games/6cd/6cd699a29ba58f5e33212a0f8611195b.jpg",
    metacritic: 88,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 9023, name: "CD PROJEKT RED" }],
    publishers: [{ id: 7411, name: "CD PROJEKT RED" }],
    description: "The Witcher 2: Assassins of Kings is a role-playing game that continues the story of Geralt of Rivia, a professional monster slayer, who is caught up in political turmoil as he pursues a kingslayer."
  },
  {
    id: 41494,
    name: "Cyberpunk 2077",
    released: "2020-12-10",
    background_image: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
    metacritic: 73,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 9023, name: "CD PROJEKT RED" }],
    publishers: [{ id: 7411, name: "CD PROJEKT RED" }],
    description: "Cyberpunk 2077 is an open-world, action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality."
  },
  {
    id: 11935,
    name: "Half-Life Alyx",
    released: "2020-03-23",
    background_image: "https://media.rawg.io/media/games/855/8552687245f888ba388bc6ec0dcc3947.jpg",
    metacritic: 93,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 1, name: "PC" } }
    ],
    developers: [{ id: 1612, name: "Valve Software" }],
    publishers: [{ id: 1612, name: "Valve" }],
    description: "Half-Life: Alyx is a VR first-person shooter developed and published by Valve. Set between the events of Half-Life and Half-Life 2, players control Alyx Vance as she and her father Eli fight against the alien Combine occupation of Earth."
  },
  {
    id: 290856,
    name: "Apex Legends",
    released: "2019-02-04",
    background_image: "https://media.rawg.io/media/games/b72/b7233d5d5b1e75e91d5ee33e8d96dd49.jpg",
    metacritic: 80,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 1172, name: "Respawn Entertainment" }],
    publishers: [{ id: 1612, name: "Electronic Arts" }],
    description: "Apex Legends is a free-to-play battle royale game developed by Respawn Entertainment and published by Electronic Arts. Players form squads of up to three and select from pre-designed characters with unique abilities, known as 'Legends'."
  },
  {
    id: 5525,
    name: "Call of Duty: Modern Warfare 3",
    released: "2011-11-08",
    background_image: "https://media.rawg.io/media/games/0e5/0e5e869f2e8f496b3f09e00187ea94fc.jpg",
    metacritic: 78,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 2202, name: "Infinity Ward" }],
    publishers: [{ id: 2095, name: "Activision" }],
    description: "Call of Duty: Modern Warfare 3 is a first-person shooter, the eighth Call of Duty installment, and the third installment in the Modern Warfare series. It continues the story from Modern Warfare 2 and is the final chapter in the original Modern Warfare storyline."
  },
  {
    id: 3387,
    name: "Bloodborne",
    released: "2015-03-24",
    background_image: "https://media.rawg.io/media/games/214/214b29aeff13a0ae6a70fc4426e85991.jpg",
    metacritic: 92,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 2211, name: "FromSoftware" }],
    publishers: [{ id: 369, name: "Sony Computer Entertainment" }],
    description: "Bloodborne is an action RPG developed by FromSoftware and published by Sony Computer Entertainment for PlayStation 4. The game follows the player character, the Hunter, through the decrepit Gothic city of Yharnam, whose inhabitants have been afflicted with an abnormal blood-borne disease."
  },
  {
    id: 326292,
    name: "Fall Guys: Ultimate Knockout",
    released: "2020-08-04",
    background_image: "https://media.rawg.io/media/games/5eb/5eb49eb2fa0738fdb5bacea557b1bc57.jpg",
    metacritic: 80,
    genres: [{ id: 4, name: "Action" }, { id: 10, name: "Strategy" }, { id: 15, name: "Sports" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 17711, name: "Mediatonic" }],
    publishers: [{ id: 7411, name: "Devolver Digital" }],
    description: "Fall Guys: Ultimate Knockout is a battle royale game with up to 60 players controlling jellybean-like creatures and competing against each other in a series of randomly selected mini-games."
  },
  {
    id: 766,
    name: "Warframe",
    released: "2013-03-25",
    background_image: "https://media.rawg.io/media/games/f87/f87457e8347484033cb34cde6101d08d.jpg",
    metacritic: 73,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 53, name: "Digital Extremes" }],
    publishers: [{ id: 53, name: "Digital Extremes" }],
    description: "Warframe is a free-to-play cooperative third-person shooter. Players control members of the Tenno, a race of ancient warriors who have awoken from centuries of cryosleep to find themselves at war with different factions."
  },
  {
    id: 9882,
    name: "Don't Starve Together",
    released: "2016-04-21",
    background_image: "https://media.rawg.io/media/games/dd5/dd50d4266915d56dd5b63ae1bf72606a.jpg",
    metacritic: 83,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }, { id: 51, name: "Indie" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 827, name: "Klei Entertainment" }],
    publishers: [{ id: 827, name: "Klei Entertainment" }],
    description: "Don't Starve Together is the standalone multiplayer expansion of the uncompromising survival game Don't Starve. It introduces multiplayer to the game, allowing up to six players to survive together in a harsh wilderness filled with monsters and other hazards."
  },
  {
    id: 17540,
    name: "Injustice: Gods Among Us Ultimate Edition",
    released: "2013-11-12",
    background_image: "https://media.rawg.io/media/games/234/23410661770ae13eac11066980834367.jpg",
    metacritic: 79,
    genres: [{ id: 4, name: "Action" }, { id: 6, name: "Fighting" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 6859, name: "NetherRealm Studios" }],
    publishers: [{ id: 8352, name: "Warner Bros. Interactive" }],
    description: "Injustice: Gods Among Us Ultimate Edition is a fighting game featuring characters from the DC Comics universe. The game takes place in a universe where Superman establishes a new world order after the Joker tricks him into killing Lois Lane and destroying Metropolis."
  },
  {
    id: 5303,
    name: "Metro: Last Light Redux",
    released: "2014-08-25",
    background_image: "https://media.rawg.io/media/games/7a4/7a45e4cdc5b07f316d49cf147b083b27.jpg",
    metacritic: 76,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 7, name: "Nintendo Switch" } }
    ],
    developers: [{ id: 49, name: "4A Games" }],
    publishers: [{ id: 2621, name: "Deep Silver" }],
    description: "Metro: Last Light Redux is the improved and expanded version of Metro: Last Light, the sequel to the acclaimed Metro 2033. It continues the story in a post-apocalyptic Moscow, where survivors dwell in the remains of the Metro tunnels below the city."
  },
  // Adding final batch of games
  {
    id: 3782,
    name: "StarCraft II: Wings of Liberty",
    released: "2010-07-27",
    background_image: "https://media.rawg.io/media/games/490/49016e06ae2103881ff6373248843069.jpg",
    metacritic: 93,
    genres: [{ id: 10, name: "Strategy" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 5, name: "macOS" } }
    ],
    developers: [{ id: 817, name: "Blizzard Entertainment" }],
    publishers: [{ id: 2155, name: "Blizzard Entertainment" }],
    description: "StarCraft II: Wings of Liberty is a military science fiction real-time strategy video game, and is the sequel to StarCraft. It continues the story of Jim Raynor's fight against the Dominion, a totalitarian regime that rules over most of humanity in the Koprulu sector."
  },
  {
    id: 12447,
    name: "The Elder Scrolls IV: Oblivion",
    released: "2006-03-20",
    background_image: "https://media.rawg.io/media/games/615/61503312a95d451198d80d9ab4b09a45.jpg",
    metacritic: 94,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 2996, name: "Bethesda Game Studios" }],
    publishers: [{ id: 339, name: "Bethesda Softworks" }],
    description: "The Elder Scrolls IV: Oblivion is a fantasy open-world RPG game. After the emperor has been killed, the search for his heir begins while an invasion from the realm of Oblivion threatens the land."
  },
  {
    id: 5562,
    name: "Fallout 3",
    released: "2008-10-28",
    background_image: "https://media.rawg.io/media/games/5a4/5a4e70bb8a862829dbaa398aa5f66afc.jpg",
    metacritic: 91,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 2996, name: "Bethesda Game Studios" }],
    publishers: [{ id: 339, name: "Bethesda Softworks" }],
    description: "Fallout 3 is an action role-playing game set in a post-apocalyptic Washington D.C. following nuclear war. The game follows a vault-dweller emerging from Vault 101 to search for their missing father."
  },
  {
    id: 12447,
    name: "Mass Effect 2",
    released: "2010-01-26",
    background_image: "https://media.rawg.io/media/games/3cf/3cff89996570cf29a10eb9cd967dcf73.jpg",
    metacritic: 94,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 343, name: "BioWare" }],
    publishers: [{ id: 2611, name: "Electronic Arts" }],
    description: "Mass Effect 2 is a sci-fi RPG/third-person shooter hybrid that continues the story of Commander Shepard and their quest to save the galaxy from the mysterious Collectors who are abducting human colonies."
  },
  {
    id: 11936,
    name: "Half-Life 2: Episode Two",
    released: "2007-10-10",
    background_image: "https://media.rawg.io/media/games/198/1988a337305e008b41d7f536ce9b73f6.jpg",
    metacritic: 90,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 5, name: "macOS" } }
    ],
    developers: [{ id: 1612, name: "Valve Software" }],
    publishers: [{ id: 1612, name: "Valve" }],
    description: "Half-Life 2: Episode Two is a first-person shooter game and part of the Half-Life series. The game continues directly from the events of Half-Life 2: Episode One, as Gordon Freeman and Alyx Vance head to White Forest Missile Base."
  },
  {
    id: 4248,
    name: "Dishonored",
    released: "2012-10-09",
    background_image: "https://media.rawg.io/media/games/4e6/4e6e8e7f50c237d76f38f3c885dae3d2.jpg",
    metacritic: 88,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 49, name: "Arkane Studios" }],
    publishers: [{ id: 339, name: "Bethesda Softworks" }],
    description: "Dishonored is an immersive first-person action game that casts you as a supernatural assassin driven by revenge. Framed for the murder of the empress you swore to protect, you are forced to become an assassin to seek revenge on those who conspired against you."
  },
  {
    id: 4166,
    name: "Mass Effect",
    released: "2007-11-20",
    background_image: "https://media.rawg.io/media/games/a6c/a6ccd34125c594abf1a9c9821b9a715d.jpg",
    metacritic: 89,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 343, name: "BioWare" }],
    publishers: [{ id: 2611, name: "Electronic Arts" }],
    description: "Mass Effect is an action role-playing game set in a science fiction universe. The game follows Commander Shepard, an elite human soldier who must save the galaxy from a race of powerful mechanical beings known as the Reapers."
  },
  {
    id: 3612,
    name: "Hotline Miami",
    released: "2012-10-23",
    background_image: "https://media.rawg.io/media/games/9fa/9fa63622543e5d4f6d99aa9d73b759ac.jpg",
    metacritic: 85,
    genres: [{ id: 4, name: "Action" }, { id: 51, name: "Indie" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 3873, name: "Dennaton Games" }],
    publishers: [{ id: 3694, name: "Devolver Digital" }],
    description: "Hotline Miami is a high-octane top-down shooter set in 1989 Miami. The game blends brutal violence with surreal storytelling as players don animal masks and embark on killing sprees at the behest of mysterious phone messages."
  },
  {
    id: 5525,
    name: "Metro 2033",
    released: "2010-03-16",
    background_image: "https://media.rawg.io/media/games/120/1201a40e4364557b124392ee50317b99.jpg",
    metacritic: 79,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 49, name: "4A Games" }],
    publishers: [{ id: 2621, name: "THQ" }],
    description: "Metro 2033 is a first-person shooter survival horror video game based on the novel of the same name by Russian author Dmitry Glukhovsky. The game is set in a post-apocalyptic Moscow, where survivors hide in the city's metro system to escape the dangerous mutants that roam the surface."
  },
  {
    id: 39,
    name: "Prey",
    released: "2017-05-05",
    background_image: "https://media.rawg.io/media/games/e6d/e6de699bd788497f4b52e2f41f9698f2.jpg",
    metacritic: 82,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 49, name: "Arkane Studios" }],
    publishers: [{ id: 339, name: "Bethesda Softworks" }],
    description: "Prey is a first-person shooter with RPG elements set on a space station overrun by hostile aliens known as the Typhon. Players control Morgan Yu, who must use weapons and abilities to combat the Typhon and uncover the secrets of the space station Talos I."
  },
  {
    id: 3603,
    name: "Life is Strange: Before the Storm",
    released: "2017-08-31",
    background_image: "https://media.rawg.io/media/games/214/214b29aeff13a0ae6a70fc4426e85991.jpg",
    metacritic: 78,
    genres: [{ id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 6043, name: "Deck Nine" }],
    publishers: [{ id: 354, name: "Square Enix" }],
    description: "Life is Strange: Before the Storm is a graphic adventure video game, a prequel to Life is Strange. The game follows Chloe Price, a rebellious teenager who forms an unlikely friendship with Rachel Amber, a popular student destined for success."
  },
  {
    id: 3494,
    name: "Dark Souls",
    released: "2011-09-22",
    background_image: "https://media.rawg.io/media/games/a6c/a6ccd34125c594abf1a9c9821b9a715d.jpg",
    metacritic: 89,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 2211, name: "FromSoftware" }],
    publishers: [{ id: 1163, name: "Bandai Namco Entertainment" }],
    description: "Dark Souls is an action RPG known for its punishing difficulty and complex level design. Players navigate a dark fantasy world filled with undead enemies, massive bosses, and intricate lore as they aim to either rekindle or extinguish the Age of Fire."
  },
  {
    id: 10754,
    name: "BioShock 2",
    released: "2010-02-09",
    background_image: "https://media.rawg.io/media/games/157/15742f2f67eacff546738e1ab5c19d20.jpg",
    metacritic: 88,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 14, name: "Xbox 360" } }
    ],
    developers: [{ id: 2152, name: "2K Marin" }],
    publishers: [{ id: 2155, name: "2K Games" }],
    description: "BioShock 2 is a first-person shooter set in the underwater dystopian city of Rapture. The game follows Subject Delta, a prototype Big Daddy, as he searches for his former Little Sister, Eleanor, while combating the forces of Sofia Lamb."
  },
  {
    id: 1447,
    name: "Deus Ex: Mankind Divided",
    released: "2016-08-23",
    background_image: "https://media.rawg.io/media/games/c24/c24ec439abf4a2e92f3429dfa83f7f94.jpg",
    metacritic: 83,
    genres: [{ id: 4, name: "Action" }, { id: 5, name: "RPG" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 1012, name: "Eidos Montréal" }],
    publishers: [{ id: 354, name: "Square Enix" }],
    description: "Deus Ex: Mankind Divided is an action RPG with first-person shooter and stealth elements that continues the story of Adam Jensen, now working with an anti-terrorist unit as augmented humans face increasing discrimination and segregation."
  },
  {
    id: 1030,
    name: "Inside",
    released: "2016-06-29",
    background_image: "https://media.rawg.io/media/games/d5a/d5a24f9f71315427fa6e966fdd98dfa6.jpg",
    metacritic: 87,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }, { id: 7, name: "Puzzle" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 1672, name: "Playdead" }],
    publishers: [{ id: 1672, name: "Playdead" }],
    description: "Inside is a puzzle-platformer adventure game. The game follows a young boy who finds himself drawn into the center of a dark project as he navigates a surreal and monochromatic landscape filled with hostile forces and environmental hazards."
  },
  {
    id: 11934,
    name: "Counter-Strike: Source",
    released: "2004-11-01",
    background_image: "https://media.rawg.io/media/games/48e/48e63bbddeddbe9ba81942772b156664.jpg",
    metacritic: 88,
    genres: [{ id: 4, name: "Action" }, { id: 2, name: "Shooter" }],
    platforms: [
      { platform: { id: 1, name: "PC" } },
      { platform: { id: 5, name: "macOS" } }
    ],
    developers: [{ id: 1612, name: "Valve Software" }],
    publishers: [{ id: 1612, name: "Valve" }],
    description: "Counter-Strike: Source is a remake of Counter-Strike using the Source game engine. As in the original, Counter-Strike: Source pits a team of counter-terrorists against a team of terrorists in a series of rounds."
  },
  {
    id: 58134,
    name: "Marvel's Spider-Man",
    released: "2018-09-07",
    background_image: "https://media.rawg.io/media/games/9aa/9aa42d16d425fa6f179fc9dc2f763647.jpg",
    metacritic: 87,
    genres: [{ id: 4, name: "Action" }, { id: 3, name: "Adventure" }],
    platforms: [
      { platform: { id: 18, name: "PlayStation 4" } }
    ],
    developers: [{ id: 955, name: "Insomniac Games" }],
    publishers: [{ id: 369, name: "Sony Interactive Entertainment" }],
    description: "Marvel's Spider-Man is an open-world action-adventure game that puts players in control of Spider-Man as he fights crime in Manhattan, battling iconic villains while dealing with his dual life as Peter Parker."
  }
];

/**
 * Returns the full list of hardcoded games
 */
export function getHardcodedGames() {
  return [...topGames]; // Return a copy to prevent modification of the original
}

/**
 * Simulates an API response structure with the hardcoded games
 * @param {Object} options - Options like search term, page, etc.
 * @returns {Object} - API-like response object
 */
export function getGamesLikeApi(options = {}) {
  console.log('Getting hardcoded games with options:', options);
  
  // Get all games
  const allGames = getHardcodedGames();
  
  // Filter games based on search term
  let filteredGames = allGames;
  
  if (options.search) {
    const searchTerm = options.search.toLowerCase();
    filteredGames = filteredGames.filter(game => 
      game.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by genre if specified
  if (options.genres) {
    const genreIds = options.genres.split(',').map(id => parseInt(id.trim(), 10));
    filteredGames = filteredGames.filter(game => 
      game.genres && game.genres.some(genre => genreIds.includes(genre.id))
    );
  }
  
  // Sort games based on ordering
  if (options.ordering) {
    if (options.ordering === '-rating') {
      filteredGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (options.ordering === 'name') {
      filteredGames.sort((a, b) => a.name.localeCompare(b.name));
    } else if (options.ordering === '-released') {
      filteredGames.sort((a, b) => {
        const dateA = new Date(a.released || '1970-01-01');
        const dateB = new Date(b.released || '1970-01-01');
        return dateB - dateA;
      });
    }
  }
  
  // Calculate pagination
  const page = options.page || 1;
  const pageSize = options.pageSize || 20;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  // Get games for current page
  const paginatedGames = filteredGames.slice(startIndex, endIndex);
  
  // Return API-like response
  return {
    count: filteredGames.length,
    next: endIndex < filteredGames.length ? `page=${page + 1}` : null,
    previous: page > 1 ? `page=${page - 1}` : null,
    results: paginatedGames
  };
} 