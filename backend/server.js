const Koa = require('koa');
const Router = require('koa-router');
const { koaBody } = require('koa-body');
const serve = require('koa-static');
const cors = require('@koa/cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = new Koa();
const router = new Router();

const DATA_FILE = path.join(__dirname, 'data', 'recipes.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

// Middleware
app.use(cors());
app.use(serve(path.join(__dirname, 'public'))); // Serve uploaded images
app.use(serve(path.join(__dirname, 'dist')));   // Serve frontend build

app.use(koaBody({
    multipart: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    formidable: {
        uploadDir: UPLOAD_DIR,
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024 // 5MB
    }
}));

// Helper to read data
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Routes

// GET /api/recipes - Get all recipes
router.get('/api/recipes', async (ctx) => {
    ctx.body = readData();
});

// POST /api/recipes - Create new recipe with image
router.post('/api/recipes', async (ctx) => {
    const { title, tags } = ctx.request.body;
    const file = ctx.request.files ? ctx.request.files.image : null;

    if (!title || !file) {
        ctx.status = 400;
        ctx.body = { error: 'Title and image are required' };
        return;
    }

    const recipes = readData();
    const id = uuidv4();
    const imageName = path.basename(file.filepath);
    
    // Parse tags (could be a string or array depending on how it's sent)
    let parsedTags = [];
    if (typeof tags === 'string') {
        try {
            parsedTags = JSON.parse(tags);
        } catch (e) {
            parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
        }
    } else if (Array.isArray(tags)) {
        parsedTags = tags;
    }

    const newRecipe = {
        id,
        title,
        image: `/uploads/${imageName}`,
        tags: parsedTags,
        createdAt: new Date().toISOString()
    };

    recipes.push(newRecipe);
    writeData(recipes);

    ctx.body = newRecipe;
});

// PUT /api/recipes/:id - Update recipe
router.put('/api/recipes/:id', async (ctx) => {
    const { id } = ctx.params;
    const { title, tags } = ctx.request.body;
    const file = ctx.request.files ? ctx.request.files.image : null;

    let recipes = readData();
    const recipeIndex = recipes.findIndex(r => r.id === id);

    if (recipeIndex === -1) {
        ctx.status = 404;
        ctx.body = { error: 'Recipe not found' };
        return;
    }

    if (!title) {
        ctx.status = 400;
        ctx.body = { error: 'Title is required' };
        return;
    }

    const recipe = recipes[recipeIndex];
    let imagePath = recipe.image;

    // Delete old image and save new one if provided
    if (file) {
        const oldPath = path.join(__dirname, 'public', recipe.image.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) {
            try {
                fs.unlinkSync(oldPath);
            } catch (err) {
                console.error('Failed to delete old image:', err);
            }
        }
        imagePath = `/uploads/${path.basename(file.filepath)}`;
    }

    // Parse tags
    let parsedTags = [];
    if (typeof tags === 'string') {
        try {
            parsedTags = JSON.parse(tags);
        } catch (e) {
            parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);
        }
    } else if (Array.isArray(tags)) {
        parsedTags = tags;
    }

    recipes[recipeIndex] = {
        ...recipe,
        title,
        image: imagePath,
        tags: parsedTags
    };
    writeData(recipes);

    ctx.body = recipes[recipeIndex];
});

// DELETE /api/recipes/:id - Delete recipe and image
router.delete('/api/recipes/:id', async (ctx) => {
    const { id } = ctx.params;
    let recipes = readData();
    const recipeIndex = recipes.findIndex(r => r.id === id);

    if (recipeIndex === -1) {
        ctx.status = 404;
        ctx.body = { error: 'Recipe not found' };
        return;
    }

    const recipe = recipes[recipeIndex];
    
    // Delete image file if it exists
    if (recipe.image) {
        const imagePath = path.join(__dirname, 'public', recipe.image.replace(/^\//, ''));
        if (fs.existsSync(imagePath)) {
            try {
                fs.unlinkSync(imagePath);
            } catch (err) {
                console.error('Failed to delete image:', err);
            }
        }
    }

    recipes.splice(recipeIndex, 1);
    writeData(recipes);

    ctx.status = 204;
});

// Serve index.html for any unknown routes (SPA fallback) - MUST be last
router.get('(.*)', async (ctx) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
        ctx.type = 'html';
        ctx.body = fs.createReadStream(indexPath);
    } else {
        ctx.status = 404;
        ctx.body = 'Frontend not built yet';
    }
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
