import { NetlifyRouter, setTestRoutes } from "../../../routes/routes";

// Netlify function handler
export const handler = async (event, context) => {
  try {
    // Create a new router instance
    const router = new NetlifyRouter();

    // Setup routes using the bridge function
    setTestRoutes(router);

    // Call the buildHandler method to get the Netlify function handler
    const netlifyHandler = router.buildHandler();

    // Execute the Netlify function handler
    const response = await netlifyHandler(event, context);

    return response;
  } catch (error) {
    console.error("Error:", error);
    // ... rest of the error handling logic
  }
};
