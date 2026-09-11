// MongoDB Script: Insert Products with Random Reviews
// Usage: mongosh your-db-name < insert-products.js
// Note: Run insert-categories.js FIRST

const products = [
  { name: "2½\" Kuruvi Crackers", price: 40.0, discountPrice: 8.0, categoryName: "SOUND CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 131, reviews: [], isFeatured: false, isActive: true },
  { name: "3½\" Lakshmi Crackers", price: 90.0, discountPrice: 18.0, categoryName: "SOUND CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 144, reviews: [], isFeatured: false, isActive: true },
  { name: "4\" Lakshmi Crackers", price: 140.0, discountPrice: 28.0, categoryName: "SOUND CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 78, reviews: [], isFeatured: false, isActive: true },
  { name: "4\" Gold Lakshmi Crackers", price: 190.0, discountPrice: 38.0, categoryName: "SOUND CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 63, reviews: [], isFeatured: false, isActive: true },
  { name: "4\" Kumki Crackers", price: 225.0, discountPrice: 45.0, categoryName: "SOUND CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 119, reviews: [], isFeatured: false, isActive: true },
  { name: "5\" Jalli Kattu Crackers", price: 330.0, discountPrice: 66.0, categoryName: "SOUND CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 104, reviews: [], isFeatured: false, isActive: true },
  { name: "6\" Lion Crackers", price: 460.0, discountPrice: 92.0, categoryName: "SOUND CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 61, reviews: [], isFeatured: false, isActive: true },
  { name: "Red Bijili [50 Pcs]", price: 120.0, discountPrice: 24.0, categoryName: "BIJILI CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.4, numReviews: 114, reviews: [], isFeatured: false, isActive: true },
  { name: "Red Bijili [100 Pcs]", price: 240.0, discountPrice: 48.0, categoryName: "BIJILI CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 121, reviews: [], isFeatured: false, isActive: true },
  { name: "Stripped Bijili [100 Pcs]", price: 260.0, discountPrice: 52.0, categoryName: "BIJILI CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 133, reviews: [], isFeatured: false, isActive: true },
  { name: "24 Deluxe", price: 300.0, discountPrice: 60.0, categoryName: "DELUXE ELECTRIC CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 103, reviews: [], isFeatured: false, isActive: true },
  { name: "50 Deluxe", price: 680.0, discountPrice: 136.0, categoryName: "DELUXE ELECTRIC CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 125, reviews: [], isFeatured: false, isActive: true },
  { name: "100 Deluxe", price: 1215.0, discountPrice: 244.0, categoryName: "DELUXE ELECTRIC CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 50, reviews: [], isFeatured: false, isActive: true },
  { name: "Bullet Bomb", price: 225.0, discountPrice: 45.0, categoryName: "BOMBS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 70, reviews: [], isFeatured: false, isActive: true },
  { name: "Hydro Bomb", price: 425.0, discountPrice: 85.0, categoryName: "BOMBS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 93, reviews: [], isFeatured: false, isActive: true },
  { name: "King of King", price: 550.0, discountPrice: 110.0, categoryName: "BOMBS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 77, reviews: [], isFeatured: false, isActive: true },
  { name: "Classic Bomb", price: 670.0, discountPrice: 134.0, categoryName: "BOMBS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 93, reviews: [], isFeatured: false, isActive: true },
  { name: "Digital Bomb", price: 1280.0, discountPrice: 256.0, categoryName: "BOMBS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 98, reviews: [], isFeatured: false, isActive: true },
  { name: "Ground Chakkar Big", price: 385.0, discountPrice: 77.0, categoryName: "GROUND CHAKKAR", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.4, numReviews: 94, reviews: [], isFeatured: false, isActive: true },
  { name: "Ground Chakkar Special", price: 550.0, discountPrice: 110.0, categoryName: "GROUND CHAKKAR", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 55, reviews: [], isFeatured: false, isActive: true },
  { name: "Ground Chakkar Deluxe", price: 870.0, discountPrice: 174.0, categoryName: "GROUND CHAKKAR", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 118, reviews: [], isFeatured: false, isActive: true },
  { name: "Spinner Special", price: 675.0, discountPrice: 135.0, categoryName: "GROUND CHAKKAR", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 98, reviews: [], isFeatured: false, isActive: true },
  { name: "Spinner Deluxe", price: 930.0, discountPrice: 186.0, categoryName: "GROUND CHAKKAR", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 87, reviews: [], isFeatured: false, isActive: true },
  { name: "Disco Wheel", price: 450.0, discountPrice: 90.0, categoryName: "GROUND CHAKKAR", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 129, reviews: [], isFeatured: false, isActive: true },
  { name: "Flower Pot Big", price: 360.0, discountPrice: 72.0, categoryName: "FLOWER POTS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.4, numReviews: 96, reviews: [], isFeatured: false, isActive: true },
  { name: "Flower Pot Special", price: 550.0, discountPrice: 110.0, categoryName: "FLOWER POTS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 140, reviews: [], isFeatured: false, isActive: true },
  { name: "Flower Pot Ashoka", price: 800.0, discountPrice: 160.0, categoryName: "FLOWER POTS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 134, reviews: [], isFeatured: false, isActive: true },
  { name: "Colour Kotti", price: 1260.0, discountPrice: 252.0, categoryName: "FLOWER POTS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 5.0, numReviews: 87, reviews: [], isFeatured: false, isActive: true },
  { name: "Colour Kotti Express", price: 1395.0, discountPrice: 279.0, categoryName: "FLOWER POTS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 79, reviews: [], isFeatured: false, isActive: true },
  { name: "Flower Pot Deluxe", price: 1490.0, discountPrice: 298.0, categoryName: "FLOWER POTS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 98, reviews: [], isFeatured: false, isActive: true },
  { name: "Mayajal", price: 1450.0, discountPrice: 290.0, categoryName: "SPECIAL FLOWER POTS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 131, reviews: [], isFeatured: false, isActive: true },
  { name: "1½\" Twinkling star", price: 175.0, discountPrice: 35.0, categoryName: "TWINKLING STAR", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 70, reviews: [], isFeatured: false, isActive: true },
  { name: "4\" Twinkling star", price: 410.0, discountPrice: 82.0, categoryName: "TWINKLING STAR", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 76, reviews: [], isFeatured: false, isActive: true },
  { name: "Pogo", price: 150.0, discountPrice: 30.0, categoryName: "MINI COLOUR FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 139, reviews: [], isFeatured: false, isActive: true },
  { name: "Pogo (Pack of 5)", price: 700.0, discountPrice: 140.0, categoryName: "MINI COLOUR FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 132, reviews: [], isFeatured: false, isActive: true },
  { name: "Water Melon", price: 650.0, discountPrice: 130.0, categoryName: "MINI COLOUR FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 131, reviews: [], isFeatured: false, isActive: true },
  { name: "Colour Fountain 6 Pcs/Box", price: 900.0, discountPrice: 180.0, categoryName: "MINI COLOUR FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 143, reviews: [], isFeatured: false, isActive: true },
  { name: "Asarifi Kotti", price: 650.0, discountPrice: 130.0, categoryName: "MINI COLOUR FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 109, reviews: [], isFeatured: false, isActive: true },
  { name: "Bonsai 5 Pcs/Box", price: 750.0, discountPrice: 150.0, categoryName: "MINI COLOUR FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 131, reviews: [], isFeatured: false, isActive: true },
  { name: "Holy Pot 5 Pcs/Box", price: 800.0, discountPrice: 160.0, categoryName: "MINI COLOUR FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 78, reviews: [], isFeatured: false, isActive: true },
  { name: "Lolipop", price: 950.0, discountPrice: 190.0, categoryName: "CRACKLING FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 148, reviews: [], isFeatured: false, isActive: true },
  { name: "High Voltage", price: 950.0, discountPrice: 190.0, categoryName: "CRACKLING FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 79, reviews: [], isFeatured: false, isActive: true },
  { name: "Special Fountain", price: 950.0, discountPrice: 190.0, categoryName: "CRACKLING FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 90, reviews: [], isFeatured: false, isActive: true },
  { name: "Tricolor Fountain [5 Pcs]", price: 915.0, discountPrice: 184.0, categoryName: "TRI COLOUR FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 58, reviews: [], isFeatured: false, isActive: true },
  { name: "Mega Tricolour fountain [5 pcs]", price: 1375.0, discountPrice: 275.0, categoryName: "TRI COLOUR FOUNTAIN", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 122, reviews: [], isFeatured: false, isActive: true },
  { name: "Peacock Feather", price: 670.0, discountPrice: 134.0, categoryName: "PEACOCK SERIES", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 90, reviews: [], isFeatured: false, isActive: true },
  { name: "Peacock", price: 950.0, discountPrice: 190.0, categoryName: "PEACOCK SERIES", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 113, reviews: [], isFeatured: false, isActive: true },
  { name: "Mega Bada Peacock", price: 1925.0, discountPrice: 385.0, categoryName: "PEACOCK SERIES", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.2, numReviews: 132, reviews: [], isFeatured: false, isActive: true },
  { name: "Photo Flash", price: 375.0, discountPrice: 75.0, categoryName: "FANCY CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 83, reviews: [], isFeatured: false, isActive: true },
  { name: "Colour Changing Butterfly", price: 550.0, discountPrice: 110.0, categoryName: "FANCY CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.3, numReviews: 145, reviews: [], isFeatured: false, isActive: true },
  { name: "Bambara", price: 550.0, discountPrice: 110.0, categoryName: "FANCY CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 83, reviews: [], isFeatured: false, isActive: true },
  { name: "Selfie Stick", price: 750.0, discountPrice: 150.0, categoryName: "FANCY CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 104, reviews: [], isFeatured: false, isActive: true },
  { name: "Siren", price: 800.0, discountPrice: 160.0, categoryName: "FANCY CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.0, numReviews: 101, reviews: [], isFeatured: false, isActive: true },
  { name: "Helicopter", price: 650.0, discountPrice: 130.0, categoryName: "FANCY CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.3, numReviews: 67, reviews: [], isFeatured: false, isActive: true },
  { name: "Millionaire", price: 1150.0, discountPrice: 230.0, categoryName: "FANCY CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 61, reviews: [], isFeatured: false, isActive: true },
  { name: "Hero Series 1\" (2 Pcs/Box)", price: 300.0, discountPrice: 60.0, categoryName: "MINI SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 64, reviews: [], isFeatured: false, isActive: true },
  { name: "Mini Sky Shot (5 Pcs/Box)", price: 800.0, discountPrice: 160.0, categoryName: "MINI SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 70, reviews: [], isFeatured: false, isActive: true },
  { name: "Colour Collection (5 Pcs/Bx)", price: 1000.0, discountPrice: 200.0, categoryName: "MINI SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.4, numReviews: 104, reviews: [], isFeatured: false, isActive: true },
  { name: "2\" Sky Shot [1 Pcs]", price: 600.0, discountPrice: 120.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 99, reviews: [], isFeatured: false, isActive: true },
  { name: "2\" Sky Shot [3 Pcs]", price: 1750.0, discountPrice: 350.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.3, numReviews: 109, reviews: [], isFeatured: false, isActive: true },
  { name: "2½\" Sky Shot [1 Pcs]", price: 1075.0, discountPrice: 215.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 120, reviews: [], isFeatured: false, isActive: true },
  { name: "4\" Sky Shot [1 Pcs]", price: 1890.0, discountPrice: 378.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 51, reviews: [], isFeatured: false, isActive: true },
  { name: "4½\" Sky Shot [1 Pcs]", price: 2350.0, discountPrice: 470.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 64, reviews: [], isFeatured: false, isActive: true },
  { name: "5\" Sky Shot [1 Pcs]", price: 2400.0, discountPrice: 480.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 118, reviews: [], isFeatured: false, isActive: true },
  { name: "5\" Sky Shot Nayagara [1 Pcs]", price: 2550.0, discountPrice: 510.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 148, reviews: [], isFeatured: false, isActive: true },
  { name: "Sky Shot 3 STEP [1 Pcs]", price: 1300.0, discountPrice: 260.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 64, reviews: [], isFeatured: false, isActive: true },
  { name: "Sky Shot 7 STEP [1 Pcs]", price: 2130.0, discountPrice: 426.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.2, numReviews: 70, reviews: [], isFeatured: false, isActive: true },
  { name: "Sky Shot Double Ball [1 Pcs]", price: 2475.0, discountPrice: 495.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 142, reviews: [], isFeatured: false, isActive: true },
  { name: "Butterfly Seriers [2 Pcs]", price: 3780.0, discountPrice: 756.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 5.0, numReviews: 83, reviews: [], isFeatured: false, isActive: true },
  { name: "Tower Seriers [2 Pcs]", price: 5200.0, discountPrice: 1040.0, categoryName: "SKY SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 147, reviews: [], isFeatured: false, isActive: true },
  { name: "7 Shots [5 Pcs]", price: 575.0, discountPrice: 115.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 63, reviews: [], isFeatured: false, isActive: true },
  { name: "10 Shots", price: 1230.0, discountPrice: 246.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 88, reviews: [], isFeatured: false, isActive: true },
  { name: "12 Shots", price: 1130.0, discountPrice: 226.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.4, numReviews: 114, reviews: [], isFeatured: false, isActive: true },
  { name: "30 Shot", price: 2100.0, discountPrice: 420.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 69, reviews: [], isFeatured: false, isActive: true },
  { name: "30 Shot Premium", price: 2450.0, discountPrice: 490.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.3, numReviews: 70, reviews: [], isFeatured: false, isActive: true },
  { name: "60 Shot Premium", price: 4825.0, discountPrice: 965.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 149, reviews: [], isFeatured: false, isActive: true },
  { name: "120 Shot Premium", price: 9600.0, discountPrice: 1920.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.4, numReviews: 50, reviews: [], isFeatured: false, isActive: true },
  { name: "240 Shot premium", price: 18960.0, discountPrice: 3792.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 112, reviews: [], isFeatured: false, isActive: true },
  { name: "10 Cm Electric", price: 100.0, discountPrice: 20.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 96, reviews: [], isFeatured: false, isActive: true },
  { name: "10 Cm Crackling", price: 110.0, discountPrice: 22.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 89, reviews: [], isFeatured: false, isActive: true },
  { name: "12 Cm Electric", price: 150.0, discountPrice: 30.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 80, reviews: [], isFeatured: false, isActive: true },
  { name: "12 Cm Crackling", price: 160.0, discountPrice: 32.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 60, reviews: [], isFeatured: false, isActive: true },
  { name: "12 Cm Green", price: 170.0, discountPrice: 34.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 112, reviews: [], isFeatured: false, isActive: true },
  { name: "12 Cm Red", price: 180.0, discountPrice: 36.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.3, numReviews: 147, reviews: [], isFeatured: false, isActive: true },
  { name: "15 Cm Electric", price: 220.0, discountPrice: 44.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 66, reviews: [], isFeatured: false, isActive: true },
  { name: "15 Cm Crackling", price: 230.0, discountPrice: 46.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 110, reviews: [], isFeatured: false, isActive: true },
  { name: "15 Cm Green", price: 240.0, discountPrice: 48.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 71, reviews: [], isFeatured: false, isActive: true },
  { name: "15 Cm Red", price: 250.0, discountPrice: 50.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 127, reviews: [], isFeatured: false, isActive: true },
  { name: "30 Cm Electric", price: 220.0, discountPrice: 44.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 77, reviews: [], isFeatured: false, isActive: true },
  { name: "30 Cm Crackling", price: 230.0, discountPrice: 46.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 146, reviews: [], isFeatured: false, isActive: true },
  { name: "30 Cm Green", price: 240.0, discountPrice: 48.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 75, reviews: [], isFeatured: false, isActive: true },
  { name: "30 Cm Red", price: 250.0, discountPrice: 50.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 5.0, numReviews: 101, reviews: [], isFeatured: false, isActive: true },
  { name: "50 Cm Electric", price: 875.0, discountPrice: 175.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 133, reviews: [], isFeatured: false, isActive: true },
  { name: "50 Cm Crackling", price: 970.0, discountPrice: 194.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.2, numReviews: 116, reviews: [], isFeatured: false, isActive: true },
  { name: "Wow Rotating", price: 1100.0, discountPrice: 220.0, categoryName: "SPARKLERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 81, reviews: [], isFeatured: false, isActive: true },
  { name: "100 Garland", price: 225.0, discountPrice: 45.0, categoryName: "FESTIVAL GARLAND", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 93, reviews: [], isFeatured: false, isActive: true },
  { name: "1K Garland", price: 900.0, discountPrice: 180.0, categoryName: "FESTIVAL GARLAND", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 120, reviews: [], isFeatured: false, isActive: true },
  { name: "2K Garland", price: 1800.0, discountPrice: 360.0, categoryName: "FESTIVAL GARLAND", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 78, reviews: [], isFeatured: false, isActive: true },
  { name: "5K Garland", price: 4500.0, discountPrice: 900.0, categoryName: "FESTIVAL GARLAND", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.4, numReviews: 140, reviews: [], isFeatured: false, isActive: true },
  { name: "10K Garland", price: 9000.0, discountPrice: 1800.0, categoryName: "FESTIVAL GARLAND", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 79, reviews: [], isFeatured: false, isActive: true },
  { name: "1 K Garland Premium", price: 1200.0, discountPrice: 240.0, categoryName: "FESTIVAL GARLAND", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 54, reviews: [], isFeatured: false, isActive: true },
  { name: "2K Garland Premium", price: 2400.0, discountPrice: 480.0, categoryName: "FESTIVAL GARLAND", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.3, numReviews: 59, reviews: [], isFeatured: false, isActive: true },
  { name: "5K Garland Premium", price: 6000.0, discountPrice: 1200.0, categoryName: "FESTIVAL GARLAND", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 85, reviews: [], isFeatured: false, isActive: true },
  { name: "10K Garland Premium", price: 12000.0, discountPrice: 2400.0, categoryName: "FESTIVAL GARLAND", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.3, numReviews: 77, reviews: [], isFeatured: false, isActive: true },
  { name: "Kg Paper Bomb", price: 250.0, discountPrice: 50.0, categoryName: "PAPER BOMB", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 142, reviews: [], isFeatured: false, isActive: true },
  { name: "½ Kg Paper Bomb", price: 500.0, discountPrice: 100.0, categoryName: "PAPER BOMB", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.4, numReviews: 123, reviews: [], isFeatured: false, isActive: true },
  { name: "1 Kg Paper Bomb", price: 1000.0, discountPrice: 200.0, categoryName: "PAPER BOMB", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 81, reviews: [], isFeatured: false, isActive: true },
  { name: "Pop Corn", price: 1050.0, discountPrice: 210.0, categoryName: "KIDS CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 102, reviews: [], isFeatured: false, isActive: true },
  { name: "Baby Corn", price: 1050.0, discountPrice: 210.0, categoryName: "KIDS CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 62, reviews: [], isFeatured: false, isActive: true },
  { name: "Amazing Candle", price: 1050.0, discountPrice: 210.0, categoryName: "KIDS CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 95, reviews: [], isFeatured: false, isActive: true },
  { name: "Kit Kat", price: 150.0, discountPrice: 30.0, categoryName: "KIDS CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 109, reviews: [], isFeatured: false, isActive: true },
  { name: "Assorted Cartoon", price: 225.0, discountPrice: 45.0, categoryName: "KIDS CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 56, reviews: [], isFeatured: false, isActive: true },
  { name: "Colour Smoke", price: 800.0, discountPrice: 160.0, categoryName: "KIDS CRACKERS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 132, reviews: [], isFeatured: false, isActive: true },
  { name: "Colour Rocket", price: 375.0, discountPrice: 75.0, categoryName: "ROCKETS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 101, reviews: [], isFeatured: false, isActive: true },
  { name: "Rocket Bomb", price: 400.0, discountPrice: 80.0, categoryName: "ROCKETS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 63, reviews: [], isFeatured: false, isActive: true },
  { name: "Lunic Rocket", price: 750.0, discountPrice: 150.0, categoryName: "ROCKETS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.3, numReviews: 74, reviews: [], isFeatured: false, isActive: true },
  { name: "Two Sound Rocket", price: 850.0, discountPrice: 170.0, categoryName: "ROCKETS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 67, reviews: [], isFeatured: false, isActive: true },
  { name: "Whistling Rocket", price: 1000.0, discountPrice: 200.0, categoryName: "ROCKETS", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.2, numReviews: 85, reviews: [], isFeatured: false, isActive: true },
  { name: "Music Rip", price: 1740.0, discountPrice: 348.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.2, numReviews: 59, reviews: [], isFeatured: false, isActive: true },
  { name: "Whistling 25 Shot", price: 3475.0, discountPrice: 695.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.6, numReviews: 120, reviews: [], isFeatured: false, isActive: true },
  { name: "Carribian Knights", price: 18125.0, discountPrice: 3625.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 5.0, numReviews: 133, reviews: [], isFeatured: false, isActive: true },
  { name: "Cocktails (1¼\" x 12\")", price: 12990.0, discountPrice: 2598.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 5.0, numReviews: 51, reviews: [], isFeatured: false, isActive: true },
  { name: "Art of Indians (1¾\" x 13½\")", price: 14475.0, discountPrice: 2985.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 146, reviews: [], isFeatured: false, isActive: true },
  { name: "Beats (2½\" x 14¼\")", price: 22055.0, discountPrice: 4411.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 71, reviews: [], isFeatured: false, isActive: true },
  { name: "Rajasthan Royals (3½\" x 16¾\")", price: 34460.0, discountPrice: 6892.0, categoryName: "MULTI COLOUR SHOT", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.8, numReviews: 111, reviews: [], isFeatured: false, isActive: true },
  { name: "25 Items Gift Box", price: 400.0, discountPrice: 400.0, categoryName: "GIFT BOX", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 101, reviews: [], isFeatured: false, isActive: true },
  { name: "30 Items Gift Box", price: 520.0, discountPrice: 520.0, categoryName: "GIFT BOX", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 71, reviews: [], isFeatured: false, isActive: true },
  { name: "35 Items Gift Box", price: 630.0, discountPrice: 630.0, categoryName: "GIFT BOX", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.9, numReviews: 99, reviews: [], isFeatured: false, isActive: true },
  { name: "40 Items Gift Box", price: 750.0, discountPrice: 750.0, categoryName: "GIFT BOX", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 150, reviews: [], isFeatured: false, isActive: true },
  { name: "50 Items Gift Box", price: 900.0, discountPrice: 900.0, categoryName: "GIFT BOX", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.1, numReviews: 86, reviews: [], isFeatured: false, isActive: true },
  { name: "3K Combo Box", price: 3000.0, discountPrice: 3000.0, categoryName: "COMBO BOX", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 5.0, numReviews: 143, reviews: [], isFeatured: false, isActive: true },
  { name: "5K Combo Box", price: 5000.0, discountPrice: 5000.0, categoryName: "COMBO BOX", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.5, numReviews: 121, reviews: [], isFeatured: false, isActive: true },
  { name: "8K Combo Box", price: 7000.0, discountPrice: 7000.0, categoryName: "COMBO BOX", stock: 10000, sold: 0, images: [], description: "", specifications: [], rating: 4.7, numReviews: 112, reviews: [], isFeatured: false, isActive: true },
];

// Clear existing products (optional)
// db.products.deleteMany({});

// Convert categoryName to ObjectId and insert
const productsWithCategoryId = products.map(p => {
  const category = db.categories.findOne({ name: p.categoryName });
  if (!category) {
    console.warn(`⚠ Category not found: ${p.categoryName}`);
  }
  return {
    name: p.name,
    price: p.price,
    discountPrice: p.discountPrice,
    category: category?._id,
    stock: p.stock,
    sold: p.sold,
    images: p.images,
    description: p.description,
    specifications: p.specifications,
    rating: p.rating,
    numReviews: p.numReviews,
    reviews: p.reviews,
    isFeatured: p.isFeatured,
    isActive: p.isActive,
    createdAt: new Date()
  };
});

const result = db.products.insertMany(productsWithCategoryId);
console.log(`✓ Inserted ${result.insertedIds.length} products`);

// Verify
const count = db.products.countDocuments();
console.log(`✓ Total products in database: ${count}`);

// Show by category with review stats
const byCat = db.products.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 }, avgReviews: { $avg: "$numReviews" }, avgRating: { $avg: "$rating" } } },
  { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "cat" } },
  { $unwind: "$cat" },
  { $sort: { "cat.name": 1 } }
]).toArray();

console.log("\nProducts by Category:");
byCat.forEach(item => console.log(`  ${item.cat.name}: ${item.count} products | Avg Reviews: ${Math.round(item.avgReviews)} | Avg Rating: ${item.avgRating.toFixed(1)}⭐`));

// Sample products
console.log("\nSample Products with Reviews:");
db.products.find({}).limit(10).forEach(p => {
  const cat = db.categories.findOne({ _id: p.category });
  console.log(`  ${p.name} - ₹${p.price} | ${p.numReviews} reviews | ⭐ ${p.rating}`);
});

// Review statistics
console.log("\n📊 Review Statistics:");
const stats = db.products.aggregate([
  { $group: { _id: null, totalReviews: { $sum: "$numReviews" }, avgReviews: { $avg: "$numReviews" }, maxReviews: { $max: "$numReviews" }, minReviews: { $min: "$numReviews" } } }
]).toArray()[0];

console.log(`  Total Review Count: ${stats.totalReviews}`);
console.log(`  Average Reviews per Product: ${Math.round(stats.avgReviews)}`);
console.log(`  Max Reviews: ${stats.maxReviews}`);
console.log(`  Min Reviews: ${stats.minReviews}`);
