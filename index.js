// 2D drawing context, takes canvas, bar, and button from HTML
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bar = document.getElementById("bar");
const tooltip = document.getElementById('custom-tooltip');

// Have the canvas take up all of window, but for height leave the bottom row to
// be for the bar
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100;

let dragged;
let offsetX;
let offsetY;
let selectedItem = null;

// Static
const supplies = [
    {
        name: "oven",
        src: "ingredients/Oven.png",
        width: 120,
        height: 120,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "pot",
        src: "ingredients/Pot.png",
        width: 120,
        height: 120,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "pan",
        src: "ingredients/Pan.png",
        width: 120,
        height: 120,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "mixing bowl",
        src: "ingredients/Bowl.png",
        width: 120,
        height: 120,
        x: null,
        y: null,
        dragging: false,
        image: null
    }
]

// All possible items, including nondiscovered
const allItems = [
    {
        name: "egg",
        src: "ingredients/Egg.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "Calories 78\nProtein 6g"
    },
    {
        name: "sugar",
        src: "ingredients/Sugar.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(100g)\nCalories 387"
    },
    {
        name: "peanut butter",
        src: "ingredients/Peanut_Butter.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(2 tbsp)\nCalories 190\nFat 16g\nProtein 8g\nCarbohydrates 7g\nFiber 3g\nSugar 2g"
    },
    {
        name: "peanut butter mix",
        src: "ingredients/Peanut_Butter_Mix.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(2 tbsp)\nCalories 210\nFat 12g\nProtein 6g\nCarbohydrates 17g\nSugar 12g\nFiber 2g"
    },
    {
        name: "peanut butter cookies",
        src: "ingredients/Peanut butter cookies.webp",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(1 cookie)\nCalories 180\nFat 10g\nProtein 4g\nCarbohydrates 18g\nSugar 14g\nFiber 1g"
    },
    {
        name: "water",
        src: "ingredients/Water.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "Calories 0"
    },
    {
        name: "rice",
        src: "ingredients/Rice.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(100g dry)\nCalories 365\nCarbohydrates 80g\nProtein 7g\nFat 0.6g"
    },
    {
        name: "cooked rice",
        src: "ingredients/Cooked_Rice.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(100g cooked)\nCalories 130\nCarbohydrates 28g\nProtein 2.7g\nFat 0.3g"
    },
    {
        name: "boiled egg",
        src: "ingredients/Boiled_Egg.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "Calories 78\nProtein 6g\nFat 5g"
    },
    {
        name: "egg mix",
        src: "ingredients/Egg_Mix.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(1 serving)\nCalories 85\nProtein 6g\nFat 6g"
    },
    {
        name: "omelette",
        src: "ingredients/Omelette.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(1 omelette)\nCalories 150\nProtein 10g\nFat 12g"
    },
    {
        name: "omurice",
        src: "ingredients/Omurice.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(1 serving)\nCalories 350\nProtein 12g\nFat 14g\nCarbohydrates 40g"
    },
    {
        name: "fried egg",
        src: "ingredients/Fried_Egg.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "Calories 90\nProtein 6g\nFat 7g"
    }
];

// Starting items given to player 
const discoveredItems = [
    {
        name: "egg",
        src: "ingredients/Egg.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "Calories 78g\nProtein 6g"
    },
    {
        name: "sugar",
        src: "ingredients/Sugar.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(100g)\nCalories 387"
    },
    {
        name: "peanut butter",
        src: "ingredients/Peanut_Butter.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(2tbsp)\nCalories 190\nFat 16g\nProtein 8g\nCarbohydrates 7g\nFiber 3g\nSugar 2g"
    },
    {
        name: "rice",
        src: "ingredients/Rice.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "(100g dry)\nCalories 365\nCarbohydrates 80g\nProtein 7g\nFat 0.6g"
    },
    {
        name: "water",
        src: "ingredients/Water.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null,
        nutrition: "Calories 0"
    }
]

// default to be empty until player begins and discovers recipes
let draggedItems = [];

// Loads supplies right at the start
function preloadImages() {
    /*
    allItems.forEach(item => {
        item.image = new Image();
        item.image.src = item.src;
        item.image.onload = () => {
            draggedItems.push(item);
            drawItems();
        };
    });
    */
    for (let i = 0; i < supplies.length; i++) {
        let item = supplies[i];
        let image = new Image();
        item.image = image;
        image.src = item.src;
        image.width = 80;
        image.height = 80;
        item.x = canvas.width - 140;
        item.y = (canvas.height / 4) * (i) + 20;
        item.image.onload = () => {
            drawItems();
        }
    }

    // As player plays, discovered items will newly appear on the bar
    discoveredItems.forEach(item => {
        let image = new Image();
        image.src = item.src;
        image.width = 80;
        image.height = 80;
        image.draggable = true;
        image.className = item.name;

        // Event: Show tooltip
        image.addEventListener('mouseenter', (e) => {
            tooltip.textContent = "Nutrition Facts\n" + item.nutrition;
            tooltip.style.display = 'block';
        });

        // Event: Move tooltip with cursor
        image.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 10) + 'px';
            tooltip.style.top = (e.clientY - 150) + 'px';
        });

        // Event: Hide tooltip
        image.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        bar.appendChild(image);
    });
}

// Controls mouse drags, declares offset to be the length between
// the x-coordinate of cursor and the padding (left and top)
addEventListener("dragstart", (event) => {
    dragged = event.target.className;
    offsetX = event.offsetX;
    offsetY = event.offsetY;
    event.dataTransfer.setData("text/plain", dragged);

});

canvas.addEventListener("dragover", (event) => {
    event.preventDefault();
});

canvas.addEventListener("drop", (event) => {
    event.preventDefault();
    if (event.target.id == "canvas") {
        let item = allItems.find((item) => {
            return item.name === dragged;
        });
        let dItem = {
            name: item.name,
            src: item.src,
            width: item.width,
            height: item.height,
            x: null,
            y: null,
            dragging: false,
            image: null
        }
        // Turns item into one that is being dragged around
        if (dItem) {
            const canvasRect = canvas.getBoundingClientRect();
            dItem.x = event.clientX - canvasRect.left - offsetX;
            dItem.y = event.clientY - canvasRect.top - offsetY;
            // old - dItem.x = event.x - dItem.width / 2
            dItem.image = new Image();
            dItem.image.src = dItem.src;
            dItem.image.onload = () => {
                draggedItems.push(dItem);
                drawItems();
                checkCombine(dItem)

            };
        }
    }
});

function drawItems() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    supplies.forEach((item) => {
        ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
    });
    draggedItems.forEach((item) => {
        if (item.image) {
            ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
        }
    });
}

canvas.addEventListener("mousedown", (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    selectedItem = draggedItems.find((item) => {
        return mouseX >= item.x && mouseX <= item.x + item.width &&
            mouseY >= item.y && mouseY <= item.y + item.height;
    });

    if (selectedItem) {
        selectedItem.dragging = true;
        canvas.addEventListener("mouseup", mouseUp);
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (selectedItem && selectedItem.dragging) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        selectedItem.x = mouseX - selectedItem.width / 2;
        selectedItem.y = mouseY - selectedItem.height / 2;
        drawItems();
    }
});

/*button.addEventListener("click", () => {
    alert("Button clicked!");
});
document.body.appendChild(button);
*/

const combinations = [
    {
        name: "peanut butter mix",
        ingredients: ["egg", "sugar", "peanut butter", "mixing bowl"]
    },
    {
        name: "peanut butter cookies",
        ingredients: ["peanut butter mix", "oven"]
    },
    {
        name: "boiled egg",
        ingredients: ["egg", "water", "pot"]
    },
    {
        name: "cooked rice",
        ingredients: ["rice", "water", "pot"]
    },
    {
        name: "egg mix",
        ingredients: ["egg", "mixing bowl"]
    },
    {
        name: "omelette",
        ingredients: ["egg mix", "pan"]
    },
    {
        name: "omurice",
        ingredients: ["cooked rice", "egg mix", "pan"]
    },
    {
        name: "fried egg",
        ingredients: ["egg", "pan"]
    }
];


function isOverlapping(x1, y1, x2, y2, width1, width2) {
    if (y1 + width1 < y2 || x1 + width1 < x2 || y2 + width2 < y1 || x2 + width2 < x1) {
        return false;
    } else {
        return true;
    }
}

function mouseUp(e) {
    if (selectedItem) {
        selectedItem.dragging = false;
        checkCombine(selectedItem);
    }
}

function checkCombine(selected) {
    const currentItems = [];
    const currentItemsNames = [];
    draggedItems.forEach((item) => {
        if (isOverlapping(selected.x, selected.y, item.x, item.y, selected.width, item.width)) {
            currentItemsNames.push(item.name);
            currentItems.push(item);
        }
        //mouseX >= item.x && mouseX <= item.x + item.width &&
        //mouseY >= item.y && mouseY <= item.y + item.height
    });

    supplies.forEach((supply) => {
        if (isOverlapping(selected.x, selected.y, supply.x, supply.y, selected.width, supply.width)) {
            currentItemsNames.push(supply.name);
            currentItems.push(supply);
        }
    });

    let result;
    for (let i = 0; i < combinations.length; i++) {
        if (combinations[i].ingredients.length === currentItems.length) {
            let match = true;
            for (let j = 0; j < combinations[i].ingredients.length; j++) {
                if (!currentItemsNames.includes(combinations[i].ingredients[j])) {
                    match = false;
                }
            }
            if (match) {
                result = combinations[i].name;
            }
        }
    }
    if (!result) {
        return false;
    }
    draggedItems = draggedItems.filter((item) => {
        return !currentItems.some((currItem) => currItem.name === item.name
            && currItem.x === item.x && currItem.y === item.y
            && !supplies.some(supply => supply.name === currItem.name));
    })
    let item = allItems.find((item) => {
        return item.name === result;
    });
    let newItem = {
        name: item.name,
        src: item.src,
        width: item.width,
        height: item.height,
        x: selected.x,
        y: selected.y,
        dragging: false,
        image: allItems.image,
        nutrition: item.nutrition
    }
    newItem.image = new Image();
    newItem.image.src = newItem.src;
    newItem.image.width = 80;
    newItem.image.height = 80;
    newItem.image.draggable = true;
    newItem.image.className = newItem.name;

    newItem.image.addEventListener('mouseenter', (e) => {
        tooltip.textContent = "Nutrition Facts\n" + newItem.nutrition;
        tooltip.style.display = 'block';
    });

    newItem.image.addEventListener('mousemove', (e) => {
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY - 150) + 'px';
    });

    newItem.image.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    newItem.image.onload = () => {
        draggedItems.push(newItem);

        if (!discoveredItems.find((item) => item.name === newItem.name)) {
            bar.appendChild(newItem.image);
            discoveredItems.push(newItem);
        }

        drawItems();
    };
    return true;
}

preloadImages();
