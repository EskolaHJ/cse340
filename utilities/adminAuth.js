const jwt = require("jsonwebtoken");

function adminAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    req.flash("error", "You must be logged in as an Employee or Admin to access that page.");
    return res.redirect("/account/login");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.flash("error", "Your session has expired. Please log in again.");
      return res.redirect("/account/login");
    }
    // Allow only Employee or Admin account types to continue.
    if (decoded.account_type !== "Employee" && decoded.account_type !== "Admin") {
      req.flash("error", "You do not have permission to view that page.");
      return res.redirect("/account/login");
    }
    req.user = decoded; // Attach the decoded info to the request.
    next();
  });
}

module.exports = { adminAuth };
