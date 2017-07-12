var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
class Component {
    constructor() {
        this._entity = null;
        this.scene = null;
        this.active = true;
        this.visible = true;
        this.position = new Vector(0, 0);
    }
    get entity() { return this._entity; }
    set entity(val) {
        if (this._entity != null && val != null)
            throw "This Component is already attached to an Entity";
        this._entity = val;
    }
    get x() { return this.position.x; }
    set x(val) { this.position.x = val; }
    get y() { return this.position.y; }
    set y(val) { this.position.y = val; }
    get scenePosition() {
        return new Vector((this._entity ? this._entity.x : 0) + this.position.x, (this._entity ? this._entity.y : 0) + this.position.y);
    }
    addedToEntity() { }
    addedToScene() { }
    removedFromEntity() { }
    removedFromScene() { }
    update() { }
    render(camera) { }
    debugRender(camera) { }
}
class Color {
    constructor(r, g, b, a) {
        this.color = [0, 0, 0, 1];
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 1;
    }
    get r() { return this.color[0]; }
    set r(v) { this.color[0] = Math.min(1, Math.max(0, v)); }
    get g() { return this.color[1]; }
    set g(v) { this.color[1] = Math.min(1, Math.max(0, v)); }
    get b() { return this.color[2]; }
    set b(v) { this.color[2] = Math.min(1, Math.max(0, v)); }
    get a() { return this.color[3]; }
    set a(v) { this.color[3] = Math.min(1, Math.max(0, v)); }
    get rgba() { return this.color; }
    static fromHex(hexColor) {
        hexColor = hexColor.replace(/[^0-9A-F]/gi, '');
        const arrBuff = new ArrayBuffer(4);
        const vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hexColor, 16), false);
        const arrByte = new Uint8Array(arrBuff);
        return new Color(arrByte[1], arrByte[2], arrByte[3], 1.0);
    }
    set(r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        return this;
    }
    copy(color) {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        this.a = color.a;
        return this;
    }
    lerp(a, b, p) {
        this.r = a.r + (b.r - a.r) * p;
        this.g = a.g + (b.g - a.g) * p;
        this.b = a.b + (b.b - a.b) * p;
        this.a = a.a + (b.a - a.a) * p;
        return this;
    }
    clone() {
        return new Color().copy(this);
    }
    mult(alpha) {
        return this.set(this.r, this.g, this.b, this.a * alpha);
    }
}
Color.white = new Color(1, 1, 1, 1);
Color.black = new Color(0, 0, 0, 1);
Color.red = new Color(1, 0, 0, 1);
Color.green = new Color(0, 1, 0, 1);
Color.blue = new Color(0, 0, 1, 1);
Color.temp = new Color();
class GameWindow {
    constructor() {
        if (Engine.client == Client.Desktop) {
            var remote = require("electron").remote;
            GameWindow.browserWindow = remote.getCurrentWindow();
            GameWindow.screen = remote.screen;
        }
    }
    static get title() {
        return GameWindow.titleName;
    }
    static set title(val) {
        GameWindow.titleName = val;
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.setTitle(val);
        else
            document.title = val;
    }
    static get fullscreen() {
        return Engine.client == Client.Desktop && GameWindow.browserWindow.isFullScreen();
    }
    static set fullscreen(val) {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.setFullScreen(val);
        else
            console.warn("Can only set Fullscreen in Client.Desktop mode");
    }
    static get screenLeft() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getPosition()[0];
        else
            return Engine.graphics.canvas.getBoundingClientRect().left;
    }
    static get screenTop() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getPosition()[1];
        else
            return Engine.graphics.canvas.getBoundingClientRect().top;
    }
    static get screenWidth() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getContentSize()[0];
        else
            return Engine.graphics.canvas.getBoundingClientRect().width;
    }
    static get screenHeight() {
        if (Engine.client == Client.Desktop)
            return GameWindow.browserWindow.getContentSize()[1];
        else
            return Engine.graphics.canvas.getBoundingClientRect().height;
    }
    static resize(width, height) {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.setContentSize(width, height);
    }
    static center() {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.center();
    }
    static toggleDevTools() {
        if (Engine.client == Client.Desktop)
            GameWindow.browserWindow.toggleDevTools();
    }
    static get screenMouse() {
        if (Engine.client == Client.Desktop) {
            var pos = GameWindow.screen.getCursorScreenPoint();
            return new Vector(pos.x, pos.y);
        }
        return Mouse.absolute;
    }
}
var Client;
(function (Client) {
    Client[Client["Desktop"] = 0] = "Desktop";
    Client[Client["Web"] = 1] = "Web";
})(Client || (Client = {}));
class Engine {
    constructor() {
        this.scene = null;
        this.nextScene = null;
        this.frameCount = 0;
        if (Engine.instance != null)
            throw "Engine has already been instantiated";
        if (!Engine.started)
            throw "Engine must be instantiated through static Engine.start";
        Engine.instance = this;
        this.client = Client.Web;
        if (window && window.process && window.process.versions && window.process.versions.electron)
            this.client = Client.Desktop;
        this.startTime = Date.now();
    }
    static get root() { return Engine.instance.root; }
    static get client() { return Engine.instance.client; }
    static get scene() {
        return (Engine.instance.nextScene != null ? Engine.instance.nextScene : Engine.instance.scene);
    }
    static get width() { return Engine.instance.width; }
    static get height() { return Engine.instance.height; }
    static get debugMode() { return Engine.instance.debuggerEnabled; }
    static set debugMode(v) { Engine.instance.debuggerEnabled = v; }
    static get delta() { return Engine.instance.dt; }
    static get elapsed() { return Engine.instance.elapsed; }
    static get frameCount() { return Engine.instance.frameCount; }
    static get graphics() { return Engine.instance.graphics; }
    static get volume() { return Engine._volume; }
    static set volume(n) {
        Engine._volume = n;
        for (let i = 0; i < Sound.active.length; i++)
            Sound.active[i].volume = Sound.active[i].volume;
    }
    static get muted() { return Engine._muted; }
    static set muted(m) {
        Engine._muted = m;
        for (let i = 0; i < Sound.active.length; i++)
            Sound.active[i].muted = Sound.active[i].muted;
    }
    static start(title, width, height, scale, ready) {
        Engine.started = true;
        new Engine();
        new GameWindow();
        GameWindow.title = title;
        GameWindow.resize(width * scale, height * scale);
        GameWindow.center();
        window.onload = function () {
            var c = String.fromCharCode(0x25cf);
            Engine.instance.root = document.getElementsByTagName("body")[0];
            Collider.registerDefaultOverlapTests();
            FosterIO.init();
            Engine.instance.graphics = new Graphics(Engine.instance);
            Engine.instance.graphics.load();
            Engine.resize(width, height);
            Shaders.init();
            Mouse.init();
            Keyboard.init();
            GamepadManager.init();
            Engine.instance.step();
            if (ready != undefined)
                ready();
        };
    }
    static goto(scene, disposeLastScene) {
        let lastScene = Engine.scene;
        Engine.instance.nextScene = scene;
        Engine.instance.disposeLastScene = disposeLastScene;
        return scene;
    }
    static exit() {
        if (Engine.started && !Engine.exiting)
            Engine.instance.exit();
    }
    static resize(width, height) {
        Engine.instance.width = width;
        Engine.instance.height = height;
        Engine.instance.graphics.resize();
    }
    static assert(value, message) {
        if (!value)
            throw message;
        return value;
    }
    step() {
        var time = Date.now();
        this.elapsed = Math.floor(time - this.startTime) / 1000;
        this.dt = Math.floor(time - this.lastTime) / 1000;
        this.lastTime = time;
        this.frameCount++;
        this.graphics.update();
        Mouse.update();
        Keyboard.update();
        if (this.nextScene != null) {
            if (this.scene != null) {
                this.scene.ended();
                if (this.disposeLastScene)
                    this.scene.dispose();
            }
            this.scene = this.nextScene;
            this.nextScene = null;
            this.scene.begin();
        }
        if (this.scene != null) {
            this.scene.update();
        }
        if (this.nextScene == null) {
            this.graphics.reset();
            if (this.scene != null)
                this.scene.render();
            this.graphics.finalize();
        }
        for (let i = 0; i < Sound.active.length; i++)
            Sound.active[i].update();
        if (!Engine.exiting)
            requestAnimationFrame(this.step.bind(this));
    }
    exit() {
        Engine.exiting = true;
        Assets.unload();
        Engine.graphics.unload();
        if (Engine.client == Client.Desktop) {
            var remote = require("electron").remote;
            var win = remote.getCurrentWindow();
            win.close();
        }
    }
}
Engine.version = "0.1.11";
Engine._volume = 1;
Engine._muted = false;
Engine.instance = null;
Engine.started = false;
Engine.exiting = false;
class Scene {
    constructor() {
        this.camera = new Camera();
        this.entities = new ObjectList();
        this.renderers = new ObjectList();
        this.groups = {};
        this.colliders = {};
        this.cache = {};
        this.camera = new Camera();
        this.addRenderer(new SpriteRenderer());
    }
    begin() {
    }
    ended() {
    }
    dispose() {
        this.renderers.each((r) => r.dispose());
        this.renderers.clear();
        this.entities.each((e) => this.destroy(e));
        this.entities.clear();
        this.colliders = {};
        this.groups = {};
        this.cache = {};
    }
    update() {
        this.entities.each((e) => {
            if (!e.isStarted) {
                e.isStarted = true;
                e.started();
            }
            if (e.active && e.isStarted)
                e.update();
        });
        this.renderers.each((r) => {
            if (r.visible)
                r.update();
        });
        this.entities.clean();
        this.renderers.clean();
        for (let key in this.groups)
            this.groups[key].clean();
    }
    render() {
        this.entities.sort((a, b) => b.depth - a.depth);
        for (let key in this.groups)
            this.groups[key].sort((a, b) => b.depth - a.depth);
        this.renderers.each((r) => {
            if (r.visible)
                r.preRender();
        });
        this.renderers.each((r) => {
            if (r.visible)
                r.render();
        });
        this.renderers.each((r) => {
            if (r.visible)
                r.postRender();
        });
        if (Engine.debugMode) {
            Engine.graphics.setRenderTarget(Engine.graphics.buffer);
            Engine.graphics.shader = Shaders.primitive;
            Engine.graphics.shader.set("matrix", this.camera.matrix);
            this.entities.each((e) => {
                if (e.active)
                    e.debugRender(this.camera);
            });
        }
    }
    add(entity, position) {
        entity.scene = this;
        this.entities.add(entity);
        if (position != undefined)
            entity.position.set(position.x, position.y);
        if (!entity.isCreated) {
            entity.isCreated = true;
            entity.created();
        }
        for (let i = 0; i < entity.groups.length; i++)
            this._groupEntity(entity, entity.groups[i]);
        entity.components.each((c) => this._trackComponent(c));
        entity.added();
        return entity;
    }
    recreate(bucket) {
        if (Array.isArray(this.cache[bucket]) && this.cache[bucket].length > 0) {
            var entity = this.cache[bucket][0];
            this.cache[bucket].splice(0, 1);
            return this.add(entity);
        }
        return null;
    }
    recycle(bucket, entity) {
        this.remove(entity);
        if (this.cache[bucket] == undefined)
            this.cache[bucket] = [];
        this.cache[bucket].push(entity);
        entity.recycled();
    }
    remove(entity) {
        entity.removed();
        entity.components.each((c) => this._untrackComponent(c));
        for (let i = 0; i < entity.groups.length; i++)
            this._ungroupEntity(entity, entity.groups[i]);
        entity.isStarted = false;
        entity.scene = null;
        this.entities.remove(entity);
    }
    removeAll() {
        this.entities.each((e) => this.remove(e));
    }
    destroy(entity) {
        if (entity.scene != null)
            this.remove(entity);
        entity.destroyed();
        entity.isCreated = false;
    }
    find(className) {
        let entity = null;
        this.entities.each((e) => {
            if (e instanceof className) {
                entity = e;
                return false;
            }
        });
        return entity;
    }
    findEach(className, callback) {
        this.entities.each((e) => {
            if (e instanceof className)
                return callback(e);
        });
    }
    findAll(className) {
        let list = [];
        this.entities.each((e) => {
            if (e instanceof className)
                list.push(e);
        });
        return list;
    }
    firstInGroup(group) {
        if (this.groups[group] != undefined && this.groups[group].count > 0)
            return this.groups[group].first();
        return null;
    }
    eachInGroup(group, callback) {
        if (this.groups[group] != undefined)
            this.groups[group].each(callback);
    }
    allInGroup(group) {
        if (this.groups[group] != undefined)
            return this.groups[group];
        return null;
    }
    eachInGroups(groups, callback) {
        let stop = false;
        for (let i = 0; i < groups.length && !stop; i++) {
            this.eachInGroup(groups[i], (e) => {
                let result = callback(e);
                if (result === false)
                    stop = true;
                return result;
            });
        }
    }
    allInGroups(groups, into = null) {
        if (into == null || into == undefined)
            into = new ObjectList();
        for (let i = 0; i < groups.length; i++) {
            let list = this.allInGroup(groups[i]);
            if (list != null)
                list.each((e) => into.add(e));
        }
        return into;
    }
    firstColliderInTag(tag) {
        if (this.colliders[tag] != undefined && this.colliders[tag].length > 0)
            return this.colliders[tag];
        return null;
    }
    allCollidersInTag(tag) {
        if (this.colliders[tag] != undefined)
            return this.colliders[tag];
        return [];
    }
    addRenderer(renderer) {
        renderer.scene = this;
        this.renderers.add(renderer);
        return renderer;
    }
    removeRenderer(renderer, dispose) {
        this.renderers.remove(renderer);
        if (dispose)
            renderer.dispose();
        renderer.scene = null;
        return renderer;
    }
    _groupEntity(entity, group) {
        if (this.groups[group] == undefined)
            this.groups[group] = new ObjectList();
        this.groups[group].add(entity);
    }
    _ungroupEntity(entity, group) {
        if (this.groups[group] != undefined)
            this.groups[group].remove(entity);
    }
    _trackComponent(component) {
        if (component.entity == null || component.entity.scene != this)
            throw "Component must be added through an existing entity";
        if (component instanceof Collider) {
            for (let i = 0; i < component.tags.length; i++)
                this._trackCollider(component, component.tags[i]);
        }
        component.scene = this;
        component.addedToScene();
    }
    _untrackComponent(component) {
        component.removedFromScene();
        if (component instanceof Collider) {
            for (let i = 0; i < component.tags.length; i++)
                this._untrackCollider(component, component.tags[i]);
        }
        component.scene = null;
    }
    _trackCollider(collider, tag) {
        if (this.colliders[tag] == undefined)
            this.colliders[tag] = [];
        this.colliders[tag].push(collider);
    }
    _untrackCollider(collider, tag) {
        if (this.colliders[tag] != undefined) {
            let index = this.colliders[tag].indexOf(collider);
            if (index >= 0) {
                this.colliders[tag].splice(index, 1);
                if (this.colliders[tag].length <= 0)
                    delete this.colliders[tag];
            }
        }
    }
}
class Collider extends Component {
    constructor() {
        super(...arguments);
        this.tags = [];
    }
    tag(tag) {
        this.tags.push(tag);
        if (this.entity != null && this.entity.scene != null)
            this.entity.scene._trackCollider(this, tag);
    }
    untag(tag) {
        let index = this.tags.indexOf(tag);
        if (index >= 0) {
            this.tags.splice(index, 1);
            if (this.entity != null && this.entity.scene != null)
                this.entity.scene._untrackCollider(this, tag);
        }
    }
    check(tag, x, y) {
        return this.collide(tag, x, y) != null;
    }
    checks(tags, x, y) {
        for (let i = 0; i < tags.length; i++)
            if (this.collide(tags[i], x, y) != null)
                return true;
        return false;
    }
    collide(tag, x, y) {
        var result = null;
        var against = this.entity.scene.allCollidersInTag(tag);
        this.x += x || 0;
        this.y += y || 0;
        for (let i = 0; i < against.length; i++)
            if (Collider.overlap(this, against[i])) {
                result = against[i];
                break;
            }
        this.x -= x || 0;
        this.y -= y || 0;
        return result;
    }
    collides(tags, x, y) {
        for (let i = 0; i < tags.length; i++) {
            let hit = this.collide(tags[i], x, y);
            if (hit != null)
                return hit;
        }
        return null;
    }
    collideAll(tag, x, y) {
        var list = [];
        var against = this.entity.scene.allCollidersInTag(tag);
        this.x += x || 0;
        this.y += y || 0;
        for (let i = 0; i < against.length; i++)
            if (Collider.overlap(this, against[i]))
                list.push(against[i]);
        this.x -= x || 0;
        this.y -= y || 0;
        return list;
    }
    static registerOverlapTest(fromType, toType, test) {
        if (Collider.overlaptest[fromType.name] == undefined)
            Collider.overlaptest[fromType.name] = {};
        if (Collider.overlaptest[toType.name] == undefined)
            Collider.overlaptest[toType.name] = {};
        Collider.overlaptest[fromType.name][toType.name] = (a, b) => { return test(a, b); };
        Collider.overlaptest[toType.name][fromType.name] = (a, b) => { return test(b, a); };
    }
    static registerDefaultOverlapTests() {
        Collider.registerOverlapTest(Hitbox, Hitbox, Collider.overlap_hitbox_hitbox);
        Collider.registerOverlapTest(Hitbox, Hitgrid, Collider.overlap_hitbox_grid);
    }
    static overlap(a, b) {
        return Collider.overlaptest[a.type][b.type](a, b);
    }
    static overlap_hitbox_hitbox(a, b) {
        return a.sceneRight > b.sceneLeft && a.sceneBottom > b.sceneTop && a.sceneLeft < b.sceneRight && a.sceneTop < b.sceneBottom;
    }
    static overlap_hitbox_grid(a, b) {
        let gridPosition = b.scenePosition;
        let left = Math.floor((a.sceneLeft - gridPosition.x) / b.tileWidth);
        let top = Math.floor((a.sceneTop - gridPosition.y) / b.tileHeight);
        let right = Math.ceil((a.sceneRight - gridPosition.x) / b.tileWidth);
        let bottom = Math.ceil((a.sceneBottom - gridPosition.y) / b.tileHeight);
        for (let x = left; x < right; x++)
            for (let y = top; y < bottom; y++)
                if (b.has(x, y))
                    return true;
        return false;
    }
}
Collider.overlaptest = {};
class Hitbox extends Collider {
    get sceneLeft() { return this.scenePosition.x + this.left; }
    get sceneRight() { return this.scenePosition.x + this.left + this.width; }
    get sceneTop() { return this.scenePosition.y + this.top; }
    get sceneBottom() { return this.scenePosition.y + this.top + this.height; }
    get sceneBounds() { return new Rectangle(this.sceneLeft, this.sceneTop, this.width, this.height); }
    constructor(left, top, width, height, tags) {
        super();
        this.type = Hitbox.name;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        if (tags != undefined)
            for (let i = 0; i < tags.length; i++)
                this.tag(tags[i]);
    }
    debugRender() {
        Engine.graphics.hollowRect(this.sceneLeft, this.sceneTop, this.width, this.height, 1, Color.red);
    }
}
class Rectsprite extends Component {
    constructor(width, height, color) {
        super();
        this.size = new Vector(0, 0);
        this.scale = new Vector(1, 1);
        this.origin = new Vector(0, 0);
        this.rotation = 0;
        this.color = Color.white.clone();
        this.alpha = 1;
        this.size.x = width;
        this.size.y = height;
        this.color = color || Color.white;
    }
    get width() { return this.size.x; }
    set width(val) { this.size.x = val; }
    get height() { return this.size.y; }
    set height(val) { this.size.y = val; }
    render() {
        if (Engine.graphics.shader.sampler2d != null) {
            Engine.graphics.texture(Engine.graphics.pixel, this.scenePosition.x, this.scenePosition.y, null, Color.temp.copy(this.color).mult(this.alpha), Vector.temp0.copy(this.origin).div(this.size), Vector.temp1.copy(this.size).mult(this.scale), this.rotation);
        }
        else {
            Engine.graphics.quad(this.scenePosition.x, this.scenePosition.y, this.size.x, this.size.y, Color.temp.copy(this.color).mult(this.alpha), this.origin, this.scale, this.rotation);
        }
    }
}
class Entity {
    constructor(x, y) {
        this.position = new Vector(0, 0);
        this.visible = true;
        this.active = true;
        this.isCreated = false;
        this.isStarted = false;
        this.components = new ObjectList();
        this.groups = [];
        this._depth = 0;
        if (x !== undefined)
            this.x = x;
        if (y !== undefined)
            this.y = y;
    }
    get x() { return this.position.x; }
    set x(val) { this.position.x = val; }
    get y() { return this.position.y; }
    set y(val) { this.position.y = val; }
    get depth() {
        return this._depth;
    }
    set depth(val) {
        if (this.scene != null && this._depth != val) {
            this._depth = val;
            this.scene.entities.unsorted = true;
            for (let i = 0; i < this.groups.length; i++)
                this.scene.groups[this.groups[i]].unsorted = true;
        }
    }
    created() {
    }
    added() {
    }
    started() {
    }
    removed() {
    }
    recycled() {
    }
    destroyed() {
    }
    update() {
        this.components.each((c) => {
            if (c.active)
                c.update();
        });
    }
    render(camera) {
        this.components.each((c) => {
            if (c.visible)
                c.render(camera);
        });
    }
    debugRender(camera) {
        Engine.graphics.hollowRect(this.x - 5, this.y - 5, 10, 10, 1, Color.white);
        this.components.each((c) => {
            if (c.visible)
                c.debugRender(camera);
        });
    }
    add(component) {
        this.components.add(component);
        component.entity = this;
        component.addedToEntity();
        if (this.scene != null)
            this.scene._trackComponent(component);
        return component;
    }
    remove(component) {
        this.components.remove(component);
        component.removedFromEntity();
        component.entity = null;
        if (this.scene != null)
            this.scene._untrackComponent(component);
        return component;
    }
    removeAll() {
        for (let i = this.components.count - 1; i >= 0; i--)
            this.remove(this.components[i]);
    }
    find(className) {
        let component = null;
        this.components.each((c) => {
            if (c instanceof className) {
                component = c;
                return false;
            }
        });
        return component;
    }
    findAll(className) {
        let list = [];
        this.components.each((c) => {
            if (c instanceof className)
                list.push(c);
        });
        return list;
    }
    group(groupType) {
        this.groups.push(groupType);
        if (this.scene != null)
            this.scene._groupEntity(this, groupType);
    }
    ungroup(groupType) {
        let index = this.groups.indexOf(groupType);
        if (index >= 0) {
            this.groups.splice(index, 1);
            if (this.scene != null)
                this.scene._ungroupEntity(this, groupType);
        }
    }
    ingroup(groupType) {
        return (this.groups.indexOf(groupType) >= 0);
    }
}
define("game/health", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Health extends Component {
        constructor() {
            super(...arguments);
            this.health = 1;
            this.invincibilityTime = 1;
            this.lastHitTime = -1000;
            this.onDamage = [];
        }
        get invincible() {
            return Engine.elapsed - this.lastHitTime < this.invincibilityTime;
        }
        tryApplyDamage(source) {
            if (!this.invincible) {
                this.health -= source.amount;
                this.lastHitTime = Engine.elapsed;
                for (const cb of this.onDamage)
                    cb(source);
                return true;
            }
            return false;
        }
    }
    exports.default = Health;
});
define("game/player", ["require", "exports", "game/game", "game/health"], function (require, exports, game_1, health_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GraphicHitEffect extends Component {
        addedToScene() {
            super.addedToScene();
            this.health = this.entity.find(health_1.default);
            this.graphic = this.entity.find(Graphic);
        }
        update() {
            let visibleThisFrame = true;
            if (this.health.invincible)
                visibleThisFrame = Engine.frameCount % 2 === 0;
            this.graphic.visible = visibleThisFrame;
        }
    }
    class KnockBack extends Component {
        constructor() {
            super(...arguments);
            this.factor = 3.4;
        }
        addedToScene() {
            this.health = this.entity.find(health_1.default);
            this.physics = this.entity.find(Physics);
            this.health.onDamage.push((damager) => {
                let speed;
                {
                    const hitbox = damager.entity.find(Hitbox);
                    if (hitbox) {
                        const pt = Vector.temp0.set(hitbox.sceneLeft + hitbox.width / 2, hitbox.sceneTop + hitbox.height / 2);
                        speed = Vector.temp1.copy(this.entity.position).sub(pt).normalize().mult(100).mult(this.factor);
                    }
                }
                this.physics.speed.add(speed);
            });
        }
    }
    class Player extends Entity {
        constructor() {
            super();
            this.add(this.physics = new Physics(-4, -8, 8, 8, [game_1.default.TAGS.PLAYER], [game_1.default.TAGS.SOLID]));
            this.add(this.sprite = new Sprite("guy"));
            this.add(new health_1.default());
            this.add(new KnockBack());
            this.add(new GraphicHitEffect());
            this.sprite.play("idle");
            this.sprite.origin.set(12, 24);
            this.physics.onCollideX = () => { this.physics.speed.x = 0; };
            this.physics.onCollideY = () => { this.physics.speed.y = 0; };
        }
        update() {
            super.update();
            const friction = 200;
            let speed = 220;
            let maxSpeed = 48;
            if (Keyboard.check(game_1.default.KEYS.A)) {
                speed *= 2;
                maxSpeed *= 2;
            }
            if (Keyboard.pressed(game_1.default.KEYS.TELEPORT))
                this.position.copy(this.scene.firstInGroup("teleports").position);
            const delta = speed * Engine.delta;
            const addedSpeed = Vector.temp0.set((Keyboard.check(game_1.default.KEYS.LEFT) ? -delta : 0) +
                (Keyboard.check(game_1.default.KEYS.RIGHT) ? delta : 0), (Keyboard.check(game_1.default.KEYS.UP) ? -delta : 0) +
                (Keyboard.check(game_1.default.KEYS.DOWN) ? delta : 0));
            this.physics.speed.add(addedSpeed);
            this.physics.friction(addedSpeed.x == 0 ? friction : 0, addedSpeed.y == 0 ? friction : 0);
            this.physics.circularMaxspeed(maxSpeed);
            this.scene.camera.position.set(this.x, this.y - 5);
            const xSign = Calc.sign(this.physics.speed.x);
            if (xSign != 0)
                this.sprite.scale.x = xSign;
            this.sprite.play(this.physics.speed.length > 0 ? "run" : "idle");
        }
    }
    exports.default = Player;
});
define("game/door", ["require", "exports", "game/level", "game/game", "game/player"], function (require, exports, level_1, game_2, player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Door extends Entity {
        constructor(name, gotoScene, gotoDoor, spawnPlayer) {
            super();
            this.spawnPlayerTimer = 1;
            this.playerOn = true;
            this.isOpen = true;
            this.closedEase = 1;
            this.name = name;
            this.gotoScene = gotoScene;
            this.gotoDoor = gotoDoor;
            this.spawnPlayer = spawnPlayer;
            this.add(this.hitbbox = new Hitbox(-4, -8, 8, 8));
        }
        added() {
            if (this.spawnPlayer)
                this.scene.camera.position.set(this.x, this.y - 64);
        }
        update() {
            if (this.spawnPlayer && this.spawnPlayerTimer > 0) {
                this.spawnPlayerTimer -= Engine.delta * 1.25;
                this.scene.camera.position.set(this.x, this.y - Ease.cubeIn(this.spawnPlayerTimer) * 64);
                if (this.spawnPlayerTimer <= 0) {
                    let player;
                    this.scene.add(player = new player_1.default(), new Vector(this.x, this.y));
                    player.physics.speed.y = 120;
                    this.closedEase = 0;
                }
            }
            else {
                if (this.hitbbox.check(game_2.default.TAGS.PLAYER)) {
                    if (this.gotoScene.length > 0 && !this.playerOn) {
                        this.scene.remove(this.scene.find(player_1.default));
                        this.playerOn = true;
                        this.scene.doSlide(1, 0, () => { Engine.goto(new level_1.default(this.gotoScene, this.gotoDoor), false); });
                    }
                }
                else {
                    if (this.isOpen && this.gotoScene.length <= 0) {
                        this.hitbbox.tag(game_2.default.TAGS.SOLID);
                        this.isOpen = false;
                    }
                    this.playerOn = false;
                    if (!this.isOpen)
                        this.closedEase = Calc.approach(this.closedEase, 1, Engine.delta);
                }
            }
        }
        render() {
            Engine.graphics.rect(this.x + -6, this.y - 13, 12, 13, game_2.default.COLORS[3]);
            Engine.graphics.rect(this.x + -5, this.y - 12, 10, 12, game_2.default.COLORS[2]);
            Engine.graphics.rect(this.x + -4, this.y - 11, 8, 11, game_2.default.COLORS[3]);
            if (!this.isOpen)
                Engine.graphics.rect(this.x + -3, this.y - 10, 6, 10 * this.closedEase, game_2.default.COLORS[2]);
        }
    }
    exports.default = Door;
});
class Physics extends Hitbox {
    constructor(left, top, width, height, tags, solids) {
        super(left, top, width, height, tags);
        this.solids = [];
        this.speed = new Vector(0, 0);
        this.remainder = new Vector(0, 0);
        if (solids != undefined)
            this.solids = solids;
    }
    update() {
        if (this.speed.x != 0)
            this.moveX(this.speed.x * Engine.delta);
        if (this.speed.y != 0)
            this.moveY(this.speed.y * Engine.delta);
    }
    moveBy(amount) {
        var movedX = this.moveX(amount.x);
        var movedY = this.moveY(amount.y);
        return movedX && movedY;
    }
    move(x, y) {
        var movedX = this.moveX(x);
        var movedY = this.moveY(y);
        return movedX && movedY;
    }
    moveX(amount) {
        let moveBy = amount + this.remainder.x;
        this.remainder.x = moveBy % 1;
        moveBy -= this.remainder.x;
        return this.moveXAbsolute(moveBy);
    }
    moveXAbsolute(amount) {
        if (this.solids.length <= 0) {
            this.entity.x += Math.round(amount);
        }
        else {
            let sign = Calc.sign(amount);
            amount = Math.abs(Math.round(amount));
            while (amount > 0) {
                let hit = this.collides(this.solids, sign, 0);
                if (hit != null) {
                    this.remainder.x = 0;
                    if (this.onCollideX != null)
                        this.onCollideX(hit);
                    return false;
                }
                else {
                    this.entity.x += sign;
                    amount -= 1;
                }
            }
        }
        return true;
    }
    moveY(amount) {
        let moveBy = amount + this.remainder.y;
        this.remainder.y = moveBy % 1;
        moveBy -= this.remainder.y;
        return this.moveYAbsolute(moveBy);
    }
    moveYAbsolute(amount) {
        if (this.solids.length <= 0) {
            this.entity.y += Math.round(amount);
        }
        else {
            let sign = Calc.sign(amount);
            amount = Math.abs(Math.round(amount));
            while (amount > 0) {
                let hit = this.collides(this.solids, 0, sign);
                if (hit != null) {
                    this.remainder.y = 0;
                    if (this.onCollideY != null)
                        this.onCollideY(hit);
                    return false;
                }
                else {
                    this.entity.y += sign;
                    amount -= 1;
                }
            }
        }
        return true;
    }
    friction(fx, fy) {
        if (this.speed.x < 0)
            this.speed.x = Math.min(0, this.speed.x + fx * Engine.delta);
        else if (this.speed.x > 0)
            this.speed.x = Math.max(0, this.speed.x - fx * Engine.delta);
        if (this.speed.y < 0)
            this.speed.y = Math.min(0, this.speed.y + fy * Engine.delta);
        else if (this.speed.y > 0)
            this.speed.y = Math.max(0, this.speed.y - fy * Engine.delta);
        return this;
    }
    maxspeed(mx, my) {
        if (mx != undefined && mx != null)
            this.speed.x = Math.max(-mx, Math.min(mx, this.speed.x));
        if (my != undefined && my != null)
            this.speed.y = Math.max(-my, Math.min(my, this.speed.y));
        return this;
    }
    circularMaxspeed(length) {
        if (this.speed.length > length)
            this.speed.normalize().scale(length);
        return this;
    }
    stop() {
        this.speed.x = this.speed.y = 0;
        this.remainder.x = this.remainder.y = 0;
    }
}
define("game/pushable", ["require", "exports", "game/game"], function (require, exports, game_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Pushable extends Component {
        constructor() {
            super(...arguments);
            this.pushCounter = new Vector();
            this.threshold = 0.5;
        }
        addedToEntity() {
            const tags = [game_3.default.TAGS.SOLID];
            const collidesWith = [game_3.default.TAGS.PLAYER];
            this.entity.add(this.physics = new Physics(0, 0, 24, 24, tags, collidesWith));
            this.entity.add(this.hitbox = new Hitbox(-1, -1, 26, 26, []));
        }
        play_sound() {
            game_3.default.SOUNDS.slide_stone.play();
        }
        update() {
            super.update();
            const currentTween = this.entity.find(Tween);
            if (currentTween)
                return;
            var player = this.hitbox.collide(game_3.default.TAGS.PLAYER, undefined, undefined);
            if (!player) {
                this.pushCounter.set(0, 0);
                return;
            }
            const p = player.entity.find(Physics);
            {
                let xSign = Math.sign(p.speed.x);
                let ySign = Math.sign(p.speed.y);
                if (xSign != 0 && !this.physics.sceneBounds.overlapsVertically(p.sceneBounds))
                    xSign = 0;
                if (ySign != 0 && !this.physics.sceneBounds.overlapsHorizontally(p.sceneBounds))
                    ySign = 0;
                this.pushCounter.set(xSign == 0 ? 0 : (this.pushCounter.x + Engine.delta * xSign), ySign == 0 ? 0 : (this.pushCounter.y + Engine.delta * ySign));
            }
            const duration = .42;
            const ease = Ease.sineInOut;
            const tileSize = 24;
            const start = this.scenePosition;
            if (Math.abs(this.pushCounter.x) > this.threshold) {
                const amount = Math.sign(this.pushCounter.x) * tileSize;
                const withColliders = this.physics.collideAll(game_3.default.TAGS.SOLID, amount, 0);
                if (!this.isBlocked(withColliders)) {
                    this.play_sound();
                    Tween.create(this.entity).start(duration, start.x, start.x + amount, ease, (n) => {
                        this.physics.moveX(n - this.scenePosition.x);
                    }, true).restart();
                    this.pushCounter.x = 0;
                }
            }
            if (Math.abs(this.pushCounter.y) > this.threshold) {
                const amount = Math.sign(this.pushCounter.y) * tileSize;
                const withColliders = this.physics.collideAll(game_3.default.TAGS.SOLID, 0, amount);
                if (!this.isBlocked(withColliders)) {
                    this.play_sound();
                    Tween.create(this.entity).start(duration, start.y, start.y + amount, ease, (n) => {
                        this.physics.moveY(n - this.scenePosition.y);
                    }, true).restart();
                    this.pushCounter.y = 0;
                }
            }
        }
        isBlocked(colliders) {
            for (const c of colliders)
                if (c.entity != this.entity)
                    return true;
            return false;
        }
    }
    exports.default = Pushable;
});
define("game/level", ["require", "exports", "game/game", "game/door", "game/pushable", "game/causesdamage", "reflect-metadata"], function (require, exports, game_4, door_1, pushable_1, causesdamage_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createSpriteBanksForTileAnimations(tilesetInfo) {
        let animations = {};
        let animSpeeds = {};
        for (const [localIdString, { anim_name, anim_frame, anim_speed }] of Object.entries(tilesetInfo.tileproperties)) {
            if (anim_name && anim_frame !== undefined) {
                const localId = parseInt(localIdString, 10);
                console.assert(!isNaN(localId));
                console.assert(typeof (anim_frame) === 'number');
                if (animations[anim_name] === undefined)
                    animations[anim_name] = { frames: new Array(), speed: 2.2 };
                animations[anim_name].frames.splice(anim_frame, 0, tilesetInfo.tilemap.getTileSubtexture(localId));
                if (anim_speed !== undefined)
                    animations[anim_name].speed = anim_speed;
            }
        }
        for (const [animName, { frames, speed }] of Object.entries(animations))
            SpriteBank.create(animName)
                .add("main", speed, frames, true);
    }
    class Emitter extends Component {
        constructor({ prefab = "" }) {
            super();
            this.prefab = prefab;
        }
        emit() {
            const { x, y } = this.scenePosition;
            var e = new Entity(x, y);
            this.scene.add(instantiatePrefab(this.prefab, e));
        }
    }
    class MyComponent extends Component {
        constructor() {
            super(...arguments);
            this.siblings = {};
        }
        addedToScene() {
            for (const [name, ctor] of Object.entries(this.siblings)) {
                this[name] = this.entity.find(ctor);
            }
        }
    }
    function logType(target, key) {
        var t = Reflect.getMetadata("design:type", target, key);
        console.log(`${key} type: ${t.name}`);
    }
    function logParamTypes(target, key) {
        var types = Reflect.getMetadata("design:paramtypes", target, key);
        var s = types.map((a) => a.name).join();
        console.log(`${key} param types: ${s}`);
    }
    function logProperty(target, key) {
        var _val = this[key];
        var getter = function () {
            console.log(`Get: ${key} => ${_val}`);
            return _val;
        };
        var setter = function (newVal) {
            console.log(`Set: ${key} => ${newVal}`);
            _val = newVal;
        };
        if (delete this[key]) {
            Object.defineProperty(target, key, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            });
        }
    }
    class Mover extends MyComponent {
        constructor(delta) {
            super();
            this.delta = delta;
        }
        addedToScene() {
            this.siblings["physics"] = Physics;
            super.addedToScene();
            this.physics.speed.copy(this.delta);
        }
    }
    __decorate([
        logType,
        __metadata("design:type", Physics)
    ], Mover.prototype, "physics", void 0);
    class Trigger extends Component {
        constructor(onTrigger) {
            super();
            this.triggerEvery = 1;
            this.lastTrigger = -1;
            this.onTrigger = onTrigger;
        }
        addedToScene() {
            super.addedToScene();
            this.hitbox = this.entity.find(Hitbox);
        }
        update() {
            super.update();
            if (this.hitbox.check(game_4.default.TAGS.PLAYER)) {
                const now = Engine.elapsed;
                if (this.lastTrigger + this.triggerEvery < now) {
                    this.lastTrigger = now;
                    this.onTrigger(this);
                }
            }
        }
    }
    class SpriteAutoPlay extends Component {
        constructor(animationName) {
            super();
            this.animationName = animationName;
        }
        addedToScene() {
            this.entity.find(Sprite).play(this.animationName);
        }
    }
    const prefabs = {
        fireball: {
            sprite: () => new Sprite("fireball_red"),
            spriteAutoPlay: () => new SpriteAutoPlay("main"),
            physics: () => new Physics(6, 3, 12, 18),
            causesDamage: () => new causesdamage_1.default(),
            mover: () => new Mover(new Vector(-80, 0))
        },
        dragon: {
            sightline: () => new Hitbox(-80, 4, 80, 8),
            trigger: () => new Trigger((self) => self.entity.find(Emitter).emit()),
            emitter: () => new Emitter({ prefab: "fireball" })
        },
        eyeballs: {
            hitbox: () => new Hitbox(2, 2, 20, 20),
            causesDamage: () => new causesdamage_1.default(),
        }
    };
    function instantiatePrefab(prefabName, entity) {
        const template = prefabs[prefabName];
        if (!template)
            throw "no prefab named " + prefabName;
        for (var name in template) {
            const componentTemplate = template[name];
            if (Array.isArray(componentTemplate)) {
                const ctor = componentTemplate[0];
                const newComponent = new ctor(...componentTemplate.slice(1));
                entity.add(newComponent);
            }
            else if (typeof (componentTemplate) === "function") {
                const newComponent = componentTemplate();
                entity.add(newComponent);
            }
        }
        return entity;
    }
    class Wobble extends Component {
        constructor(graphic) {
            super();
            this.intensity = .07;
            this.frequency = 2.1;
            this.graphic = graphic;
        }
        addedToScene() {
            super.addedToScene();
            this.startPos = this.graphic.position;
        }
        update() {
            super.update();
            this.graphic.y = this.startPos.y + Math.sin(Engine.elapsed * this.frequency) * this.intensity;
        }
    }
    class Teleport extends Component {
        constructor(name) {
            super();
            this.name = name;
        }
    }
    class Level extends Scene {
        constructor(scene, entrance) {
            super();
            this.slider = 0;
            this.sliderTo = -1;
            this.loaded = false;
            this.scene = scene;
            this.entrance = entrance;
        }
        loadTiled(dirName, jsonFile, terrain) {
            const jsonPath = dirName + jsonFile;
            const level = Assets.json[jsonPath];
            if (!level)
                throw "no level at " + jsonPath;
            const tilesets = [];
            function getNumber(obj, key) {
                var val = obj[key];
                var valType = typeof (val);
                if (valType !== "number")
                    throw `expected ${key} to be a number, got ${valType}`;
                if (isNaN(val))
                    throw `expected ${key} to be a number, got NaN`;
                return val;
            }
            for (const tileset of level.tilesets) {
                const firstGid = tileset.firstgid;
                if (tileset.source !== undefined) {
                    const assetName = dirName + tileset.source;
                    var xmlTilesetInfo = Assets.xml[assetName];
                    let tilesetEl = xmlTilesetInfo['documentElement'];
                    function parseAndCheckInt(s) {
                        let n = parseInt(s, 10);
                        if (isNaN(n))
                            throw `expected a number, got ${s}`;
                        return n;
                    }
                    let getInt = (s) => parseAndCheckInt(tilesetEl.getAttribute(s));
                    const columns = getInt("columns");
                    const tilewidth = getInt("tilewidth");
                    const tileheight = getInt("tileheight");
                    const lastGid = firstGid + getInt("tilecount");
                    let imagewidth = -1;
                    let imageheight = -1;
                    let transColor;
                    let image;
                    let tilesPerRow;
                    let tileoffset = null;
                    let tileproperties = {};
                    for (let q = 0; q < tilesetEl.children.length; ++q) {
                        const child = tilesetEl.children[q];
                        switch (child.nodeName) {
                            case "image":
                                {
                                    imagewidth = parseAndCheckInt(child.getAttribute("width"));
                                    imageheight = parseAndCheckInt(child.getAttribute("height"));
                                    transColor = child.getAttribute("trans");
                                    image = child.getAttribute("source");
                                    tilesPerRow = Math.floor(imagewidth / tilewidth);
                                    break;
                                }
                            case "tileoffset":
                                {
                                    const x = parseAndCheckInt(child.getAttribute("x"));
                                    const y = parseAndCheckInt(child.getAttribute("y"));
                                    tileoffset = new Vector(x, y);
                                    break;
                                }
                            case "tile":
                                {
                                    const gid = parseAndCheckInt(child.getAttribute("id"));
                                    const type = child.getAttribute("type");
                                    if (type)
                                        tileproperties[gid] = { type };
                                    for (let k = 0; k < child.children.length; ++k) {
                                        const subChild = child.children[k];
                                        switch (subChild.nodeName) {
                                            case "properties":
                                                {
                                                    const props = tileproperties[gid] || (tileproperties[gid] = {});
                                                    for (let p = 0; p < subChild.children.length; ++p) {
                                                        const property = subChild.children[p];
                                                        console.assert(property.nodeName === "property");
                                                        const key = property.getAttribute("name");
                                                        console.assert(typeof (key) === 'string');
                                                        const val = property.getAttribute("value");
                                                        const propType = property.getAttribute("type");
                                                        switch (propType) {
                                                            case "int":
                                                                props[key] = parseInt(val, 10);
                                                                console.assert(!isNaN(props[key]));
                                                                break;
                                                            case "float":
                                                                props[key] = parseFloat(val);
                                                                console.assert(!isNaN(props[key]));
                                                                break;
                                                            case "bool":
                                                                props[key] = val.toString() === "true" ? true : false;
                                                                break;
                                                            case "string":
                                                            default:
                                                                props[key] = val.toString();
                                                                break;
                                                        }
                                                    }
                                                    break;
                                                }
                                            default:
                                                throw `unknown <tile/> child ${subChild.nodeName}`;
                                        }
                                    }
                                    break;
                                }
                            default:
                                throw `unknown node name ${child.nodeName}`;
                        }
                    }
                    const tilesetInfo = {
                        firstGid, lastGid,
                        tilewidth, tileheight,
                        tilesPerRow,
                        image,
                        tileproperties,
                        tilemap: null,
                    };
                    tilesets.push(tilesetInfo);
                }
                else {
                    const lastGid = firstGid + getNumber(tileset, "tilecount");
                    const tilesetInfo = {
                        firstGid,
                        lastGid,
                        tilewidth: tileset.tilewidth,
                        tileheight: tileset.tileheight,
                        tilesPerRow: Math.floor(tileset.imagewidth / tileset.tilewidth),
                        tileproperties: tileset.tileproperties,
                        image: tileset.image,
                        tilemap: null
                    };
                    tilesets.push(tilesetInfo);
                }
            }
            for (const tilesetInfo of tilesets) {
                const textureName = dirName + tilesetInfo.image;
                const tex = Assets.textures[textureName];
                console.assert(tex != null, `expected a texture at ${textureName}`);
                console.assert(tilesetInfo.tilewidth > 1, tilesetInfo);
                console.assert(tilesetInfo.tilewidth > 1, tilesetInfo);
                const tilemap = new Tilemap(tex, tilesetInfo.tilewidth, tilesetInfo.tileheight);
                console.assert(tilesetInfo.tilemap == null);
                tilesetInfo.tilemap = tilemap;
                terrain.add(tilemap);
                createSpriteBanksForTileAnimations(tilesetInfo);
            }
            function findTileset(gid) {
                for (const tileset of tilesets)
                    if (gid >= tileset.firstGid && gid < tileset.lastGid)
                        return tileset;
            }
            function getTileProps(gid) {
                if (gid < 1)
                    return null;
                const tileset = findTileset(gid);
                if (!tileset)
                    return null;
                const tilesetLocalId = gid - tileset.firstGid;
                const props = tileset.tileproperties != null ? tileset.tileproperties[tilesetLocalId] : undefined;
                if (!props)
                    return null;
                return props;
            }
            for (let i = 0; i < level.layers.length; i++) {
                const layer = level.layers[i];
                if (layer.name == "objects") {
                    let mapX = 0;
                    let mapY = 0;
                    let first = true;
                    for (const tile of layer.data) {
                        if (!first) {
                            if (++mapX >= layer.width) {
                                mapX = 0;
                                mapY++;
                            }
                        }
                        else {
                            first = false;
                        }
                        var props = getTileProps(tile);
                        if (!props)
                            continue;
                        if (props.pushable) {
                            let pushable;
                            const tileset = findTileset(tile);
                            this.add(pushable = new Entity(mapX * tileset.tilewidth, mapY * tileset.tileheight));
                            pushable.depth = -10;
                            pushable.add(new pushable_1.default());
                            pushable.add(new Graphic(tileset.tilemap.getTileSubtexture(tile - tileset.firstGid)));
                        }
                    }
                }
                if (layer.name === "terrain" || layer.name === "shadows" || layer.name === "corners") {
                    let tilemap = undefined;
                    let mapX = 0;
                    let mapY = 0;
                    const tiles = layer.data;
                    for (let j = 0; j < tiles.length; ++j) {
                        const tile = tiles[j];
                        if (tile !== 0) {
                            const tilesetInfo = findTileset(tile);
                            if (!tilesetInfo)
                                throw `couldn't find a tilesetInfo for tile ${tile} at (${mapX}, ${mapY}) in layer ${layer.name}`;
                            const tilemap = tilesetInfo.tilemap;
                            const tileI = tile - tilesetInfo.firstGid;
                            console.assert(tileI >= 0 && tile < tilesetInfo.lastGid);
                            const tileY = Math.floor(tileI / tilesetInfo.tilesPerRow);
                            const tileX = Math.floor(tileI % tilesetInfo.tilesPerRow);
                            tilemap.set(tileX, tileY, mapX, mapY);
                        }
                        if (++mapX >= layer.width) {
                            mapX = 0;
                            mapY++;
                        }
                    }
                }
                else if (layer.name == "entities") {
                    for (let j = 0; j < layer.objects.length; j++) {
                        const entity = layer.objects[j];
                        if (entity.type == "door") {
                            const doorName = entity.name;
                            const spawnPlayer = doorName == this.entrance;
                            this.add(new door_1.default(doorName, entity.gotoScene || "", entity.gotoDoor || "", spawnPlayer), new Vector(parseInt(entity.x), parseInt(entity.y)));
                        }
                        else if (entity.type == "teleport") {
                            const teleport = new Entity(entity.x, entity.y);
                            teleport.add(new Teleport(entity.name));
                            this.add(teleport);
                            teleport.group("teleports");
                        }
                        else {
                            const gid = entity.gid;
                            if (typeof (gid) === "number" && gid >= 1) {
                                const newEntity = new Entity(entity.x, entity.y);
                                let type;
                                var props = getTileProps(gid);
                                const tileset = findTileset(gid);
                                if (props && props.type)
                                    type = props.type;
                                newEntity.depth = -2000;
                                let mainGraphic = null;
                                let needsWobble = false;
                                if (props && props.hasShadow) {
                                    needsWobble = true;
                                    function makeShadow(tileset) {
                                        for (let localIdString in tileset.tileproperties) {
                                            const localId = parseInt(localIdString, 10);
                                            let props = tileset.tileproperties[localId];
                                            if (typeof (props.shadow) === "number") {
                                                const tex = tileset.tilemap.getTileSubtexture(localId);
                                                return new Graphic(tex);
                                            }
                                        }
                                        return null;
                                    }
                                    const shadow = makeShadow(tileset);
                                    if (shadow) {
                                        newEntity.add(shadow);
                                    }
                                }
                                if (tileset)
                                    newEntity.add(mainGraphic = new Graphic(tileset.tilemap.getTileSubtexture(gid - tileset.firstGid)));
                                if (needsWobble)
                                    newEntity.add(new Wobble(mainGraphic));
                                if (type) {
                                    instantiatePrefab(type, newEntity);
                                }
                                this.add(newEntity);
                            }
                        }
                    }
                }
                else if (layer.name == "solids") {
                    const solids = new Hitgrid(level.tilewidth, level.tileheight, [game_4.default.TAGS.SOLID]);
                    terrain.add(solids);
                    let mapX = 0, mapY = 0;
                    for (let i = 0; i < layer.data.length; ++i) {
                        if (layer.data[i] !== 0)
                            solids.set(true, mapX, mapY);
                        if (++mapX >= layer.width) {
                            mapX = 0;
                            mapY++;
                        }
                    }
                }
            }
        }
        loadOgmo(jsonPath, terrain) {
            let level = Assets.json[jsonPath];
            for (let i = 0; i < level.layers.length; i++) {
                let layer = level.layers[i];
                if (layer.name == "terrain") {
                    let tilemap = new Tilemap(Assets.atlases["gfx"].get("tilemap"), 8, 8);
                    terrain.add(tilemap);
                    let rows = layer.data.split('\n');
                    for (let y = 0; y < rows.length; y++) {
                        let x = 0;
                        let tiles = rows[y].split(',');
                        for (let j = 0; j < tiles.length - 1; j++) {
                            if (tiles[j] == "-1") {
                                x++;
                                continue;
                            }
                            let tx = tiles[j];
                            let ty = tiles[j + 1];
                            tilemap.set(parseInt(tx), parseInt(ty), x, y);
                            x++;
                            j++;
                        }
                    }
                }
                else if (layer.name == "solids") {
                    let solids = new Hitgrid(8, 8, [game_4.default.TAGS.SOLID]);
                    terrain.add(solids);
                    let rows = layer.data.split('\n');
                    for (let y = 0; y < rows.length; y++)
                        for (let x = 0; x < rows[y].length; x++)
                            if (rows[y][x] == '1')
                                solids.set(true, x, y);
                }
                else if (layer.name == "bgclouds") {
                    for (let j = 0; j < layer.entities.length; j++)
                        this.add(new Clouds(layer.entities[j].index, 10), new Vector(layer.entities[j].x, layer.entities[j].y));
                }
                else if (layer.name == "fgclouds") {
                    for (let j = 0; j < layer.entities.length; j++)
                        this.add(new Clouds(layer.entities[j].index, -10), new Vector(layer.entities[j].x, layer.entities[j].y));
                }
                else if (layer.name == "entities") {
                    for (let j = 0; j < layer.entities.length; j++) {
                        let entity = layer.entities[j];
                        if (entity.name == "door") {
                            this.add(new door_1.default(entity.doorName, entity.gotoScene, entity.gotoDoor, entity.doorName == this.entrance), new Vector(parseInt(entity.x), parseInt(entity.y)));
                        }
                    }
                }
            }
        }
        begin() {
            super.begin();
            this.loaded = false;
            const D = "fantasy/TMX/";
            new AssetLoader("assets")
                .addJson(D + "tiny.json")
                .addJson(D + "fantasy.json")
                .addJson(D + "puzzle.json")
                .addXml(D + "oryx_creatures.tsx")
                .addXml(D + "oryx_items.tsx")
                .addXml(D + "oryx_world2.tsx")
                .addTexture(D + "../oryx_world2.png", new Color(0, 0, 0, 1))
                .addTexture(D + "../oryx_world.png", new Color(0, 0, 0, 1))
                .addTexture(D + "../oryx_fx.png")
                .addTexture(D + "../oryx_creatures.png", new Color(0, 0, 0, 1))
                .addTexture(D + "../oryx_items.png")
                .load(() => {
                this.loaded = true;
                this.afterLoad();
            });
            return;
        }
        afterLoad() {
            this.camera.origin.set(Engine.width / 2, Engine.height / 2);
            this.camera.position.set(Engine.width / 2, Engine.height / 2);
            let terrain = this.add(new Entity());
            terrain.depth = 1;
            this.loadTiled("assets/fantasy/TMX/", "puzzle.json", terrain);
        }
        doSlide(from, to, onEnd) {
            this.slider = from;
            this.sliderTo = to;
            this.sliderOnEnd = onEnd;
        }
        update() {
            super.update();
            if (Keyboard.pressed(game_4.default.KEYS.SELECT))
                Engine.debugMode = !Engine.debugMode;
            if (this.slider != this.sliderTo) {
                this.slider = Calc.approach(this.slider, this.sliderTo, Engine.delta * 1.5);
                if (this.slider == this.sliderTo && this.sliderOnEnd != undefined && this.sliderOnEnd != null)
                    this.sliderOnEnd();
            }
            if (!this.loaded)
                return;
            if (this.dust)
                this.dust.burst(this.camera.position.x - Engine.width, this.camera.position.y - Engine.height + Math.random() * Engine.height * 2, 0);
        }
        render() {
            super.render();
            if (this.slider > -1 || this.slider < 1) {
                let color = game_4.default.COLORS[0];
                let px = this.camera.position.x + Ease.cubeInOut(this.slider) * (Engine.width + 32);
                let py = this.camera.position.y - Engine.height / 2;
                let left = px - Engine.width / 2;
                let right = px + Engine.width / 2;
                Engine.graphics.setRenderTarget(Engine.graphics.buffer);
                Engine.graphics.shader = Shaders.texture;
                Engine.graphics.shader.set("matrix", this.camera.matrix);
                Engine.graphics.rect(left - 1, py, Engine.width + 2, Engine.height, color);
                Engine.graphics.triangle(new Vector(left, py), new Vector(left - 32, py + Engine.height), new Vector(left, py + Engine.height), color);
                Engine.graphics.triangle(new Vector(right, py), new Vector(right + 32, py), new Vector(right, py + Engine.height), color);
            }
        }
    }
    exports.default = Level;
});
define("game/game", ["require", "exports", "game/level"], function (require, exports, level_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Game {
        static start() {
            const zoom = 1.2;
            Engine.start("test", 160 * zoom, 144 * zoom, 5, () => { Game.load(); });
        }
        static load() {
            Engine.graphics.clearColor = Game.COLORS[0].clone();
            Keyboard.map(Game.KEYS.LEFT, [Key.left, Key.a, Key.j]);
            Keyboard.map(Game.KEYS.RIGHT, [Key.right, Key.d, Key.l]);
            Keyboard.map(Game.KEYS.UP, [Key.up, Key.w, Key.i]);
            Keyboard.map(Game.KEYS.DOWN, [Key.down, Key.s, Key.k]);
            Keyboard.map(Game.KEYS.A, [Key.z, Key.c]);
            Keyboard.map(Game.KEYS.B, [Key.x, Key.v]);
            Keyboard.map(Game.KEYS.START, [Key.enter]);
            Keyboard.map(Game.KEYS.SELECT, [Key.shift]);
            Keyboard.map(Game.KEYS.TELEPORT, [Key.t]);
            let template = new ParticleTemplate("dust");
            template.accelX(120, 40);
            template.accelY(-20, 10);
            template.colors([Game.COLORS[0]]);
            template.duration(12);
            template.scale(1, 0);
            var assets = new AssetLoader("assets")
                .addAtlas("gfx", "atlas.png", "atlas.json", AtlasReaders.Aseprite)
                .addAtlas("sprites", "sprites/atlas.png", "sprites/atlas.json", AtlasReaders.Aseprite)
                .addAtlas("guy_idle", "sprites/guy_idle.png", "sprites/guy_idle.json", AtlasReaders.DoodleStudio)
                .addAtlas("guy_walk", "sprites/guy_walk.png", "sprites/guy_walk.json", AtlasReaders.DoodleStudio)
                .addJson("scenes/bottom.json")
                .addJson("scenes/bottom2.json")
                .addSound("slide_stone", "sounds/168821__debsound__stone-door-004.wav")
                .load(() => { Game.begin(); });
        }
        static begin() {
            Engine.graphics.clearColor = Game.COLORS[3].clone();
            Engine.graphics.pixel = Assets.atlases["gfx"].get("pixel");
            SpriteBank.create("player")
                .add("idle", 10, Assets.atlases['sprites'].find("player_idle"), true)
                .add("run", 10, Assets.atlases['sprites'].find("player_run"), true);
            SpriteBank.create("guy")
                .add("idle", 6, Assets.atlases["guy_idle"].find("main"), true)
                .add("run", 10, Assets.atlases["guy_walk"].find("main"), true);
            Game.SOUNDS.slide_stone = new Sound("slide_stone");
            Game.SOUNDS.slide_stone.volume = .2;
            Engine.goto(new level_2.default("bottom", "start"), false);
        }
    }
    Game.TAGS = {
        PLAYER: "player",
        SOLID: "solid"
    };
    Game.KEYS = {
        LEFT: "left",
        RIGHT: "right",
        UP: "up",
        DOWN: "down",
        A: "a",
        B: "b",
        START: "start",
        SELECT: "select",
        TELEPORT: "teleport",
    };
    Game.SOUNDS = {};
    Game.COLORS = [
        new Color(155 / 255, 188 / 255, 15 / 255, 1),
        new Color(139 / 255, 172 / 255, 15 / 255, 1),
        new Color(48 / 255, 98 / 255, 48 / 255, 1),
        new Color(15 / 255, 56 / 255, 15 / 255, 1)
    ];
    exports.default = Game;
});
define("game/causesdamage", ["require", "exports", "game/game", "game/health"], function (require, exports, game_5, health_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CausesDamage extends Component {
        constructor() {
            super(...arguments);
            this.amount = .1;
        }
        addedToScene() {
            super.addedToScene();
            this.hitbox = this.entity.find(Hitbox);
        }
        update() {
            super.update();
            for (let collider of this.hitbox.collideAll(game_5.default.TAGS.PLAYER)) {
                var health = collider.entity.find(health_2.default);
                if (health)
                    health.tryApplyDamage(this);
            }
        }
    }
    exports.default = CausesDamage;
});
class Clouds extends Entity {
    constructor(index, depth) {
        super();
        this.add(this.sprite = new Graphic(Assets.atlases["gfx"].get("clouds " + index)));
        this.sprite.origin.set(this.sprite.width / 2, this.sprite.height / 2);
        this.depth = depth;
        this.timerY = Math.random() * Math.PI * 2;
        this.timerX = Math.random() * Math.PI * 2;
    }
    update() {
        this.timerY += Engine.delta;
        this.timerX += Engine.delta;
        this.sprite.x = Math.sin(this.timerX * 2) * 4;
        this.sprite.y = Math.sin(this.timerY) * 2;
    }
}
var ResolutionStyle;
(function (ResolutionStyle) {
    ResolutionStyle[ResolutionStyle["None"] = 0] = "None";
    ResolutionStyle[ResolutionStyle["Exact"] = 1] = "Exact";
    ResolutionStyle[ResolutionStyle["Contain"] = 2] = "Contain";
    ResolutionStyle[ResolutionStyle["ContainInteger"] = 3] = "ContainInteger";
    ResolutionStyle[ResolutionStyle["Fill"] = 4] = "Fill";
    ResolutionStyle[ResolutionStyle["FillInteger"] = 5] = "FillInteger";
})(ResolutionStyle || (ResolutionStyle = {}));
class BlendMode {
    constructor(source, dest) { this.source = source; this.dest = dest; }
}
class BlendModes {
}
class Graphics {
    constructor(engine) {
        this.resolutionStyle = ResolutionStyle.Contain;
        this.borderColor = Color.black.clone();
        this.clearColor = new Color(0.1, 0.1, 0.3, 1);
        this.vertices = [];
        this.texcoords = [];
        this.colors = [];
        this.currentTarget = null;
        this.currentShader = null;
        this.nextShader = null;
        this.currentBlendmode = null;
        this.nextBlendmode = null;
        this.orthographic = new Matrix();
        this.toscreen = new Matrix();
        this._pixel = null;
        this._pixelUVs = [new Vector(0, 0), new Vector(1, 0), new Vector(1, 1), new Vector(0, 1)];
        this._defaultPixel = null;
        this.drawCalls = 0;
        this.topleft = new Vector();
        this.topright = new Vector();
        this.botleft = new Vector();
        this.botright = new Vector();
        this.texToDraw = new Texture(null, new Rectangle(), new Rectangle());
        this.engine = engine;
        this.canvas = document.createElement("canvas");
        this.gl = this.canvas.getContext('experimental-webgl', {
            alpha: false,
            antialias: false
        });
        Engine.root.appendChild(this.canvas);
        this.gl.enable(this.gl.BLEND);
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        BlendModes.normal = new BlendMode(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        BlendModes.add = new BlendMode(this.gl.ONE, this.gl.DST_ALPHA);
        BlendModes.multiply = new BlendMode(this.gl.DST_COLOR, this.gl.ONE_MINUS_SRC_ALPHA);
        BlendModes.screen = new BlendMode(this.gl.ONE, this.gl.ONE_MINUS_SRC_COLOR);
        this.currentBlendmode = BlendModes.normal;
        this.vertexBuffer = this.gl.createBuffer();
        this.texcoordBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
    }
    get shader() {
        if (this.nextShader != null)
            return this.nextShader;
        return this.currentShader;
    }
    set shader(s) {
        if (this.shader != s && s != null)
            this.nextShader = s;
    }
    get blendmode() {
        if (this.nextBlendmode != null)
            return this.nextBlendmode;
        return this.currentBlendmode;
    }
    set blendmode(bm) {
        if (this.currentBlendmode != bm && bm != null)
            this.nextBlendmode = bm;
    }
    set pixel(p) {
        if (p == null)
            p = this._defaultPixel;
        let minX = p.bounds.left / p.texture.width;
        let minY = p.bounds.top / p.texture.height;
        let maxX = p.bounds.right / p.texture.width;
        let maxY = p.bounds.bottom / p.texture.height;
        this._pixel = p;
        this._pixelUVs =
            [
                new Vector(minX, minY),
                new Vector(maxX, minY),
                new Vector(maxX, maxY),
                new Vector(minX, maxY)
            ];
    }
    get pixel() { return this._pixel; }
    load() {
        this.pixel = this._defaultPixel = Texture.createFromData([1, 1, 1, 1], 1, 1);
    }
    unload() {
        this._defaultPixel.dispose();
        this.gl.deleteBuffer(this.vertexBuffer);
        this.gl.deleteBuffer(this.colorBuffer);
        this.gl.deleteBuffer(this.texcoordBuffer);
        this.buffer.dispose();
        this.buffer = null;
        this.canvas.remove();
        this.canvas = null;
    }
    resize() {
        if (this.buffer != null)
            this.buffer.dispose();
        this.buffer = RenderTarget.create(Engine.width, Engine.height);
        this.orthographic
            .identity()
            .translate(-1, 1)
            .scale(1 / this.buffer.width * 2, -1 / this.buffer.height * 2);
    }
    update() {
        if (this.canvas.width != Engine.root.clientWidth || this.canvas.height != Engine.root.clientHeight) {
            this.canvas.width = Engine.root.clientWidth;
            this.canvas.height = Engine.root.clientHeight;
        }
    }
    getOutputBounds() {
        let scaleX = 1;
        let scaleY = 1;
        if (this.resolutionStyle == ResolutionStyle.Exact) {
            scaleX = this.canvas.width / this.buffer.width;
            scaleY = this.canvas.height / this.buffer.height;
        }
        else if (this.resolutionStyle == ResolutionStyle.Contain) {
            scaleX = scaleY = (Math.min(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        else if (this.resolutionStyle == ResolutionStyle.ContainInteger) {
            scaleX = scaleY = Math.floor(Math.min(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        else if (this.resolutionStyle == ResolutionStyle.Fill) {
            scaleX = scaleY = (Math.max(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        else if (this.resolutionStyle == ResolutionStyle.FillInteger) {
            scaleX = scaleY = Math.ceil(Math.max(this.canvas.width / this.buffer.width, this.canvas.height / this.buffer.height));
        }
        let width = this.buffer.width * scaleX;
        let height = this.buffer.height * scaleY;
        return new Rectangle((this.canvas.width - width) / 2, (this.canvas.height - height) / 2, width, height);
    }
    clear(color) {
        this.gl.clearColor(color.r, color.g, color.b, color.a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
    reset() {
        this.drawCalls = 0;
        this.currentShader = null;
        this.nextShader = null;
        this.vertices = [];
        this.colors = [];
        this.texcoords = [];
        this.setRenderTarget(this.buffer);
        this.clear(this.clearColor);
    }
    setRenderTarget(target) {
        if (this.currentTarget != target) {
            this.flush();
            if (target == null) {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
            else {
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, target.frameBuffer);
                this.gl.viewport(0, 0, target.width, target.height);
            }
            this.currentTarget = target;
        }
    }
    setShaderTexture(tex) {
        if (Engine.assert(this.shader.sampler2d != null, "This shader has no Sampler2D to set the texture to"))
            this.shader.sampler2d.value = tex.texture.webGLTexture;
    }
    checkState() {
        if (this.nextShader != null || this.currentShader.dirty || this.nextBlendmode != null) {
            if (this.currentShader != null)
                this.flush();
            let swapped = (this.nextShader != null);
            if (swapped) {
                if (this.currentShader != null)
                    for (let i = 0; i < this.currentShader.attributes.length; i++)
                        this.gl.disableVertexAttribArray(this.currentShader.attributes[i].attribute);
                this.currentShader = this.nextShader;
                this.nextShader = null;
                this.gl.useProgram(this.currentShader.program);
                for (let i = 0; i < this.currentShader.attributes.length; i++)
                    this.gl.enableVertexAttribArray(this.currentShader.attributes[i].attribute);
            }
            if (this.nextBlendmode != null) {
                this.currentBlendmode = this.nextBlendmode;
                this.nextBlendmode = null;
                this.gl.blendFunc(this.currentBlendmode.source, this.currentBlendmode.dest);
            }
            let textureCounter = 0;
            for (let i = 0; i < this.currentShader.uniforms.length; i++) {
                let uniform = this.currentShader.uniforms[i];
                let location = uniform.uniform;
                if (swapped || uniform.dirty) {
                    if (uniform.type == ShaderUniformType.sampler2D) {
                        this.gl.activeTexture(this.gl["TEXTURE" + textureCounter]);
                        if (uniform.value instanceof Texture)
                            this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value.texture.webGLTexture);
                        else if (uniform.value instanceof RenderTarget)
                            this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value.texture.webGLTexture);
                        else
                            this.gl.bindTexture(this.gl.TEXTURE_2D, uniform.value);
                        this.gl.uniform1i(location, textureCounter);
                        textureCounter += 1;
                    }
                    else {
                        setGLUniformValue[uniform.type](this.gl, uniform.uniform, uniform.value);
                    }
                    uniform.dirty = false;
                }
            }
            this.currentShader.dirty = false;
        }
    }
    flush() {
        if (this.vertices.length > 0) {
            for (let i = 0; i < this.currentShader.attributes.length; i++) {
                let attr = this.currentShader.attributes[i];
                if (attr.type == ShaderAttributeType.Position) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.vertexBuffer : this.currentTarget.vertexBuffer));
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attr.attribute, 2, this.gl.FLOAT, false, 0, 0);
                }
                else if (attr.type == ShaderAttributeType.Texcoord) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.texcoordBuffer : this.currentTarget.texcoordBuffer));
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texcoords), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attr.attribute, 2, this.gl.FLOAT, false, 0, 0);
                }
                else if (attr.type == ShaderAttributeType.Color) {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, (this.currentTarget == null ? this.colorBuffer : this.currentTarget.colorBuffer));
                    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
                    this.gl.vertexAttribPointer(attr.attribute, 4, this.gl.FLOAT, false, 0, 0);
                }
            }
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 2);
            this.drawCalls++;
            this.vertices = [];
            this.texcoords = [];
            this.colors = [];
        }
    }
    finalize() {
        this.setRenderTarget(null);
        this.clear(this.borderColor);
        this.toscreen
            .identity()
            .translate(-1, -1)
            .scale(1 / this.canvas.width * 2, 1 / this.canvas.height * 2);
        this.shader = Shaders.texture;
        this.shader.sampler2d.value = this.buffer.texture.webGLTexture;
        this.shader.set("matrix", this.toscreen);
        let bounds = this.getOutputBounds();
        this.push(bounds.left, bounds.top, 0, 0, Color.white);
        this.push(bounds.right, bounds.top, 1, 0, Color.white);
        this.push(bounds.right, bounds.bottom, 1, 1, Color.white);
        this.push(bounds.left, bounds.top, 0, 0, Color.white);
        this.push(bounds.right, bounds.bottom, 1, 1, Color.white);
        this.push(bounds.left, bounds.bottom, 0, 1, Color.white);
        this.flush();
    }
    push(x, y, u, v, color) {
        this.checkState();
        this.vertices.push(x, y);
        this.texcoords.push(u, v);
        if (color != undefined && color != null)
            this.colors.push(color.r, color.g, color.b, color.a);
    }
    pushUnsafe(x, y, u, v, color) {
        this.vertices.push(x, y);
        this.texcoords.push(u, v);
        if (color != undefined && color != null)
            this.colors.push(color.r, color.g, color.b, color.a);
    }
    pushList(pos, uv, color) {
        this.checkState();
        for (let i = 0; i < pos.length; i++) {
            this.vertices.push(pos[i].x, pos[i].y);
            if (uv != undefined && uv != null)
                this.texcoords.push(uv[i].x, uv[i].y);
            if (color != undefined && color != null) {
                let c = color[i];
                this.colors.push(c.r, c.g, c.b, c.a);
            }
        }
    }
    texture(tex, posX, posY, crop, color, origin, scale, rotation, flipX, flipY) {
        this.setShaderTexture(tex);
        let t = null;
        if (crop == undefined || crop == null)
            t = tex;
        else
            t = tex.getSubtexture(crop, this.texToDraw);
        let left = -t.frame.x;
        let top = -t.frame.y;
        let width = t.bounds.width;
        let height = t.bounds.height;
        this.topleft.set(left, top);
        this.topright.set(left + width, top);
        this.botleft.set(left, top + height);
        this.botright.set(left + width, top + height);
        if (origin && (origin.x != 0 || origin.y != 0)) {
            this.topleft.sub(origin);
            this.topright.sub(origin);
            this.botleft.sub(origin);
            this.botright.sub(origin);
        }
        if (scale && (scale.x != 1 || scale.y != 1)) {
            this.topleft.mult(scale);
            this.topright.mult(scale);
            this.botleft.mult(scale);
            this.botright.mult(scale);
        }
        if (rotation && rotation != 0) {
            let s = Math.sin(rotation);
            let c = Math.cos(rotation);
            this.topleft.rotate(s, c);
            this.topright.rotate(s, c);
            this.botleft.rotate(s, c);
            this.botright.rotate(s, c);
        }
        let uvMinX = t.bounds.x / t.texture.width;
        let uvMinY = t.bounds.y / t.texture.height;
        let uvMaxX = uvMinX + (width / t.texture.width);
        let uvMaxY = uvMinY + (height / t.texture.height);
        if (flipX) {
            let a = uvMinX;
            uvMinX = uvMaxX;
            uvMaxX = a;
        }
        if (flipY) {
            let a = uvMinY;
            uvMinY = uvMaxY;
            uvMaxY = a;
        }
        let col = (color || Color.white);
        this.push(posX + this.topleft.x, posY + this.topleft.y, uvMinX, uvMinY, col);
        this.pushUnsafe(posX + this.topright.x, posY + this.topright.y, uvMaxX, uvMinY, col);
        this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
        this.pushUnsafe(posX + this.topleft.x, posY + this.topleft.y, uvMinX, uvMinY, col);
        this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, uvMaxX, uvMaxY, col);
        this.pushUnsafe(posX + this.botleft.x, posY + this.botleft.y, uvMinX, uvMaxY, col);
    }
    quad(posX, posY, width, height, color, origin, scale, rotation) {
        let left = 0;
        let top = 0;
        this.topleft.set(left, top);
        this.topright.set(left + width, top);
        this.botleft.set(left, top + height);
        this.botright.set(left + width, top + height);
        if (origin && (origin.x != 0 || origin.y != 0)) {
            this.topleft.sub(origin);
            this.topright.sub(origin);
            this.botleft.sub(origin);
            this.botright.sub(origin);
        }
        if (scale && (scale.x != 1 || scale.y != 1)) {
            this.topleft.mult(scale);
            this.topright.mult(scale);
            this.botleft.mult(scale);
            this.botright.mult(scale);
        }
        if (rotation && rotation != 0) {
            let s = Math.sin(rotation);
            let c = Math.cos(rotation);
            this.topleft.rotate(s, c);
            this.topright.rotate(s, c);
            this.botleft.rotate(s, c);
            this.botright.rotate(s, c);
        }
        let col = (color || Color.white);
        this.push(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
        this.pushUnsafe(posX + this.topright.x, posY + this.topright.y, 0, 0, color);
        this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
        this.pushUnsafe(posX + this.topleft.x, posY + this.topleft.y, 0, 0, color);
        this.pushUnsafe(posX + this.botright.x, posY + this.botright.y, 0, 0, color);
        this.pushUnsafe(posX + this.botleft.x, posY + this.botleft.y, 0, 0, color);
    }
    rect(x, y, width, height, color) {
        if (this.shader.sampler2d != null)
            this.setShaderTexture(this._pixel);
        let uv = this._pixelUVs;
        this.push(x, y, uv[0].x, uv[0].y, color);
        this.pushUnsafe(x + width, y, uv[1].x, uv[1].y, color);
        this.pushUnsafe(x + width, y + height, uv[2].x, uv[2].y, color);
        this.pushUnsafe(x, y, uv[0].x, uv[0].y, color);
        this.pushUnsafe(x, y + height, uv[3].x, uv[3].y, color);
        this.pushUnsafe(x + width, y + height, uv[2].x, uv[2].y, color);
    }
    triangle(a, b, c, colA, colB, colC) {
        if (this.shader.sampler2d != null)
            this.setShaderTexture(this._pixel);
        if (colB == undefined)
            colB = colA;
        if (colC == undefined)
            colC = colA;
        let uv = this._pixelUVs;
        this.push(a.x, a.y, uv[0].x, uv[0].y, colA);
        this.pushUnsafe(b.x, b.y, uv[1].x, uv[1].y, colB);
        this.pushUnsafe(c.x, c.y, uv[2].x, uv[2].y, colC);
    }
    circle(pos, rad, steps, colorA, colorB) {
        if (this.shader.sampler2d != null)
            this.setShaderTexture(this._pixel);
        if (colorB == undefined)
            colorB = colorA;
        this.checkState();
        let uv = this._pixelUVs;
        let last = new Vector(pos.x + rad, pos.y);
        for (let i = 1; i <= steps; i++) {
            let angle = (i / steps) * Math.PI * 2;
            let next = new Vector(pos.x + Math.cos(angle), pos.y + Math.sin(angle));
            this.pushUnsafe(pos.x, pos.y, uv[0].x, uv[0].y, colorA);
            this.pushUnsafe(last.x, last.y, uv[1].x, uv[1].y, colorB);
            this.pushUnsafe(next.x, next.y, uv[2].x, uv[2].y, colorB);
            last = next;
        }
    }
    hollowRect(x, y, width, height, stroke, color) {
        this.rect(x, y, width, stroke, color);
        this.rect(x, y + stroke, stroke, height - stroke * 2, color);
        this.rect(x + width - stroke, y + stroke, stroke, height - stroke * 2, color);
        this.rect(x, y + height - stroke, width, stroke, color);
    }
}
class Renderer {
    constructor() {
        this.visible = true;
        this.target = null;
        this.clearTargetColor = new Color(0, 0, 0, 0);
        this.scene = null;
        this.groupsMask = [];
    }
    update() { }
    preRender() { }
    render() {
        this.drawBegin();
        this.drawEntities();
    }
    drawBegin() {
        if (this.target != null) {
            Engine.graphics.setRenderTarget(this.target);
            Engine.graphics.clear(this.clearTargetColor);
        }
        else
            Engine.graphics.setRenderTarget(Engine.graphics.buffer);
        Engine.graphics.shader = this.shader;
        Engine.graphics.shader.set(this.shaderCameraUniformName, this.getActiveCamera().matrix);
    }
    drawEntities() {
        let camera = this.getActiveCamera();
        let list = (this.groupsMask.length > 0 ? this.scene.allInGroups(this.groupsMask) : this.scene.entities);
        list.each((e) => {
            if (e.visible)
                e.render(camera);
        });
    }
    getActiveCamera() {
        return (this.camera || this.scene.camera);
    }
    postRender() { }
    dispose() {
        if (this.target != null)
            this.target.dispose();
        this.target = null;
    }
}
class AssetLoader {
    constructor(root) {
        this.root = "";
        this._loading = false;
        this._loaded = false;
        this.assets = 0;
        this.assetsLoaded = 0;
        this.textures = [];
        this.jsons = [];
        this.xmls = [];
        this.sounds = [];
        this.atlases = [];
        this.texts = [];
        this.root = root || "";
    }
    get loading() { return this._loading; }
    get loaded() { return this._loaded; }
    get percent() { return this.assetsLoaded / this.assets; }
    addTexture(path, colorKey = null) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.textures.push({ path, colorKey });
        this.assets++;
        return this;
    }
    addJson(path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.jsons.push(path);
        this.assets++;
        return this;
    }
    addXml(path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.xmls.push(path);
        this.assets++;
        return this;
    }
    addText(path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.texts.push(path);
        this.assets++;
        return this;
    }
    addSound(handle, path) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.sounds.push({ handle: handle, path: path });
        this.assets++;
        return this;
    }
    addAtlas(name, image, data, loader) {
        if (this.loading || this.loaded)
            throw "Cannot add more assets when already loaded";
        this.atlases.push({ name: name, image: image, data: data, loader: loader });
        this.assets += 3;
        return this;
    }
    load(callback) {
        this._loading = true;
        this.callback = callback;
        for (let i = 0; i < this.textures.length; i++) {
            const fullPath = FosterIO.join(this.root, this.textures[i].path);
            this.loadTexture({ path: fullPath, colorKey: this.textures[i].colorKey });
        }
        for (let i = 0; i < this.jsons.length; i++)
            this.loadJson(FosterIO.join(this.root, this.jsons[i]));
        for (let i = 0; i < this.xmls.length; i++)
            this.loadXml(FosterIO.join(this.root, this.xmls[i]));
        for (let i = 0; i < this.texts.length; i++)
            this.loadText(FosterIO.join(this.root, this.texts[i]));
        for (let i = 0; i < this.sounds.length; i++)
            this.loadSound(this.sounds[i].handle, FosterIO.join(this.root, this.sounds[i].path));
        for (let i = 0; i < this.atlases.length; i++)
            this.loadAtlas(this.atlases[i]);
    }
    unload() {
        if (this.loading)
            throw "Cannot unload until finished loading";
        if (!this.loaded)
            throw "Cannot unload before loading";
        throw "Asset Unloading not Implemented";
    }
    loadTexture(info, callback) {
        const path = info.path;
        let gl = Engine.graphics.gl;
        let img = new Image();
        img.addEventListener('load', () => {
            let tex = Texture.create(img, info.colorKey);
            tex.texture.path = path;
            Assets.textures[this.pathify(path)] = tex;
            if (callback != undefined)
                callback(tex);
            this.incrementLoader();
        });
        img.src = path;
    }
    loadJson(path, callback) {
        var self = this;
        FosterIO.read(path, (data) => {
            let p = this.pathify(path);
            Assets.json[p] = JSON.parse(data);
            if (callback != undefined)
                callback(Assets.json[p]);
            self.incrementLoader();
        });
    }
    loadXml(path, callback) {
        FosterIO.read(path, (data) => {
            let p = this.pathify(path);
            Assets.xml[p] = (new DOMParser()).parseFromString(data, "text/xml");
            if (callback != undefined)
                callback(Assets.xml[p]);
            this.incrementLoader();
        });
    }
    loadText(path, callback) {
        FosterIO.read(path, (data) => {
            let p = this.pathify(path);
            Assets.text[p] = data;
            if (callback != undefined)
                callback(Assets.text[p]);
            this.incrementLoader();
        });
    }
    loadSound(handle, path, callback) {
        let audio = new Audio();
        audio.addEventListener("loadeddata", () => {
            Assets.sounds[handle] = new AudioSource(path, audio);
            if (callback != undefined)
                callback(Assets.sounds[handle]);
            this.incrementLoader();
        });
        audio.src = path;
    }
    loadAtlas(data) {
        var self = this;
        var texture = null;
        var atlasdata = null;
        function check() {
            if (texture == null || atlasdata == null)
                return;
            let atlas = new Atlas(data.name, texture, atlasdata, data.loader);
            Assets.atlases[atlas.name] = atlas;
            self.incrementLoader();
        }
        this.loadText(FosterIO.join(this.root, data.data), (text) => { atlasdata = text; check(); });
        this.loadTexture({ path: FosterIO.join(this.root, data.image), colorKey: null }, (tex) => { texture = tex; check(); });
    }
    incrementLoader() {
        this.assetsLoaded++;
        if (this.assetsLoaded == this.assets) {
            this._loaded = true;
            this._loading = false;
            if (this.callback != undefined)
                this.callback();
        }
    }
    pathify(path) {
        while (path.indexOf("\\") >= 0)
            path = path.replace("\\", "/");
        return path;
    }
}
class Assets {
    static unload() {
        Assets.json = {};
        Assets.xml = {};
        Assets.text = {};
        Assets.atlases = {};
        for (var path in Assets.textures)
            Assets.textures[path].dispose();
        Assets.textures = {};
        for (var path in Assets.sounds)
            Assets.sounds[path].dispose();
        Assets.sounds = {};
    }
}
Assets.textures = {};
Assets.json = {};
Assets.xml = {};
Assets.text = {};
Assets.sounds = {};
Assets.atlases = {};
class SpriteAnimationTemplate {
    constructor(name, speed, frames, loops, position, origin) {
        this.loops = false;
        this.goto = null;
        this.name = name;
        this.speed = speed;
        this.frames = frames;
        this.loops = loops || false;
        this.position = (position || new Vector(0, 0));
        this.origin = (origin || new Vector(0, 0));
    }
}
class SpriteBank {
    static create(name) {
        var animSet = new SpriteTemplate(name);
        SpriteBank.bank[name] = animSet;
        return animSet;
    }
    static get(name) {
        return SpriteBank.bank[name];
    }
    static has(name) {
        return SpriteBank.bank[name] != undefined;
    }
}
SpriteBank.bank = {};
class SpriteTemplate {
    constructor(name) {
        this.animations = {};
        this.name = name;
    }
    add(name, speed, frames, loops, position, origin) {
        let anim = new SpriteAnimationTemplate(name, speed, frames, loops, position, origin);
        this.animations[name] = anim;
        if (this.first == null)
            this.first = anim;
        return this;
    }
    addFrameAnimation(name, speed, tex, frameWidth, frameHeight, frames, loops, position, origin) {
        let columns = Math.floor(tex.width / frameWidth);
        let texFrames = [];
        for (let i = 0; i < frames.length; i++) {
            let index = frames[i];
            let tx = (index % columns) * frameWidth;
            let ty = Math.floor(index / columns) * frameWidth;
            texFrames.push(tex.getSubtexture(new Rectangle(tx, ty, frameWidth, frameHeight)));
        }
        let anim = new SpriteAnimationTemplate(name, speed, texFrames, loops, position, origin);
        this.animations[name] = anim;
        if (this.first == null)
            this.first = anim;
        return this;
    }
    get(name) {
        return this.animations[name];
    }
    has(name) {
        return this.animations[name] != undefined;
    }
}
class AudioGroup {
    static volume(group, value) {
        if (value != undefined && AudioGroup.volumes[group] != value) {
            AudioGroup.volumes[group] = value;
            for (let i = 0; i < Sound.active.length; i++)
                if (Sound.active[i].ingroup(group))
                    Sound.active[i].volume = Sound.active[i].volume;
        }
        if (AudioGroup.volumes[group] != undefined)
            return AudioGroup.volumes[group];
        return 1;
    }
    static muted(group, value) {
        if (value != undefined && AudioGroup.mutes[group] != value) {
            AudioGroup.mutes[group] = value;
            for (let i = 0; i < Sound.active.length; i++)
                if (Sound.active[i].ingroup(group))
                    Sound.active[i].muted = Sound.active[i].muted;
        }
        if (AudioGroup.mutes[group] != undefined)
            return AudioGroup.mutes[group];
        return false;
    }
}
AudioGroup.volumes = {};
AudioGroup.mutes = {};
class AudioSource {
    constructor(path, first) {
        this.sounds = [];
        this.path = path;
        if (first)
            this.sounds.push(first);
    }
    requestSound() {
        if (this.sounds.length > 0) {
            let source = this.sounds[0];
            this.sounds.splice(0, 1);
            return source;
        }
        else if (this.sounds.length < AudioSource.maxInstances) {
            let source = new Audio();
            source.src = this.path;
            return source;
        }
        else
            return null;
    }
    returnSound(sound) {
        this.sounds.push(sound);
    }
    dispose() {
    }
}
AudioSource.maxInstances = 50;
class Sound {
    constructor(handle, groups) {
        this.sound = null;
        this.started = false;
        this.groups = [];
        this.fadePercent = 1;
        this.fadeDuration = 1;
        this._loop = false;
        this._paused = false;
        this._muted = false;
        this._volume = 1;
        this.source = Assets.sounds[handle];
        if (groups && groups.length > 0)
            for (let i = 0; i < groups.length; i++)
                this.group(groups[i]);
    }
    get playing() { return this.started && !this._paused; }
    get loop() { return this._loop; }
    set loop(v) {
        this._loop = v;
        if (this.started)
            this.sound.loop = this._loop;
    }
    get paused() { return this._paused; }
    get muted() { return this._muted; }
    set muted(m) {
        this._muted = m;
        this.internalUpdateMuted();
    }
    get volume() { return this._volume; }
    set volume(n) {
        this._volume = n;
        this.internalUpdateVolume();
    }
    play(loop) {
        this.loop = loop;
        if (this.sound != null && this.started) {
            this.sound.currentTime = 0;
            if (this._paused)
                this.resume();
        }
        else {
            this.sound = this.source.requestSound();
            if (this.sound != null) {
                if (this.sound.readyState < 3) {
                    var self = this;
                    self.loadedEvent = () => {
                        if (self.sound != null)
                            self.internalPlay();
                        self.sound.removeEventListener("loadeddata", self.loadedEvent);
                        self.loadedEvent = null;
                    };
                    this.sound.addEventListener("loadeddata", self.loadedEvent);
                }
                else
                    this.internalPlay();
            }
        }
        return this;
    }
    resume() {
        if (this.started && this._paused)
            this.sound.play();
        this._paused = false;
        return this;
    }
    pause() {
        if (this.started && !this._paused)
            this.sound.pause();
        this._paused = true;
        return this;
    }
    stop() {
        if (this.sound != null) {
            this.source.returnSound(this.sound);
            if (this.started) {
                this.sound.pause();
                this.sound.currentTime = 0;
                this.sound.volume = 1;
                this.sound.muted = false;
                this.sound.removeEventListener("ended", this.endEvent);
                if (this.loadedEvent != null)
                    this.sound.removeEventListener("loadeddata", this.loadedEvent);
            }
            this.sound = null;
            this.started = false;
            this._paused = false;
            this.fadePercent = 1;
            let i = Sound.active.indexOf(this);
            if (i >= 0)
                Sound.active.splice(i, 1);
        }
        return this;
    }
    group(group) {
        this.groups.push(group);
        this.internalUpdateVolume();
        this.internalUpdateMuted();
        return this;
    }
    ungroup(group) {
        let index = this.groups.indexOf(group);
        if (index >= 0) {
            this.groups.splice(index, 1);
            this.internalUpdateVolume();
            this.internalUpdateMuted();
        }
        return this;
    }
    ungroupAll() {
        this.groups = [];
        this.internalUpdateVolume();
        this.internalUpdateMuted();
        return this;
    }
    ingroup(group) {
        return this.groups.indexOf(group) >= 0;
    }
    internalPlay() {
        this.started = true;
        Sound.active.push(this);
        var self = this;
        this.endEvent = () => { self.stop(); };
        this.sound.addEventListener("ended", this.endEvent);
        this.sound.loop = this.loop;
        this.internalUpdateVolume();
        this.internalUpdateMuted();
        if (!this._paused)
            this.sound.play();
    }
    internalUpdateVolume() {
        if (this.started) {
            let groupVolume = 1;
            for (let i = 0; i < this.groups.length; i++)
                groupVolume *= AudioGroup.volume(this.groups[i]);
            this.sound.volume = this._volume * groupVolume * Engine.volume;
        }
    }
    internalUpdateMuted() {
        if (this.started) {
            let groupMuted = false;
            for (let i = 0; i < this.groups.length && !groupMuted; i++)
                groupMuted = groupMuted || AudioGroup.muted(this.groups[i]);
            this.sound.muted = Engine.muted || this._muted || groupMuted;
        }
    }
    update() {
        if (this.fadePercent < 1) {
            this.fadePercent = Calc.approach(this.fadePercent, 1, Engine.delta / this.fadeDuration);
            this.volume = this.fadeFrom + (this.fadeTo - this.fadeFrom) * this.fadeEase(this.fadePercent);
        }
    }
    fade(volume, duration, ease) {
        this.fadeFrom = this.volume;
        this.fadeTo = volume;
        this.fadeDuration = Math.max(0.001, duration);
        this.fadeEase = (ease != undefined ? ease : (n) => { return n; });
        this.fadePercent = 0;
        return this;
    }
}
Sound.active = [];
class Atlas {
    constructor(name, texture, data, reader) {
        this.subtextures = {};
        this.name = name;
        this.texture = texture;
        this.reader = reader;
        this.data = data;
        this.reader(data, this);
    }
    get(name) {
        return this.subtextures[name];
    }
    has(name) {
        return this.subtextures[name] != undefined;
    }
    list(prefix, names) {
        let listed = [];
        for (let i = 0; i < names.length; i++)
            listed.push(this.get(prefix + names[i]));
        return listed;
    }
    find(prefix) {
        let found = [];
        for (var key in this.subtextures) {
            if (key.indexOf(prefix) == 0)
                found.push({ name: key, tex: this.subtextures[key] });
        }
        found.sort((a, b) => {
            return (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
        });
        let listed = [];
        for (let i = 0; i < found.length; i++)
            listed.push(found[i].tex);
        return listed;
    }
}
class AtlasReaders {
    static DoodleStudio(data, into) {
        const json = JSON.parse(data);
        const frames = json["frames"];
        let i = 0;
        for (const frame of frames) {
            const bounds = frame.rect;
            const boundsRect = new Rectangle(bounds.x, bounds.y, bounds.width, bounds.height);
            var tex = new Texture(into.texture.texture, boundsRect);
            tex.metadata["duration"] = frame.duration;
            into.subtextures["main " + i] = tex;
            ++i;
        }
    }
    static Aseprite(data, into) {
        let json = JSON.parse(data);
        let frames = json["frames"];
        for (var path in frames) {
            var name = path.replace(".ase", "").replace(".png", "");
            var obj = frames[path];
            var bounds = obj.frame;
            var tex;
            if (obj.trimmed) {
                var source = obj["spriteSourceSize"];
                var size = obj["sourceSize"];
                tex = new Texture(into.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h), new Rectangle(-source.x, -source.y, size.w, size.h));
            }
            else {
                tex = new Texture(into.texture.texture, new Rectangle(bounds.x, bounds.y, bounds.w, bounds.h));
            }
            if (obj.duration != undefined)
                tex.metadata["duration"] = parseInt(obj.duration);
            into.subtextures[name] = tex;
        }
    }
}
class FosterWebGLTexture {
    constructor(texture, width, height) {
        this.disposed = false;
        this.webGLTexture = texture;
        this.width = width;
        this.height = height;
    }
    dispose() {
        if (!this.disposed) {
            let gl = Engine.graphics.gl;
            gl.deleteTexture(this.webGLTexture);
            this.path = "";
            this.webGLTexture = null;
            this.width = 1;
            this.height = 1;
            this.disposed = true;
        }
    }
}
class RenderTarget {
    get width() { return this.texture.width; }
    get height() { return this.texture.height; }
    constructor(buffer, texture, vertexBuffer, colorBuffer, texcoordBuffer) {
        this.texture = texture;
        this.frameBuffer = buffer;
        this.vertexBuffer = vertexBuffer;
        this.colorBuffer = colorBuffer;
        this.texcoordBuffer = texcoordBuffer;
    }
    dispose() {
        this.texture.dispose();
        this.texture = null;
        let gl = Engine.graphics.gl;
        gl.deleteFramebuffer(this.frameBuffer);
        gl.deleteBuffer(this.vertexBuffer);
        gl.deleteBuffer(this.texcoordBuffer);
        gl.deleteBuffer(this.colorBuffer);
        this.frameBuffer = null;
        this.vertexBuffer = null;
        this.texcoordBuffer = null;
        this.colorBuffer = null;
    }
    static create(width, height) {
        let gl = Engine.graphics.gl;
        let frameBuffer = gl.createFramebuffer();
        let tex = gl.createTexture();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        let vertexBuffer = gl.createBuffer();
        let uvBuffer = gl.createBuffer();
        let colorBuffer = gl.createBuffer();
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return new RenderTarget(frameBuffer, new FosterWebGLTexture(tex, width, height), vertexBuffer, colorBuffer, uvBuffer);
    }
}
class Texture {
    constructor(texture, bounds, frame) {
        this.bounds = null;
        this.frame = null;
        this.texture = null;
        this.metadata = {};
        this.texture = texture;
        this.bounds = bounds || new Rectangle(0, 0, texture.width, texture.height);
        this.frame = frame || new Rectangle(0, 0, this.bounds.width, this.bounds.height);
        this.center = new Vector(this.frame.width / 2, this.frame.height / 2);
    }
    get width() { return this.frame.width; }
    get height() { return this.frame.height; }
    get clippedWidth() { return this.bounds.width; }
    get clippedHeight() { return this.bounds.height; }
    getSubtexture(clip, sub) {
        if (sub == undefined)
            sub = new Texture(this.texture);
        else
            sub.texture = this.texture;
        sub.bounds.x = this.bounds.x + Math.max(0, Math.min(this.bounds.width, clip.x + this.frame.x));
        sub.bounds.y = this.bounds.y + Math.max(0, Math.min(this.bounds.height, clip.y + this.frame.y));
        sub.bounds.width = Math.max(0, this.bounds.x + Math.min(this.bounds.width, clip.x + this.frame.x + clip.width) - sub.bounds.x);
        sub.bounds.height = Math.max(0, this.bounds.y + Math.min(this.bounds.height, clip.y + this.frame.y + clip.height) - sub.bounds.y);
        sub.frame.x = Math.min(0, this.frame.x + clip.x);
        sub.frame.y = Math.min(0, this.frame.y + clip.y);
        sub.frame.width = clip.width;
        sub.frame.height = clip.height;
        sub.center = new Vector(sub.frame.width / 2, sub.frame.height / 2);
        return sub;
    }
    clone() {
        return new Texture(this.texture, this.bounds.clone(), this.frame.clone());
    }
    toString() {
        return (this.texture.path +
            ": [" + this.bounds.x + ", " + this.bounds.y + ", " + this.bounds.width + ", " + this.bounds.height + "]" +
            "frame[" + this.frame.x + ", " + this.frame.y + ", " + this.frame.width + ", " + this.frame.height + "]");
    }
    draw(position, origin, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, null, color, origin, scale, rotation, flipX, flipY);
    }
    drawCropped(position, crop, origin, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, crop, color, origin, scale, rotation, flipX, flipY);
    }
    drawCenter(position, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, null, color, this.center, scale, rotation, flipX, flipY);
    }
    drawCenterCropped(position, crop, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, crop, color, new Vector(crop.width / 2, crop.height / 2), scale, rotation, flipX, flipY);
    }
    drawJustify(position, justify, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, null, color, new Vector(this.width * justify.x, this.height * justify.y), scale, rotation, flipX, flipY);
    }
    drawJustifyCropped(position, crop, justify, scale, rotation, color, flipX, flipY) {
        Engine.graphics.texture(this, position.x, position.y, crop, color, new Vector(crop.width * justify.x, crop.height * justify.y), scale, rotation, flipX, flipY);
    }
    dispose() {
        this.texture.dispose();
        this.texture = null;
    }
    static makeTransparent(image, colorKey) {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            if (data[i + 0] === colorKey.r &&
                data[i + 1] === colorKey.g &&
                data[i + 2] === colorKey.b) {
                data[i + 3] = 0;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }
    static create(image, colorKey) {
        let gl = Engine.graphics.gl;
        let tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        if (colorKey)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Texture.makeTransparent(image, colorKey));
        else
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return new Texture(new FosterWebGLTexture(tex, image.width, image.height));
    }
    static createFromData(data, width, height) {
        let gl = Engine.graphics.gl;
        let tex = gl.createTexture();
        let input = [];
        for (let i = 0; i < data.length; i++)
            input[i] = Math.floor(data[i] * 255);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(data));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        return new Texture(new FosterWebGLTexture(tex, width, height));
    }
}
class Alarm extends Component {
    constructor() {
        super();
        this._percent = 0;
        this.removeOnComplete = false;
        this.active = this.visible = false;
    }
    get percent() { return this._percent; }
    get duration() { return this._duration; }
    start(duration, callback) {
        this._percent = 0;
        this._duration = duration;
        this.callback = callback;
        return this;
    }
    restart() {
        this._percent = 0;
        return this;
    }
    resume() {
        if (this.percent < 1)
            this.active = true;
        return this;
    }
    pause() {
        this.active = false;
        return this;
    }
    update() {
        if (this.percent < 1 && this.duration > 0) {
            this._percent += Engine.delta / this.duration;
            if (this.percent >= 1) {
                this._percent = 1;
                this.active = false;
                this.callback(this);
                if (this.removeOnComplete)
                    this.entity.remove(this);
            }
        }
    }
    static create(on) {
        let alarm = new Alarm();
        on.add(alarm);
        return alarm;
    }
}
class Coroutine extends Component {
    constructor(call) {
        super();
        this.wait = 0;
        this.iterator = null;
        this.active = this.visible = false;
        if (call)
            this.start(call);
    }
    start(call) {
        this.iterator = call();
        this.active = true;
        return this;
    }
    resume() {
        this.active = true;
        return this;
    }
    pause() {
        this.active = false;
        return this;
    }
    stop() {
        this.wait = 0;
        this.active = false;
        this.iterator = null;
        return this;
    }
    update() {
        this.wait -= Engine.delta;
        if (this.wait > 0)
            return;
        this.step();
    }
    step() {
        if (this.iterator != null) {
            let next = this.iterator.next();
            if (next.done)
                this.end(next.value == "remove");
            else {
                if (next.value == null)
                    this.wait = 0;
                else if ((typeof next.value) === "number")
                    this.wait = parseFloat(next.value);
            }
        }
    }
    end(remove) {
        this.stop();
        if (remove)
            this.entity.remove(this);
    }
}
class Tween extends Component {
    constructor() {
        super();
        this._percent = 0;
        this.from = 0;
        this.to = 0;
        this.ease = (p) => { return p; };
        this.removeOnComplete = false;
        this.active = this.visible = false;
    }
    get percent() { return this._percent; }
    get duration() { return this._duration; }
    get value() { return this.from + (this.to - this.from) * this.ease(this.percent); }
    start(duration, from, to, ease, step, removeOnComplete) {
        this._percent = 0;
        this._duration = duration;
        this.from = from;
        this.to = to;
        this.ease = ease;
        this.step = step;
        this.removeOnComplete = removeOnComplete;
        return this;
    }
    restart() {
        this._percent = 0;
        this.active = true;
        return this;
    }
    resume() {
        if (this.percent < 1)
            this.active = true;
        return this;
    }
    pause() {
        this.active = false;
        return this;
    }
    update() {
        if (this.percent < 1 && this.duration > 0) {
            this._percent += Engine.delta / this.duration;
            if (this.percent >= 1) {
                this._percent = 1;
                this.step(this.to);
                this.active = false;
                if (this.removeOnComplete)
                    this.entity.remove(this);
            }
            else
                this.step(this.value);
        }
    }
    static create(on) {
        let tween = new Tween();
        on.add(tween);
        return tween;
    }
}
class Hitgrid extends Collider {
    constructor(tileWidth, tileHeight, tags) {
        super();
        this.map = {};
        this.debugSub = new Color(200, 200, 200, 0.5);
        this.type = Hitgrid.name;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        if (tags != undefined)
            for (let i = 0; i < tags.length; i++)
                this.tag(tags[i]);
    }
    set(solid, tx, ty, columns, rows) {
        for (let x = tx; x < tx + (columns || 1); x++) {
            if (this.map[x] == undefined)
                this.map[x] = {};
            for (let y = ty; y < ty + (rows || 1); y++)
                if (solid)
                    this.map[x][y] = solid;
                else
                    delete this.map[x][y];
        }
    }
    has(tx, ty, columns, rows) {
        for (let x = tx; x < tx + (columns || 1); x++)
            if (this.map[x] != undefined)
                for (let y = ty; y < ty + (rows || 1); y++)
                    if (this.map[x][y] == true)
                        return true;
        return false;
    }
    debugRender(camera) {
        let bounds = camera.extents;
        let pos = this.scenePosition;
        let left = Math.floor((bounds.left - pos.x) / this.tileWidth) - 1;
        let right = Math.ceil((bounds.right - pos.x) / this.tileWidth) + 1;
        let top = Math.floor((bounds.top - pos.y) / this.tileHeight) - 1;
        let bottom = Math.ceil((bounds.bottom - pos.y) / this.tileHeight) + 1;
        for (let tx = left; tx < right; tx++) {
            if (this.map[tx] == undefined)
                continue;
            for (let ty = top; ty < bottom; ty++) {
                if (this.map[tx][ty] == true) {
                    let l = this.has(tx - 1, ty);
                    let r = this.has(tx + 1, ty);
                    let u = this.has(tx, ty - 1);
                    let d = this.has(tx, ty + 1);
                    let px = pos.x + tx * this.tileWidth;
                    let py = pos.y + ty * this.tileHeight;
                    Engine.graphics.rect(px, py, 1, this.tileHeight, l ? Color.red : this.debugSub);
                    Engine.graphics.rect(px, py, this.tileWidth, 1, u ? Color.red : this.debugSub);
                    Engine.graphics.rect(px + this.tileWidth - 1, py, 1, this.tileHeight, r ? Color.red : this.debugSub);
                    Engine.graphics.rect(px, py + this.tileHeight - 1, this.tileWidth, 1, d ? Color.red : this.debugSub);
                }
            }
        }
    }
}
class Particle {
}
class Vector {
    constructor(x, y) {
        this.x = 0;
        this.y = 0;
        if (x != undefined)
            this.x = x;
        if (y != undefined)
            this.y = y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    mult(s) {
        if (typeof s === "number") {
            this.x *= s;
            this.y *= s;
        }
        else {
            this.x *= s.x;
            this.y *= s.y;
        }
        return this;
    }
    div(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    }
    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    rotate(sin, cos) {
        let ox = this.x, oy = this.y;
        this.x = ox * cos - oy * sin;
        this.y = ox * sin + oy * cos;
        return this;
    }
    transform(m) {
        let ax = this.x, ay = this.y;
        this.x = m.mat[0] * ax + m.mat[3] * ay + m.mat[6];
        this.y = m.mat[1] * ax + m.mat[4] * ay + m.mat[7];
        return this;
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    get length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    get normal() {
        let dist = this.length;
        return new Vector(this.x / dist, this.y / dist);
    }
    normalize(length = 1) {
        let dist = this.length;
        this.x = (this.x / dist) * length;
        this.y = (this.y / dist) * length;
        return this;
    }
    static get zero() { return Vector._zero.set(0, 0); }
}
Vector.directions = [
    new Vector(-1, 0),
    new Vector(0, -1),
    new Vector(1, 0),
    new Vector(0, 1)
];
Vector.temp0 = new Vector();
Vector.temp1 = new Vector();
Vector.temp2 = new Vector();
Vector._zero = new Vector();
class ParticleSystem extends Component {
    constructor(template) {
        super();
        this.renderRelativeToEntity = false;
        this.particles = [];
        this.template = ParticleTemplate.templates[template];
    }
    update() {
        let dt = Engine.delta;
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            if (p.percent >= 1) {
                this.particles.splice(i, 1);
                ParticleSystem.cache.push(p);
                continue;
            }
            p.percent = Math.min(1, p.percent + dt / p.duration);
            p.x += p.speedX * dt;
            p.y += p.speedY * dt;
            p.speedX += p.accelX * dt;
            p.speedY += p.accelY * dt;
            p.speedX = Calc.approach(p.speedX, 0, p.frictionX * dt);
            p.speedY = Calc.approach(p.speedY, 0, p.frictionY * dt);
        }
    }
    render(camera) {
        let tex = this.template.texture;
        if (tex == null)
            tex = Engine.graphics.pixel;
        if (tex == null)
            throw "Particle requires a Texture";
        let pos = this.position;
        if (this.renderRelativeToEntity)
            pos = this.scenePosition;
        let t = this.template;
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            let lerp = p.percent;
            let x = pos.x + p.x;
            let y = pos.y + p.y;
            let scaleX = p.scaleFromX + (p.scaleToX - p.scaleFromX) * t.scaleXEaser(lerp);
            let scaleY = p.scaleFromY + (p.scaleToY - p.scaleFromY) * t.scaleYEaser(lerp);
            let rotation = p.rotationFrom + (p.rotationTo - p.rotationFrom) * t.rotationEaser(lerp);
            let alpha = p.alphaFrom + (p.alphaTo - p.alphaFrom) * t.alphaEaser(lerp);
            let color = ParticleSystem.color.lerp(p.colorFrom, p.colorTo, t.colorEaser(lerp)).mult(alpha);
            Engine.graphics.texture(tex, x, y, null, color, ParticleSystem.origin, ParticleSystem.scale.set(scaleX, scaleY), rotation);
        }
    }
    burst(x, y, direction, rangeX, rangeY, count) {
        let t = this.template;
        if (rangeX == undefined || rangeX == null)
            rangeX = 0;
        if (rangeY == undefined || rangeY == null)
            rangeY = 0;
        if (count == undefined)
            count = 1;
        for (let i = 0; i < count; i++) {
            let duration = t.durationBase + Calc.range(t.durationRange);
            if (duration <= 0)
                continue;
            let p = null;
            if (ParticleSystem.cache.length > 0) {
                p = ParticleSystem.cache[0];
                ParticleSystem.cache.splice(0, 1);
            }
            else
                p = new Particle();
            let speed = t.speedBase + Calc.range(t.speedRange);
            p.percent = 0;
            p.duration = duration;
            p.x = x + Calc.range(rangeX);
            p.y = y + Calc.range(rangeY);
            p.colorFrom = Calc.choose(t.colorsFrom);
            p.colorTo = Calc.choose(t.colorsTo);
            p.speedX = Math.cos(direction) * speed;
            p.speedY = -Math.sin(direction) * speed;
            p.accelX = t.accelBaseX + Calc.range(t.accelRangeX);
            p.accelY = t.accelBaseY + Calc.range(t.accelRangeY);
            p.frictionX = t.frictionBaseX + Calc.range(t.frictionRangeX);
            p.frictionY = t.frictionBaseY + Calc.range(t.frictionRangeY);
            p.scaleFromX = t.scaleFromBaseX + Calc.range(t.scaleFromRangeX);
            p.scaleFromY = t.scaleFromBaseY + Calc.range(t.scaleFromRangeY);
            p.scaleToX = t.scaleToBaseX + Calc.range(t.scaleToRangeX);
            p.scaleToY = t.scaleToBaseY + Calc.range(t.scaleToRangeY);
            p.rotationFrom = t.rotationFromBase + Calc.range(t.rotationFromRange);
            p.rotationTo = t.rotationToBase + Calc.range(t.rotationToRange);
            p.alphaFrom = t.alphaFromBase + Calc.range(t.alphaFromRange);
            p.alphaTo = t.alphaToBase + Calc.range(t.alphaToRange);
            this.particles.push(p);
        }
    }
}
ParticleSystem.cache = [];
ParticleSystem.color = new Color();
ParticleSystem.origin = new Vector(0.5, 0.5);
ParticleSystem.scale = new Vector(0, 0);
class ParticleTemplate {
    constructor(name) {
        this.texture = null;
        this.speedBase = 0;
        this.speedRange = 0;
        this.accelBaseX = 0;
        this.accelRangeX = 0;
        this.accelBaseY = 0;
        this.accelRangeY = 0;
        this.frictionBaseX = 0;
        this.frictionRangeX = 0;
        this.frictionBaseY = 0;
        this.frictionRangeY = 0;
        this.colorsFrom = [Color.white];
        this.colorsTo = [Color.white];
        this.colorEaser = Ease.linear;
        this.alphaFromBase = 1;
        this.alphaFromRange = 0;
        this.alphaToBase = 1;
        this.alphaToRange = 0;
        this.alphaEaser = Ease.linear;
        this.rotationFromBase = 0;
        this.rotationFromRange = 0;
        this.rotationToBase = 0;
        this.rotationToRange = 0;
        this.rotationEaser = Ease.linear;
        this.scaleFromBaseX = 1;
        this.scaleFromRangeX = 0;
        this.scaleToBaseX = 1;
        this.scaleToRangeX = 0;
        this.scaleXEaser = Ease.linear;
        this.scaleFromBaseY = 1;
        this.scaleFromRangeY = 0;
        this.scaleToBaseY = 1;
        this.scaleToRangeY = 0;
        this.scaleYEaser = Ease.linear;
        this.durationBase = 1;
        this.durationRange = 1;
        this.name = name;
        ParticleTemplate.templates[name] = this;
    }
    tex(texture) {
        this.texture = texture;
        return this;
    }
    speed(Base, Range) {
        this.speedBase = Base;
        this.speedRange = Range || 0;
        return this;
    }
    accelX(Base, Range) {
        this.accelBaseX = Base;
        this.accelRangeX = Range || 0;
        return this;
    }
    accelY(Base, Range) {
        this.accelBaseY = Base;
        this.accelRangeY = Range || 0;
        return this;
    }
    frictionX(Base, Range) {
        this.frictionBaseX = Base;
        this.frictionRangeX = Range || 0;
        return this;
    }
    frictionY(Base, Range) {
        this.frictionBaseY = Base;
        this.frictionRangeY = Range || 0;
        return this;
    }
    colors(from, to) {
        this.colorsFrom = from;
        this.colorsTo = to || from;
        return this;
    }
    colorEase(easer) {
        this.colorEaser = easer;
        return this;
    }
    alpha(Base, Range) {
        this.alphaFrom(Base, Range);
        this.alphaTo(Base, Range);
        return this;
    }
    alphaFrom(Base, Range) {
        this.alphaFromBase = Base;
        this.alphaFromRange = Range || 0;
        return this;
    }
    alphaTo(Base, Range) {
        this.alphaToBase = Base;
        this.alphaToRange = Range || 0;
        return this;
    }
    alphaEase(easer) {
        this.alphaEaser = easer;
        return this;
    }
    rotation(Base, Range) {
        this.rotationFrom(Base, Range);
        this.rotationTo(Base, Range);
        return this;
    }
    rotationFrom(Base, Range) {
        this.rotationFromBase = Base;
        this.rotationFromRange = Range || 0;
        return this;
    }
    rotationTo(Base, Range) {
        this.rotationToBase = Base;
        this.rotationToRange = Range || 0;
        return this;
    }
    rotationEase(easer) {
        this.rotationEaser = easer;
        return this;
    }
    scale(Base, Range) {
        this.scaleFrom(Base, Range);
        this.scaleTo(Base, Range);
        return this;
    }
    scaleFrom(Base, Range) {
        this.scaleFromX(Base, Range);
        this.scaleFromY(Base, Range);
        return this;
    }
    scaleTo(Base, Range) {
        this.scaleToX(Base, Range);
        this.scaleToY(Base, Range);
        return this;
    }
    scaleEase(easer) {
        this.scaleXEaser = easer;
        this.scaleYEaser = easer;
        return this;
    }
    scaleX(Base, Range) {
        this.scaleFromX(Base, Range);
        this.scaleToX(Base, Range);
        return this;
    }
    scaleFromX(Base, Range) {
        this.scaleFromBaseX = Base;
        this.scaleFromRangeX = Range || 0;
        return this;
    }
    scaleToX(Base, Range) {
        this.scaleToBaseX = Base;
        this.scaleToRangeX = Range || 0;
        return this;
    }
    scaleY(Base, Range) {
        this.scaleFromY(Base, Range);
        this.scaleToY(Base, Range);
        return this;
    }
    scaleXEase(easer) {
        this.scaleXEaser = easer;
        return this;
    }
    scaleFromY(Base, Range) {
        this.scaleFromBaseY = Base;
        this.scaleFromRangeY = Range || 0;
        return this;
    }
    scaleToY(Base, Range) {
        this.scaleToBaseY = Base;
        this.scaleToRangeY = Range || 0;
        return this;
    }
    scaleYEase(easer) {
        this.scaleYEaser = easer;
        return this;
    }
    duration(Base, Range) {
        this.durationBase = Base;
        this.durationRange = Range || 0;
        return this;
    }
}
ParticleTemplate.templates = {};
class Graphic extends Component {
    constructor(texture, position) {
        super();
        this.scale = new Vector(1, 1);
        this.origin = new Vector(0, 0);
        this.rotation = 0;
        this.flipX = false;
        this.flipY = false;
        this.color = Color.white.clone();
        this.alpha = 1;
        if (texture != null) {
            this.texture = texture;
            this.crop = new Rectangle(0, 0, texture.width, texture.height);
        }
        if (position)
            this.position = position;
    }
    get width() { return this.crop ? this.crop.width : (this.texture ? this.texture.width : 0); }
    get height() { return this.crop ? this.crop.height : (this.texture ? this.texture.height : 0); }
    center() {
        this.justify(0.5, 0.5);
    }
    justify(x, y) {
        this.origin.set(this.width * x, this.height * y);
    }
    render(camera) {
        Engine.graphics.texture(this.texture, this.scenePosition.x, this.scenePosition.y, this.crop, Color.temp.copy(this.color).mult(this.alpha), this.origin, this.scale, this.rotation, this.flipX, this.flipY);
    }
}
class Sprite extends Graphic {
    constructor(animation) {
        super(null);
        this._animation = null;
        this._playing = null;
        this._frame = 0;
        this.rate = 1;
        Engine.assert(SpriteBank.has(animation), "Missing animation '" + animation + "'!");
        this._animation = SpriteBank.get(animation);
        this.texture = this._animation.first.frames[0];
    }
    get animation() { return this._animation; }
    get playing() { return this._playing; }
    get frame() { return Math.floor(this._frame); }
    set frame(n) {
        this._frame = n;
        if (this.playing != null) {
            this._frame = Calc.clamp(n, 0, this.playing.frames.length);
            this.texture = this.playing.frames[this.frame];
        }
    }
    play(name, restart) {
        if (this.animation == null)
            return;
        let next = this.animation.get(name);
        if (next != null && (this.playing != next || restart)) {
            this._playing = next;
            this._frame = 0;
            this.active = true;
            if (this._playing.frames.length > 0)
                this.texture = this._playing.frames[0];
        }
    }
    has(name) {
        return this.animation != null && this.animation.has(name);
    }
    update() {
        if (this.playing != null) {
            this._frame += this.playing.speed * this.rate * Engine.delta;
            if (this.frame >= this.playing.frames.length || this.frame < 0) {
                if (this.playing.loops) {
                    while (this._frame >= this.playing.frames.length)
                        this._frame -= this.playing.frames.length;
                    while (this._frame < 0)
                        this._frame += this.playing.frames.length;
                }
                else if (this.playing.goto != null && this.playing.goto.length > 0) {
                    let next = this.playing.goto[Math.floor(Math.random() * this.playing.goto.length)];
                    this.play(next, true);
                }
                else {
                    this.active = false;
                    if (this.frame >= this.playing.frames.length)
                        this._frame = this.playing.frames.length - 1;
                    else
                        this._frame = 0;
                }
            }
            if (this.playing != null)
                this.texture = this.playing.frames[this.frame];
        }
    }
    render(camera) {
        if (this.texture != null)
            super.render(camera);
    }
}
class Tilemap extends Component {
    constructor(texture, tileWidth, tileHeight) {
        super();
        this.color = Color.white.clone();
        this.alpha = 1;
        this.map = {};
        this.crop = new Rectangle();
        this.texture = texture;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileColumns = Math.floor(this.texture.width / this.tileWidth);
    }
    set(tileX, tileY, mapX, mapY, mapWidth, mapHeight) {
        let tileIndex = tileX + tileY * this.tileColumns;
        return this.setIndex(tileIndex, mapX, mapY, mapWidth, mapHeight);
    }
    setIndex(tileIndex, mapX, mapY, mapWidth, mapHeight) {
        for (let x = mapX; x < mapX + (mapWidth || 1); x++) {
            if (this.map[x] == undefined)
                this.map[x] = {};
            for (let y = mapY; y < mapY + (mapHeight || 1); y++)
                this.map[x][y] = tileIndex;
        }
        return this;
    }
    clear(mapX, mapY, mapWidth, mapHeight) {
        for (let x = mapX; x < mapX + (mapWidth || 1); x++)
            if (this.map[x] != undefined)
                for (let y = mapY; y < mapY + (mapHeight || 1); y++)
                    if (this.map[x][y] != undefined)
                        delete this.map[x][y];
        return this;
    }
    has(mapX, mapY) {
        return (this.map[mapX] != undefined && this.map[mapX][mapY] != undefined);
    }
    get(mapX, mapY) {
        if (this.has(mapX, mapY)) {
            var index = this.map[mapX][mapY];
            return new Vector(index % this.tileColumns, Math.floor(index / this.tileColumns));
        }
        return null;
    }
    getTileSubtexture(tileIndex, sub) {
        console.assert(tileIndex >= 0);
        const x = (Math.floor(tileIndex % this.tileColumns)) * this.tileWidth;
        const y = Math.floor(tileIndex / this.tileColumns) * this.tileHeight;
        console.assert(x >= 0 && y >= 0);
        const rect = new Rectangle(x, y, this.tileWidth, this.tileHeight);
        return this.texture.getSubtexture(rect, sub);
    }
    render(camera) {
        let bounds = camera.extents;
        let pos = this.scenePosition;
        let left = Math.floor((bounds.left - pos.x) / this.tileWidth) - 1;
        let right = Math.ceil((bounds.right - pos.x) / this.tileWidth) + 1;
        let top = Math.floor((bounds.top - pos.y) / this.tileHeight) - 1;
        let bottom = Math.ceil((bounds.bottom - pos.y) / this.tileHeight) + 1;
        this.crop.width = this.tileWidth;
        this.crop.height = this.tileHeight;
        for (let tx = left; tx < right; tx++) {
            if (this.map[tx] == undefined)
                continue;
            for (let ty = top; ty < bottom; ty++) {
                let index = this.map[tx][ty];
                if (index != undefined) {
                    this.crop.x = (index % this.tileColumns) * this.tileWidth;
                    this.crop.y = Math.floor(index / this.tileColumns) * this.tileHeight;
                    Engine.graphics.texture(this.texture, pos.x + tx * this.tileWidth, pos.y + ty * this.tileHeight, this.crop, Color.temp.copy(this.color).mult(this.alpha));
                }
            }
        }
    }
}
class GamepadManager {
    static init() {
        window.addEventListener("gamepadconnected", GamepadManager.onAddController, false);
        window.addEventListener("gamepaddisconnected", GamepadManager.onRemoveController, false);
    }
    static onAddController(event) {
        for (var i = 0; i < GamepadManager.controllers.length; i++) {
            if (GamepadManager.controllers[i].gamepad == event.gamepad)
                return;
        }
        if (event.gamepad.id.includes("Unknown Gamepad"))
            return;
        GamepadManager.controllers.push(new ControllerInput(event.gamepad));
    }
    static onRemoveController(event) {
        console.log("A gamepad was disconnected, please reconnect.");
    }
    static getController(index) {
        return GamepadManager.controllers[index];
    }
    static numControllers() {
        return GamepadManager.controllers.length;
    }
    static setRemoveControllerBehavior(handler) {
        GamepadManager.onRemoveController = handler;
    }
}
GamepadManager.defaultDeadzone = 0.3;
GamepadManager.controllers = [];
class ControllerInput extends Component {
    constructor(pad, deadzone = GamepadManager.defaultDeadzone) {
        super();
        this.leftStick = new Vector();
        this.rightStick = new Vector();
        this.buttons = [];
        this.gamepad = pad;
        this.deadzone = deadzone;
        for (var i = 0; i < pad.buttons.length; i++)
            this.buttons.push(new ButtonState());
    }
    update() {
        var gamepad = this.queryGamepad();
        this.leftStick.x = gamepad.axes[0];
        this.leftStick.y = gamepad.axes[1];
        this.rightStick.x = gamepad.axes[2];
        this.rightStick.y = gamepad.axes[3];
        for (var i = 0; i < this.buttons.length; i++)
            this.buttons[i].update(gamepad.buttons[i].pressed);
    }
    getButton(index) {
        return this.buttons[index];
    }
    getLeftStick() {
        if (this.leftStick.length > this.deadzone)
            return this.leftStick.clone();
        return Vector.zero;
    }
    getRightStick() {
        if (this.rightStick.length > this.deadzone)
            return this.rightStick.clone();
        return Vector.zero;
    }
    getRawLeftStick() {
        return this.leftStick.clone();
    }
    getRawRightStick() {
        return this.rightStick.clone();
    }
    queryGamepad() {
        return navigator.getGamepads()[this.gamepad.index];
    }
}
class ButtonState {
    constructor() {
        this._last = false;
        this._next = false;
    }
    update(val) {
        this._last = this._next;
        this._next = val;
    }
    down() {
        return this._next;
    }
    pressed() {
        return this._next && !this._last;
    }
    released() {
        return this._last && !this._next;
    }
}
class Keyboard {
    static init() {
        window.addEventListener("keydown", function (e) {
            Keyboard._next[e.keyCode] = true;
        });
        window.addEventListener("keyup", function (e) {
            Keyboard._next[e.keyCode] = false;
        });
    }
    static update() {
        for (let i = 0; i < 256; i++) {
            Keyboard._last[i] = Keyboard._down[i];
            Keyboard._down[i] = Keyboard._next[i];
        }
    }
    static check(key) {
        if (isNaN(key))
            return Keyboard.mapCheck(key);
        return (Keyboard._down[key] == true);
    }
    static pressed(key) {
        if (isNaN(key))
            return Keyboard.mapPressed(key);
        return (Keyboard._down[key] == true && !Keyboard._last[key]);
    }
    static released(key) {
        if (isNaN(key))
            return Keyboard.mapReleased(key);
        return (!Keyboard._down[key] && Keyboard._last[key] == true);
    }
    static map(name, keys) {
        if (!Keyboard._map[name])
            Keyboard._map[name] = [];
        for (let i = 0; i < keys.length; i++)
            Keyboard._map[name].push(keys[i]);
    }
    static maps(list) {
        for (let name in list)
            Keyboard.map(name, list[name]);
    }
    static mapCheck(key) {
        if (Keyboard._map[key] != undefined)
            for (let i = 0; i < Keyboard._map[key].length; i++)
                if (Keyboard.check(Keyboard._map[key][i]))
                    return true;
        return false;
    }
    static mapPressed(key) {
        if (Keyboard._map[key] != undefined)
            for (let i = 0; i < Keyboard._map[key].length; i++)
                if (Keyboard.pressed(Keyboard._map[key][i]))
                    return true;
        return false;
    }
    static mapReleased(key) {
        if (Keyboard._map[key] != undefined)
            for (let i = 0; i < Keyboard._map[key].length; i++)
                if (Keyboard.released(Keyboard._map[key][i]))
                    return true;
        return false;
    }
}
Keyboard._down = [];
Keyboard._last = [];
Keyboard._next = [];
Keyboard._map = {};
var Key;
(function (Key) {
    Key[Key["backspace"] = 8] = "backspace";
    Key[Key["tab"] = 9] = "tab";
    Key[Key["enter"] = 13] = "enter";
    Key[Key["shift"] = 16] = "shift";
    Key[Key["ctrl"] = 17] = "ctrl";
    Key[Key["alt"] = 18] = "alt";
    Key[Key["pause"] = 19] = "pause";
    Key[Key["capslock"] = 20] = "capslock";
    Key[Key["escape"] = 27] = "escape";
    Key[Key["space"] = 32] = "space";
    Key[Key["pageUp"] = 33] = "pageUp";
    Key[Key["pageDown"] = 34] = "pageDown";
    Key[Key["end"] = 35] = "end";
    Key[Key["home"] = 36] = "home";
    Key[Key["left"] = 37] = "left";
    Key[Key["up"] = 38] = "up";
    Key[Key["right"] = 39] = "right";
    Key[Key["down"] = 40] = "down";
    Key[Key["insert"] = 45] = "insert";
    Key[Key["del"] = 46] = "del";
    Key[Key["zero"] = 48] = "zero";
    Key[Key["one"] = 49] = "one";
    Key[Key["two"] = 50] = "two";
    Key[Key["three"] = 51] = "three";
    Key[Key["four"] = 52] = "four";
    Key[Key["five"] = 53] = "five";
    Key[Key["six"] = 54] = "six";
    Key[Key["seven"] = 55] = "seven";
    Key[Key["eight"] = 56] = "eight";
    Key[Key["nine"] = 57] = "nine";
    Key[Key["a"] = 65] = "a";
    Key[Key["b"] = 66] = "b";
    Key[Key["c"] = 67] = "c";
    Key[Key["d"] = 68] = "d";
    Key[Key["e"] = 69] = "e";
    Key[Key["f"] = 70] = "f";
    Key[Key["g"] = 71] = "g";
    Key[Key["h"] = 72] = "h";
    Key[Key["i"] = 73] = "i";
    Key[Key["j"] = 74] = "j";
    Key[Key["k"] = 75] = "k";
    Key[Key["l"] = 76] = "l";
    Key[Key["m"] = 77] = "m";
    Key[Key["n"] = 78] = "n";
    Key[Key["o"] = 79] = "o";
    Key[Key["p"] = 80] = "p";
    Key[Key["q"] = 81] = "q";
    Key[Key["r"] = 82] = "r";
    Key[Key["s"] = 83] = "s";
    Key[Key["t"] = 84] = "t";
    Key[Key["u"] = 85] = "u";
    Key[Key["v"] = 86] = "v";
    Key[Key["w"] = 87] = "w";
    Key[Key["x"] = 88] = "x";
    Key[Key["y"] = 89] = "y";
    Key[Key["z"] = 90] = "z";
    Key[Key["leftWindow"] = 91] = "leftWindow";
    Key[Key["rightWindow"] = 92] = "rightWindow";
    Key[Key["select"] = 93] = "select";
    Key[Key["numpad0"] = 96] = "numpad0";
    Key[Key["numpad1"] = 97] = "numpad1";
    Key[Key["numpad2"] = 98] = "numpad2";
    Key[Key["numpad3"] = 99] = "numpad3";
    Key[Key["numpad4"] = 100] = "numpad4";
    Key[Key["numpad5"] = 101] = "numpad5";
    Key[Key["numpad6"] = 102] = "numpad6";
    Key[Key["numpad7"] = 103] = "numpad7";
    Key[Key["numpad8"] = 104] = "numpad8";
    Key[Key["numpad9"] = 105] = "numpad9";
    Key[Key["multiply"] = 106] = "multiply";
    Key[Key["add"] = 107] = "add";
    Key[Key["subtract"] = 109] = "subtract";
    Key[Key["decimal"] = 110] = "decimal";
    Key[Key["divide"] = 111] = "divide";
    Key[Key["f1"] = 112] = "f1";
    Key[Key["f2"] = 113] = "f2";
    Key[Key["f3"] = 114] = "f3";
    Key[Key["f4"] = 115] = "f4";
    Key[Key["f5"] = 116] = "f5";
    Key[Key["f6"] = 117] = "f6";
    Key[Key["f7"] = 118] = "f7";
    Key[Key["f8"] = 119] = "f8";
    Key[Key["f9"] = 120] = "f9";
    Key[Key["f10"] = 121] = "f10";
    Key[Key["f11"] = 122] = "f11";
    Key[Key["f12"] = 123] = "f12";
    Key[Key["numlock"] = 144] = "numlock";
    Key[Key["scrollLock"] = 145] = "scrollLock";
    Key[Key["semicolon"] = 186] = "semicolon";
    Key[Key["equal"] = 187] = "equal";
    Key[Key["comma"] = 188] = "comma";
    Key[Key["dash"] = 189] = "dash";
    Key[Key["period"] = 190] = "period";
    Key[Key["forwardSlash"] = 191] = "forwardSlash";
    Key[Key["graveAccent"] = 192] = "graveAccent";
    Key[Key["openBracket"] = 219] = "openBracket";
    Key[Key["backSlash"] = 220] = "backSlash";
    Key[Key["closeBraket"] = 221] = "closeBraket";
    Key[Key["singleQuote"] = 222] = "singleQuote";
})(Key || (Key = {}));
class Mouse {
    static get x() { return this._position.x; }
    static get y() { return this._position.y; }
    static get position() { return new Vector(this._position.x, this._position.y); }
    static get left() { return this._left; }
    static get leftPressed() { return this._left && !this._leftWas; }
    static get leftReleased() { return !this._left && this._leftWas; }
    static get right() { return this._right; }
    static get rightPressed() { return this._right && !this._rightWas; }
    static get rightReleased() { return !this._right && this._rightWas; }
    static init() {
        Mouse._position = new Vector(0, 0);
        Mouse._positionNext = new Vector(0, 0);
        Engine.root.addEventListener("mousemove", function (e) {
            Mouse.absolute = new Vector(e.pageX, e.pageY);
            Mouse.setNextMouseTo(e.pageX, e.pageY);
        });
        Engine.root.addEventListener("mousedown", function (e) {
            if (e.button == 0)
                Mouse._leftNext = true;
            else
                Mouse._rightNext = true;
        });
        Engine.root.addEventListener("mouseup", function (e) {
            if (e.button == 0)
                Mouse._leftNext = false;
            else
                Mouse._rightNext = false;
        });
    }
    static update() {
        this._leftWas = this._left;
        this._left = this._leftNext;
        this._rightWas = this._right;
        this._right = this._rightNext;
        this._position = this._positionNext;
    }
    static setNextMouseTo(pageX, pageY) {
        let screen = Engine.graphics.canvas.getBoundingClientRect();
        let scaled = Engine.graphics.getOutputBounds();
        let scale = new Vector(scaled.width / Engine.width, scaled.height / Engine.height);
        var was = Mouse._positionNext;
        Mouse._positionNext = new Vector((pageX - screen.left - scaled.left) / scale.x, (pageY - screen.top - scaled.top) / scale.y);
    }
}
Mouse.absolute = new Vector(0, 0);
class PrimitiveRenderer extends Renderer {
    constructor() {
        super();
        this.shader = Shaders.primitive;
        this.shaderCameraUniformName = "matrix";
    }
}
class SpriteRenderer extends Renderer {
    constructor() {
        super();
        this.shader = Shaders.texture;
        this.shaderCameraUniformName = "matrix";
    }
}
class Calc {
    static sign(n) {
        return (n < 0 ? -1 : (n > 0 ? 1 : 0));
    }
    static clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }
    static approach(n, target, step) {
        return n > target ? Math.max(n - step, target) : Math.min(n + step, target);
    }
    static range(min, max) {
        if (max == undefined)
            return -min + Math.random() * min * 2;
        return min + Math.random() * (max - min);
    }
    static choose(list) {
        return list[Math.floor(Math.random() * list.length)];
    }
}
class Camera {
    constructor() {
        this.position = new Vector(0, 0);
        this.origin = new Vector(0, 0);
        this.scale = new Vector(1, 1);
        this.rotation = 0;
        this._matrix = new Matrix();
        this._internal = new Matrix();
        this._mouse = new Vector();
        this.extentsA = new Vector();
        this.extentsB = new Vector();
        this.extentsC = new Vector();
        this.extentsD = new Vector();
        this.extentsRect = new Rectangle();
    }
    get x() { return this.position.x; }
    set x(n) { this.position.x = n; }
    get y() { return this.position.y; }
    set y(n) { this.position.y = n; }
    get internal() {
        return this._internal.identity()
            .translate(this.origin.x, this.origin.y)
            .rotate(this.rotation)
            .scale(this.scale.x, this.scale.y)
            .translate(-this.position.x, -this.position.y);
    }
    get matrix() {
        return this._matrix
            .copy(Engine.graphics.orthographic)
            .multiply(this.internal);
    }
    get mouse() {
        return this._mouse.set(Mouse.x + this.position.x - this.origin.x, Mouse.y + this.position.y - this.origin.y).transform(this.internal.invert());
    }
    getExtents() {
        let inverse = this.internal.invert();
        this.extentsA.set(0, 0).transform(inverse);
        this.extentsB.set(Engine.width, 0).transform(inverse);
        this.extentsC.set(0, Engine.height).transform(inverse);
        this.extentsD.set(Engine.width, Engine.height).transform(inverse);
    }
    get extents() {
        this.getExtents();
        let r = this.extentsRect;
        r.x = Math.min(this.extentsA.x, this.extentsB.x, this.extentsC.x, this.extentsD.x);
        r.y = Math.min(this.extentsA.y, this.extentsB.y, this.extentsC.y, this.extentsD.y);
        r.width = Math.max(this.extentsA.x, this.extentsB.x, this.extentsC.x, this.extentsD.x) - r.x;
        r.height = Math.max(this.extentsA.y, this.extentsB.y, this.extentsC.y, this.extentsD.y) - r.y;
        return r;
    }
}
class Ease {
    static linear(t) {
        return t;
    }
    static quadIn(t) {
        return t * t;
    }
    static quadOut(t) {
        return 1 - Ease.quadIn(1 - t);
    }
    static quadInOut(t) {
        return (t <= 0.5) ? Ease.quadIn(t * 2) / 2 : Ease.quadOut(t * 2 - 1) / 2 + 0.5;
    }
    static cubeIn(t) {
        return t * t * t;
    }
    static cubeOut(t) {
        return 1 - Ease.cubeIn(1 - t);
    }
    static cubeInOut(t) {
        return (t <= 0.5) ? Ease.cubeIn(t * 2) / 2 : Ease.cubeOut(t * 2 - 1) / 2 + 0.5;
    }
    static backIn(t) {
        return t * t * (2.70158 * t - 1.70158);
    }
    static backOut(t) {
        return 1 - Ease.backIn(1 - t);
    }
    static backInOut(t) {
        return (t <= 0.5) ? Ease.backIn(t * 2) / 2 : Ease.backOut(t * 2 - 1) / 2 + 0.5;
    }
    static expoIn(t) {
        return Math.pow(2, 10 * (t - 1));
    }
    static expoOut(t) {
        return 1 - Ease.expoIn(t);
    }
    static expoInOut(t) {
        return t < .5 ? Ease.expoIn(t * 2) / 2 : Ease.expoOut(t * 2) / 2;
    }
    static sineIn(t) {
        return -Math.cos((Math.PI / 2) * t) + 1;
    }
    static sineOut(t) {
        return Math.sin((Math.PI / 2) * t);
    }
    static sineInOut(t) {
        return -Math.cos(Math.PI * t) / 2 + .5;
    }
    static elasticInOut(t) {
        if ((t /= 0.5) == 2)
            return 1;
        let p = (0.3 * 1.5);
        let s = p / 4;
        if (t < 1)
            return -0.5 * (Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        return Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
    }
    static arc(t, ease) {
        if (t < 0.5)
            return 1 - ease(1 - t * 2);
        return (1 - ease((t - 0.5) * 2));
    }
}
class FosterIO {
    static init() {
        if (FosterIO.fs == null && Engine.client == Client.Desktop) {
            FosterIO.fs = require("fs");
            FosterIO.path = require("path");
        }
    }
    static read(path, callback) {
        if (Engine.client == Client.Desktop) {
            FosterIO.fs.readFile(FosterIO.path.join(__dirname, path), 'utf8', function (err, data) {
                if (err)
                    throw err;
                callback(data);
            });
        }
        else {
            let httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = (e) => {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200)
                        callback(httpRequest.responseText);
                    else
                        throw "Unable to read file " + path;
                }
            };
            httpRequest.open('GET', path);
            httpRequest.send();
        }
    }
    static join(...paths) {
        if (paths.length <= 0)
            return ".";
        if (Engine.client == Client.Desktop) {
            let result = paths[0];
            for (let i = 1; i < paths.length; i++)
                result = FosterIO.path.join(result, paths[i]);
            return result;
        }
        else {
            let result = [];
            for (let i = 0; i < paths.length; i++) {
                let sub = paths[i].split("/");
                for (let j = 0; j < sub.length; j++)
                    result.push(sub[j]);
            }
            return result.length > 0 ? result.join("/") : ".";
        }
    }
    static extension(path) {
        let ext = "";
        let parts = (/(?:\.([^.]+))?$/).exec(path);
        if (parts.length > 1)
            ext = parts[1];
        return ext;
    }
}
FosterIO.fs = null;
FosterIO.path = null;
class Matrix {
    constructor() {
        this.mat = new Float32Array(9);
        this.identity();
    }
    identity() {
        this.mat[0] = 1;
        this.mat[1] = 0;
        this.mat[2] = 0;
        this.mat[3] = 0;
        this.mat[4] = 1;
        this.mat[5] = 0;
        this.mat[6] = 0;
        this.mat[7] = 0;
        this.mat[8] = 1;
        return this;
    }
    copy(o) {
        this.mat[0] = o.mat[0];
        this.mat[1] = o.mat[1];
        this.mat[2] = o.mat[2];
        this.mat[3] = o.mat[3];
        this.mat[4] = o.mat[4];
        this.mat[5] = o.mat[5];
        this.mat[6] = o.mat[6];
        this.mat[7] = o.mat[7];
        this.mat[8] = o.mat[8];
        return this;
    }
    set(a, b, c, d, tx, ty) {
        this.mat[0] = a;
        this.mat[1] = d;
        this.mat[2] = 0;
        this.mat[3] = c;
        this.mat[4] = b;
        this.mat[5] = 0;
        this.mat[6] = tx;
        this.mat[7] = ty;
        this.mat[8] = 1;
        return this;
    }
    add(o) {
        this.mat[0] += o.mat[0];
        this.mat[1] += o.mat[1];
        this.mat[2] += o.mat[2];
        this.mat[3] += o.mat[3];
        this.mat[4] += o.mat[4];
        this.mat[5] += o.mat[5];
        this.mat[6] += o.mat[6];
        this.mat[7] += o.mat[7];
        this.mat[8] += o.mat[8];
        return this;
    }
    sub(o) {
        this.mat[0] -= o.mat[0];
        this.mat[1] -= o.mat[1];
        this.mat[2] -= o.mat[2];
        this.mat[3] -= o.mat[3];
        this.mat[4] -= o.mat[4];
        this.mat[5] -= o.mat[5];
        this.mat[6] -= o.mat[6];
        this.mat[7] -= o.mat[7];
        this.mat[8] -= o.mat[8];
        return this;
    }
    scaler(s) {
        this.mat[0] *= s;
        this.mat[1] *= s;
        this.mat[2] *= s;
        this.mat[3] *= s;
        this.mat[4] *= s;
        this.mat[5] *= s;
        this.mat[6] *= s;
        this.mat[7] *= s;
        this.mat[8] *= s;
        return this;
    }
    invert() {
        var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8], b01 = a22 * a11 - a12 * a21, b11 = -a22 * a10 + a12 * a20, b21 = a21 * a10 - a11 * a20, det = a00 * b01 + a01 * b11 + a02 * b21;
        if (!det)
            return this;
        det = 1.0 / det;
        this.mat[0] = b01 * det;
        this.mat[1] = (-a22 * a01 + a02 * a21) * det;
        this.mat[2] = (a12 * a01 - a02 * a11) * det;
        this.mat[3] = b11 * det;
        this.mat[4] = (a22 * a00 - a02 * a20) * det;
        this.mat[5] = (-a12 * a00 + a02 * a10) * det;
        this.mat[6] = b21 * det;
        this.mat[7] = (-a21 * a00 + a01 * a20) * det;
        this.mat[8] = (a11 * a00 - a01 * a10) * det;
        return this;
    }
    multiply(o) {
        var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8], b00 = o.mat[0], b01 = o.mat[1], b02 = o.mat[2], b10 = o.mat[3], b11 = o.mat[4], b12 = o.mat[5], b20 = o.mat[6], b21 = o.mat[7], b22 = o.mat[8];
        this.mat[0] = b00 * a00 + b01 * a10 + b02 * a20;
        this.mat[1] = b00 * a01 + b01 * a11 + b02 * a21;
        this.mat[2] = b00 * a02 + b01 * a12 + b02 * a22;
        this.mat[3] = b10 * a00 + b11 * a10 + b12 * a20;
        this.mat[4] = b10 * a01 + b11 * a11 + b12 * a21;
        this.mat[5] = b10 * a02 + b11 * a12 + b12 * a22;
        this.mat[6] = b20 * a00 + b21 * a10 + b22 * a20;
        this.mat[7] = b20 * a01 + b21 * a11 + b22 * a21;
        this.mat[8] = b20 * a02 + b21 * a12 + b22 * a22;
        return this;
    }
    rotate(rad) {
        var a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], s = Math.sin(rad), c = Math.cos(rad);
        this.mat[0] = c * a00 + s * a10;
        this.mat[1] = c * a01 + s * a11;
        this.mat[2] = c * a02 + s * a12;
        this.mat[3] = c * a10 - s * a00;
        this.mat[4] = c * a11 - s * a01;
        this.mat[5] = c * a12 - s * a02;
        return this;
    }
    scale(x, y) {
        this.mat[0] = x * this.mat[0];
        this.mat[1] = x * this.mat[1];
        this.mat[2] = x * this.mat[2];
        this.mat[3] = y * this.mat[3];
        this.mat[4] = y * this.mat[4];
        this.mat[5] = y * this.mat[5];
        return this;
    }
    translate(x, y) {
        let a00 = this.mat[0], a01 = this.mat[1], a02 = this.mat[2], a10 = this.mat[3], a11 = this.mat[4], a12 = this.mat[5], a20 = this.mat[6], a21 = this.mat[7], a22 = this.mat[8];
        this.mat[6] = x * a00 + y * a10 + a20;
        this.mat[7] = x * a01 + y * a11 + a21;
        this.mat[8] = x * a02 + y * a12 + a22;
        return this;
    }
    fromRotation(rad) {
        var s = Math.sin(rad), c = Math.cos(rad);
        this.identity();
        this.mat[0] = c;
        this.mat[1] = -s;
        this.mat[3] = s;
        this.mat[4] = c;
        return this;
    }
    fromScale(x, y) {
        this.identity();
        this.mat[0] = x;
        this.mat[4] = y;
        return this;
    }
    fromTranslation(x, y) {
        this.identity();
        this.mat[6] = x;
        this.mat[7] = y;
        return this;
    }
}
class ObjectList {
    constructor() {
        this.objects = [];
        this._count = 0;
    }
    get count() { return this._count; }
    add(object) {
        this.objects.push(object);
        this._count++;
        this.unsorted = true;
        return object;
    }
    first() {
        let entry = null;
        for (let i = 0; i < this.objects.length && entry == null; i++)
            entry = this.objects[i];
        return entry;
    }
    each(callback) {
        let count = this.objects.length;
        for (let i = 0; i < count; i++)
            if (this.objects[i] != null)
                if (callback(this.objects[i]) === false)
                    break;
    }
    at(index) {
        for (let i = index; i < this.objects.length; i++)
            if (this.objects[i] != null)
                return this.objects[i];
        return null;
    }
    sort(compare) {
        if (this.unsorted) {
            for (let i = 0; i < this.objects.length - 1; ++i) {
                let j = i + 1;
                while (j > 0 && this.objects[j - 1] != null && this.objects[j] != null && compare(this.objects[j - 1], this.objects[j]) > 0) {
                    let temp = this.objects[j - 1];
                    this.objects[j - 1] = this.objects[j];
                    this.objects[j--] = temp;
                }
            }
            this.unsorted = false;
        }
    }
    remove(object) {
        let index = this.objects.indexOf(object);
        if (index >= 0) {
            this.objects[index] = null;
            this._count--;
            this.dirty = true;
            return true;
        }
        return false;
    }
    clear() {
        for (let i = 0; i < this.objects.length; i++)
            this.objects[i] = null;
        this._count = 0;
        this.dirty = true;
    }
    clean() {
        if (this.dirty) {
            if (this.count <= 0)
                this.objects = [];
            else {
                for (let i = this.objects.length - 1; i >= 0; i--)
                    if (this.objects[i] == null)
                        this.objects.splice(i, 1);
            }
        }
    }
}
class Rectangle {
    get left() { return this.x; }
    get right() { return this.x + this.width; }
    get top() { return this.y; }
    get bottom() { return this.y + this.height; }
    constructor(x, y, w, h) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = w || 1;
        this.height = h || 1;
    }
    set(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        return this;
    }
    overlapsVertically(rect) {
        return (rect.top > this.top && rect.top < this.bottom) ||
            (rect.bottom > this.top && rect.bottom < this.bottom);
    }
    overlapsHorizontally(rect) {
        return (rect.left > this.left && rect.left < this.right) ||
            (rect.right > this.left && rect.right < this.right);
    }
    cropRect(r) {
        if (r.x < this.x) {
            r.width += (r.x - this.x);
            r.x = this.x;
        }
        if (r.y < this.x) {
            r.height += (r.y - this.y);
            r.y = this.y;
        }
        if (r.x > this.right) {
            r.x = this.right;
            r.width = 0;
        }
        if (r.y > this.bottom) {
            r.y = this.bottom;
            r.height = 0;
        }
        if (r.right > this.right)
            r.width = this.right - r.x;
        if (r.bottom > this.bottom)
            r.height = this.bottom - r.y;
        return r;
    }
    crop(x, y, w, h, ref) {
        if (ref == undefined)
            ref = new Rectangle();
        ref.set(x, y, w, h);
        this.cropRect(ref);
        return ref;
    }
    clone() {
        return new Rectangle().copy(this);
    }
    copy(from) {
        this.x = from.x;
        this.y = from.y;
        this.width = from.width;
        this.height = from.height;
        return this;
    }
}
class Shader {
    constructor(vertex, fragment, uniforms, attributes) {
        this.dirty = true;
        this.uniformsByName = {};
        let gl = Engine.graphics.gl;
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertex);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
            throw "An error occurred compiling the shaders: " + gl.getShaderInfoLog(vertexShader);
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragment);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
            throw "An error occurred compiling the shaders: " + gl.getShaderInfoLog(fragmentShader);
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
            throw "Unable to initialize the shader program.";
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        this.attributes = attributes;
        for (let i = 0; i < this.attributes.length; i++)
            this.attributes[i].attribute = gl.getAttribLocation(this.program, this.attributes[i].name);
        this.uniforms = uniforms;
        for (let i = 0; i < this.uniforms.length; i++) {
            let uniform = this.uniforms[i];
            this.uniformsByName[uniform.name] = uniform;
            uniform.shader = this;
            uniform.uniform = gl.getUniformLocation(this.program, uniform.name);
            if (uniform.type == ShaderUniformType.sampler2D && this.sampler2d == null)
                this.sampler2d = uniform;
        }
    }
    set(name, value) {
        this.uniformsByName[name].value = value;
    }
}
var ShaderUniformType;
(function (ShaderUniformType) {
    ShaderUniformType[ShaderUniformType["float"] = 0] = "float";
    ShaderUniformType[ShaderUniformType["floatArray"] = 1] = "floatArray";
    ShaderUniformType[ShaderUniformType["float2"] = 2] = "float2";
    ShaderUniformType[ShaderUniformType["float2Array"] = 3] = "float2Array";
    ShaderUniformType[ShaderUniformType["float3"] = 4] = "float3";
    ShaderUniformType[ShaderUniformType["float3Array"] = 5] = "float3Array";
    ShaderUniformType[ShaderUniformType["float4"] = 6] = "float4";
    ShaderUniformType[ShaderUniformType["float4Array"] = 7] = "float4Array";
    ShaderUniformType[ShaderUniformType["matrix2d"] = 8] = "matrix2d";
    ShaderUniformType[ShaderUniformType["matrix3d"] = 9] = "matrix3d";
    ShaderUniformType[ShaderUniformType["matrix4d"] = 10] = "matrix4d";
    ShaderUniformType[ShaderUniformType["int"] = 11] = "int";
    ShaderUniformType[ShaderUniformType["intArray"] = 12] = "intArray";
    ShaderUniformType[ShaderUniformType["int2"] = 13] = "int2";
    ShaderUniformType[ShaderUniformType["int2Array"] = 14] = "int2Array";
    ShaderUniformType[ShaderUniformType["int3"] = 15] = "int3";
    ShaderUniformType[ShaderUniformType["int3Array"] = 16] = "int3Array";
    ShaderUniformType[ShaderUniformType["int4"] = 17] = "int4";
    ShaderUniformType[ShaderUniformType["int4Array"] = 18] = "int4Array";
    ShaderUniformType[ShaderUniformType["sampler2D"] = 19] = "sampler2D";
})(ShaderUniformType || (ShaderUniformType = {}));
class ShaderUniform {
    constructor(name, type, value) {
        this._value = null;
        this.name = name;
        this.type = type;
        this._value = value;
    }
    get value() { return this._value; }
    set value(a) {
        if (this.value != a) {
            this._value = a;
            this._shader.dirty = true;
            this.dirty = true;
        }
    }
    set shader(s) {
        if (this._shader != null)
            throw "This Uniform is already attached to a shader";
        this._shader = s;
    }
}
var ShaderAttributeType;
(function (ShaderAttributeType) {
    ShaderAttributeType[ShaderAttributeType["Position"] = 0] = "Position";
    ShaderAttributeType[ShaderAttributeType["Texcoord"] = 1] = "Texcoord";
    ShaderAttributeType[ShaderAttributeType["Color"] = 2] = "Color";
})(ShaderAttributeType || (ShaderAttributeType = {}));
class ShaderAttribute {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
var setGLUniformValue = {};
setGLUniformValue[ShaderUniformType.float] = (gl, location, value) => {
    gl.uniform1f(location, value);
};
setGLUniformValue[ShaderUniformType.float2] = (gl, location, value) => {
    if (value instanceof Vector)
        gl.uniform2f(location, value.x, value.y);
    else
        gl.uniform2f(location, value[0], value[1]);
};
setGLUniformValue[ShaderUniformType.float3] = (gl, location, value) => {
    gl.uniform3f(location, value[0], value[1], value[2]);
};
setGLUniformValue[ShaderUniformType.float4] = (gl, location, value) => {
    gl.uniform4f(location, value[0], value[1], value[2], value[3]);
};
setGLUniformValue[ShaderUniformType.floatArray] = (gl, location, value) => {
    gl.uniform1fv(location, value);
};
setGLUniformValue[ShaderUniformType.float2Array] = (gl, location, value) => {
    gl.uniform2fv(location, value);
};
setGLUniformValue[ShaderUniformType.float3Array] = (gl, location, value) => {
    gl.uniform3fv(location, value);
};
setGLUniformValue[ShaderUniformType.float4Array] = (gl, location, value) => {
    gl.uniform4fv(location, value);
};
setGLUniformValue[ShaderUniformType.int] = (gl, location, value) => {
    gl.uniform1i(location, value);
};
setGLUniformValue[ShaderUniformType.int2] = (gl, location, value) => {
    if (value instanceof Vector)
        gl.uniform2i(location, Math.round(value.x), Math.round(value.y));
    else
        gl.uniform2i(location, value[0], value[1]);
};
setGLUniformValue[ShaderUniformType.int3] = (gl, location, value) => {
    gl.uniform3i(location, value[0], value[1], value[2]);
};
setGLUniformValue[ShaderUniformType.int4] = (gl, location, value) => {
    gl.uniform4i(location, value[0], value[1], value[2], value[3]);
};
setGLUniformValue[ShaderUniformType.intArray] = (gl, location, value) => {
    gl.uniform1iv(location, value);
};
setGLUniformValue[ShaderUniformType.int2Array] = (gl, location, value) => {
    gl.uniform2iv(location, value);
};
setGLUniformValue[ShaderUniformType.int3Array] = (gl, location, value) => {
    gl.uniform3iv(location, value);
};
setGLUniformValue[ShaderUniformType.int4Array] = (gl, location, value) => {
    gl.uniform4iv(location, value);
};
setGLUniformValue[ShaderUniformType.matrix2d] = (gl, location, value) => {
    gl.uniformMatrix2fv(location, false, value);
};
setGLUniformValue[ShaderUniformType.matrix3d] = (gl, location, value) => {
    if (value instanceof Matrix)
        gl.uniformMatrix3fv(location, false, value.mat);
    else
        gl.uniformMatrix3fv(location, false, value);
};
setGLUniformValue[ShaderUniformType.matrix4d] = (gl, location, value) => {
    gl.uniformMatrix2fv(location, false, value);
};
class Shaders {
    static init() {
        Shaders.texture = new Shader('attribute vec2 a_position;' +
            'attribute vec2 a_texcoord;' +
            'attribute vec4 a_color;' +
            'uniform mat3 matrix;' +
            'varying vec2 v_texcoord;' +
            'varying vec4 v_color;' +
            'void main()' +
            '{' +
            '	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);' +
            '	v_texcoord = a_texcoord;' +
            '	v_color = vec4(a_color.rgb * a_color.a, a_color.a);' +
            '}', 'precision mediump float;' +
            'varying vec2 v_texcoord;' +
            'varying vec4 v_color;' +
            'uniform sampler2D texture;' +
            'void main() ' +
            '{' +
            '	gl_FragColor = texture2D(texture, v_texcoord) * v_color;' +
            '}', [
            new ShaderUniform("matrix", ShaderUniformType.matrix3d),
            new ShaderUniform("texture", ShaderUniformType.sampler2D)
        ], [
            new ShaderAttribute('a_position', ShaderAttributeType.Position),
            new ShaderAttribute('a_texcoord', ShaderAttributeType.Texcoord),
            new ShaderAttribute('a_color', ShaderAttributeType.Color)
        ]);
        Shaders.solid = new Shader('attribute vec2 a_position;' +
            'attribute vec2 a_texcoord;' +
            'attribute vec4 a_color;' +
            'uniform mat3 matrix;' +
            'varying vec2 v_texcoord;' +
            'varying vec4 v_color;' +
            'void main()' +
            '{' +
            '	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);' +
            '	v_texcoord = a_texcoord;' +
            '	v_color = a_color;' +
            '}', 'precision mediump float;' +
            'varying vec2 v_texcoord;' +
            'varying vec4 v_color;' +
            'uniform sampler2D texture;' +
            'void main() ' +
            '{' +
            '	gl_FragColor = v_color * texture2D(texture, v_texcoord).a;' +
            '}', [
            new ShaderUniform("matrix", ShaderUniformType.matrix3d),
            new ShaderUniform("texture", ShaderUniformType.sampler2D)
        ], [
            new ShaderAttribute('a_position', ShaderAttributeType.Position),
            new ShaderAttribute('a_texcoord', ShaderAttributeType.Texcoord),
            new ShaderAttribute('a_color', ShaderAttributeType.Color)
        ]);
        Shaders.primitive = new Shader('attribute vec2 a_position;' +
            'attribute vec4 a_color;' +
            'uniform mat3 matrix;' +
            'varying vec4 v_color;' +
            'void main()' +
            '{' +
            '	gl_Position = vec4((matrix * vec3(a_position, 1.0)).xy, 0.0, 1.0);' +
            '	v_color = a_color;' +
            '}', 'precision mediump float;' +
            'varying vec4 v_color;' +
            'void main() ' +
            '{' +
            '	gl_FragColor = v_color;' +
            '}', [
            new ShaderUniform("matrix", ShaderUniformType.matrix3d)
        ], [
            new ShaderAttribute('a_position', ShaderAttributeType.Position),
            new ShaderAttribute('a_color', ShaderAttributeType.Color)
        ]);
    }
}
//# sourceMappingURL=game.js.map