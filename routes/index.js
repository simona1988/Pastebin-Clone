const express = require('express');
const router = express.Router();
const pool = require('../db'); 

router.post('/save', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }
        const result = await pool.query(
            "INSERT INTO snippets (content) VALUES ($1) RETURNING *",
            [content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
module.exports = router;

router.get('/snippets', async (req, res) => {
    console.log("S-a apelat ruta /snippets");
    try {
        const result = await pool.query("SELECT * FROM snippets ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/snippets/:id', async (req, res) => {
    try {
        const snippetId = req.params.id;
        const result = await pool.query("SELECT * FROM snippets WHERE id = $1", [snippetId]);
        if (result.rows.length === 0) {
            return res.status(404).send("Snippet not found");
        }
        res.render('snippet', { snippet: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});