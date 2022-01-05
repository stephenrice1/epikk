const Whanau = require('../models/whanau');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const whanau = await Whanau.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    whanau.reviews.push(review);
    await review.save();
    await whanau.save();
    req.flash('success', 'Review added!')
    res.redirect(`/whanaus/${whanau._id}`)
 }

 module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Whanau.findByIdAndUpdate(id, { $pull: {reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/whanaus/${id}`)
}