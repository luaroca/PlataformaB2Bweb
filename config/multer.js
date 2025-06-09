const multer = require("multer")
const path = require("path")
const fs = require("fs")

// imágenes de productos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const filename = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext
    cb(null, filename)
  },
})

const upload = multer({ storage })


const storageResenas = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads", "resenas")
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "resena-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const uploadResenas = multer({
  storage: storageResenas,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Solo se permiten archivos de imagen (JPEG, PNG, GIF)"))
    }
  },
})

module.exports = { upload, uploadResenas }
