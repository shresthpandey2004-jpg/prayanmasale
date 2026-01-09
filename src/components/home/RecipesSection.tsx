import React from 'react';
import { Clock, ChefHat, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const RecipesSection: React.FC = () => {
  const featuredRecipes = [
    {
      id: 'butter-chicken',
      name: 'Butter Chicken',
      nameHindi: 'बटर चिकन',
      description: 'Creamy, rich and delicious butter chicken made with tender chicken pieces',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500',
      cookingTime: '45 mins',
      difficulty: 'Medium',
      servings: '4 people',
      spicesCount: 7
    },
    {
      id: 'biryani',
      name: 'Chicken Biryani',
      nameHindi: 'चिकन बिरयानी',
      description: 'Aromatic basmati rice layered with spiced chicken and cooked to perfection',
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=500',
      cookingTime: '90 mins',
      difficulty: 'Hard',
      servings: '6 people',
      spicesCount: 12
    },
    {
      id: 'dal-tadka',
      name: 'Dal Tadka',
      nameHindi: 'दाल तड़का',
      description: 'Comfort food at its best - yellow lentils tempered with aromatic spices',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
      cookingTime: '30 mins',
      difficulty: 'Easy',
      servings: '4 people',
      spicesCount: 7
    },
    {
      id: 'paneer-butter-masala',
      name: 'Paneer Butter Masala',
      nameHindi: 'पनीर बटर मसाला',
      description: 'Soft paneer cubes in a rich, creamy tomato-based gravy',
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500',
      cookingTime: '35 mins',
      difficulty: 'Easy',
      servings: '4 people',
      spicesCount: 6
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-orange-600 mb-3">
              <ChefHat size={20} />
              <span className="text-sm font-medium uppercase tracking-wider">Cooking Inspiration</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800">
              Traditional <span className="text-orange-600">Recipes</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-lg">
              Discover authentic Indian recipes with all the spices you need. Coming soon - recipe-to-cart feature!
            </p>
          </div>
          <Button variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
            <span className="gap-2 flex items-center">
              Coming Soon <ArrowRight size={18} />
            </span>
          </Button>
        </div>

        {/* Recipes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRecipes.map((recipe, index) => (
            <div
              key={recipe.id}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Time Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
                  <Clock size={12} className="text-orange-600" />
                  {recipe.cookingTime}
                </div>

                {/* Difficulty Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
                  {recipe.name}
                </h3>
                <p className="text-sm text-orange-600 font-medium mb-2">{recipe.nameHindi}</p>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {recipe.description}
                </p>

                {/* Recipe Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <span>{recipe.servings}</span>
                  </div>
                  <div className="text-orange-600 font-medium">
                    {recipe.spicesCount} spices
                  </div>
                </div>

                {/* Call to Action */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-center text-gray-500">
                    Recipe feature coming soon! 🍛
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🍛 Recipe-to-Cart Feature Coming Soon!
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're working on an amazing feature where you can view recipes and add all required spices directly to your cart with one click. 
              Stay tuned for this exciting update!
            </p>
            <Button className="bg-orange-600 hover:bg-orange-700" disabled>
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecipesSection;
