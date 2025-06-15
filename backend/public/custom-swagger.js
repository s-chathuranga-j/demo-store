window.onload = function() {
  console.log('custom-swagger.js loaded');

  // Track attempts to find Swagger UI
  let attempts = 0;
  const maxAttempts = 5;

  // Check if Swagger UI is loaded properly
  const checkSwaggerUI = function() {
    attempts++;
    console.log('Checking if Swagger UI is loaded properly (attempt ' + attempts + ' of ' + maxAttempts + ')');
    const swaggerUI = document.querySelector('.swagger-ui');
    const topbar = document.querySelector('.swagger-ui .topbar');

    // If we can't find the Swagger UI elements after multiple attempts, redirect to fallback
    if ((!swaggerUI || document.body.innerHTML.trim() === '') && attempts >= maxAttempts) {
      console.log('Swagger UI not found or page is blank after ' + maxAttempts + ' attempts, redirecting to fallback');
      window.location.href = '/api-docs-fallback';
      return;
    }

    // If elements not found but we haven't reached max attempts, try again
    if ((!swaggerUI || document.body.innerHTML.trim() === '') && attempts < maxAttempts) {
      console.log('Swagger UI not found yet, will try again');
      setTimeout(checkSwaggerUI, 1000);
      return;
    }

    console.log('Swagger UI found:', swaggerUI ? 'Yes' : 'No');
    console.log('Topbar element found:', topbar ? 'Yes' : 'No');

    // Create the download link
    const downloadLink = document.createElement('a');
    downloadLink.href = '/api-docs-json';
    downloadLink.className = 'download-link';
    downloadLink.textContent = 'Download Swagger Schema';
    downloadLink.style.marginLeft = 'auto';
    downloadLink.style.marginRight = '20px';
    downloadLink.style.color = '#fff';
    downloadLink.style.textDecoration = 'none';
    downloadLink.style.fontWeight = 'bold';
    downloadLink.style.padding = '5px 10px';
    downloadLink.style.backgroundColor = '#4990e2';
    downloadLink.style.borderRadius = '4px';

    // Add hover effect
    downloadLink.onmouseover = function() {
      this.style.backgroundColor = '#357abd';
    };
    downloadLink.onmouseout = function() {
      this.style.backgroundColor = '#4990e2';
    };

    if (topbar) {
      // Append the link to the topbar
      console.log('Appending download link to topbar');
      topbar.appendChild(downloadLink);
    } else if (swaggerUI) {
      // Fallback: Add the link to the swagger-ui container
      console.log('Topbar not found, adding link to swagger-ui container');
      // Create a container for the link
      const linkContainer = document.createElement('div');
      linkContainer.style.padding = '20px';
      linkContainer.style.textAlign = 'right';
      linkContainer.appendChild(downloadLink);

      // Insert at the beginning of the swagger-ui container
      swaggerUI.insertBefore(linkContainer, swaggerUI.firstChild);
    } else {
      // If we can't find any Swagger UI elements, add a link to the body
      console.log('Adding download link to body as last resort');
      const linkContainer = document.createElement('div');
      linkContainer.style.padding = '20px';
      linkContainer.style.textAlign = 'center';
      linkContainer.style.margin = '20px auto';
      linkContainer.style.maxWidth = '800px';

      const heading = document.createElement('h1');
      heading.textContent = 'API Documentation';
      linkContainer.appendChild(heading);

      const message = document.createElement('p');
      message.textContent = 'Swagger UI may not be loading correctly. You can download the API schema directly:';
      linkContainer.appendChild(message);

      linkContainer.appendChild(downloadLink);

      const fallbackLink = document.createElement('p');
      fallbackLink.innerHTML = '<a href="/api-docs-fallback">Go to fallback documentation page</a>';
      linkContainer.appendChild(fallbackLink);

      document.body.appendChild(linkContainer);
    }
  };

  // Start the check process
  checkSwaggerUI();
};
