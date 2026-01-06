import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import serverless from "serverless-http";
import path from "path";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

app.use((req, res, next) => {
    res.locals.q = "";
    res.locals.sort = "newest";
    next();
});

app.get("/create", (req, res) => {
    res.render("create.ejs");
});

app.post("/create", (req, res) => {
    const { title, description } = req.body;
    if (!title.trim() || !description.trim()) {
        return res.render("create.ejs", { error: "Please fill in all fields." });
    }
    createPosts(title, description);
    res.redirect("/");
});

app.get("/", (req, res) => {
    res.locals.q = req.query.q?.toLowerCase() || "";
    res.locals.sort = req.query.sort || "newest";
    let result = [...posts];

    if (res.locals.q) {
        result = result.filter(post =>
            post.title.toLowerCase().includes(res.locals.q) ||
            post.description.toLowerCase().includes(res.locals.q)
        );
    }

    if (res.locals.sort === "oldest") {
        result.sort((a, b) => a.rawDate - b.rawDate);
    } else if (res.locals.sort === "newest") {
        result.sort((a, b) => b.rawDate - a.rawDate);
    } else if (res.locals.sort === "alpha") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    }

    res.render("index.ejs", { posts: result });
});

app.get("/post/:id", (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.redirect("/");

    res.render("post.ejs", { post, id: post.id });
});

app.get("/edit/:id", (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.redirect("/");

    res.render("edit.ejs", { post, id: post.id });
});

app.post("/edit/:id", (req, res) => {
    const idToEdit = req.params.id;
    const { title, description } = req.body;
    
    const post = posts.find(p => p.id === idToEdit);
    if (post) {
        post.title = title;
        post.description = description;
    }
    
    res.redirect("/");
});

app.post("/delete/:id", (req, res) => {
    const idToDelete = req.params.id;
    posts = posts.filter(post => post.id !== idToDelete);
    res.redirect("/");
});

class blog {
    constructor(title, description) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.rawDate = new Date();
        this.date = this.rawDate.toLocaleString();
    }
}

function createPosts(title, des){
    const post = new blog(title, des);
    posts.push(post);
}

let posts = [
    new blog(
        "Building My First Server-Rendered App with Node.js & EJS",
        "This project was my first hands-on experience building a server-rendered web application using Node.js, Express, and EJS. Instead of relying on a database, I focused on understanding routing, request handling, and dynamic templating. I implemented features like creating, editing, deleting, searching, and sorting posts, all while keeping the UI clean and responsive with Bootstrap. This project helped me understand how backend logic connects directly to the frontend without using APIs."
    ),
    new blog(
        "Why I Chose Server-Side Rendering Before Learning Databases",
        "Before diving into databases and authentication, I wanted to fully understand how server-side rendering works. By building a blog without persistent storage, I could focus on Express routing, form handling, and application structure without unnecessary complexity. This approach helped me build confidence with backend fundamentals and prepared me to later introduce databases and REST APIs in a structured way."
    )
];

// Wrap Express app for Vercel serverless
export default serverless(app);




