const registeruser = ((req, res) => {

    res.send({ message: "This is register user " })
})

const loginuser = ((req, res) => {
    res.send({ message: "this is login" });

})

const currentuser = (req, res) => {
    res.send({ message: "this is current day" })
}

module.exports = {
    registeruser,
    loginuser,
    currentuser
}