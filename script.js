document.getElementById('search').addEventListener('click', function () {
    const restaurantName = document.getElementById('restaurant').value.trim();
    const borough = document.getElementById('borough').value;
    const restaurantListDiv = document.getElementById('restaurant-list');
    const resultDiv = document.getElementById('result');
  
    if (!restaurantName) {
      alert('Please enter a restaurant name.');
      return;
    }
  
    // Clear previous results
    restaurantListDiv.innerHTML = '';
    resultDiv.innerHTML = '';
  
    // SODA API request to fetch matching restaurants
    const url = `https://data.cityofnewyork.us/resource/43nn-pn8j.json?$where=dba like '%25${restaurantName}%25' AND boro='${borough}'&$select=dba,camis,boro&$limit=10`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          restaurantListDiv.innerHTML = '<h2>Select a Restaurant:</h2>';
          data.forEach(restaurant => {
            // Create a clickable list of restaurants
            const restaurantDiv = document.createElement('div');
            restaurantDiv.classList.add('restaurant-item');
            restaurantDiv.innerHTML = restaurant.dba;
            restaurantDiv.dataset.camis = restaurant.camis; // Store CAMIS (restaurant ID)
            restaurantDiv.dataset.boro = restaurant.boro;
  
            // Add click event to each restaurant
            restaurantDiv.addEventListener('click', function () {
              getRestaurantRating(restaurant.camis, restaurant.boro);
            });
  
            restaurantListDiv.appendChild(restaurantDiv);
          });
        } else {
          restaurantListDiv.innerHTML = 'No restaurants found for this search.';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        restaurantListDiv.innerHTML = 'An error occurred. Please try again.';
      });
  });
  
  // Function to fetch and display the rating for a selected restaurant
  function getRestaurantRating(camis, borough) {
    const resultDiv = document.getElementById('result');
  
    const url = `https://data.cityofnewyork.us/resource/43nn-pn8j.json?camis=${camis}&boro=${borough}&$select=dba,grade`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0 && data[0].grade) {
          resultDiv.innerHTML = `The restaurant <strong>${data[0].dba}</strong> in <strong>${borough}</strong> has a grade of <strong>${data[0].grade}</strong>.`;
        } else {
          resultDiv.innerHTML = 'No rating found for this restaurant.';
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        resultDiv.innerHTML = 'An error occurred. Please try again.';
      });
  }