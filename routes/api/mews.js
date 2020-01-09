const express = require('express'), { check, validationResult } = require('express-validator'), monk = require('monk'), config = require('config'), badwords = require('bad-words'), ratelimit = require('express-rate-limit');
const router = express.Router(), db = monk(config.get('mongoURICloud')), mews = db.get('mews'), filter = new badwords();

router.get('/', async (req, res) => {
    const tweetData = await mews.find();
    res.json(tweetData); db.close(); return;
});
router.use(ratelimit({ windowMs: 30 * 1000, max: 1 }));
router.post('/', [check('name', 'Name is required').notEmpty(), check('mew', 'Mew is required').notEmpty()], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); }
        const tweetData = { name: filter.clean(req.body.name.toString()), mew: filter.clean(req.body.mew.toString()) };
        await mews.insert(tweetData); res.json(tweetData); db.close(); return;
    } catch (err) { res.status(500).send('Server Error'); }
});
module.exports = router;