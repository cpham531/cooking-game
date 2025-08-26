// 2D drawing context, takes canvas, bar, and button from HTML
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const bar = document.getElementById("bar");
const button = document.getElementById("button");

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
        src: "ingredients/oven.jpg",
        width: 120,
        height: 120,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "pot",
        src: "ingredients/pot.jpg",
        width: 120,
        height: 120,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "pan",
        src: "ingredients/pan.jpg",
        width: 120,
        height: 120,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "mixing bowl",
        src: "ingredients/mixing bowl.webp",
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
        src: "ingredients/egg.webp",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "sugar",
        src: "ingredients/sugar.webp",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "peanut butter",
        src: "ingredients/peanut butter.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "peanut butter mix",
        src: "ingredients/peanut butter mix.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "peanut butter cookies",
        src: "ingredients/Peanut butter cookies.webp",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null
    }
];

// Starting items given to player 
const discoveredItems = [
    {
        name: "egg",
        src: "ingredients/egg.webp",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "sugar",
        src: "ingredients/sugar.webp",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null
    },
    {
        name: "peanut butter",
        src: "ingredients/peanut butter.png",
        width: 80,
        height: 80,
        x: null,
        y: null,
        dragging: false,
        image: null
    }
]

// default to be empty until player begins and discovers recipes
let draggedItems = [];
let potItems = [];
let panItems = [];
let mixingBowlItems = [{
    name: "peanut butter mix",
    src: "ingredients/peanut butter mix.png",
    width: 80,
    height: 80,
    x: null,
    y: null,
    dragging: false,
    image: null
}];
let ovenItems = [];

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
        bar.appendChild(image);
    });
}

// Controls mouse drags, declares offset to be the length between
// the x-coordinate of cursor and the padding (left and top)
addEventListener("dragstart", (event) => {
    dragged = event.target.className;
    offsetX = event.offsetX;
    offsetY = event.offsetY;
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
    }
]

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
        image: allItems.image
    }
    newItem.image = new Image();
    newItem.image.src = newItem.src;
    newItem.image.width = 80;
    newItem.image.height = 80;
    newItem.image.draggable = true;
    newItem.image.className = item.name;
    newItem.image.onload = () => {
        draggedItems.push(newItem);
        if (!discoveredItems.find((item) => {
            return item.name === newItem.name;
        })) {
            bar.appendChild(newItem.image);
            discoveredItems.push(newItem);
            mixingBowlItems.push(newItem);
        }
        drawItems();
    };
    return true;
}

preloadImages();
