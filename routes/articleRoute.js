const express = require("express");
const router = express.Router();

const { getallarticle, createnewarticle, deletearticle, updatearticle } = require("../controller/articleController")
router.get('/', getallarticle);
router.post('/', createnewarticle);
router.put('/:id', updatearticle);
router.delete('/:id', deletearticle);


module.exports = router;
