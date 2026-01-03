export interface Product {
    id: string;
    name: string;
    type: string;
    description: string;
    image: string;
    longDescription: string;
    varieties: string[];
    specifications: Record<string, string>;
    features: string[];
}

export const products: Product[] = [
    {
        id: 'groundnut',
        name: 'Groundnut',
        type: 'Oil Seed',
        description: 'Premium quality groundnuts, ideal for snacking and export markets.',
        image: '/images/Groundnuts.png',
        longDescription: 'Our premium groundnuts are sourced from the best farms in Gujarat. They are carefully selected for their size, taste, and nutritional value. Perfect for direct consumption, roasting, or oil extraction.',
        varieties: ['G20', 'Java', 'TJ', 'Bold', 'Runner'],
        specifications: {
            'Origin': 'Gujarat, India',
            'Moisture': 'Max 8%',
            'Admixture': 'Max 1%',
            'Oil Content': '48-50%',
            'Packing': '50kg Jute/PP Bags'
        },
        features: ['Rich in Protein', 'High Oil Content', 'Aflatoxin Controlled', 'Hand Picked Selected']
    },
    {
        id: 'peanut',
        name: 'Peanut',
        type: 'Oil Seed',
        description: 'High-quality peanuts sourced from premium farms, available in various grades and specifications.',
        image: '/images/Peanut.png',
        longDescription: 'We offer a wide variety of peanuts including Bold, Java, and TJ varieties. Our peanuts are known for their nutty flavor and crunchiness, making them a favorite in international markets.',
        varieties: ['Bold', 'Java', 'TJ', 'Blanched'],
        specifications: {
            'Variety': 'Bold / Java',
            'Count': '40/50, 50/60, 60/70',
            'Moisture': 'Max 7%',
            'Foreign Matter': 'Max 0.5%',
            'Packing': '25kg/50kg Vacuum Bags'
        },
        features: ['Uniform Size', 'Excellent Taste', 'HPS Quality', 'Export Grade']
    },
    {
        id: 'coriander',
        name: 'Coriander',
        type: 'Spice',
        description: 'Aromatic coriander seeds with rich flavor profiles, perfect for culinary and medicinal uses.',
        image: '/images/Coriander seeds.png',
        longDescription: 'Our coriander seeds are famous for their distinct aroma and golden-green color. They are widely used in spice blends and for essential oil extraction.',
        varieties: ['Eagle', 'Scooter', 'Parrot', 'Badami', 'Green'],
        specifications: {
            'Purity': '99% Min',
            'Moisture': 'Max 10%',
            'Split': 'Max 5%',
            'Flavor': 'Aromatic',
            'Packing': '25kg/50kg PP Bags'
        },
        features: ['Intense Aroma', 'Cleaned & Sorted', 'No Artificial Color', 'Rich in Essential Oils']
    },
    {
        id: 'cumin-seed',
        name: 'Cumin Seed',
        type: 'Spice',
        description: 'Premium cumin seeds with strong aroma and flavor, essential for spice markets worldwide.',
        image: '/images/Cumin seeds.png',
        longDescription: 'Sourced from the spice bowl of India, our cumin seeds (Jeera) are known for their high essential oil content and strong flavor. A must-have spice for kitchens globally.',
        varieties: ['Singapore', 'Europe', 'Gulf', 'Grinding Quality'],
        specifications: {
            'Purity': '99% / 99.5%',
            'Moisture': 'Max 9%',
            'Admixture': 'Max 1%',
            'Volatile Oil': 'Min 2.5%',
            'Packing': '25kg/50kg Paper/PP Bags'
        },
        features: ['Strong Flavor', 'High Purity', 'Machine Cleaned', 'Sortex Quality']
    },
    {
        id: 'black-cumin',
        name: 'Black Cumin',
        type: 'Spice',
        description: 'High-quality black cumin seeds known for their distinctive flavor and health benefits.',
        image: '/images/Kalonji.png',
        longDescription: 'Also known as Kalonji, our black cumin seeds are highly valued for their medicinal properties and unique taste. Used in baking, pickles, and traditional medicines.',
        varieties: ['Machine Clean', 'Sortex Clean'],
        specifications: {
            'Purity': '99% Min',
            'Moisture': 'Max 10%',
            'Foreign Matter': 'Max 1%',
            'Packing': '25kg PP Bags'
        },
        features: ['Medicinal Value', 'Distinctive Taste', 'Premium Quality', 'Cleaned']
    },
    {
        id: 'wheat',
        name: 'Wheat',
        type: 'Grain',
        description: 'Premium quality wheat grains with excellent protein content and baking properties.',
        image: '/images/Wheat.png',
        longDescription: 'We supply premium quality Lokwan and Sharbati wheat varieties. Our wheat is clean, golden, and high in protein, making it excellent for flour milling and baking.',
        varieties: ['Lokwan', 'Sharbati', 'Tukdi', 'Milling Quality'],
        specifications: {
            'Protein': 'Min 11%',
            'Moisture': 'Max 12%',
            'Gluten': 'Min 25%',
            'Falling Number': 'Min 300 sec',
            'Packing': '50kg/100kg PP Bags'
        },
        features: ['High Protein', 'Golden Color', 'Excellent for Baking', 'Free from Insects']
    },
    {
        id: 'chickpea',
        name: 'Chickpea',
        type: 'Pulse',
        description: 'Premium chickpeas with excellent protein content and nutritional value for global markets.',
        image: '/images/Chana.png',
        longDescription: 'Our Kabuli and Desi chickpeas are known for their size, taste, and cooking quality. They are a rich source of protein and fiber.',
        varieties: ['Kabuli', 'Desi', 'Chana Dal'],
        specifications: {
            'Size': '42-44, 44-46, 58-60, 75-80 count',
            'Moisture': 'Max 10%',
            'Admixture': 'Max 1%',
            'Weevilled': 'Max 0.2%',
            'Packing': '25kg/50kg PP Bags'
        },
        features: ['Large Size', 'Quick Cooking', 'High Nutrition', 'Mechanically Cleaned']
    },
    {
        id: 'mung',
        name: 'Mung',
        type: 'Pulse',
        description: 'High-quality mung beans rich in protein and nutrients, perfect for various culinary applications.',
        image: '/images/Mug.png',
        longDescription: 'Green Mung beans are a staple in Asian cuisine. Our mung beans are uniform in size, green in color, and free from stones and impurities.',
        varieties: ['Green Mung', 'Yellow Mung Dal', 'Split Mung'],
        specifications: {
            'Purity': '98% / 99%',
            'Moisture': 'Max 12%',
            'Admixture': 'Max 2%',
            'Imperfection': 'Max 3%',
            'Packing': '25kg/50kg PP Bags'
        },
        features: ['High Germination', 'Uniform Green Color', 'Rich in Protein', 'Polished/Unpolished']
    },
    {
        id: 'sesame-seed',
        name: 'Sesame Seed',
        type: 'Oil Seed',
        description: 'Premium sesame seeds with rich oil content and nutty flavor, ideal for food and oil industries.',
        image: '/images/White Sesame seed.png',
        longDescription: 'We offer Natural and Hulled Sesame Seeds. They are sweet, nutty, and rich in oil. Widely used in bakery products, tahini, and confectionery.',
        varieties: ['Natural White', 'Hulled', 'Brown'],
        specifications: {
            'Purity': '99.95% / 99.90%',
            'Moisture': 'Max 5%',
            'Oil Content': 'Min 48%',
            'FFA': 'Max 1.5%',
            'Packing': '25kg/50kg Paper/PP Bags'
        },
        features: ['Sweet Nutty Taste', 'High Oil Content', 'Auto Dried', 'Sortex Cleaned']
    },
    {
        id: 'black-sesame-seed',
        name: 'Black Sesame Seed',
        type: 'Oil Seed',
        description: 'High-quality black sesame seeds with distinctive color and enhanced nutritional benefits.',
        image: '/images/Black sesame seed.png',
        longDescription: 'Black sesame seeds are richer in flavor and nutrients compared to white ones. They are used for medicinal purposes and as a gourmet garnish.',
        varieties: ['Z-Black', 'Regular Black'],
        specifications: {
            'Purity': '99% Min',
            'Moisture': 'Max 6%',
            'Admixture': 'Max 1%',
            'Oil Content': 'Min 45%',
            'Packing': '25kg/50kg PP Bags'
        },
        features: ['Rich Flavor', 'High Calcium', 'Medicinal Properties', 'Deep Black Color']
    },
    {
        id: 'soyabean',
        name: 'Soya Bean',
        type: 'Oil Seed',
        description: 'Premium soya beans with high protein content, perfect for food processing and oil extraction.',
        image: '/images/Soyabean.png',
        longDescription: 'Our premium soya beans are rich in protein and essential nutrients. They are widely used in food processing, oil extraction, and as a key ingredient in various food products.',
        varieties: ['Yellow Soya Bean', 'Black Soya Bean', 'Organic Soya Bean'],
        specifications: {
            'Protein': 'Min 40%',
            'Oil Content': 'Min 20%',
            'Moisture': 'Max 11%',
            'Foreign Matter': 'Max 1%',
            'Packing': '50kg PP Bags'
        },
        features: ['High Protein Content', 'Rich in Nutrients', 'Versatile Applications', 'Premium Quality']
    },
    {
        id: 'garlic',
        name: 'Garlic',
        type: 'Vegetable',
        description: 'Fresh and premium garlic bulbs with strong flavor and aroma, ideal for culinary and medicinal uses.',
        image: '/images/Garlic.png',
        longDescription: 'Our garlic is carefully harvested and processed to maintain its natural flavor, aroma, and nutritional benefits. Known for its culinary versatility and health benefits.',
        varieties: ['Single Clove', 'Multi Clove', 'Organic Garlic'],
        specifications: {
            'Size': '4-6 cm diameter',
            'Moisture': 'Max 65%',
            'Foreign Matter': 'Max 1%',
            'Purity': '99% Min',
            'Packing': '10kg/20kg Mesh Bags'
        },
        features: ['Strong Aroma', 'Rich Flavor', 'Medicinal Properties', 'Long Shelf Life']
    },
    {
        id: 'onion',
        name: 'Onion',
        type: 'Vegetable',
        description: 'Fresh onions with excellent quality and taste, available in various sizes for different market needs.',
        image: '/images/Onion.png',
        longDescription: 'We offer premium quality onions that are sweet, pungent, and perfect for cooking. Our onions are known for their crisp texture and long storage life.',
        varieties: ['Red Onion', 'White Onion', 'Yellow Onion', 'Shallot'],
        specifications: {
            'Size': 'Medium/Large',
            'Moisture': 'Max 80%',
            'Foreign Matter': 'Max 1%',
            'Rotten/Sprouted': 'Max 2%',
            'Packing': '20kg/50kg Net Bags'
        },
        features: ['Sweet Taste', 'Long Storage', 'High Quality', 'Versatile Cooking']
    }
];
