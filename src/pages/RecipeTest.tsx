import { getRecipeById, recipes } from '@/data/recipes';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const RecipeTest = () => {
  const navigate = useNavigate();
  
  console.log('All recipes:', recipes);
  console.log('Butter chicken recipe:', getRecipeById('butter-chicken'));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate('/')} className="mb-4">
          ← Back to Home
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Recipe Data Test</h1>
        
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Total Recipes: {recipes.length}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map(recipe => (
                <div key={recipe.id} className="border p-3 rounded">
                  <h3 className="font-bold">{recipe.name}</h3>
                  <p className="text-sm text-gray-600">ID: {recipe.id}</p>
                  <p className="text-sm text-orange-600">{recipe.nameHindi}</p>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  >
                    View Recipe
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Test getRecipeById Function</h2>
            <div className="space-y-2">
              <p>getRecipeById('butter-chicken'): {getRecipeById('butter-chicken') ? '✅ Found' : '❌ Not Found'}</p>
              <p>getRecipeById('biryani'): {getRecipeById('biryani') ? '✅ Found' : '❌ Not Found'}</p>
              <p>getRecipeById('invalid-id'): {getRecipeById('invalid-id') ? '✅ Found' : '❌ Not Found'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeTest;