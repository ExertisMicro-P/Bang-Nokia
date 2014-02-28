
====================

emp-quickstart-prime

====================

Exertis Micro-P Quickstart Project for microsites, landing page, etc on exertismicro-p.co.uk - fork from this to start a new project

##Prerequisite
Webserver with domain & webroot folder (default document index.html)

##Getting Started

1) Clone this Quickstart repo into the webroot setup above


2) Choose from ONE of the template folders & delete the remaining two

- Multi-Page (Ajax)
- Single-Page
- Charlston

Template Previews Online
- http://www.exertismicro-p.co.uk/cmcPage.asp?idPage=27480 | Multi-Page (Ajax)
- http://www.exertismicro-p.co.uk/cmcPage.asp?idPage=27481 | Single-Page
- http://www.exertismicro-p.co.uk/cmcPage.asp?idPage=27482 | Charlston

NB:
- If the templates do not match your requirements, you can delete all contents within the template folder apart from index.html, which you should rework to suit your needs.
- Every project must to contain initProject() in its index.html file which becomes the equivient of $(document).ready();


3) Rename to the template folder to your agreed project name
- rename multi-page myproject


4) Configure the project index file (/PROJECT-NAME/index.html)

- Set var projectName = [your agreed PROJECT-NAME]
- Set inSandbox = true
- Use head.load() to include any global JS and CSS

NB:
- If you are using the Multi-Page template you will also need to configure home.html, which is ajaxed into the page by default.
- All ajaxed pages need to contain initPage() which again is called after the content has been received.
- Inside initPage use head.load() to include any JS and CSS required for this page


5) The sandbox expects a querystring parameter to be passed to know where to load the project from
- http://YOUR-DOMAIN?project=myproject

NB
- If you are using the MULTI-PAGE template you can also pass p=PAGE-NAME to change the default landing page to one of the sub pages
- Each Quickstart Template contains a README.md file which has more details about the options / functions available



==============================