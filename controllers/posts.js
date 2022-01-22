const Forum = require('../models/forum');
const Post = require('../models/post');

module.exports.createPost = async (req, res) => {
    const forum = await Forum.findById(req.params.id);
    const post = new Post(req.body.post);
    post.author = req.user._id;
    forum.posts.push(post);
    await post.save();
    await forum.save();
    req.flash('success', 'post added')
    res.redirect(`/forums/${forum._id}`)
 }

 module.exports.deletePost = async (req, res) => {
    const { id, postId } = req.params;
    await Forum.findByIdAndUpdate(id, { $pull: {posts: postId }});
    await Post.findByIdAndDelete(postId);
    req.flash('success', 'Successfully deleted post')
    res.redirect(`/forums/${id}`)
}