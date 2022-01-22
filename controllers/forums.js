const Forum = require('../models/forum');

module.exports.index = async (req, res) => {
    const forums = await Forum.find({});
    res.render('layouts/forums/index', { forums })
}

module.exports.renderNewForm = (req, res) => {
    res.render('layouts/forums/new')}

module.exports.createForum = async (req, res, next) => {
    const forum = new Forum(req.body.forum);
    forum.author = req.user._id;
    forum.title = req.body.forum.title;
    forum.description = req.body.forum.description;
    await forum.save();
    console.log(forum);
    req.flash('success', 'Successfully created a new forum!');
    res.redirect(`/layouts/forums/${forum._id}`)
    }

   module.exports.showForum = async (req, res,) => {
        const forum = await Forum.findById(req.params.id).populate({
            path: 'posts',
            populate: {
                path: 'author'
            }
        }).populate('author');
           if(!forum) {
            req.flash('error', 'Cannot find that forum!');
            return res.redirect('/layouts/forums');
        }
        res.render('layouts/forums/show', { forum });
}

// module.exports.renderEditForm = async (req, res) => {
//     const { id } = req.params;
//     const whanau = await Whanau.findById(id)
//     if(!whanau) {
//         req.flash('error', 'Cannot find that whanau!');
//         return res.redirect('/whanaus');
//     }
//     res.render('whanaus/edit', { whanau });
// }

// module.exports.updateWhanau = async (req, res) => {
//     const { id } = req.params;
//     const geoData = await geocoder.forwardGeocode({
//         query: req.body.whanau.location,
//         limit: 1
//     }).send()
//     console.log(req.body);
//     const whanau = await Whanau.findByIdAndUpdate(id, { ...req.body.whanau });
//     whanau.geometry = await geoData.body.features[0].geometry;
//     const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
//     whanau.images.push(...imgs);
//     await whanau.save();
//     if (req.body.deleteImages) {
//         for(let filename of req.body.deleteImages) {
//             await cloudinary.uploader.destroy(filename);
//         }
//         await whanau.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages} } } });
//         }
//     console.log(whanau.geometry)
//     req.flash('success', 'Successfully updated whanau!')
//     res.redirect(`/whanaus/${whanau._id}`)
// }

// module.exports.deleteWhanau = async (req, res) => {
//     const { id } = req.params;
//     await Whanau.findByIdAndDelete(id);
//     req.flash('success', 'Successfully Deleted Whanau!')
//     res.redirect('/whanaus');
// }