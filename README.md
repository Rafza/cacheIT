#cacheIT
cacheIT's MEAN stack project

##Installation Guide
https://docs.google.com/document/d/1iDTn3sGbDSNgVxrtCFV2m18_CvJ0QyVSrW4a2n1kQSs/edit?usp=sharing

##App Structure
Overview of important files/directories in our application structure

    ├── client                          - Client-side
    │   ├── app                         - All of our app specific components go in here
    │   │   ├── account       
    │   │   │   └── login				- Login functions(no longer used, moved to main)
    │   │   │   └── recovery 			- Recover passward
    │   │   │   └── settings			- Change password
    │   │   │   └── signup 				- Signup
    │   │   │   
    │   │   ├── admin_dashboard 		- Admin/Teller dashboard functions
    │   │   │   └── dash_view 			- Subviews for dashboard                 
    │   │   │   └── dash.controller     - Admin/Teller dashbaord controller
    │   │   │   
    │   │   ├── dashboard       		- User dashboard functons
    │   │   │   └── dash_view 			- Subviews for dashboard    
    │   │   │   └── dash.controller     - User dashbaord controller
    │   │   │   
    │   │   ├── main					- The front marketing page, includes login, signup
    │   │   └── myService  				- Contains singletons that are used throughout the app
    │   │       └── transaction.service - A singleton responsible for transactions like deposit, 
	│  	│                                 withdraw, transfer,adding transaction history 
 	│  	│								       
    │   └── assets                      - Images, Bootstrap Templates
    │                     
    └── server                          - Server-side
        ├── api                         - Our apps server api
        │   └── user                    - The main code to manage user data and 
        │                                 checking/saving accounts through REST api calls 
        ├── auth                        - For handling authentication with different auth strategies
        ├── config                      - Where we do the bulk of our apps configuration
        │   └── local.env.js            - Keep our environment variables out of source control
        │   └── environment             - Configuration specific to the node environment
        └── views                       - Server rendered views
