c = a.getContext("2d");
camx = 0;
camy = 0;
camz = -10;
camYaw = 10;
camPitch = 15;
camRoll = 25;
w = a.width / 2;
h = a.height / 2;
perspective = 500;

rotate = (a, b, angle) => [
    Math.cos(angle) * a - Math.sin(angle) * b,
    Math.sin(angle) * a + Math.cos(angle) * b
];
points = [];
for (i = 0; i < 3; i += 1) {
    for (j = 0; j < 3; j += 1) {
        for (k = 0; k < 3; k += 1) {
            x = (i - 1) * 2;
            y = (j - 1) * 2;
            z = (k - 1) * 2;
            xx = x
            yy = y
            zz = z
            color = "#ff0000";
            points.push({x, y, z,xx,yy,zz, color});
        }
    }
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

function genHexColor() {
    const hex = '0123456789ABCDEF';
    let output = '#';
    for (let i = 0; i < 6; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }
    return output;
}


var update = function () {
    caCanvas.clear()
    //console.log("update", count,population);
    for (let i = 0; i < population.list.length; i++) {
        population.list[rndInt(population.list.length)].dissemination()

    }
    draw();
    if (( running == true) && (count < iterations))  {
        setTimeout(function () {
            window.requestAnimationFrame(update);
        }, 0);
        count++
    }
};

setInterval(
    () => {
        a.width = a.width;
        //   camPitch += .0;
        //   camYaw += .01;
        //   camRoll += .01;

        for(let i = 0; i< points.length; i++){
            console.log(points);
            x = points[i].x
            y = points[i].y 
            z = points[i].z
            [x,z] = rotate(x,z,camYaw);
            [y,z] = rotate(y,z,camPitch);
            [x,y] = rotate(x,y,camRoll);
            x -= camx;
            y -= camy;
            z -= camz;
            points[i].xx = x 
            points[i].yy = y 
            points[i].zz = z 
        }
        points.sort((a, b) => b.zz - a.zz);
        for (i in points) {
            p = points[i]
            x = p.xx;
            y = p.yy;
            z = p.zz;
            color = newShade(p.color, z * 10);
            realSize = 0.2;
            size = realSize / z * perspective;
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
    , 16
)