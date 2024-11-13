import { Pin } from "../models/pinModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const createPin = TryCatch(async (req, res) => {
    console.log("Inside createPin controller");
    const { title, pin } = req.body;
    console.log("Request body:", req.body);
  
    const file = req.file;
    console.log("Uploaded file:", file);
  
    if (!file) {
      return res.status(400).json({ error: "File upload failed" });
    }
  
    const fileUrl = getDataUrl(file);
    console.log("File URL generated:", fileUrl);
  
    // Upload to Cloudinary
    const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);
    console.log("Uploaded to Cloudinary:", cloud);
  
    try {
      await Pin.create({
        title,
        pin,
        image: {
          id: cloud.public_id,
          url: cloud.secure_url,
        },
        owner: req.user._id,
      });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Failed to create pin in the database" });
    }
  
    res.json({
      message: "pin created",
    });
  });

  
  export const getAllPins = TryCatch(async(req,res) => {
    const pins = await Pin.find().sort({createdAt: -1});

    res.json(pins);
  });

  export const getSinglePin = TryCatch(async(req,res) => {
    const pin = await Pin.findById(req.params.id).populate("owner", "-password");

    res.json(pin);
  });

  export const commentOnPin = TryCatch(async(req,res) => {
    const pin = await Pin.findById(req.params.id);
    
    if(!pin)
        return res.status(400).json({
    message: "No pin with this id"
        });

        pin.comments.push({
            user: req.user._id,
            name: req.user.name,
            comment: req.body.comment,
        });

       await pin.save()

       res.json({
        message: "comment added",
       });
  });

  export const deleteComment = TryCatch(async(req,res) =>{
    const pin = await Pin.findById(req.params.id);
    
    if(!pin)
        return res.status(400).json({
    message: "No pin with this id"
        });

    if(!req.query.commentId) 
        return res.status(404).json({
    message: "please give comment Id"
        });

        const commentIndex = pin.comments.findIndex(
            (item) => item._id.toString() === req.query.commentId.toString()
        );

        if(commentIndex === -1){
            return res.status(404).json({
                message: "comment not found"
                    });
        }

        const comment = pin.comments[commentIndex]

        if(comment.user.toString() === req.user._id.toString()){
            pin.comments.splice(commentIndex, 1);

        await pin.save();

        return res.json({
            message: "comment Deleted"
        });
        } else {
            return res.status(403).json({
                message: "you are not owner of this comment",
            });

        }
  });

  export const deletePin = TryCatch(async(req,res) => {
    const pin = await Pin.findById(req.params.id)

    if(!pin)
        return res.status(400).json({
    message: "No pin with this id"
        });

        if(pin.owner.toString() !== req.user._id.toString())
            return res.status(403).json({
        message: "Unauthorized",
            });

            await cloudinary.v2.uploader.destroy(pin.image.id)

            await pin.deleteOne()

            res.json({
                message: "pin deleted",
            })
  });

  export const updatePin = TryCatch(async(req,res) => {
    const pin = await Pin.findById(req.params.id)

    if(!pin)
        return res.status(400).json({
    message: "No pin with this id"
        });

        if(pin.owner.toString() !== req.user._id.toString())
            return res.status(403).json({
        message: "Unauthorized",
            });
            
            pin.title = req.body.title;
            pin.pin = req.body.pin;

            await pin.save()

            res.json({
                message : "pin updated"
            })
  })