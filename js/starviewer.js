c = a.getContext("2d");
camx = 0;
camy = 0;
camz = -10000;
camYaw = 10;
camPitch = 15;
camRoll = 25;
w = a.width / 2;
h = a.height / 2;
perspective = 500;

function randn_bm() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num
}

document.addEventListener('keydown', function(event) {
  if (event.code == 'KeyZ' && (event.ctrlKey || event.metaKey)) {
    zoomFlag = !zoomFlag
  }
});


rotate = (a, b, angle) => [
    Math.cos(angle) * a - Math.sin(angle) * b,
    Math.sin(angle) * a + Math.cos(angle) * b
];
stars = [];
for (i = 0; i < 15000; i += 1) {
    x = (10 - randn_bm() * 20) * randn_bm()*180;
    y = (20 - randn_bm() * 40) * randn_bm()*180;
    z = (20 - randn_bm() * 40) * randn_bm()*180;
    color = "#FFFFfe"//genHexColor();
    size = 1//randn_bm() * 10
    stars.push({ x, y, z, size, color });

}
downFlag = false
zoomFlag = false
var position = {
    x: 0,
    y: 0
};

function genHexColor() {
    const hex = '9ABCDEF';
    out = ""

    for (let i = 0; i < 2; ++i) {
        out += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    output ="#"+out+out+"00"
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
        return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
        return hexColor;
    }
};
a.onmousedown = function (down) {
    console.log("down", down);
    downFlag = true;
    // Record click position
    position.x = down.clientX;
    position.y = down.clientY;
};

a.onmouseup = function (up) {
    downFlag = false;
};

a.onmousemove = function (move) {
    console.log("move", downFlag);
    if (downFlag) {
        if (zoomFlag) {
            camz += -(position.y - move.clientY) *100
            position.y = move.clientY
            console.log(camz);
        } else {
            camYaw += -(position.x - move.clientX) / 200
            camRoll += -(position.y - move.clientY) / 200
            position.x = move.clientX
            position.y = move.clientY
        }
        draw()
    }
};

000015
var moveCam = function () {
    console.log("move");
    camPitch += .01;
    camYaw += .01;
    camRoll += .01;
    draw()
}

draw = function () {
    a.width = a.width;
    c.rect(0,0,a.width,a.height)
    c.fillStyle = "#"
    c.fill();
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
        color =  stars[i].color;
        size = stars[i].size
        points.push({ x, y, z, size, color });
    }

    points.sort((a, b) => b.z - a.z);
    for (i in points) {
        x = points[i].x;
        y = points[i].y;
        z = points[i].z;
        color = newShade(points[i].color, -250 * (points.length-i)/points.length);
        
        
            
            size = points[i].size / z * perspective;
        if (size<0.5){size = 0.5}
        if (z > 0) {
            X = w + x / z * perspective;
            Y = h + y / z * perspective;
            c.beginPath();
            c.arc(X, Y, size, 0, 2 * Math.PI);
            c.fillStyle = color;
            c.fill();
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