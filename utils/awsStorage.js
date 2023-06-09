const AWS = require("aws-sdk");
const {
    AWS_SECRET_ACCESS_KEY,
    AWS_ACCESS_KEY,
    AWS_REGION,
    AWS_BUCKET_NAME,
    AWS_ACCESS_VERCEL,
    AWS_SECRET_ACCESS_KEY_VERCEL
} = require("../config/config");

AWS.config.update({
    accessKeyId: AWS_ACCESS_VERCEL,
    secretAccessKey: AWS_SECRET_ACCESS_KEY_VERCEL,
    region: AWS_REGION
});

const s3 = new AWS.S3();
let multer = require("multer");
let multerS3 = require("multer-s3")
// const bucketName = process.env.AWS_BUCKET_NAME

//Specify the multer config
exports.upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 1024,
    },
    fileFilter: function (req, file, done) {
        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "video/quicktime" ||
            file.mimetype === "video/mp4"
        ) {
            done(null, true);
        } else {
            //prevent the upload
            var newError = new Error("File type is incorrect");
            newError.name = "MulterError";
            done(newError, false);
        }
    },
});

//upload to s3
exports.uploadToS3 = (fileData) => {
    console.log("bucket name: ", AWS_BUCKET_NAME)
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: AWS_BUCKET_NAME,
            Key: `${Date.now().toString()}.jpg`,
            Body: fileData
        };
        s3.upload(params, (err, data) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            console.log(data);
            return resolve(data);
        });
    });
};

//add this script
//upload multiple images to s3

// app.post("/upload-multiple", upload.array(15), async (req, res) => {
//     // console.log(req.files);

//     if (req.files && req.files.length > 0) {
//         for (var i = 0; i < req.files.length; i++) {
//             // console.log(req.files[i]);
//             await uploadToS3(req.files[i].buffer);
//         }
//     }
// }

// const uploadToS3 = (bucketName, fileName, buffer) => {
//     return new Promise((resolve, reject) => {
//         const params = {
//             Bucket: bucketName,
//             Key: fileName, // File name you want to save as in S3
//             Body: buffer,
//         };

// s3.putObject(params, (err, data) => {
//     if (err) {
//         reject(err);
//     }
//     resolve({
//         ...data,
//         object_url: `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${fileName}`,
//     });
// });
//     });
// };

// module.exports = uploadToS3;