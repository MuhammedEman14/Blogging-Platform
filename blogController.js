const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const mongoose = require('mongoose');
// Create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Create a new blog post
    const newBlogPost = new BlogPost({
      title,
      content,
      owner: req.user.email, // Set the owner of the blog post to the logged-in user
    });

    // Save the new blog post to the database
    const savedPost = await newBlogPost.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error',detail:err.message });
  }
};



const getBlogPostById = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Validate if postId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid postId format' });
    }

    const blogPost = await BlogPost.findById(postId);

    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    

    // Add owner information to the blog post object
    const blogPostWithOwner = {
      _id: blogPost._id,
      title: blogPost.title,
      content: blogPost.content,
      // Add other fields as needed
      owner: blogPost.owner,
    };

    res.json(blogPostWithOwner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const updateBlogPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, content } = req.body;

    // Check if the user making the request is the owner of the blog post
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (blogPost.owner !== req.user.email) {
      return res.status(403).json({ message: 'You are not authorized to update this blog post' });
    }

    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true }
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(updatedBlogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a specific blog post
const deleteBlogPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Check if the user making the request is the owner of the blog post
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (blogPost.owner !== req.user.email) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog post' });
    }

    const deletedBlogPost = await BlogPost.findByIdAndDelete(postId);

    if (!deletedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(deletedBlogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const addRating = async (req, res) => {
  try {
    const postId = req.params.postId;
    const  ratingss  = req.body.value; // Assuming your request body contains the rating value

    // Add the rating to the blog post
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      postId,
      { $push: { ratings: { user: req.user.email, value: ratingss } } },
      { new: true }
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(updatedBlogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// const addComment = async (req, res) => {
//   try {
//     const postId = req.params.postId;
//     const { text } = req.body; // Assuming your request body contains the comment text

//     // Add the comment to the blog post
//     const updatedBlogPost = await BlogPost.findByIdAndUpdate(
//       postId,
//       { $push: { comments: { user: req.user.email, content:text } } },
//       { new: true }
//     );

//     if (!updatedBlogPost) {
//       return res.status(404).json({ message: 'Blog post not found' });
//     }

//     res.json(updatedBlogPost);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const  text  = req.body.content;

    // Add the comment to the blog post
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(
      postId,
      { $push: { comments: { user: req.user.email, content: text } } },
      { new: true }
    );

    if (!updatedBlogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Create a comment notification
    const blogPostOwner = updatedBlogPost.owner; // Assuming owner is an email, adjust based on your model
    const blogPostOwnerUser = await User.findOne({ email: blogPostOwner });
    blogPostOwnerUser.notifications.push({
      sender: req.user.email,
      type: 'comment',
      read: false,
     // postId: postId,
    });
    await blogPostOwnerUser.save();

    res.json(updatedBlogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllBlogPosts = async (req, res) => {
  try {
    // Extract pagination parameters from the query string
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    // Retrieve the paginated blog posts
    const blogPosts = await BlogPost.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getSortedAndFilteredPosts = async (req, res) => {
  try {
    // Extract sorting and filtering parameters from the query string
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    const filter = req.query.filter || {};

    // Retrieve the sorted and filtered blog posts
    const blogPosts = await BlogPost.find(filter)
      .sort({ [sortBy]: sortOrder })
      .exec();

    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getUserFeed = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Find the authenticated user
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Use the emails of the bloggers the user is following
    const followedBloggersEmails = user.following;

    // Find blog posts from the followed bloggers
    const feed = await BlogPost.find({ owner: { $in: followedBloggersEmails } });

    res.json(feed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const listAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({}, 'title owner createdAt averageRating');
    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const viewBlogPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const blogPost = await BlogPost.findById(postId);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const disableBlog = async (req, res) => {
  try {
    const { postId } = req.params;
    // Update blog status to disabled
    await BlogPost.findByIdAndUpdate(postId, { $set: { status: 'disabled' } });
    res.json({ message: 'Blog disabled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



module.exports = {
  createBlogPost,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  addRating,
  addComment,
  getAllBlogPosts,
  getSortedAndFilteredPosts,
  getUserFeed,
  listAllBlogPosts,
  viewBlogPost,
  disableBlog,
};
