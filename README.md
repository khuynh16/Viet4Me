# Table of Contents

- [Project Description](#viet4me)
- [Project Link](#project-link)
- [Functionality](#functionality)
- [Utilized Software](#utilized-software)
- [Previous Features Depreciated From Project](#previous-features-depreciated-from-project)
- [Things Currently In Progress](#things-currently-in-progress)
- [Ideas to Implement In The Future](#ideas-to-implement-in-the-future)
- [Changelog (Notable Changes/Updates as of 10/18/2020)](#changelog)
- [Images of Project](#images-of-project)


# Viet4Me

The project is a "self-learning" Vietnamese app where you are able to translate any word or phrase from English into Vietnamese. With each translation comes its own post and you are able to categorize and filter certain posts to view! Think of it as a Google Translate meets Quizlet application.

## Project Link

The project is hosted via Heroku at:

&nbsp;&nbsp;&nbsp; https://viet4me.herokuapp.com/

## Functionality

* __In terms of user__:
  * Creating an account and storing in database
  * Adding a post (comprised of entering an English word/phrase to translate, adding/choosing categories to store in)
  * Added posts includes an english phrase, which is translated into Vietnamese via Google Translate API upon viewing posts in home page
  * Editing a post (the phrase to translate, the categories the current post is stored in)
  * Deleting a post
  * Filtering posts via category and search bar
  * Filter option to display english content or viet content visibly first on top of expansion panels
  * Filter option to have all panels expanded or collapsed on button click
  * Vietnamese keyboard of viet characters displayed to use for search bar to filter content (Note: keyboard only displayed when viet display filter option selected)
  
* __In terms of user experience__: 
  * Correct authentication and authorization to add/edit/delete posts that the user themselves created in the first place (and viewing only their posts)
  * Lazy loading of components for optimization
  * Animation of the buffalo and login + signup forms 
  * Mobile responsive to fit all browsers and devices
  * Able to click on audio icon for each post to hear the respective vietnamese translation
  
## Utilized Software

The application utilizes the __MEAN__ stack (__MongoDB, Express.js, Angular, and Node.js__). 

Libraries included: 

* __mongoose__: working with Node.js and MongoDB a bit easier (syntax-wise)
* __mongoose-unique-validator__: validator for unique emails in database
* __express__: working with Node.js a bit easier
* __jsonwebtoken__: part of the authorization and authentication for user log in and sign up
* __bcrypt__: hashing of passwords

## Previous Features Depreciated From Project

* __Use-as-guest feature__
  * meant for first time visitors of site to be able to use all functionality of project (add/edit/deleting their own posts) 
  * removed for the case of motivated user involvement (in creating an account to use features), as opposed to allowing them to use features without creating account
* __Image for each post__
  * was to implement a select-image in the create post section, where users will be able to select image from a select few (images from some sort of Google Image API) 
  * removed (from design, wasn't implemented functionally) as it was deemed unnecessary

## Things Currently In Progress

* Testing via Jasmine and Karma
* 'Manage Account' Button where user can edit their chosen email and password, as well as removing categories (even if there are posts within said category)
* Cleaning the code (cleaned a lot initially but some areas to clean up still)
* Pagination (as to not load all posts immediately, affecting loadtime)
  * (Note: has been implemented but commented out as it was not working as intended with category filter and search bar filter)
  
## Ideas to Implement In The Future

* Audio capture feature (to capture your voice pronunciating the vietnamese word or phrase)

## Changelog 

* __10/18/2020__
  * Implemented Google Text to Speech API to now allow users to click speaker icon and be able to hear vietnamese translation
* __11/05/2020__
  * Redesigned UI (Font style changes, coloring of filter component, button style of login/signup page)
* __11/06/2020__
  * Implemented hiding/showing all posts when clicking master category checkbox
* __3/08/2021__
  * Website's backend utilizing AWS Elastic Beanstalk was took down due to financial-related issues
* __5/21/2021__
  * Website's front and backend hosted via Heroku and is now live 
  
## Images of Project
  
#### Landing page   

<img src="images/landing-page.png" width="50%">

#### Login and signup form 

<img src="images/log-in.png" width="50%">
<img src="images/sign-up.png" width="50%">

#### Home page when user logs in

<img src="images/first-view-when-logged-in.png" width="50%">

#### Filter expansion panel in home page

<img src="images/filter.png" width="50%">

#### Filter expansion panel when viet display filter option selected (notice the 'Click Me!' expansion bar)

<img src="images/viet-filter-keyboard-closed.png" width="50%">

#### Viet keyboard expansion panel (open)

<img src="images/viet-filter-keyboard-open.png" width="50%">

#### Adding post form

<img src="images/add-post.png" width="50%">

#### Expanded post view

<img src="images/one-expanded-panel.png" width="50%">

