const express = require("express");
const router = express.Router();

router.post('/api/notes', async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;  //User authenticated
    
    try {
      const result = await db.run(
        'INSERT INTO Notes (user_id, content) VALUES (?, ?)',
        [userId, content]
      );
      res.json({ success: true, noteId: result.lastID });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save note' });
    }
  });
  
  router.delete('/api/notes/:id', async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;
  
    try {
      // Move the note to the deleted_notes table
      await db.run(
        'INSERT INTO Deleted_Notes (user_id, note_id) VALUES (?, ?)',
        [userId, noteId]
      );
  
      // Delete the note from the notes table
      await db.run('DELETE FROM Notes WHERE id = ? AND user_id = ?', [noteId, userId]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete note' });
    }
  });

router.post('/api/deleted-notes/restore/:id', async (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;
  
    try {
      // Move the note back to the notes table
      const note = await db.get('SELECT * FROM Deleted_Notes WHERE note_id = ?', [noteId]);
      await db.run(
        'INSERT INTO Notes (user_id, content) SELECT user_id, content FROM Deleted_Notes WHERE note_id = ?',
        [noteId]
      );
  
      // Deleting the note from the deleted notes table
      await db.run('DELETE FROM Deleted_Notes WHERE note_id = ?', [noteId]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to restore note' });
    }
  });
// Export the router object so index.js can access it
module.exports = router;