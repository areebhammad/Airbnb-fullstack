const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User.js");
const Place = require("./models/Place.js");
const Booking = require("./models/Booking.js");
const { default: mongoose } = require("mongoose");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const mime = require("mime-types");

require("dotenv").config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "adewsdfgtrefghjuyth";
//or
// const bcryptSalt = await bcrypt.genSalt(8)

//req.body is in json so we need to use express.json()
app.use(express.json());
app.use("/upload", express.static(__dirname + "/upload"));
app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

// async function uploadToAzureBlobStorage(path, originalFilename, mimetype) {
//   const blobServiceClient = new BlobServiceClient(
//     process.env.AZURE_STORAGE_CONNECTION_STRING,
//     new DefaultAzureCredential()
//   );

// const containerName = "images";
// const containerClient = blobServiceClient.getContainerClient(containerName);

// const parts = originalFilename.split(".");
// const ext = parts[parts.length - 1];
// const newFilename = Date.now() + "." + ext;

//   const blockBlobClient = containerClient.getBlockBlobClient(newFilename);
//   await blockBlobClient.uploadFile(path, {
//     blobHTTPHeaders: {
//       blobContentType: mimetype,
//       blobCacheControl: "public, max-age=31536000",
//     },
//     metadata: { fileName: originalFilename },
//   });

//   return blockBlobClient.url;
// }

function getUserDataFromReq(req) {
  return new Promise((resolve, rejects) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, user) => {
      if (err) throw err;
      resolve(user);
    });
  });
}

app.get("/test", (req, res) => {
  res.json("Test Okay");
});

app.post("/register", async (req, res) => {
  //req.body requires app.use(express.json());
  const { names, email, password } = req.body;
  try {
    const userDoc = await User.create({
      names,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.json("pass not Ok");
    }
  } else {
    res.status(422).json("Wrong password");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) throw err;
      const { names, email, id } = await User.findById(user.id);
      res.json({ names, email, id });
    });
  } else {
    res.json(null);
  }
});

console.log(__dirname);
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/upload" + newName,
    // dest: "/tmp/" + newName,
  });
  // const url = await uploadToAzureBlobStorage(
  //   "/tmp/" + newName,
  //   newName,
  //   mime.lookup("/tmp/" + newName)
  // );
  res.json(newName);
});

const photoMiddleware = multer({ dest: "/upload" });
// const photoMiddleware = multer({ dest: "/tmp" });
app.post("/upload", photoMiddleware.array("photos", 100), async (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    // const url = await uploadToAzureBlobStorage(path, originalname, mimetype);
    // uploadedFiles.push(url);
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("upload/", ""));
  }
  res.json(uploadedFiles);
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: user.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});

app.get("/user-places", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) throw err;
    const { id } = user;
    res.json(await Place.find({ owner: id }));
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  // req.json(req.params);
  // console.log({ id });
  res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  // const { id } = req.params;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, user) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (user.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

app.get("/places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);

  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;
  Booking.create({
    place,
    user: userData.id,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
});

app.get("/bookings", async (req, res) => {
  // const { token } = req.cookies;
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("place"));
});

app.listen(1337);
