#!/usr/bin/env python3
"""Generate static sport pages for vivid-casino-crypto based on shuffle.com structure."""

import os
import json

SPORTS_DIR = "/Users/Jakin/vivid-casino-crypto/sports"

# Sport data with static match data from shuffle.com
SPORTS_DATA = {
    "baseball": {
        "icon": "baseball",
        "name": "Baseball",
        "leagues": [
            {
                "country": "USA",
                "flag": "USA_round",
                "league": "MLB",
                "market": "Winner (incl. extra innings)",
                "matches": [
                    {
                        "teams": ["Baltimore Orioles", "Chicago White Sox"],
                        "status": "LIVE",
                        "phase": "4th inning bottom",
                        "scores": [["0", "0"], ["0", "1"]],
                        "odds": [["Baltimore Orioles", "2.05"], ["Chicago White Sox", "1.80"]],
                        "markets": "+208"
                    },
                    {
                        "teams": ["Cleveland Guardians", "Texas Rangers"],
                        "status": "LIVE",
                        "phase": "2nd inning top",
                        "scores": [["0", "0"], ["0", "0"]],
                        "odds": [["Cleveland Guardians", "1.75"], ["Texas Rangers", "2.10"]],
                        "markets": "+205"
                    },
                    {
                        "teams": ["Boston Red Sox", "Washington Nationals"],
                        "status": "About to start",
                        "phase": "Jul 02, 12:35 PM",
                        "scores": [],
                        "odds": [["Boston Red Sox", "1.65"], ["Washington Nationals", "2.25"]],
                        "markets": "+113"
                    }
                ]
            },
            {
                "country": "Japan",
                "flag": "JPN_round",
                "league": "NPB",
                "market": "Winner (incl. extra innings)",
                "matches": [
                    {
                        "teams": ["Hokkaido Nippon-Ham Fighters", "Orix Buffaloes"],
                        "status": "Upcoming",
                        "phase": "Jul 02, 4:00 AM",
                        "scores": [],
                        "odds": [["Hokkaido Nippon-Ham Fighters", "1.50"], ["Orix Buffaloes", "2.42"]],
                        "markets": "+7"
                    },
                    {
                        "teams": ["Fukuoka Hawks", "Saitama Seibu Lions"],
                        "status": "Upcoming",
                        "phase": "Jul 02, 4:00 AM",
                        "scores": [],
                        "odds": [["Fukuoka Hawks", "1.59"], ["Saitama Seibu Lions", "2.23"]],
                        "markets": "+7"
                    }
                ]
            },
            {
                "country": "Republic of Korea",
                "flag": "KOR_round",
                "league": "KBO League",
                "market": "Winner (incl. extra innings)",
                "matches": [
                    {
                        "teams": ["Doosan Bears", "Lotte Giants"],
                        "status": "Upcoming",
                        "phase": "Jul 02, 4:30 AM",
                        "scores": [],
                        "odds": [["Doosan Bears", "1.67"], ["Lotte Giants", "2.08"]],
                        "markets": "+7"
                    },
                    {
                        "teams": ["NC Dinos", "Samsung Lions"],
                        "status": "Upcoming",
                        "phase": "Jul 02, 4:30 AM",
                        "scores": [],
                        "odds": [["NC Dinos", "1.91"], ["Samsung Lions", "1.80"]],
                        "markets": "+7"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "Japan", "count": "4"},
            {"name": "Republic of Korea", "count": "5"},
            {"name": "USA", "count": "42"}
        ]
    },
    "basketball": {
        "icon": "basketball",
        "name": "Basketball",
        "leagues": [
            {
                "country": "USA",
                "flag": "USA_round",
                "league": "NBA",
                "market": "Winner (incl. overtime)",
                "matches": [
                    {
                        "teams": ["Boston Celtics", "Dallas Mavericks"],
                        "status": "LIVE",
                        "phase": "3rd quarter",
                        "scores": [["78", "72"], ["82", "75"]],
                        "odds": [["Boston Celtics", "1.45"], ["Dallas Mavericks", "2.75"]],
                        "markets": "+156"
                    },
                    {
                        "teams": ["Los Angeles Lakers", "Golden State Warriors"],
                        "status": "Upcoming",
                        "phase": "Jul 02, 8:00 PM",
                        "scores": [],
                        "odds": [["Los Angeles Lakers", "1.85"], ["Golden State Warriors", "1.95"]],
                        "markets": "+142"
                    }
                ]
            },
            {
                "country": "Spain",
                "flag": "ESP_round",
                "league": "Liga ACB",
                "market": "Winner (incl. overtime)",
                "matches": [
                    {
                        "teams": ["Real Madrid", "Barcelona"],
                        "status": "Upcoming",
                        "phase": "Jul 02, 2:00 PM",
                        "scores": [],
                        "odds": [["Real Madrid", "1.55"], ["Barcelona", "2.45"]],
                        "markets": "+38"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "Spain", "count": "8"},
            {"name": "USA", "count": "32"}
        ]
    },
    "soccer": {
        "icon": "soccer",
        "name": "Soccer",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "FIFA World Cup",
                "market": "1x2",
                "matches": [
                    {
                        "teams": ["England", "Congo DR"],
                        "status": "LIVE",
                        "phase": "71:30 2nd half",
                        "scores": [["0", "0"], ["0", "1"]],
                        "odds": [["England", "5.00"], ["Draw", "2.70"], ["Congo DR", "2.15"]],
                        "markets": "+76"
                    },
                    {
                        "teams": ["Belgium", "Senegal"],
                        "status": "Upcoming",
                        "phase": "Jul 01, 7:00 PM",
                        "scores": [],
                        "odds": [["Belgium", "2.14"], ["Draw", "3.45"], ["Senegal", "3.70"]],
                        "markets": "+499"
                    },
                    {
                        "teams": ["USA", "Bosnia and Herzegovina"],
                        "status": "Upcoming",
                        "phase": "Jul 01, 7:00 PM",
                        "scores": [],
                        "odds": [["USA", "1.38"], ["Draw", "5.20"], ["Bosnia and Herzegovina", "8.20"]],
                        "markets": "+492"
                    }
                ]
            },
            {
                "country": "England",
                "flag": "GBR_round",
                "league": "Premier League",
                "market": "1x2",
                "matches": [
                    {
                        "teams": ["Manchester City", "Arsenal"],
                        "status": "Upcoming",
                        "phase": "Aug 15, 3:00 PM",
                        "scores": [],
                        "odds": [["Manchester City", "1.65"], ["Draw", "3.80"], ["Arsenal", "5.20"]],
                        "markets": "+312"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "England", "count": "24"},
            {"name": "Germany", "count": "18"},
            {"name": "International", "count": "64"},
            {"name": "Spain", "count": "16"}
        ]
    },
    "tennis": {
        "icon": "tennis",
        "name": "Tennis",
        "leagues": [
            {
                "country": "ATP",
                "flag": "world",
                "league": "Wimbledon Men Singles",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["Nakashima, Brandon", "Struff, Jan-Lennard"],
                        "status": "LIVE",
                        "phase": "2nd set",
                        "scores": [["3", "3"], ["40", "0"]],
                        "odds": [["Nakashima, Brandon", "1.12"], ["Struff, Jan-Lennard", "6.25"]],
                        "markets": "+48"
                    },
                    {
                        "teams": ["Auger-Aliassime, Felix", "Prizmic, Dino"],
                        "status": "LIVE",
                        "phase": "1st set",
                        "scores": [["5", "5"], ["30", "15"]],
                        "odds": [["Auger-Aliassime, Felix", "1.25"], ["Prizmic, Dino", "3.85"]],
                        "markets": "+48"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "ATP", "count": "24"},
            {"name": "WTA", "count": "18"}
        ]
    },
    "american-football": {
        "icon": "american-football",
        "name": "American Football",
        "leagues": [
            {
                "country": "USA",
                "flag": "USA_round",
                "league": "NFL",
                "market": "Winner (incl. overtime)",
                "matches": [
                    {
                        "teams": ["Kansas City Chiefs", "San Francisco 49ers"],
                        "status": "Upcoming",
                        "phase": "Sep 05, 7:20 PM",
                        "scores": [],
                        "odds": [["Kansas City Chiefs", "1.75"], ["San Francisco 49ers", "2.10"]],
                        "markets": "+142"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "USA", "count": "64"}
        ]
    },
    "mma": {
        "icon": "mma",
        "name": "Mixed Martial Arts",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "UFC",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["Jon Jones", "Stipe Miocic"],
                        "status": "Upcoming",
                        "phase": "Jul 12, 10:00 PM",
                        "scores": [],
                        "odds": [["Jon Jones", "1.55"], ["Stipe Miocic", "2.45"]],
                        "markets": "+68"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "24"}
        ]
    },
    "boxing": {
        "icon": "boxing",
        "name": "Boxing",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "Heavyweight",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["Tyson Fury", "Oleksandr Usyk"],
                        "status": "Upcoming",
                        "phase": "Jul 15, 9:00 PM",
                        "scores": [],
                        "odds": [["Tyson Fury", "1.85"], ["Oleksandr Usyk", "1.95"]],
                        "markets": "+42"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "18"}
        ]
    },
    "cricket": {
        "icon": "cricket",
        "name": "Cricket",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "ICC World Cup",
                "market": "Match Winner",
                "matches": [
                    {
                        "teams": ["India", "Australia"],
                        "status": "Upcoming",
                        "phase": "Jul 05, 10:00 AM",
                        "scores": [],
                        "odds": [["India", "1.65"], ["Australia", "2.25"]],
                        "markets": "+56"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "Australia", "count": "8"},
            {"name": "England", "count": "12"},
            {"name": "India", "count": "16"}
        ]
    },
    "ice-hockey": {
        "icon": "ice-hockey",
        "name": "Ice Hockey",
        "leagues": [
            {
                "country": "USA",
                "flag": "USA_round",
                "league": "NHL",
                "market": "Winner (incl. overtime)",
                "matches": [
                    {
                        "teams": ["New York Rangers", "Florida Panthers"],
                        "status": "Upcoming",
                        "phase": "Oct 10, 7:00 PM",
                        "scores": [],
                        "odds": [["New York Rangers", "1.90"], ["Florida Panthers", "1.90"]],
                        "markets": "+128"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "Canada", "count": "8"},
            {"name": "USA", "count": "16"}
        ]
    },
    "darts": {
        "icon": "darts",
        "name": "Darts",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "PDC World Championship",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["Luke Littler", "Michael van Gerwen"],
                        "status": "Upcoming",
                        "phase": "Dec 15, 8:00 PM",
                        "scores": [],
                        "odds": [["Luke Littler", "1.70"], ["Michael van Gerwen", "2.15"]],
                        "markets": "+32"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "12"}
        ]
    },
    "golf": {
        "icon": "golf",
        "name": "Golf",
        "leagues": [
            {
                "country": "USA",
                "flag": "USA_round",
                "league": "PGA Championship",
                "market": "Outright",
                "matches": [
                    {
                        "teams": ["Scottie Scheffler", "Rory McIlroy"],
                        "status": "Upcoming",
                        "phase": "Aug 10, 9:00 AM",
                        "scores": [],
                        "odds": [["Scottie Scheffler", "2.50"], ["Rory McIlroy", "3.20"]],
                        "markets": "+64"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "8"},
            {"name": "USA", "count": "24"}
        ]
    },
    "rugby": {
        "icon": "rugby-union",
        "name": "Rugby",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "Rugby World Cup",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["New Zealand", "South Africa"],
                        "status": "Upcoming",
                        "phase": "Sep 15, 3:00 PM",
                        "scores": [],
                        "odds": [["New Zealand", "1.80"], ["South Africa", "2.00"]],
                        "markets": "+48"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "Australia", "count": "4"},
            {"name": "England", "count": "8"},
            {"name": "International", "count": "16"}
        ]
    },
    "volleyball": {
        "icon": "volleyball",
        "name": "Volleyball",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "FIVB World Cup",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["Brazil", "Italy"],
                        "status": "Upcoming",
                        "phase": "Jul 10, 6:00 PM",
                        "scores": [],
                        "odds": [["Brazil", "1.65"], ["Italy", "2.25"]],
                        "markets": "+28"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "8"}
        ]
    },
    "table-tennis": {
        "icon": "table-tennis",
        "name": "Table Tennis",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "World Championship",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["Fan Zhendong", "Ma Long"],
                        "status": "Upcoming",
                        "phase": "Jul 08, 4:00 PM",
                        "scores": [],
                        "odds": [["Fan Zhendong", "1.55"], ["Ma Long", "2.45"]],
                        "markets": "+22"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "6"}
        ]
    },
    "formula-1": {
        "icon": "f1",
        "name": "Formula 1",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "F1 World Championship",
                "market": "Race Winner",
                "matches": [
                    {
                        "teams": ["Max Verstappen", "Lewis Hamilton"],
                        "status": "Upcoming",
                        "phase": "Jul 20, 2:00 PM",
                        "scores": [],
                        "odds": [["Max Verstappen", "1.45"], ["Lewis Hamilton", "3.50"]],
                        "markets": "+38"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "24"}
        ]
    },
    "handball": {
        "icon": "handball",
        "name": "Handball",
        "leagues": [
            {
                "country": "Germany",
                "flag": "DEU_round",
                "league": "Bundesliga",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["THW Kiel", "Barcelona"],
                        "status": "Upcoming",
                        "phase": "Jul 12, 7:00 PM",
                        "scores": [],
                        "odds": [["THW Kiel", "1.80"], ["Barcelona", "2.00"]],
                        "markets": "+18"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "Germany", "count": "4"},
            {"name": "Spain", "count": "4"}
        ]
    },
    "futsal": {
        "icon": "soccer",
        "name": "Futsal",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "FIFA Futsal World Cup",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["Brazil", "Portugal"],
                        "status": "Upcoming",
                        "phase": "Sep 20, 8:00 PM",
                        "scores": [],
                        "odds": [["Brazil", "1.55"], ["Portugal", "2.45"]],
                        "markets": "+16"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "4"}
        ]
    },
    "badminton": {
        "icon": "badminton",
        "name": "Badminton",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "BWF World Championships",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["Viktor Axelsen", "Kodai Naraoka"],
                        "status": "Upcoming",
                        "phase": "Aug 15, 3:00 PM",
                        "scores": [],
                        "odds": [["Viktor Axelsen", "1.40"], ["Kodai Naraoka", "2.85"]],
                        "markets": "+14"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "4"}
        ]
    },
    "aussie-rules": {
        "icon": "aussie-rules",
        "name": "Aussie Rules",
        "leagues": [
            {
                "country": "Australia",
                "flag": "AUS_round",
                "league": "AFL",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["Collingwood", "Carlton"],
                        "status": "Upcoming",
                        "phase": "Jul 05, 7:30 PM",
                        "scores": [],
                        "odds": [["Collingwood", "1.65"], ["Carlton", "2.25"]],
                        "markets": "+22"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "Australia", "count": "8"}
        ]
    },
    "novelties": {
        "icon": "novelties",
        "name": "Novelties",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "Special Events",
                "market": "Winner",
                "matches": [
                    {
                        "teams": ["Event A", "Event B"],
                        "status": "Upcoming",
                        "phase": "Jul 30, 8:00 PM",
                        "scores": [],
                        "odds": [["Event A", "1.50"], ["Event B", "2.50"]],
                        "markets": "+12"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "4"}
        ]
    },
    # Esports
    "cs2": {
        "icon": "cs2",
        "name": "Counter-Strike 2",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "XSE Pro League 2026",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["BIG", "Lynn Vision"],
                        "status": "LIVE",
                        "phase": "1st map: Round 28",
                        "scores": [["14", "13"], ["0", "0"]],
                        "odds": [["BIG", "1.17"], ["Lynn Vision", "4.50"]],
                        "markets": "+9"
                    },
                    {
                        "teams": ["B8", "MIBR"],
                        "status": "Upcoming",
                        "phase": "Jul 01, 12:45 PM",
                        "scores": [],
                        "odds": [["B8", "1.65"], ["MIBR", "2.15"]],
                        "markets": "+142"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "32"}
        ]
    },
    "dota2": {
        "icon": "dota2",
        "name": "Dota 2",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "Esports Nations Cup 2026",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["Great Britain", "Belgium"],
                        "status": "LIVE",
                        "phase": "3rd map",
                        "scores": [["37", "35"], ["1", "1"]],
                        "odds": [["Great Britain", "1.55"], ["Belgium", "2.40"]],
                        "markets": "+2"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "24"}
        ]
    },
    "lol": {
        "icon": "lol",
        "name": "League of Legends",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "MSI 2026",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["T1", "G2 Esports"],
                        "status": "Upcoming",
                        "phase": "Jul 05, 5:00 PM",
                        "scores": [],
                        "odds": [["T1", "1.45"], ["G2 Esports", "2.75"]],
                        "markets": "+68"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "18"}
        ]
    },
    "valorant": {
        "icon": "valorant",
        "name": "Valorant",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "VCT 2026",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["Sentinels", "Fnatic"],
                        "status": "Upcoming",
                        "phase": "Jul 10, 8:00 PM",
                        "scores": [],
                        "odds": [["Sentinels", "1.60"], ["Fnatic", "2.30"]],
                        "markets": "+42"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "16"}
        ]
    },
    "cod": {
        "icon": "cod",
        "name": "Call of Duty",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "CDL 2026",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["OpTic Texas", "Atlanta FaZe"],
                        "status": "Upcoming",
                        "phase": "Jul 15, 9:00 PM",
                        "scores": [],
                        "odds": [["OpTic Texas", "1.75"], ["Atlanta FaZe", "2.05"]],
                        "markets": "+18"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "8"}
        ]
    },
    "overwatch": {
        "icon": "overwatch",
        "name": "Overwatch",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "OWL 2026",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["Dallas Fuel", "Shock"],
                        "status": "Upcoming",
                        "phase": "Aug 01, 7:00 PM",
                        "scores": [],
                        "odds": [["Dallas Fuel", "1.85"], ["Shock", "1.95"]],
                        "markets": "+14"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "6"}
        ]
    },
    "r6": {
        "icon": "rainbowsix",
        "name": "Rainbow Six",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "Six Invitational 2026",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["Team Liquid", "w7m"],
                        "status": "Upcoming",
                        "phase": "Aug 15, 6:00 PM",
                        "scores": [],
                        "odds": [["Team Liquid", "1.70"], ["w7m", "2.15"]],
                        "markets": "+12"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "8"}
        ]
    },
    "aov": {
        "icon": "aov",
        "name": "Arena of Valor",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "AIC 2026",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["Team Flash", "Bacon Time"],
                        "status": "Upcoming",
                        "phase": "Sep 01, 5:00 PM",
                        "scores": [],
                        "odds": [["Team Flash", "1.55"], ["Bacon Time", "2.45"]],
                        "markets": "+8"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "4"}
        ]
    },
    "kog": {
        "icon": "kog",
        "name": "King of Glory",
        "leagues": [
            {
                "country": "China",
                "flag": "CHN_round",
                "league": "KPL 2026",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["Wolves", "eStarPro"],
                        "status": "Upcoming",
                        "phase": "Jul 20, 2:00 PM",
                        "scores": [],
                        "odds": [["Wolves", "1.65"], ["eStarPro", "2.25"]],
                        "markets": "+6"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "China", "count": "4"}
        ]
    },
    "efootball": {
        "icon": "fifa",
        "name": "FIFA",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "FIFAe World Cup",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["Team Brazil", "Team France"],
                        "status": "Upcoming",
                        "phase": "Aug 10, 4:00 PM",
                        "scores": [],
                        "odds": [["Team Brazil", "1.80"], ["Team France", "2.00"]],
                        "markets": "+8"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "4"}
        ]
    },
    "ebasketball": {
        "icon": "nba2k",
        "name": "NBA2K",
        "leagues": [
            {
                "country": "USA",
                "flag": "USA_round",
                "league": "NBA2K League",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["Wizards District Gaming", "T-Wolves Gaming"],
                        "status": "Upcoming",
                        "phase": "Jul 25, 8:00 PM",
                        "scores": [],
                        "odds": [["Wizards District Gaming", "1.75"], ["T-Wolves Gaming", "2.05"]],
                        "markets": "+6"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "USA", "count": "4"}
        ]
    },
    "ecricket": {
        "icon": "ecricket",
        "name": "eCricket",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "eCricket World Cup",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["India", "Australia"],
                        "status": "Upcoming",
                        "phase": "Aug 20, 3:00 PM",
                        "scores": [],
                        "odds": [["India", "1.60"], ["Australia", "2.30"]],
                        "markets": "+4"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "4"}
        ]
    },
    "cs2-duels": {
        "icon": "cs2-duels",
        "name": "CS2 Duels",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "Duel Championship",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["Player A", "Player B"],
                        "status": "Upcoming",
                        "phase": "Jul 30, 8:00 PM",
                        "scores": [],
                        "odds": [["Player A", "1.50"], ["Player B", "2.50"]],
                        "markets": "+4"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "4"}
        ]
    },
    "dota2-duels": {
        "icon": "dota2-duels",
        "name": "Dota 2 Duels",
        "leagues": [
            {
                "country": "International",
                "flag": "world",
                "league": "Duel Championship",
                "market": "Match Winner - Twoway",
                "matches": [
                    {
                        "teams": ["Player A", "Player B"],
                        "status": "Upcoming",
                        "phase": "Aug 05, 7:00 PM",
                        "scores": [],
                        "odds": [["Player A", "1.55"], ["Player B", "2.45"]],
                        "markets": "+4"
                    }
                ]
            }
        ],
        "regions": [
            {"name": "International", "count": "4"}
        ]
    }
}

# Minimal fallback for sports not explicitly defined
FALLBACK_LEAGUES = {
    "leagues": [
        {
            "country": "International",
            "flag": "world",
            "league": "Main Tournament",
            "market": "Winner",
            "matches": [
                {
                    "teams": ["Team A", "Team B"],
                    "status": "Upcoming",
                    "phase": "Jul 15, 8:00 PM",
                    "scores": [],
                    "odds": [["Team A", "1.75"], ["Team B", "2.05"]],
                    "markets": "+12"
                }
            ]
        }
    ],
    "regions": [
        {"name": "International", "count": "4"}
    ]
}


def generate_sport_page(sport_key, sport_info):
    """Generate HTML page for a single sport."""
    icon = sport_info.get("icon", sport_key)
    name = sport_info.get("name", sport_key.replace("-", " ").title())
    leagues = sport_info.get("leagues", FALLBACK_LEAGUES["leagues"])
    regions = sport_info.get("regions", FALLBACK_LEAGUES["regions"])

    # Generate match HTML
    leagues_html = ""
    for league in leagues:
        matches_html = ""
        for match in league["matches"]:
            status_badge = ""
            if match["status"] == "LIVE":
                status_badge = '<span class="tag-live">LIVE</span>'
            
            scores_html = ""
            if match["scores"]:
                scores_rows = []
                for score_row in match["scores"]:
                    scores_rows.append(f'<span>{score_row[0]}</span><span>{score_row[1]}</span>')
                scores_html = '<div class="scores">' + ''.join([f'<div class="score-row">{s}</div>' for s in scores_rows]) + '</div>'
            
            odds_html = ""
            for odd in match["odds"]:
                odds_html += f'''
                <button class="odds-button">
                    <span class="odd-name">{odd[0]}</span>
                    <span class="odd-value">{odd[1]}</span>
                </button>'''
            
            matches_html += f'''
            <div class="match-card">
                <div class="match-header">
                    <div class="match-info">
                        {status_badge}
                        <span class="match-phase">{match["phase"]}</span>
                    </div>
                    <div class="match-actions">
                        <span class="market-count">{match["markets"]}</span>
                    </div>
                </div>
                <div class="match-body">
                    <div class="teams">
                        <div class="team">
                            <div class="team-icon"></div>
                            <span>{match["teams"][0]}</span>
                        </div>
                        <div class="team">
                            <div class="team-icon"></div>
                            <span>{match["teams"][1]}</span>
                        </div>
                        {scores_html}
                    </div>
                    <div class="odds">
                        {odds_html}
                    </div>
                </div>
            </div>'''
        
        leagues_html += f'''
        <div class="league-section">
            <div class="league-header">
                <div class="league-title">
                    <span class="flag">{league["country"]}</span>
                    <span class="separator">/</span>
                    <span class="league-name">{league["league"]}</span>
                </div>
                <span class="chevron">▼</span>
            </div>
            <div class="league-body">
                <div class="market-label">{league["market"]}</div>
                {matches_html}
                <button class="load-more">Load more</button>
            </div>
        </div>'''
    
    # Generate regions HTML
    regions_html = ""
    for region in regions:
        regions_html += f'''
        <div class="region-row">
            <span class="region-name">{region["name"]}</span>
            <span class="region-count">{region["count"]}</span>
            <span class="chevron">▶</span>
        </div>'''
    
    html = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <title>{name} Betting - VIVID Sports</title>
    <meta name="theme-color" content="#000000">
    <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon/favicon-16x16.png?v=5">
    <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon/favicon-32x32.png?v=5">
    <link rel="apple-touch-icon" sizes="180x180" href="../images/favicon/apple-touch-icon.png?v=5">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #0a0a0a;
            color: #ffffff;
            min-height: 100vh;
            overflow-x: hidden;
        }}
        a {{ text-decoration: none; color: inherit; }}
        
        /* Header */
        .header {{
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 56px;
            background: #111;
            border-bottom: 1px solid #222;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            z-index: 100;
        }}
        .header-left {{ display: flex; align-items: center; gap: 12px; }}
        .back-btn {{ background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 8px; }}
        .breadcrumb {{ display: flex; align-items: center; gap: 8px; font-size: 14px; color: #999; }}
        .breadcrumb a {{ color: #999; }}
        .breadcrumb a:hover {{ color: #fff; }}
        .breadcrumb .active {{ color: #fff; font-weight: 500; }}
        .header-right {{ display: flex; align-items: center; gap: 8px; }}
        .wallet-btn {{
            background: #7c3aed;
            border: none;
            color: #fff;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
        }}
        
        /* Main Content */
        .main-content {{
            padding-top: 56px;
            max-width: 1200px;
            margin: 0 auto;
            padding-left: 16px;
            padding-right: 16px;
        }}
        
        /* Sport Header */
        .sport-header {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 0;
            border-bottom: 1px solid #222;
        }}
        .sport-title {{
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: 600;
        }}
        .sport-icon {{
            width: 32px; height: 32px;
            background: #222;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }}
        .sport-toolbar {{
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .filter-btn {{
            background: #1a1a1a;
            border: 1px solid #333;
            color: #ccc;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
        }}
        .filter-btn:hover {{ border-color: #555; }}
        
        /* Tabs */
        .tabs {{
            display: flex;
            gap: 4px;
            padding: 16px 0;
            border-bottom: 1px solid #222;
            overflow-x: auto;
        }}
        .tab {{
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            color: #999;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
        }}
        .tab:hover {{ color: #fff; }}
        .tab.active {{
            background: #1a1a1a;
            color: #fff;
            font-weight: 500;
        }}
        .tab .counter {{
            margin-left: 4px;
            font-size: 11px;
            color: #666;
        }}
        .tab .live-counter {{
            background: #ef4444;
            color: #fff;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 10px;
            margin-left: 4px;
        }}
        
        /* League Section */
        .league-section {{
            margin-bottom: 16px;
            border: 1px solid #222;
            border-radius: 12px;
            overflow: hidden;
        }}
        .league-header {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #111;
            cursor: pointer;
        }}
        .league-title {{
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
        }}
        .league-title .flag {{
            width: 20px; height: 20px;
            border-radius: 50%;
            background: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }}
        .league-title .separator {{ color: #666; }}
        .league-title .league-name {{ color: #fff; }}
        .chevron {{ color: #666; font-size: 12px; }}
        
        .league-body {{ padding: 0 16px 16px; }}
        .market-label {{
            font-size: 12px;
            color: #666;
            padding: 12px 0 8px;
            text-align: right;
        }}
        
        /* Match Card */
        .match-card {{
            background: #0f0f0f;
            border: 1px solid #222;
            border-radius: 10px;
            margin-bottom: 8px;
            overflow: hidden;
        }}
        .match-header {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            border-bottom: 1px solid #1a1a1a;
        }}
        .match-info {{
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .tag-live {{
            background: #ef4444;
            color: #fff;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
        }}
        .match-phase {{
            font-size: 13px;
            color: #888;
        }}
        .market-count {{
            font-size: 12px;
            color: #a855f7;
            font-weight: 500;
        }}
        .match-actions {{
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .match-body {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px;
        }}
        .teams {{
            display: flex;
            flex-direction: column;
            gap: 8px;
            flex: 1;
        }}
        .team {{
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }}
        .team-icon {{
            width: 20px; height: 20px;
            border-radius: 50%;
            background: #333;
        }}
        .scores {{
            display: flex;
            flex-direction: column;
            gap: 2px;
            margin-left: auto;
            margin-right: 16px;
        }}
        .score-row {{
            display: flex;
            gap: 4px;
            font-size: 13px;
            color: #fff;
        }}
        .odds {{
            display: flex;
            gap: 8px;
        }}
        .odds-button {{
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            padding: 10px 16px;
            min-width: 100px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            transition: all 0.2s;
        }}
        .odds-button:hover {{
            border-color: #7c3aed;
            background: #1f1f1f;
        }}
        .odd-name {{
            font-size: 12px;
            color: #999;
        }}
        .odd-value {{
            font-size: 15px;
            font-weight: 600;
            color: #fff;
        }}
        
        .load-more {{
            width: 100%;
            padding: 12px;
            background: transparent;
            border: none;
            color: #888;
            font-size: 14px;
            cursor: pointer;
            text-align: center;
            margin-top: 8px;
        }}
        .load-more:hover {{ color: #fff; }}
        
        /* All Sport Section */
        .all-section {{
            margin-top: 24px;
            padding-bottom: 32px;
        }}
        .all-header {{
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
        }}
        .region-row {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background: #111;
            border: 1px solid #222;
            border-radius: 8px;
            margin-bottom: 8px;
            cursor: pointer;
        }}
        .region-row:hover {{ background: #1a1a1a; }}
        .region-name {{ font-size: 14px; }}
        .region-count {{
            font-size: 12px;
            color: #666;
            background: #222;
            padding: 2px 8px;
            border-radius: 10px;
        }}
        
        /* Footer */
        .footer {{
            padding: 32px 16px;
            border-top: 1px solid #222;
            margin-top: 32px;
            text-align: center;
            color: #666;
            font-size: 12px;
        }}
        
        /* Mobile */
        @media (max-width: 768px) {{
            .match-body {{ flex-direction: column; gap: 12px; align-items: stretch; }}
            .odds {{ justify-content: stretch; }}
            .odds-button {{ flex: 1; }}
            .sport-header {{ flex-direction: column; gap: 12px; align-items: flex-start; }}
        }}
    </style>
</head>
<body>
    <header class="header">
        <div class="header-left">
            <button class="back-btn" onclick="history.back()">←</button>
            <div class="breadcrumb">
                <a href="/">Home</a>
                <span>›</span>
                <span class="active">{name}</span>
            </div>
        </div>
        <div class="header-right">
            <button class="wallet-btn">Wallet</button>
        </div>
    </header>
    
    <main class="main-content">
        <div class="sport-header">
            <div class="sport-title">
                <div class="sport-icon">🏆</div>
                <span>{name}</span>
            </div>
            <div class="sport-toolbar">
                <button class="filter-btn">Winner (incl. extra) ▼</button>
                <button class="filter-btn">Filter by Region ▼</button>
            </div>
        </div>
        
        <div class="tabs">
            <div class="tab active">Featured</div>
            <div class="tab">Upcoming</div>
            <div class="tab">Bet Live <span class="live-counter">2</span></div>
            <div class="tab">Outrights <span class="counter">4</span></div>
            <div class="tab">All {name}</div>
        </div>
        
        {leagues_html}
        
        <div class="all-section">
            <div class="all-header">
                <span>🏆</span>
                <span>All {name}</span>
            </div>
            {regions_html}
        </div>
    </main>
    
    <footer class="footer">
        <p>VIVID - The #1 Crypto Casino</p>
        <p style="margin-top:8px;">© 2026 VividBetting.com | All Rights Reserved</p>
    </footer>
</body>
</html>'''
    
    return html


def main():
    os.makedirs(SPORTS_DIR, exist_ok=True)
    
    # Get all sports from sidebar
    all_sports = [
        "american-football", "aussie-rules", "badminton", "baseball", "basketball",
        "boxing", "cricket", "darts", "formula-1", "futsal", "golf", "handball",
        "ice-hockey", "mma", "novelties", "rugby", "soccer", "table-tennis",
        "tennis", "volleyball",
        # Esports
        "aov", "cod", "cs2", "cs2-duels", "dota2", "dota2-duels", "ecricket",
        "efootball", "kog", "lol", "ebasketball", "overwatch", "r6", "valorant"
    ]
    
    created = 0
    for sport in all_sports:
        if sport in SPORTS_DATA:
            html = generate_sport_page(sport, SPORTS_DATA[sport])
        else:
            # Use fallback for any missing sports
            icon = sport.replace("-", "")
            name = sport.replace("-", " ").title()
            fallback = dict(FALLBACK_LEAGUES)
            fallback["icon"] = icon
            fallback["name"] = name
            html = generate_sport_page(sport, fallback)
        
        filepath = os.path.join(SPORTS_DIR, f"{sport}.html")
        with open(filepath, "w") as f:
            f.write(html)
        created += 1
        print(f"Created: {filepath}")
    
    print(f"\n✅ Created {created} sport pages in {SPORTS_DIR}")


if __name__ == "__main__":
    main()
