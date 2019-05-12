/* eslint-env browser */
import axios from 'axios'

class RecipeAPIWrapper {
  constructor () {
    this.API_URL = process.env.REACT_APP_API_URL
  }

  async getRecipes () {
    return axios.get(this.API_URL + '/recipes')
  }

  async getRecipe (recipeID) {
    return axios.get(this.API_URL + '/recipes/' + recipeID)
  }

  formEncodeRecipe (recipe) {
    let data = new FormData()
    Object.keys(recipe).forEach(key => data.append(key, recipe[key]))
    data.set('ingredients', JSON.stringify(Object.values(recipe.ingredients)))

    return data
  }

  async saveNewRecipe (recipe) {
    const encodedRecipe = this.formEncodeRecipe(recipe)

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    return axios.post(this.API_URL + '/recipes', encodedRecipe, config)
  }

  async updateRecipe (recipe) {
    const encodedRecipe = this.formEncodeRecipe(recipe)

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    const recipeID = recipe._id
    return axios.put(this.API_URL + '/recipes/' + recipeID, encodedRecipe, config)
  }

  async uploadImage (recipeID, image) {
    let imageData = new FormData()
    imageData.set('image', image)

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }

    return axios.post(this.API_URL + '/recipes/' + recipeID + '/images', imageData, config)
  }

  async getRandomRecipes (numberOfRecipes) {
    return axios.get(this.API_URL + '/random/' + numberOfRecipes)
  }

  async deleteRecipe (recipeID) {
    return axios.delete(this.API_URL + '/recipes/' + recipeID)
  }
}

export default RecipeAPIWrapper
