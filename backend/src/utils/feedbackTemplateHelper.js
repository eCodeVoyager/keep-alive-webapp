function generateStars(rating) {
  const filledStar =
    '<img src="https://i.ibb.co.com/ZzJ9xj6/icons8-star-48-1.png" alt="Filled Star" style="width: 24px; height: 24px; display: inline-block;">';
  const emptyStar =
    '<img src="https://i.ibb.co.com/Lp8NgCm/icons8-star-48.png" alt="Empty Star" style="width: 24px; height: 24px; display: inline-block;">';

  let starsHTML = "";

  for (let i = 0; i < 5; i++) {
    starsHTML += i < rating ? filledStar : emptyStar;
  }

  return starsHTML;
}

module.exports = generateStars;
