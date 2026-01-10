import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import { useCart } from '@/context/CartContext';
import { getRecipeById, recipes } from '@/data/recipes';
import { products } from '@/data/products';

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart, cartItems } = useCart();
  
  const [selectedSpices, setSelectedSpices] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  console.log('RecipeDetail - ID from params:', id);
  
  const recipe = id ? getRecipeById(id) : null;
  
  console.log('RecipeDetail - Recipe found:', recipe);

  useEffect(() => {
    if (recipe) {
      // Pre-select all non-optional spices
      const defaultSpices = new Set(
        recipe.ingredients
          .filter(ingredient => !ingredient.optional)
          .map(ingredient => ingredient.id)
      );
      setSelectedSpices(defaultSpices);
      
      // Set default quantities to 1
      const defaultQuantities: Record<string, number> = {};
      recipe.ingredients.forEach(ingredient => {
        defaultQuantities[ingredient.id] = 1;
      });
      setQuantities(defaultQuantities);
    }
  }, [recipe]);

  const toggleSpice = (spiceId: string) => {
    const newSelected = new Set(selectedSpices);
    if (newSelected.has(spiceId)) {
      newSelected.delete(spiceId);
    } else {
      newSelected.add(spiceId);
    }
    setSelectedSpices(newSelected);
  };

  const updateQuantity = (spiceId: string, change: number) => {
    const newQuantity = Math.max(1, (quantities[spiceId] || 1) + change);
    setQuantities(prev => ({
      ...prev,
      [spiceId]: newQuantity
    }));
  };

  const addSelectedSpicesToCart = () => {
    let addedCount = 0;
    
    selectedSpices.forEach(spiceId => {
      const product = products.find(p => p.id === spiceId);
      if (product) {
        const quantity = quantities[spiceId] || 1;
        addToCart(product, quantity);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      toast({
        title: "Spices Added to Cart! 🛒",
        description: `${addedCount} spices added for ${recipe?.name}`,
      });
    } else {
      toast({
        title: "No spices selected",
        description: "Please select at least one spice to add to cart",
        variant: "destructive"
      });
    }
  };

  const getSpiceProduct = (spiceId: string) => {
    return products.find(p => p.id === spiceId);
  };

  const isSpiceInCart = (spiceId: string) => {
    return cartItems.some(item => item.id === spiceId);
  };

  const getTotalPrice = () => {
    let total = 0;
    selectedSpices.forEach(spiceId => {
      const product = getSpiceProduct(spiceId);
      if (product) {
        total += product.price * (quantities[spiceId] || 1);
      }
    });
    return total;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe not found</h2>
          <p className="mb-4">Recipe ID: {id}</p>
          <Button onClick={() => navigate('/recipes')}>
            Back to Recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/recipes')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recipes
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recipe Info */}
          <div className="lg:col-span-2">
            <Card>
              <div className="relative">
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={getDifficultyColor(recipe.difficulty)}>
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  {recipe.name}
                </CardTitle>
                <p className="text-lg text-orange-600 font-medium">
                  {recipe.nameHindi}
                </p>
                <p className="text-gray-600 mt-2">
                  {recipe.description}
                </p>
                
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{recipe.cookingTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{recipe.servings}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{recipe.category}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Instructions */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Instructions</h3>
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                {recipe.tips.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Chef's Tips</h3>
                    <ul className="space-y-2">
                      {recipe.tips.map((tip, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-orange-600">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Nutrition Info */}
                {recipe.nutritionInfo && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Nutrition Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800">{recipe.nutritionInfo.calories}</div>
                        <div className="text-sm text-gray-600">Calories</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800">{recipe.nutritionInfo.protein}</div>
                        <div className="text-sm text-gray-600">Protein</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800">{recipe.nutritionInfo.carbs}</div>
                        <div className="text-sm text-gray-600">Carbs</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="font-semibold text-gray-800">{recipe.nutritionInfo.fat}</div>
                        <div className="text-sm text-gray-600">Fat</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Spices Shopping Cart */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Required Spices
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Click to add/remove spices for this recipe
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3 mb-6">
                  {recipe.ingredients.map(ingredient => {
                    const product = getSpiceProduct(ingredient.id);
                    const isSelected = selectedSpices.has(ingredient.id);
                    const inCart = isSpiceInCart(ingredient.id);
                    
                    return (
                      <div 
                        key={ingredient.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleSpice(ingredient.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">
                                {ingredient.name}
                              </span>
                              {ingredient.optional && (
                                <Badge variant="outline" className="text-xs">
                                  Optional
                                </Badge>
                              )}
                              {inCart && (
                                <Check className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              Recipe needs: {ingredient.quantity}
                            </div>
                            {product && (
                              <div className="text-sm font-medium text-orange-600">
                                ₹{product.price} per pack
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(ingredient.id, -1);
                                  }}
                                  disabled={quantities[ingredient.id] <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                  {quantities[ingredient.id] || 1}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateQuantity(ingredient.id, 1);
                                  }}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Selected Spices:</span>
                    <span className="font-bold">{selectedSpices.size}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Price:</span>
                    <span className="font-bold text-lg text-orange-600">
                      ₹{getTotalPrice()}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={addSelectedSpicesToCart}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    disabled={selectedSpices.size === 0}
                  >
                    Add {selectedSpices.size} Spices to Cart
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/checkout')}
                    variant="outline"
                    className="w-full"
                    disabled={selectedSpices.size === 0}
                  >
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;