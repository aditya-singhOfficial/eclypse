const validateRegistration = (req, res, next) => {
    const {username, email, password} = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
        return res.status(400).json({error: "All fields are required", success: false});
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({error: "Invalid email format", success: false});
    }

    // Validate password strength
    if (password.length < 6) {
        return res.status(400).json({error: "Password must be at least 6 characters long", success: false});
    }

    next();
}

const validateLogin = (req, res, next) => {
    const {email, password} = req.body;

    // Check if both fields are provided
    if (!email || !password) {
        return res.status(400).json({error: "Email and password are required", success: false});
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({error: "Invalid email format", success: false});
    }

    next();
}

export {validateRegistration, validateLogin};