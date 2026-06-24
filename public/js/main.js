/**
 * Front-end script to handle UI interactivity (e.g. AJAX liking).
 */

document.addEventListener('DOMContentLoaded', () => {
  // Select all elements on the page that function as like buttons
  const likeButtons = document.querySelectorAll('.like-btn');

  // Loop through each button and attach a click event listener
  likeButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      // Prevent any default link or form behavior
      event.preventDefault();

      // Retrieve the post's unique MongoDB ID from the data attribute
      const postId = button.getAttribute('data-post-id');
      
      try {
        // Send a POST request to our backend toggle endpoint using Fetch API
        const response = await fetch(`/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            // In a session-based app, the browser automatically sends the session cookie!
          }
        });

        // Check if the response was successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Parse the JSON data sent back from the controller
        const data = await response.json();

        // Update the like count number inside the button
        const countSpan = button.querySelector('.like-count');
        countSpan.textContent = data.likesCount;

        // Toggle the button state styling and heart icon
        const iconSpan = button.querySelector('.like-icon');
        
        if (data.liked) {
          // If liked, add class and change heart to filled red
          button.classList.add('liked');
          iconSpan.textContent = '♥';
        } else {
          // If unliked, remove class and change heart to empty heart
          button.classList.remove('liked');
          iconSpan.textContent = '♡';
        }

      } catch (error) {
        console.error('Error toggling like:', error);
        alert('Could not update like. Please try again.');
      }
    });
  });
});
