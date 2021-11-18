import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  app.get("/filteredimage", async (req: Request, res: Response) =>{
    let {image_url} = req.query;  // get the query as object
    if (!image_url){return res.status(400).send(`no valid URL!`);} // validate the query
    

      let url_add : string = image_url;
      
      const image_file = filterImageFromURL(url_add); // call the function to filter the image
          // return the image and delete the image
      
      // image_file as a Promise. Evaluate the resolved value and carry out the corresponding action.
      image_file.then((filteredfile) => {
        if(filteredfile === "error"){
          console.log("url error");
          return res.status(415).send("Problem of filtered URL");
        }else{
          return res.status(200).sendFile(filteredfile,() => {deleteLocalFiles([filteredfile])}); // delete after showing
          //return res.status(200).sendFile(filteredfile);
        }
      })


  })
  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();