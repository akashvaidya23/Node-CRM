const { secret, getCurrentUser } = require('../controllers/userController');

const checkAuth = async (req, resp, next) => {
    const userId = req.headers.authorization.split(" ")[1];
    if (!userId) {
        return resp.status(401).json({ success: false, message: "Unauthorized 123" });
    }
    req.params.id = userId;
    req.user = await getCurrentUser(req, resp);
    next();
};

const restrictTo = (roles) => {
    return (req, resp, next) => {
        if(!req.user){
            return resp.status(401).json({ success: false, message: "No user received." });
        }

        if(!roles.includes(req.user.role)) {
            return resp.status(403).json({ success: false, message: "You do not have permission to perform this action." });
        }

        return next();
    }
}

module.exports = {
    checkAuth, restrictTo
};