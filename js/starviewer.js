canvas = document.getElementById("starfield")
ctx = canvas.getContext("2d");
camx = 0;
camy = 0;
camz = -3500;
camYaw = 10.804999999999996;
camPitch = 15.224999999999996
camRoll = 25;
w = canvas.width / 2;
h = canvas.height / 2;
perspective = 500;
probPlanets = 0.0
probShowAll = true


// Define the Murmur3Hash function
function MurmurHash3(string) {
    let i = 0;
    for (i, hash = 1779033703 ^ string.length; i < string.length; i++) {
        let bitwise_xor_from_character = hash ^ string.charCodeAt(i);
        hash = Math.imul(bitwise_xor_from_character, 3432918353);
        hash = hash << 13 | hash >>> 19;
    } return () => {
        // Return the hash that you can use as a seed
        hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
        hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
        return (hash ^= hash >>> 16) >>> 0;
    }
}

function SimpleFastCounter32(seed_1, seed_2, seed_3, seed_4) {
    return () => {
        seed_1 >>>= 0; seed_2 >>>= 0; seed_3 >>>= 0; seed_4 >>>= 0;
        let cast32 = (seed_1 + seed_2) | 0;
        seed_1 = seed_2 ^ seed_2 >>> 9;
        seed_2 = seed_3 + (seed_3 << 3) | 0;
        seed_3 = (seed_3 << 21 | seed_3 >>> 11);
        seed_4 = seed_4 + 1 | 0;
        cast32 = cast32 + seed_4 | 0;
        seed_3 = seed_3 + cast32 | 0;
        return (cast32 >>> 0) / 4294967296;
    }
}

let generate_seed = MurmurHash3("String for the Seed Key");
let random_number = SimpleFastCounter32(generate_seed(), generate_seed())
console.log(random_number());



function randn_bm() {
    let u = 0, v = 0;
    while (u === 0) u = random_number(); //Converting [0,1) to (0,1)
    while (v === 0) v = random_number();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num
}


function genHexColor() {
    const hex = '9ABCDEF';
    out = ""

    for (let i = 0; i < 2; ++i) {
        out += hex.charAt(Math.floor(random_number * hex.length));
    }
    output = "#" + out + out + "00"
    return output;
}


const newShade = (hexColor, magnitude) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
        const decimalColor = parseInt(hexColor, 16);
        let r = (decimalColor >> 16) + magnitude;
        r > 255 && (r = 255);
        r < 0 && (r = 0);
        let g = (decimalColor & 0x0000ff) + magnitude;
        g > 255 && (g = 255);
        g < 0 && (g = 0);
        let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
        b > 255 && (b = 255);
        b < 0 && (b = 0);
        return `#${(g << 16 | (b << 16) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
};



document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
        zoomFlag = !zoomFlag
    }
    zoom = "Off"
    if (zoomFlag) {
        zoom = "On"
    }
    document.getElementById("zoom").innerHTML = zoom
});

document.getElementById("plantSlider").addEventListener('change', function (e) {
    probPlanets = this.value / 15000;
    document.getElementById("planets").innerHTML = probPlanets.toFixed(5)
    draw()
});

document.getElementById("justplanets").addEventListener('change', function (e) {
    probShowAll = ! this.checked;
    draw()
});


rotate = (a, b, angle) => [
    Math.cos(angle) * a - Math.sin(angle) * b,
    Math.sin(angle) * a + Math.cos(angle) * b
];

var position = {
    x: 0,
    y: 0
};


canvas.onmousedown = function (down) {
    downFlag = true;
    // Record click position
    position.x = down.clientX;
    position.y = down.clientY;
};

canvas.onmouseup = function (up) {
    downFlag = false;
};

canvas.onmousemove = function (move) {
    if (downFlag) {
        if (zoomFlag) {
            camz += -(position.y - move.clientY) * 100
            position.y = move.clientY
        } else {
            camYaw += -(position.x - move.clientX) / 200
            camPitch += -(position.y - move.clientY) / 200
            position.x = move.clientX
            position.y = move.clientY
        }
        draw()
        document.getElementById("camz").innerHTML = camz;
    }
};
var moveCam = function () {
    camPitch += .01;
    camYaw += .01;
    camRoll += .01;
    draw()
}





class Star {
    constructor(x, y, z, size, color, planets) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.size = size;
        this.color = color;
        this.planets = planets;
    }
}



stars = [];
for (i = 0; i < 15000; i += 1) {
    x = (10 - randn_bm() * 20) * randn_bm() * 180;
    y = (20 - randn_bm() * 40) * randn_bm() * 180;
    z = (20 - randn_bm() * 40) * randn_bm() * 180;
    color = [255, 255, 255]
    size = 3//randn_bm() * 10
    planets = random_number()
    stars.push(new Star(x, y, z, size, color, planets));

}
downFlag = false
zoomFlag = false

draw = function () {
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#000015"
    ctx.fill();
    points = [];
    for (i in stars) {
        x = stars[i].x;
        y = stars[i].y;
        z = stars[i].z;
        [x, z] = rotate(x, z, camYaw);
        [y, z] = rotate(y, z, camPitch);
        [x, y] = rotate(x, y, camRoll);
        x -= camx;
        y -= camy;
        z -= camz;
        color = stars[i].color;
        size = stars[i].size
        if (z > camz) {
            if (probShowAll) {
                points.push({ x, y, z, size, color });
            } else {
                if (stars[i].planets < probPlanets) {
                    points.push({ x, y, z, size, color });
                }
            }
        }
    }

    points.sort((a, b) => b.z - a.z);
    for (i in points) {
        x = points[i].x;
        y = points[i].y;
        z = points[i].z;
        color = [points[i].color[0] * (i) / points.length, points[i].color[1] * (i) / points.length, points[i].color[2] * (i) / points.length, 1.0]//(i) / points.length];



        size = points[i].size / z * perspective;
        if (size < 0.5) { size = 0.5 }
        if (z > 0) {
            X = w + x / z * perspective;
            Y = h + y / z * perspective;
            ctx.beginPath();
            ctx.arc(X, Y, size, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
            ctx.fill();
        }
    }
}

var update = function () {

    draw()
    setTimeout(function () {
        window.requestAnimationFrame(update);
    }, 0);

};

//update()
draw()