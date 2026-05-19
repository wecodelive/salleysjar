export const menuItems = {
    categories: [
        {
            id: "small-chops",
            name: "Small Chops",
            items: [
                {
                    id: 1,
                    name: "Samosa",
                    description: "Crispy golden parcels with savoury filling.",
                    price: 250,
                    unit: "each",
                    time: 15,
                    image: "/images/samosa.png",
                },
                {
                    id: 2,
                    name: "Spring Roll",
                    description: "Crunchy rolls packed with seasoned veggies.",
                    price: 250,
                    unit: "each",
                    time: 15,
                    image: "/images/spring-roll.png",
                },
                {
                    id: 3,
                    name: "Puff Puff",
                    description: "Soft, fluffy fried dough — a Naija classic.",
                    price: 100,
                    unit: "each",
                    time: 20,
                    image: "/images/puff-puffs.png",
                },
                {
                    id: 4,
                    name: "Puff Puff Pack (10)",
                    description: "A pack of 10 freshly fried puff puff.",
                    price: 1500,
                    unit: "pack",
                    time: 25,
                    image: "/images/puff-puff-pack.png",
                },
                {
                    id: 5,
                    name: "Buns",
                    description: "Lightly sweet, deep-fried dough balls.",
                    price: 100,
                    unit: "each",
                    time: 20,
                    image: "/images/buns.png",
                },
            ],
        },
        {
            id: "proteins",
            name: "Proteins",
            items: [
                {
                    id: 6,
                    name: "Chicken",
                    description: "Tender, well-seasoned grilled chicken.",
                    price: 1500,
                    unit: "portion",
                    time: 30,
                    image: "/images/chicken.png",
                },
                {
                    id: 7,
                    name: "Stick Meat",
                    description: "Spiced beef on a skewer, grilled to perfection.",
                    price: 1000,
                    unit: "stick",
                    time: 25,
                    image: "/images/stick-meats.png",
                },
            ],
        },
        {
            id: "drinks",
            name: "Drinks",
            items: [
                {
                    id: 8,
                    name: "Zobo",
                    description: "Hibiscus, Pineapple, Watermelon, Dates",
                    time: 5,
                    image: "/images/zobo.png",
                    variants: [
                        { size: "35cl", price: 800 },
                        { size: "50cl", price: 1000 },
                    ],
                },
                {
                    id: 9,
                    name: "Chapman",
                    description: "Refreshing Nigerian cocktail with fruity zing.",
                    time: 5,
                    image: "/images/chapman.png",
                    variants: [

                        { size: "", price: 2000 },
                    ],
                },
                {
                    id: 10,
                    name: "Tapioca",
                    description: "Smooth, creamy coconut tapioca treat.",
                    time: 5,
                    image: "/images/tapioca.png",
                    variants: [

                        { size: "", price: 2000 },
                    ],
                },
            ],
        },
        {
            id: "mixes-takeaway",
            name: "Mixes & Take-home",
            items: [
                {
                    id: 11,
                    name: "Puff Puff Mix",
                    description: "Ready-to-fry mix — make puff puff at home.",
                    price: 4000,
                    unit: "pack",
                    time: null,
                    image: "/images/puff-puff-mix.png",
                },
                {
                    id: 12,
                    name: "Pancake Mix",
                    description: "Just add water — fluffy pancakes in minutes.",
                    price: 4000,
                    unit: "pack",
                    time: null,
                    image: "/images/pancake-mix.png",
                },
            ],
        },
    ],
};
