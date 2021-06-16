# CRUD
Library Application


![](sass/img/author.jpg)


## Application Description
Introducing a simple library application that allows book nerds worldwide to store their books collection or books that they have already read.
The application will allow you to add your favourite authors and the books that they have written.

You will be able to search your books by published dates and names.

You will be able to upload a cover image in your book as well!

## Security
We will be using a simple login function with password protection

## Restful routes used

| HTTP Verb     | route| used for  |
| ------------- |:-------------:| -----:|
| Get           | '/'           | index page to display all articles |
| Get            |  '/authors/new'     |   Create a new author |
| Get | '/authors'      |  Author default Page   |
| Post | '/authors/:id/edit'      |  Edit Author Page   |
| Get | '/books/new'      |  Create a new Book   |
| Post | '/books'      |  Books default page   |
| Delete | '/authors/:id'      |    Delete |

## Css Framework used
Bulma 

## Middleware used
1.Filepond

2.Mongoose

3.Express-session

4.BodyParser

5.MethodOverride

6.Connect-flash

7.Express-validator

## Problems faced
Unable to use JSON webtoken to authenticate 

Unable to install sass with bulma for more css manipulation and had to use CSS to supplement 


