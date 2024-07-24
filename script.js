// preloader
const preloader = document.querySelector(".loader");

window.addEventListener("load", () => {
  // Fade out the preloader with a transition
  preloader.style.opacity = 0;
  preloader.style.transition = "opacity 0.5s ease-out";

  // Optionally, remove the preloader completely after a delay
  setTimeout(() => {
    preloader.parentNode.removeChild(preloader); // Remove from DOM
  }, 1000); // Delay in milliseconds (optional)
});

// <Script for Toggle Menu>
let MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px";

function menutoggle() {
  if (MenuItems.style.maxHeight == "0px") {
    MenuItems.style.maxHeight = "200px";
  } else {
    MenuItems.style.maxHeight = "0px";
  }
}

// Script for Toggle Form

let LoginForm = document.getElementById("LoginForm");
let RegForm = document.getElementById("RegForm");
let Indicator = document.getElementById("Indicator");

function register() {
  RegForm.style.transform = "translateX(0px)";
  LoginForm.style.transform = "translateX(0px)";
  Indicator.style.transform = "translateX(100px)";
}

function login() {
  RegForm.style.transform = "translateX(300px)";
  LoginForm.style.transform = "translateX(300px)";
  Indicator.style.transform = "translateX(0px)";
}

// Script for Product-img
let ProductImg = document.getElementById("productImg");
let SmallImg = document.getElementsByClassName("small-img");
SmallImg[0].onclick = function () {
  ProductImg.src = SmallImg[0].src;
};
SmallImg[1].onclick = function () {
  ProductImg.src = SmallImg[1].src;
};
SmallImg[2].onclick = function () {
  ProductImg.src = SmallImg[2].src;
};
SmallImg[3].onclick = function () {
  ProductImg.src = SmallImg[3].src;
};

//database connection
const mysql = require("mysql");

const pool = mysql.createPool({
  host: "your_host",
  user: "your_user",
  password: "your_password",
  database: "your_database",
});

// user schema
const User = {
  id: "",
  email: "",
  phone: "",
  password: "",
  created_at: "",
};

//crud operations
// Create a user
const createUser = async (user) => {
  // Hash password
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;

  // Insert into database
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO users SET ?", user, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Find a user by email
const findUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
};

// ... other CRUD operations

//authentication
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const token = jwt.sign({ id: user.id }, "your_secret_key", {
    expiresIn: "1h",
  });
  return token;
};

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = createToken(user);
  res.json({ token });
});

// Register endpoint
app.post("/register", async (req, res) => {
  const user = req.body;
  try {
    await createUser(user);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
});
