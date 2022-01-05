const Whanau = require('../models/whanau');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const whanaus = await Whanau.find({});
    res.render('whanaus/index', { whanaus })
}

module.exports.renderNewForm = (req, res) => {
    res.render('whanaus/new')}

module.exports.createWhanau = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.whanau.location,
        limit: 1
    }).send()
    const whanau = new Whanau(req.body.whanau);
    whanau.geometry = geoData.body.features[0].geometry;
    whanau.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    whanau.author = req.user._id;
    await whanau.save();
    console.log(whanau);
    req.flash('success', 'Successfully made a new whanau!');
    res.redirect(`/whanaus/${whanau._id}`)
    }

module.exports.showWhanau = async (req, res,) => {
        const whanau = await Whanau.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
           if(!whanau) {
            req.flash('error', 'Cannot find that whanau!');
            return res.redirect('/whanaus');
        }
        res.render('whanaus/show', { whanau });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const whanau = await Whanau.findById(id)
    if(!whanau) {
        req.flash('error', 'Cannot find that whanau!');
        return res.redirect('/whanaus');
    }
    res.render('whanaus/edit', { whanau });
}

module.exports.updateWhanau = async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder.forwardGeocode({
        query: req.body.whanau.location,
        limit: 1
    }).send()
    console.log(req.body);
    const whanau = await Whanau.findByIdAndUpdate(id, { ...req.body.whanau });
    whanau.geometry = await geoData.body.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    whanau.images.push(...imgs);
    await whanau.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await whanau.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages} } } });
        }
    console.log(whanau.geometry)
    req.flash('success', 'Successfully updated whanau!')
    res.redirect(`/whanaus/${whanau._id}`)
}

module.exports.deleteWhanau = async (req, res) => {
    const { id } = req.params;
    await Whanau.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted Whanau!')
    res.redirect('/whanaus');
}