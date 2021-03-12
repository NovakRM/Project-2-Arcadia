const fs = require("fs");

const db = require("../../models");
const Image = db.images;

const uploadFiles = async (req, res) => {
  try {
    console.log(req.file);

    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    console.log(req.user.id)
    Image.create({
      type: req.file.mimetype,
      name: req.file.originalname,
      UserId: req.user.id,
      data: fs.readFileSync(
        __basedir + "/public/assets/uploads/" + req.file.filename
      ),
    }).then((image) => {
      fs.writeFileSync(
        __basedir + "/public/assets/tmp/" + image.name,
        image.data
      );

      return res.render(`profile`);
    });
  } catch (error) {
    console.log(error);
    return res.send(`Error when trying upload images: ${error}`);
  }
};

module.exports = {
  uploadFiles,
};