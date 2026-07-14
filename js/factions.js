const FACTIONS = [

    {
        name: "The Architects",
        description: "Masters of creation and order."
    },

    {
        name: "The Nexus",
        description: "Keepers of knowledge."
    },

    {
        name: "The Eclipse",
        description: "Operate between light and darkness."
    },

    {
        name: "The Ascendants",
        description: "Humanity evolved beyond limitation."
    },

    {
        name: "The Hollow",
        description: "Power without morality."
    },

    {
        name: "The Vanguard",
        description: "The first defenders."
    }

];

function randomFaction() {

    return FACTIONS[Math.floor(Math.random() * FACTIONS.length)];

}