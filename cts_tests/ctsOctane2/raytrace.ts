// The ray tracer code in this file is written by Adam Burmister. It
// is available in its original form from:
//
//   http://labs.nz.co/raytracer/
//
// It has been modified slightly by Google to work as a standalone
// benchmark, but the all the computational code remains
// untouched. This file also contains a copy of parts of the Prototype
// JavaScript framework which is used by the ray tracer.

//var RayTrace = new BenchmarkSuite('RayTrace', 739989, [
//  new Benchmark('RayTrace', renderScene)
//]);

// Variable used to hold a number that can be used to verify that
// the scene was ray traced correctly.

// From typescript output
function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : ((__ as any).prototype = b.prototype, new __());
}

var checkNumber:!number = 0;

function Color(this: declare Color; red:!number = 0.0, green:!number = 0.0, blue:!number= 0.0) {
    this.red = red;
    this.green = green;
    this.blue = blue;
}

function Color_add(c1:!Color, c2:!Color) {
    var result = new Color(0, 0, 0);

    result.red = c1.red + c2.red;
    result.green = c1.green + c2.green;
    result.blue = c1.blue + c2.blue;

    return result;
}

function Color_addScalar(c1:!Color, s:!number) {
    var result = new Color(0, 0, 0);

    result.red = c1.red + s;
    result.green = c1.green + s;
    result.blue = c1.blue + s;

    result.limit();

    return result;
}

function Color_subtract(c1:!Color, c2:!Color) {
    var result = new Color(0, 0, 0);

    result.red = c1.red - c2.red;
    result.green = c1.green - c2.green;
    result.blue = c1.blue - c2.blue;

    return result;
}

function Color_multiply(c1:!Color, c2:!Color) {
    var result = new Color(0, 0, 0);

    result.red = c1.red * c2.red;
    result.green = c1.green * c2.green;
    result.blue = c1.blue * c2.blue;

    return result;
}

function Color_multiplyScalar(c1:!Color, f:!number) {
    var result = new Color(0, 0, 0);

    result.red = c1.red * f;
    result.green = c1.green * f;
    result.blue = c1.blue * f;

    return result;
}


function Color_divideFactor(c1:!Color, f:!number) {
    var result = new Color(0, 0, 0);

    result.red = c1.red / f;
    result.green = c1.green / f;
    result.blue = c1.blue / f;

    return result;
}

Color.prototype.limit = function() {
    this.red = (this.red > 0.0) ? ((this.red > 1.0) ? 1.0 : this.red) : 0.0;
    this.green = (this.green > 0.0) ? ((this.green > 1.0) ? 1.0 : this.green) : 0.0;
    this.blue = (this.blue > 0.0) ? ((this.blue > 1.0) ? 1.0 : this.blue) : 0.0;
}

Color.prototype.distance = function(color:!Color) {
    var d =+( Math.abs(this.red - color.red) + Math.abs(this.green - color.green) + Math.abs(this.blue - color.blue));
    return d;
}

function Color_blend(c1:!Color, c2:!Color, w:!number) {
    var result = new Color(0, 0, 0);
    result = Color_add(
        Color_multiplyScalar(c1, 1 - w),
        Color_multiplyScalar(c2, w)
    );
    return result;
}

Color.prototype.brightness = function() {
    var r = +Math.floor(this.red * 255);
    var g = +Math.floor(this.green * 255);
    var b = +Math.floor(this.blue * 255);
    return +( (r * 77 + g * 150 + b * 29) >> 8 );
}

Color.prototype.toString = function() {
    var r = +Math.floor(this.red * 255);
    var g = +Math.floor(this.green * 255);
    var b = +Math.floor(this.blue * 255);

    return "rgb(" + r + "," + g + "," + b + ")";
}

function Light(this: declare Light; position:!Vector= null, color:!Color= null, intensity= 10.0) {
    this.position = position;
    this.color = color;
    this.intensity = intensity;
}

Light.prototype.toString = function() {
    return 'Light [' + this.position.x + ',' + this.position.y + ',' + this.position.z + ']';
}

function Vector(this: declare Vector; x:!number= 0.0, y:!number= 0.0, z:!number= 0.0) {
    this.x = x;
    this.y = y;
    this.z = y;
}

Vector.prototype.copy = function(vector:!Vector) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
}

Vector.prototype.normalize = function() {
    var m =+( this.magnitude());
    return new Vector(this.x / m, this.y / m, this.z / m);
}

Vector.prototype.magnitude = function() {
    return +Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
}

Vector.prototype.cross = function(w:!Vector) {
    return new Vector(
            -this.z * w.y + this.y * w.z,
        this.z * w.x - this.x * w.z,
            -this.y * w.x + this.x * w.y);
}

Vector.prototype.dot = function(w:!Vector) {
    return this.x * w.x + this.y * w.y + this.z * w.z;
}

function Vector_add(v:!Vector, w:!Vector) {
    return new Vector(w.x + v.x, w.y + v.y, w.z + v.z);
}

function Vector_subtract(v:!Vector, w:!Vector) {
    if (!w || !v) throw 'Vectors must be defined [' + v + ',' + w + ']';
    return new Vector(v.x - w.x, v.y - w.y, v.z - w.z);
}

function Vector_multiplyVector(v:!Vector, w:!Vector) {
    return new Vector(v.x * w.x, v.y * w.y, v.z * w.z);
}

function Vector_multiplyScalar(v:!Vector, w:!number) {
    return new Vector(v.x * w, v.y * w, v.z * w);
}

Vector.prototype.toString = function() {
    return 'Vector [' + this.x + ',' + this.y + ',' + this.z + ']';
}

function Ray(this: declare Ray; position:!Vector, direction:!Vector) {
    this.position = position;
    this.direction = direction;
}

Ray.prototype.toString = function() {
    return 'Ray [' + this.position + ',' + this.direction + ']';
}

function Scene(this: declare Scene) {
    this.camera = new Camera(
        new Vector(0, 0, -5),
        new Vector(0, 0, 1),
        new Vector(0, 1, 0)
    );
    this.shapes = new Array<any>(0);
    this.lights = new Array<any>(0);
    this.background = new Background(new Color(0, 0, 0.5), 0.2);
}

// module Material {

function BaseMaterial(this: declare BaseMaterial) {
    this.gloss = 2.0;
    this.transparency = 0.0;
    this.reflection = 0.0;
    this.refraction = 0.50;
    this.hasTexture = false;
}

BaseMaterial.prototype.getColor = function (u:!number, v:!number) : !Color {
    throw "Abstract method";
}

BaseMaterial.prototype.wrapUp = function(t:!number) {
    t = t % 2.0;
    if (t < -1) t += 2.0;
    if (t >= 1) t -= 2.0;
    return t;
}

BaseMaterial.prototype.toString = function() {
    return 'Material [gloss=' + this.gloss + ', transparency=' + this.transparency + ', hasTexture=' + this.hasTexture + ']';
}

function Solid(this: declare Solid extends BaseMaterial; color:!Color, reflection:!number, refraction:!number, transparency:!number, gloss:!number) {
    (BaseMaterial as any).call(this, gloss, transparency, reflection, refraction);
    this.color = color;
}
__extends(Solid, BaseMaterial);

Solid.prototype.getColor = function(u:!number, v:!number) : !Color {
    return this.color;
}

Solid.prototype.toString = function() {
    return 'SolidMaterial [gloss=' + this.gloss + ', transparency=' + this.transparency + ', hasTexture=' + this.hasTexture + ']';
}

function Chessboard(this: declare Chessboard extends BaseMaterial; colorEven:!Color, colorOdd:!Color, 
            reflection:!number, 
            transparency:!number, 
            gloss:!number, 
            density= 0.5) {
    (BaseMaterial as any).call(this, gloss, transparency, reflection, 0.50, true);
    this.colorOdd = colorOdd;
    this.colorEven = colorEven;
    this.density = density;
}
__extends(Chessboard, BaseMaterial);

Chessboard.prototype.getColor = function(u:!number, v:!number) : !Color {
    var t =+( this.wrapUp(u * this.density) * this.wrapUp(v * this.density));

    if (t < 0.0)
        return this.colorEven;
    else
        return this.colorOdd;
}

Chessboard.prototype.toString = function() {
    return 'ChessMaterial [gloss=' + this.gloss + ', transparency=' + this.transparency + ', hasTexture=' + this.hasTexture + ']';
}

function Shape(this: declare Shape; position:!Vector, material:!BaseMaterial) {
    this.position = position;
    this.material = material;
}

Shape.prototype.intersect = function(ray:!Ray) : !IntersectionInfo {
    throw "Abstract method";
}

function Sphere(this: declare Sphere extends Shape; position:!Vector, radius:!number, material:!BaseMaterial) {
    (Shape as any).call(this, position, material);
    this.radius = radius;
}
__extends(Sphere, Shape);

Sphere.prototype.intersect = function(ray:!Ray) : !IntersectionInfo {
    var info = new IntersectionInfo();
    info.shape = this;

    var dst = Vector_subtract(ray.position, this.position);

    var B =+( dst.dot(ray.direction));
    var C =+( dst.dot(dst) - (this.radius * this.radius));
    var D =+( (B * B) - C);

    if (D > 0) { // intersection!
        info.isHit = true;
        info.distance = (-B) - +Math.sqrt(D);
        info.position = Vector_add(
            ray.position,
            Vector_multiplyScalar(
                ray.direction,
                info.distance
            )
        );
        info.normal = Vector_subtract(
            info.position,
            this.position
        ).normalize();

        info.color = this.material.getColor(0, 0);
    } else {
        info.isHit = false;
    }
    return info;
}

Sphere.prototype.toString = function() {
    return 'Sphere [position=' + this.position + ', radius=' + this.radius + ']';
}

function Plane(this: declare Plane extends Shape; position:!Vector, d:!number, material:!BaseMaterial) {
    (Shape as any).call(this, position, material);
    this.d = d;
}
__extends(Plane, Shape);

Plane.prototype.intersect = function(ray:!Ray) : !IntersectionInfo {
    var info = new IntersectionInfo();

    var Vd = this.position.dot(ray.direction);
    if (Vd == 0) return info; // no intersection

    var t =+( -(this.position.dot(ray.position) + this.d) / Vd);
    if (t <= 0) return info;

    info.shape = this;
    info.isHit = true;
    info.position = Vector_add(
        ray.position,
        Vector_multiplyScalar(
            ray.direction,
            t
        )
    );
    info.normal = this.position;
    info.distance = t;

    if (this.material.hasTexture) {
        var vU = new Vector(this.position.y, this.position.z, -this.position.x);
        var vV = vU.cross(this.position);
        var u = info.position.dot(vU);
        var v = info.position.dot(vV);
        info.color = this.material.getColor(u, v);
    } else {
        info.color = this.material.getColor(0, 0);
    }

    return info;
}

Plane.prototype.toString = function() {
    return 'Plane [' + this.position + ', d=' + this.d + ']';
}


function IntersectionInfo(
        this: declare IntersectionInfo;
        isHit= false,
        hitCount= 0,
        shape:!Shape|!null= null,
        position:!Vector|!null= null,
        normal:!Vector|!null= null,
        color:!Color|!null= null,
        distance:!number= 2000) { 
    this.isHit = isHit;
    this.hitCount = hitCount;
    this.shape = shape;
    this.position = position;
    this.normal = normal;
    this.color = color;
    this.distance = distance;
}

IntersectionInfo.prototype.initialize = function() {
    this.color = new Color(0, 0, 0);
}

IntersectionInfo.prototype.toString = function() {
    return 'Intersection [' + this.position + ']';
}

function Camera(this: declare Camera;
        position:!Vector|!null = null,
        lookAt:!Vector|!null = null,
        up:!Vector|!null = null) {
    this.position = position;
    this.lookAt = lookAt;
    this.up = up;
    this.equator = this.lookAt.normalize().cross(this.up);
    this.screen = Vector_add(this.position, this.lookAt);
}

Camera.prototype.getRay = function(vx:!number, vy:!number) {
    var pos = Vector_subtract(
        this.screen,
        Vector_subtract(
            Vector_multiplyScalar(this.equator, vx),
            Vector_multiplyScalar(this.up, vy)
        )
    );
    pos.y = pos.y * -1;
    var dir = Vector_subtract(
        pos,
        this.position
    );

    var ray = new Ray(pos, dir.normalize());

    return ray;
}

Camera.prototype.toString = function() {
    return 'Ray []';
}

function Background(this: declare Background; color:!Color|!null= null, ambience= 0.0) {
    this.color = color;
    this.ambience = ambience;
}

function Options(
        this: declare Options; 
        canvasWidth: !number,
        canvasHeight: !number,
        pixelWidth: !number,
        pixelHeight: !number,
        renderDiffuse: !boolean,
        renderHighlights: !boolean,
        renderShadows: !boolean,
        renderReflections: !boolean,
        rayDepth: !number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;
    this.renderDiffuse = renderDiffuse;
    this.renderHighlights = renderHighlights;
    this.renderShadows = renderShadows;
    this.renderReflections = renderReflections;
    this.rayDepth = rayDepth;
}

function Engine(this: declare Engine; options:!Options) {
    this.canvas = <any> null;
    var newOptions = new Options(
        +100,
        +100,
        +2,
        +2,
        false,
        false,
        false,
        false,
        2
    );
    if (options === null || options === undefined) {
        options = newOptions;
    }
    this.options = options;

    this.options.canvasHeight /= this.options.pixelHeight;
    this.options.canvasWidth /= this.options.pixelWidth;
}

Engine.prototype.setPixel = function(x:!number, y:!number, color:!Color) {
    var pxW = this.options.pixelWidth;
    var pxH = this.options.pixelHeight;

    if (this.canvas) {
        this.canvas.fillStyle = color.toString();
        this.canvas.fillRect(x * pxW, y * pxH, pxW, pxH);
    } else {
        if (x === y) {
            checkNumber += color.brightness();
        }
        // print(x * pxW, y * pxH, pxW, pxH);
    }
}

Engine.prototype.renderScene = function(scene:!Scene, canvas) {
    checkNumber = 0;
    /* Get canvas */
    if (canvas) {
        this.canvas = <any> canvas.getContext("2d");
    } else {
        this.canvas = <any> null;
    }

    var canvasHeight:!number = this.options.canvasHeight;
    var canvasWidth:!number = this.options.canvasWidth;

    for (var y:!number = 0; y < canvasHeight; y++) {
        for (var x:!number = 0; x < canvasWidth; x++) {
            var yp = y * 1.0 / canvasHeight * 2 - 1;
            var xp = x * 1.0 / canvasWidth * 2 - 1;

            var ray = scene.camera.getRay(xp, yp);

            var color = this.getPixelColor(ray, scene);

            this.setPixel(x, y, color);
        }
    }
    if (checkNumber !== 2321) {
    // throw new Error("Scene rendered incorrectly");
    }
}

Engine.prototype.getPixelColor = function(ray:!Ray, scene:!Scene) {
    var info = this.testIntersection(ray, scene, null);
    if (info.isHit) {
        var color = this.rayTrace(info, ray, scene, 0);
        return color;
    }
    return scene.background.color;
}

Engine.prototype.testIntersection = function(ray:!Ray, scene:!Scene, exclude:!Shape) : !IntersectionInfo {
    var hits:!number = 0;
    var best = new IntersectionInfo();
    best.distance = 2000;

    for (var i = 0; i < scene.shapes.length; i++) {
        var shape = scene.shapes[i];

        if (shape != exclude) {
            var info:!IntersectionInfo = shape.intersect(ray);
            if (info.isHit && info.distance >= 0 && info.distance < best.distance) {
                best = info;
                hits++;
            }
        }
    }
    best.hitCount = hits;
    return best;
}

Engine.prototype.getReflectionRay = function(P:!Vector, N:!Vector, V:!Vector) {
    var c1:!number = -N.dot(V);
    var R1 = Vector_add(
        Vector_multiplyScalar(N, 2 * c1),
        V
    );
    return new Ray(P, R1);
}

Engine.prototype.rayTrace = function(info:!IntersectionInfo, ray:!Ray, scene:!Scene, depth:!number) {
    // Calc ambient
    var color = Color_multiplyScalar(info.color, scene.background.ambience);
    var oldColor = color;
    var shininess =+( Math.pow(10, info.shape.material.gloss + 1));

    for (var i = 0; i < scene.lights.length; i++) {
        var light:!Light = scene.lights[i];

        // Calc diffuse lighting
        var v = Vector_subtract(
            light.position,
            info.position
        ).normalize();

        if (this.options.renderDiffuse) {
            var L =+( v.dot(info.normal));
            if (L > 0.0) {
                color = Color_add(
                    color,
                    Color_multiply(
                        info.color,
                        Color_multiplyScalar(
                            light.color,
                            L
                        )
                    )
                );
            }
        }

        // The greater the depth the more accurate the colours, but
        // this is exponentially (!) expensive
        if (depth <= this.options.rayDepth) {
            // calculate reflection ray
            if (this.options.renderReflections && info.shape.material.reflection > 0) {
                var reflectionRay = this.getReflectionRay(info.position, info.normal, ray.direction);
                var refl = this.testIntersection(reflectionRay, scene, info.shape);

                if (refl.isHit && refl.distance > 0) {
                    refl.color = this.rayTrace(refl, reflectionRay, scene, depth + 1);
                } else {
                    refl.color = scene.background.color;
                }

                color = Color_blend(
                    color,
                    refl.color,
                    info.shape.material.reflection
                );
            }

            // Refraction
            /* TODO */
        }

        /* Render shadows and highlights */

        var shadowInfo = new IntersectionInfo();

        if (this.options.renderShadows) {
            var shadowRay = new Ray(info.position, v);

            shadowInfo = this.testIntersection(shadowRay, scene, info.shape);
            if (shadowInfo.isHit && shadowInfo.shape != info.shape /*&& shadowInfo.shape.type != 'PLANE'*/) {
                var vA = Color_multiplyScalar(color, 0.5);
                var dB =+( (0.5 * Math.pow(shadowInfo.shape.material.transparency, 0.5)));
                color = Color_addScalar(vA, dB);
            }
        }

        // Phong specular highlights
        if (this.options.renderHighlights && !shadowInfo.isHit && info.shape.material.gloss > 0) {
            var Lv = Vector_subtract(
                info.shape.position,
                light.position
            ).normalize();

            var E = Vector_subtract(
                scene.camera.position,
                info.shape.position
            ).normalize();

            var H = Vector_subtract(
                E,
                Lv
            ).normalize();

            var glossWeight =+( Math.pow(Math.max(info.normal.dot(H), 0), shininess));
            color = Color_add(
                Color_multiplyScalar(light.color, glossWeight),
                color
            );
        }
    }
    color.limit();
    return color;
}

function renderScene() {
    var scene = new Scene();

    scene.camera = new Camera(
        new Vector(0, 0, -15),
        new Vector(-0.2, 0, 5),
        new Vector(0, 1, 0)
    );

    scene.background = new Background(
        new Color(0.5, 0.5, 0.5),
        0.4
    );

    var sphere = new Sphere(
        new Vector(-1.5, 1.5, 2),
        1.5,
        new Solid(
            new Color(0, 0.5, 0.5),
            0.3,
            0.0,
            0.0,
            2.0
        )
    );

    var sphere1 = new Sphere(
        new Vector(1, 0.25, 1),
        0.5,
        new Solid(
            new Color(0.9, 0.9, 0.9),
            0.1,
            0.0,
            0.0,
            1.5
        )
    );

    var plane = new Plane(
        new Vector(0.1, 0.9, -0.5).normalize(),
        1.2,
        new Chessboard(
            new Color(1, 1, 1),
            new Color(0, 0, 0),
            0.2,
            0.0,
            1.0,
            0.7
        )
    );

    scene.shapes.push(plane as any);
    scene.shapes.push(sphere as any);
    scene.shapes.push(sphere1 as any);

    var light = new Light(
        new Vector(5, 10, -1),
        new Color(0.8, 0.8, 0.8)
    );

    var light1 = new Light(
        new Vector(-3, 5, -15),
        new Color(0.8, 0.8, 0.8),
        100
    );

    scene.lights.push(light as any);
    scene.lights.push(light1 as any);

    var imageWidth:!number = 100; // $F('imageWidth');
    var imageHeight:!number = 100; // $F('imageHeight');
    var pixelSize = [5,5];//"5,5".split(','); //  $F('pixelSize').split(',');
    var renderDiffuse = true; // $F('renderDiffuse');
    var renderShadows = true; // $F('renderShadows');
    var renderHighlights = true; // $F('renderHighlights');
    var renderReflections = true; // $F('renderReflections');
    var rayDepth:!number = 2;//$F('rayDepth');

    var raytracer = new Engine(
        new Options(
            imageWidth,
            imageHeight,
            pixelSize[0],
            pixelSize[1],
            renderDiffuse,
            renderHighlights,
            renderShadows,
            renderReflections,
            rayDepth
        )
    );
    raytracer.renderScene(scene, null);
}

function timeIt(f) {
    for (let i = 0; i < 10; i++) {
        f();
    }
    let timeBefore = new Date();
    for (let i = 0; i < 10; i++) {
        f();
    }
    let timeDelta = (new Date() as any) - (timeBefore as any);
    console.log("Milliseconds: " + timeDelta);
}

timeIt(renderScene);
