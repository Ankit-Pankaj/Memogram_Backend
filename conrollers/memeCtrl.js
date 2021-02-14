const Meme = require('../models/meme-model')

// function to check a valid image url
async function checkurl(url){
    try {
        const response =await  axios.get(url);
        console.log(response.headers['content-type'])
        if(response.status === 200) {
          console.log("yeah url is working");
          return true;
        }
      }
      catch(err){
        console.log(err);
      }
    }

// to post the new meme
createMeme= (req,res)=>{
    // add the items in database here
    const body = req.body
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide an item',
        })
    }

    const meme = new Meme(body)

    if(!meme){
        return res.status(400).json({ success: false, error: err })
    }

    meme.save().then(() => {
        return res.status(200).json({succes:true, data:meme})
    })
    .catch(error => {
        return res.status(500).json({
            error,
            message: 'meme not created',
        })
    }) 
}


// count the number of elements


// to get all memes (list 100 memes)

getMemes = async (req,res)=>{
    
    await Meme.find({},(err,memes)=>{
        // console.log(memes.length);
        if(err){
            return res.status(404).json({success:false,error:err})
        }
        if(!memes.length){
            return res
                .status(404)
                .json({success:false,error:'Item Not found'})
        }
        // console.log(memes);
        return res.status(200).json({succes:true, data:memes})
    }).sort({_id:-1}).limit(5).catch(err=>console.log(err))
}

// adding a single meme
getSingleMeme = async (req,res)=>{
    let id=req.params.id;
    console.log(id);
    await Meme.find({_id:id}, (err,meme)=>{
        if(err){
            return res.json({success:false,error:err});
        }
        if(!meme.length){
            return res
                .status(404)
                .json({success:false, error: 'Item Not Found'})
        }
        return res.status(200).json({sucess:true, data:meme})
    }).catch(err=>console.log(err))
}


updateMeme = async (req,res)=>{

    const updatedBody = req.body;
    console.log(updatedBody);
    const id= req.params.id;
    console.log(id);
    await Meme.findOneAndUpdate({_id :id}, {$set : updatedBody}).exec((err,meme)=>{
        if(err){return res.status(404).json({success:false,error:err});}
        return res.status(200).json({succes:true, data:meme});
    })
    // .catch(err=>console.log(err))
    // Meme.updateOne({_id:id},{$set:updatedBody})
    //     return res.status(200)
    //             .json({success:true, data:meme});
    // }).catch(err=>console.log(err))

}

//like a meme
likeMeme =  async (req,res)=>{
    // add the items in database here
    const id = req.params.id;
    // console.log(id);
    await Meme.findOneAndUpdate({_id :id}, {$inc : {likes : 1}}).exec((err,meme)=>{
        if(err){return res.status(404).json({success:false,error:err});}
        return res.status(200).json({succes:true, data:meme});
    })
    .catch(err=>console.log(err))
}


module.exports = {createMeme, getMemes, getSingleMeme, updateMeme, likeMeme}