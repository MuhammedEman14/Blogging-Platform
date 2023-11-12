# Blogging-Platform
I have created a comprehensive backend blogging platform for different functionalities such as user authentication,registeration,following,unfollowing,posts,comments etc
 Lists of Functions and Routes 

1. Register(Post): 

  Handles user registration.Extracts user registration data from the request body (username, email, password, role) and hashes the user's password using bcrypt. It then creates a new user with the hashed password.Sends a success response without a token upon successful registration. 

  

2. Login(Post): 

   Handles user login.It Extracts user login data from the request body (email, password).Finds the user by email and validates the user's password using bcrypt used forregistration and then generates a JWT token for the user upon successful login. 

  

3. Get User Profile(Get): 

    Retrieves the user's profile information.It extracts the user's email from the JWT token and finds the user in the database using the email.It responds with the user's profile data, excluding sensitive information like the password. 

  

4. Update User Profile(Put): 

   It updates the user's profile information.It extracts the user's email from the JWT token and updates the user's profile data based on the user email from the token.It then finds and updates the user in the database using the email and responds with the updated user's profile data. 

  

5. Follow User(Post): 

   Allows a user to follow another user. Checks if the follow relationship already exists,updates the follower user , the user being followed in the database and creates a follower notification for the user being followed. 

  

6. Unfollow User(Delete): 

     Allows a user to unfollow another user and updates the follower user and the user being unfollowed in the database. 

  

7. Get Notifications(Get): 

   Retrieves follower and comment notifications for the authenticated user from the database using the user's email. Filters and retrieves follower and comment notifications from the user's notifications array. 

  

8. View All Users(Get): 

   It is an admin function and retrieves information about all users (username, email, role) and retrieves all users from the database. 

  

9. Block User(Put): 

    Blocks or disables a user and updates the user's status to blocked or disabled in the database. It is also an Admin function. 

  

10. Delete User(Delete): 

     Deletes a user based on email.Finds and deletes the user based on email from the database and implements authorization logic if needed.It is also an Admin function. 

  

11. Create Blog Post(Post): 

     Creates a new blog post with the provided title and content and extracts title and content from the request body.It then sets the owner of the blog post to the logged-in user and then saves the new blog post to the database. 

  

12. Get Blog Post by ID (Get): 

    Retrieves a specific blog post by its ID and validates if the postId is a valid ObjectId. 

 It then finds the blog post by ID and then adds owner information to the blog post object and responds with the blog post details. 

  

13. Update Blog Post (Put) 

   It updates the title and content of a specific blog post and then checks if the user making the request is the owner of the blog post.Updates the blog post with the new title and content and responds with the updated blog post. 

  

14. Delete Blog Post (Delete): 

   Deletes a specific blog post and checks if the user making the request is the owner of the blog post.Deletes the blog post and responds with the deleted blog post. 

  

15. Add Rating (Post) 

    Adds a rating to a specific blog post. Adds the rating (user email and value) to the blog post's `ratings` array and responds with the updated blog post. 

  

16. Add Comment (Post) : 

 Adds a comment to a specific blog post and creates a comment notification and adds the comment (user email and content) to the blog post's comments array.It then retrieves the owner of the blog post and creates a comment notification for them and responds with the updated blog post. 

  

17. Get All Blog Posts (Get): 

    Retrieves all blog posts with optional pagination and extracts pagination parameters from the query string (page and perPage).it then retrieves paginated blog posts and responds with the list of blog posts. 

  

18. Get Sorted and Filtered Posts (Get): 

  Retrieves blog posts sorted and filtered based on query parameters and extracts sorting and filtering parameters from the query string. Retrieves sorted and filtered blog posts and responds with the list of blog posts. 

  

19. Get User Feed (Get) 

    Retrieves a user's feed, which includes blog posts from followed bloggers and finds the authenticated user.Retrieves emails of bloggers the user is following and finds blog posts from the followed bloggers and responds with the user's feed. 

  

20. List All Blog Posts (Get) 

      Retrieves all blog posts with selected fields (title, owner, createdAt, averageRating). It retrieves all blog posts with selected fields and responds with the list of blog posts. 

  

21. View Blog Post (Get) 

   Retrieves a specific blog post by its ID. Finds the blog post by ID and responds with the blog post details.It is an Admin function. 

  

22. Disable Blog (Put) 

     Disables a specific blog post by updating its status to disabled.It then updates the blog post status to disabled and responds with a success message.It is also an Admin function. 
