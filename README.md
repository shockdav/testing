# Developer testing
1. Download these design files for Tables. File compatibility: Figma, Sketch.
2. Clone this GIT Repository to build into.
3. Code the HTML, CSS, and applicable javascript without any frameworks or plugins. Fully responsive design (desktop, tablet, smartphone). All devices.
4. Commit back to your GIT.
5. Email your public GIT link to mike@reinkmedia.com for review!


# Architecture (Core, Legacy via 2.0 / 2012)
- In "testing mode" the header.php auto generates the style sheet based on the template + prepend/append CSS files
- In "production mode" there is a compiler that takes all the files, merges them, and minifies them into the template folder with a random hash (required to clear cache for most browsers)
- Live server would re-route the URL to the page-html handler and then route to the "template-" php scripts